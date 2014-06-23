var Url = require('url');
var filter = require('../util/filter');
var async = require('async');
var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var logger = require('../util/logger').logger('reward');
var lvRecDao = require('../dao/playerDailyLvRecordDao');
var consumeRecDao = require('../dao/playerConsumptionRecordDao');
var CONSUMPTION_SOURCE_NAME = require('../data/record').CONSUMPTION_SOURCE_NAME;

var DEF_LV_DATA = {
    total : 0,
    wastage : 0
};

var playerRecord = function(app) {

    /**
     * render statistics -- player wastage rate on lv
     */
    app.get('/admin/playerWastageRateOnLv', filter.authorize, function (req, res) {
        res.render('playerWastageRateOnLv', {
            menu: 'playerWastageRateOnLv',
            title: '玩家等级分布',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        })
    });

    /**
     * get data of  player wastage rate on lv
     */
    app.all('/admin/api/getWastageRateOnLv', filter.authorize, function(req, res) {

        var reqData = req.body;
        var areaId = reqData.areaId;

        if(!areaId) {
            return res.status(500).send('ERROR : areaId is required');
        }

        queryWastageRateRows(areaId, reqData, function(err, rows) {
            if (err) {
                return res.status(500).send('error when getting WASTAGE RATE ON LV, ' + err);
            }
            res.send(rows);
        });
    });

    app.all('/admin/api/download/wastageRateOnLv', function(req, res){
        var reqData = req.body.length > 0 ? req.body : req.query;
        var areaId = reqData.areaId;

        if(!areaId) {
            return res.status(500).send('ERROR : areaId is required');
        }

        queryWastageRateRows(areaId, reqData, function(err, rows) {
            if (err) {
                return res.status(500).send('error when getting WASTAGE RATE ON LV, ' + err);
            }

            createCSVFileByRows("等级,等级玩家数,等级玩家比例,等级流失玩家数,等级流失玩家比例,总流失玩家比例", rows,
                function (row) {
                    return util.format('%s,%s,%s,%s,%s,%s\n', row.lv, row.total, row.totalRate,
                        row.wastage, row.wastageRate, row.totalWastageRate);
                },
                function (filePath) {
                    var now = new Date();
                    var outputName = util.format('player lv distribution %s-%s-%s.csv',
                        now.getFullYear(), now.getMonth(), now.getDate());
                    res.download(filePath, outputName, function(err){
                        if(err) {
                            return res.status(500).send('error when downloading file WASTAGE RATE ON LV, ' + err);
                        } else {
                            fs.unlinkSync(filePath);
                        }
                    });
                }
            );
        });
    });

    function queryWastageRateRows(areaId, param, cb) {

        /**
         * 对查询结果进行统计
         * @param rows
         * @param criticalDate
         * @returns {Array}
         */
        function handleWastageRateRows(rows, criticalDate){
            var statsRes = {}; // 统计结果集 {"lv":{"total":number,"wastage":number}}
            var totalRec = rows.length;
            for (var i in rows) {
                var row = rows[i];
                var lvData;
                if (statsRes[row.playerLv]) {
                    lvData = statsRes[row.playerLv];
                } else {
                    lvData = statsRes[row.playerLv] = _.clone(DEF_LV_DATA);
                }
                lvData.total++;
                new Date(row.recordDate) <= criticalDate && lvData.wastage++;
            }

            //statsRes 转为数组
            var statsResArr = [];
            for (var i in statsRes) {
                var resRow = statsRes[i];
                resRow.lv = i;
                statsResArr.push(resRow);
            }

            // 根据统计结果集计算出最后统计结果
            for (var i in statsResArr) {
                var resRow = statsResArr[i];
                resRow.totalRate = (resRow.total / totalRec).toFixed(4);
                resRow.wastageRate = (resRow.wastage / resRow.total).toFixed(4);
                resRow.totalWastageRate = (resRow.wastage / totalRec).toFixed(4);
            }
            return statsResArr;
        }

        var criticalTime = (param.criticalDays ? param.criticalDays : 3) * 24 * 60 * 60 * 1000;
        if(param.recordDate && param.recordDate[1]) {
            var criticalDate = new Date(new Date(param.recordDate[1]).getTime() - criticalTime);
        } else {
            var criticalDate = new Date(new Date().getTime() - criticalTime);
        }
        var recWhere = {
            created : param.created,
            recordDate : param.recordDate
        };

        if(!(areaId instanceof Array)) {
            // 从DB获取时间段内每个player的最后一次离线记录
            lvRecDao.getLastRecords(recWhere, areaId, function (err, rows) {
                if (err) {return cb(err, null);}
                cb(null, handleWastageRateRows(rows, criticalDate));
            });
        } else {
            var tasks = []; // 查询函数数组

            // 构造task,分别对应每个区的查询
            for(var i in areaId) {
                (function(i){
                    var tmpAreaId = areaId[i];
                    tasks.push(function(cb){
                        lvRecDao.getLastRecords(recWhere, tmpAreaId, function(err, rows) {
                            cb(err, rows);
                        });
                    });
                })(i);
            }
            async.parallel(tasks, function(err, rs){
                if (err) {return cb(err, null);}
                var rows = rs[0];
                for(var i = 1; i < rs.length; i++) {
                    rows = rows.concat(rs[i]);
                }
                cb(null, handleWastageRateRows(rows, criticalDate));
            });
        }
    }

    /**
     * render statistics -- player consumption rate
     */
    app.get('/admin/playerConsumption', filter.authorize, function (req, res) {
        res.render('playerConsumption', {
            menu: 'playerConsumption',
            title: '魔石使用占比',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        })
    });

    /**
     * get data of  player consumption rate
     */
    app.all('/admin/api/getPlayerConsumption', filter.authorize, function(req, res){

        var reqData = req.body;
        var areaId = reqData.areaId;

        if(!areaId) {
          return res.status(500).send('ERROR : areaId is required');
        }

        queryPlayerConsumption(areaId, reqData, function(err, rows) {
            if (err) {
                return res.status(500).send('error when getting PLAYER CONSUMPTION, ' + err);
            }
            res.send(rows);
        });
    });

    app.all('/admin/api/download/playerConsumption', function(req, res){
        var reqData = req.query;
        var areaId = reqData.areaId;

        if(!areaId) {
            return res.status(500).send('ERROR : areaId is required');
        }

        queryPlayerConsumption(areaId, reqData, function(err, rows) {
            if (err) {
                return res.status(500).send('error when getting WASTAGE RATE ON LV, ' + err);
            }

            createCSVFileByRows("功能,消费角色数,消费角色比例,购买次数,人均购买次数,消费魔石,魔石消费比例,人均消费魔石", rows,
                function (row) {
                    return util.format('%s,%s,%s,%s,%s,%s,%s,%s\n', CONSUMPTION_SOURCE_NAME[row.source],
                        row.playerCounts, row.playersRate,
                        row.buyCounts, row.buyCountsPerPlayer,
                        row.expense, row.expenseRate, row.expensePerPlayer);
                },
                function (filePath) {
                    var now = new Date();
                    var outputName = util.format('player consumption %s-%s-%s.csv',
                        now.getFullYear(), now.getMonth(), now.getDate());
                    res.download(filePath, outputName, function(err){
                        if(err) {
                            return res.status(500).send('error when downloading file WASTAGE RATE ON LV, ' + err);
                        } else {
                            fs.unlinkSync(filePath);
                        }
                    });
                }
            );
        });
    });

    function queryPlayerConsumption(areaId, param, cb) {

        /**
         * 对查询结果进行统计
         * @param rows
         * @returns {*}
         */
        function handleConsumptionRateRows(rows){
            var totalExpense = 0;
            var totalPlayers = 0;
            for(var i in rows) {
                totalExpense += rows[i].expense;
                totalPlayers += rows[i].playerCounts;
            }
            for(var j in rows) {
                var row = rows[j];
                row.expenseRate = (row.expense / totalExpense).toFixed(4);
                row.playersRate = (row.playerCounts / totalPlayers).toFixed(4);
                row.expensePerPlayer = (row.expense / totalPlayers).toFixed(2);
                row.buyCountsPerPlayer = (row.buyCounts / totalPlayers).toFixed(4);
            }
            return rows;
        }

        var recWhere = {
            created : param.created,
            createTime : param.createTime
        };

        if(!(areaId instanceof Array)) {
            consumeRecDao.getRecords(recWhere, areaId, function(err, rows){
                if(err){return cb(err, null);}
                cb(null, handleConsumptionRateRows(rows));
            });
        } else {
            var tasks = []; // 查询函数数组
            // 构造task,分别对应每个区的查询
            for(var i in areaId) {
                (function(i){
                    var tmpAreaId = areaId[i];
                    tasks.push(function(cb){
                        consumeRecDao.getRecords(recWhere, tmpAreaId, function(err, rows){
                            cb(err, rows);
                        });
                    });
                })(i);
            }
            async.parallel(tasks, function(err, rs){
                if(err){return cb(err, null);}
                var rows = rs[0];
                for(var i = 1; i < rs.length; i++) {
                    var baseRows = rows.splice(0, rows.length);
                    var tmpRows = rs[i];

                    // sum rows which have the same source
                    while(baseRows.length > 0) {
                        if(tmpRows.length > 0) {
                            var baseRow = baseRows[0];
                            var tmpRow = tmpRows[0];
                            if(baseRow.source < tmpRow.source) {
                                rows = rows.concat(baseRows.splice(0, 1));
                            } else if(baseRow.source > tmpRow.source) {
                                rows = rows.concat(tmpRows.splice(0, 1));
                            } else {
                                baseRow.expense += tmpRow.expense;
                                baseRow.playerCounts += tmpRow.playerCounts;
                                baseRow.buyCounts += tmpRow.buyCounts;
                                rows = rows.concat(baseRows.splice(0, 1));
                                tmpRows.splice(0, 1)
                            }
                        } else {
                            rows = rows.concat(baseRows.splice(0, baseRows.length));
                        }
                    }
                    if(tmpRows.length > 0) {
                        rows = rows.concat(tmpRows.splice(0, tmpRows.length));
                    }
                }
                cb(null, handleConsumptionRateRows(rows));
            });
        }
    }

    function createCSVFileByRows(head, rows, formatRow, cb) {
        var fileData = head + '\n';
        for(var i in rows) {
            var row = rows[i];
            fileData += formatRow(row);
        }
        var tmpDir = path.join(__dirname,'..', 'tmp');
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir);
        }
        var filePath = path.join(tmpDir, parseInt(Math.random() * 100000000).toString(16));
        fs.writeFileSync(filePath, fileData);
        cb(filePath);
    }
};

module.exports = playerRecord;