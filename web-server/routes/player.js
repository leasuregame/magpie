var db = require('../dao/db/db');
var playerDao = require('../dao/playerDao');
var buyRecordDao = require('../dao/buyRecordDao');

exports.get = function(req, res) {
    var names = req.body.playerNames;
    var areaId = req.body.areaId;
    var nameWhere = names;
    if(names instanceof Array) {
        nameWhere = '';
        for(var i in names) {
            nameWhere += "'" + names[i] + "',";
        }
        nameWhere = nameWhere.substr(0, nameWhere.length - 1);
    }

    var sql = "select id from player where name in (" + nameWhere + ") and areaId = " + areaId;

    db(areaId).query(sql, [], function(err, row) {
        if (err) {
            res.status(500).send('error when select playerId, ' + err);
        }

        if (!!row && row.length > 0) {
            var id = [];
            for(var i in row) {
                id.push(row[i].id);
            }
            res.send({id: id});
        } else {
            res.status(404).send('can not find player id');
        }

    });
};


/**
 * 根据条件筛选出用户名
 * @param req
 * @param res
 */
exports.getPlayerNames = function (req, res) {
    var areaId = req.body.areaId;
    var playerWhere = {
        lv : req.body.lv,
        vip : req.body.vip
    };
    var buyRecordWhere = {
        amount : req.body.amount,
        payTime : req.body.payTime
    };

    playerDao.getPlayers(playerWhere, areaId, function (err, rows){
        // rows = [{player},{player}...]
        var playerRows = rows;
        var retNames = [];

        if(buyRecordWhere.amount || buyRecordWhere.payTime) {
            buyRecordDao.getAllPlayerId(buyRecordWhere.amount, buyRecordWhere.payTime, areaId, function (err, rows){
                if(err) {
                    res.status(500).send(err);
                } else {
                    // rows = [{playerId:number},{playerId:number}...]
                    var pids = [],
                        i;

                    for(i in rows) {
                        var pid = rows[i].playerId;
                        if(pids.indexOf(pid) == -1) {
                            pids.push(pid);
                        }
                    }
                    for(i in playerRows) {
                        var player = playerRows[i];
                        if(pids.indexOf(player.id) > -1) {
                            retNames.push(player.name);
                        }
                    }
                    res.send(retNames);
                }
            });
        } else {
            for(var i in playerRows) {
                var player = playerRows[i];
                retNames.push(player.name);
            }
            res.send(retNames);
        }
    })
};