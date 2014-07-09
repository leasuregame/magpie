var _ = require('underscore');
var filter = require('../util/filter');
var db = require('../dao/db/db');
var playerDao = require('../dao/playerDao');
var buyRecordDao = require('../dao/buyRecordDao');

var player = function(app) {

    /**
     * get player id
     */
    app.all('/admin/api/getPlayerId', function (req, res) {
        var names = req.body.playerNames;
        var areaId = req.body.areaId;
        var nameWhere = names;
        if (names instanceof Array) {
            nameWhere = '';
            for (var i in names) {
                nameWhere += "'" + names[i] + "',";
            }
            nameWhere = nameWhere.substr(0, nameWhere.length - 1);
        }

        var sql = "select id, name from player where name in (" + nameWhere + ") and areaId = " + areaId;

        db(areaId).query(sql, [], function (err, rows) {
            if (err) {
                res.status(500).send('error when select playerId, ' + err);
                return;
            }

            if(rows.length < names.length) {
                var nameNotExist = [];
                var rowNames = [];
                for (var i in rows) {
                    rowNames.push(rows[i].name);
                }
                for (var i in names) {
                    if(_.indexOf(rowNames, names[i]) == -1) {
                        nameNotExist.push(names[i]);
                    }
                }
                res.status(404).send('以下玩家不存在 : ' + nameNotExist.toString());
                return;
            }

            if (!!rows && rows.length > 0) {
                var id = [];
                for (var i in rows) {
                    id.push(rows[i].id);
                }
                res.send({id: id});
            }
        });
    });

    /**
     * 根据条件筛选出用户名
     * @param req
     * @param res
     */
    app.all('/admin/api/getPlayerNames', function (req, res) {
        var areaId = req.body.areaId;
        var playerWhere = {
            lv: req.body.lv,
            vip: req.body.vip
        };
        var buyRecordWhere = {
            amount: req.body.amount,
            payTime: req.body.payTime
        };

        var playerFields = [ 'id', 'userId', 'areaId', 'name'];

        playerDao.getPlayers(playerFields, playerWhere, areaId, function (err, rows) {
            // rows = [{player},{player}...]
            var playerRows = rows;
            var retNames = [];

            if (buyRecordWhere.amount || buyRecordWhere.payTime) {
                buyRecordDao.getAllPlayerId(buyRecordWhere.amount, buyRecordWhere.payTime, areaId, function (err, rows) {
                    if (err) {
                        return res.status(500).send(err);
                    } else {
                        // rows = [{playerId:number},{playerId:number}...]
                        var pids = [],
                            i;

                        for (i in rows) {
                            var pid = rows[i].playerId;
                            if (pids.indexOf(pid) == -1) {
                                pids.push(pid);
                            }
                        }
                        for (i in playerRows) {
                            var player = playerRows[i];
                            if (pids.indexOf(player.id) > -1) {
                                retNames.push(player.name);
                            }
                        }
                        res.send(retNames);
                    }
                });
            } else {
                for (var i in playerRows) {
                    var player = playerRows[i];
                    retNames.push(player.name);
                }
                res.send(retNames);
            }
        })
    });

    app.get('/admin/api/players', function(req, res) {
        var areas = req.query.areas;
        var name = req.query.name;
        var fields = req.query.fields;

        if (!areas || areas == '' || areas == '[]') {
            areas = [1];
        }

        if (fields && fields.length > 1) {
            fields = fields.split(',');
        } else {
            fields = ['id', 'userId', 'name', 'areaId'];
        }

        playerDao.playersInAreas(fields, {name: name}, areas, function(err, rows) {
            if (err) {
                res.send(err);
            } else {
                res.send(rows);
            }
        });
    });
};

module.exports = player;