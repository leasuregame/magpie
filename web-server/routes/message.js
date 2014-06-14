var Url = require('url');
var filter = require('../util/filter');
var async = require('async');
var logger = require('../util/logger').logger('reward');
var msgConfig = require('../data/message');
var msgDao = require('../dao/messageDao');

var message = function(app) {

    /**
     * 查询消息通用方法
     * @param msgWhere
     * @param areaId
     * @param res
     */
    function queryMsg (msgWhere, areaId, res) {

        function selSingAreaPlayerMsg(msgWhere, areaId, servMsgs) {

            msgDao.getPlayerMessage(msgWhere, areaId, function(err, rows){
                if(err) {
                    res.status(500).send('error when selecting message, ' + err);
                    return;
                }
                console.log(servMsgs instanceof Array);
                if(servMsgs instanceof Array) {
//                    res.send(msgWhere);
                    res.send(servMsgs.concat(rows));
                } else {
                    res.send(rows);
                }
            });
        }

        function selMultAreaPlayerMsg(tasks, servMsgs) {
            async.parallel(tasks, function(err, rs){
                if(err){
                    res.status(500).send('error when selecting message, ' + err);
                    return;
                }
                var rows = rs[0];
                for(var i = 1; i < rs.length; i++) {
                    rows = rows.concat(rs[i]);
                }
                if(servMsgs instanceof Array) {
                    res.send(servMsgs.concat(rows));
                }else {
                    res.send(rows);
                }
            });
        }

        var servMsgs = [];

        if(!areaId) {
            res.status(500).send('error when selecting message, areaId is required');
            return;
        }

        // 查询单个服务器与查询多个服务器分开操作
        if(!(areaId instanceof Array) || areaId.length == 1) {
            if(areaId instanceof Array) {
                areaId = areaId[0];
            }

            // 若未指定receiver需查询对全服msg
            if(!msgWhere.receiver) {
                msgDao.getServMessage(msgWhere, areaId, function(err, rows) {
                    if (err) {
                        res.status(500).send('error when selecting message, ' + err);
                        return;
                    }
                    for(var i in rows) {
                        rows[i].areaId = areaId;
                    }
                    selSingAreaPlayerMsg(msgWhere, areaId, rows);
                });
            } else {
                selSingAreaPlayerMsg(msgWhere, areaId, servMsgs);
            }

        } else {
            var tasks4Player = []; // 查询对玩家消息的函数数组
            var tasks4Serv = []; // 查询对全服消息的函数数组
            // 构造task,分别对应每个区的查询
            for(var i in areaId) {
                (function(i){
                    var tmpAreaId = areaId[i];
                    tasks4Player.push(function(cb){
                        msgDao.getPlayerMessage(msgWhere, tmpAreaId, function(err, rows) {
                            cb(err, rows);
                        });
                    });
                    tasks4Serv.push(function(cb){
                        msgDao.getServMessage(msgWhere, tmpAreaId, function(err, rows) {
                            for(var i in rows) {
                                rows[i].areaId = tmpAreaId;
                            }
                            cb(err, rows);
                        })
                    });
                })(i);
            }
            // 若未指定receiver需查询对全服msg
            if(!msgWhere.receiver) {
                async.parallel(tasks4Serv, function(err, rs){
                    if(err){
                        res.status(500).send('error when selecting message, ' + err);
                        return;
                    }
                    var rows = rs[0];
                    for(var i = 1; i < rs.length; i++) {
                        rows = rows.concat(rs[i]);
                    }
                    selMultAreaPlayerMsg(tasks4Player, rows);
                });
            } else {
                selMultAreaPlayerMsg(tasks4Player, servMsgs);
            }
        }
    }

    /**
     * render sysMsgRecord
     */
    app.get('/admin/sysMsgRecord', filter.authorize, function (req, res) {
        res.render('sysMsgRecord', {
            menu: 'sysMsgRecord',
            title: '系统消息记录',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        })
    });

	app.all('/admin/api/getSysMsg', filter.authorize, function(req, res) {

        var areaId = req.body.areaId;

        var msgWhere = {
            receiver : req.body.playerIds,
            createTime : req.body.createTime,
            type : msgConfig.MESSAGETYPE.SYSTEM
        };
        queryMsg(msgWhere, areaId, res);
	});

};

module.exports = message;