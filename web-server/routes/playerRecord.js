var Url = require('url');
var filter = require('../util/filter');
var async = require('async');
var _ = require('underscore');
var logger = require('../util/logger').logger('reward');
var pLvRecDao = require('../dao/playerDailyLvRecordDao');

var DEF_LV_DATA = {
    total : 0,
    wastage : 0
};



var playerRecord = function(app) {

    function handleRows(rows, criticalDate){
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

	app.all('/admin/getWastageRateOnLv', function(req, res) {

        var reqData = req.body;
        var areaId = reqData.areaId;
        var criticalTime = (reqData.criticalDays ? reqData.criticalDays : 3) * 24 * 60 * 60 * 1000;

        if(!areaId) {
            res.status(500).send('ERROR : areaId is required');
            return;
        }

        var criticalDate = new Date(new Date(reqData.createTime[1]).getTime() - criticalTime);
        var recWhere = {
            created : reqData.created,
            createTime : reqData.createTime
        };
        if(!(areaId instanceof Array)) {
            // 从DB获取时间段内每个player的最后一次离线记录
            pLvRecDao.getLastRecords(recWhere, areaId, function (err, rows) {
                if (err) {
                    res.status(500).send('error when executing getWastageRateOnLv, ' + err);
                    return;
                }
                res.send(handleRows(rows, criticalDate));
            });
        } else {
            var tasks = []; // 查询函数数组
            // 构造task,分别对应每个区的查询
            for(var i in areaId) {
                (function(i){
                    var tmpAreaId = areaId[i];
                    tasks.push(function(cb){
                        pLvRecDao.getLastRecords(recWhere, tmpAreaId, function(err, rows) {
                            cb(err, rows);
                        });
                    });
                })(i);
            }
            async.parallel(tasks, function(err, rs){
                if(err){
                    res.status(500).send('error when selecting message, ' + err);
                    return;
                }
                var rows = rs[0];
                for(var i = 1; i < rs.length; i++) {
                    rows = rows.concat(rs[i]);
                }
                res.send(handleRows(rows, criticalDate));
            });
        }
	});

    app.get('/admin/playerWastageRateOnLv', filter.authorize, function (req, res) {
        res.render('playerWastageRateOnLv', {
            menu: 'playerWastageRateOnLv',
            title: '玩家等级流失率',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        })
    });
};

module.exports = playerRecord;