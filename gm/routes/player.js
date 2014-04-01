/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-8-27
 * Time: 上午10:46
 * To change this template use File | Settings | File Templates.
 */

var Area = require('../models/area');
var getDB = require('../models/getDatabase');
var dbClient = require('../models/dao/mysql/mysql');
var Player = require('../models/player');
var Url = require('url');
var logger = require('../logger').logger('player');

var player = function (app) {

    app.get('/playerLogin', checkLogin);

    //玩家数据修改
    app.get('/playerLogin', function (req, res) {


        var url = Url.parse(req.url, true);
        var query = url.query;

        var target = query["target"] || 'playerLogin';
        console.log(target);

        res.render('playerLogin', {
            title: '玩家数据修改',
            user: req.session.user,
            player: req.session.player,
            area: req.session.area,
            target: target,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });

    });

    app.post('/playerLogin', function (req, res) {

        var playerName = req.body.playerName;
        var area = JSON.parse(req.body.area);
        var target = req.body.target;
        console.log("target = ", target);

        var env = app.settings.env;
        var db = getDB(area.id, env);
        dbClient.init(db);

        var player = {
            where: {
                name: playerName,
                areaId: area.id
            }
        };

        Player.getPlayerInfo(player, function (err, Player) {
            if (err) {
                req.flash('error', '没有该玩家的信息');
                logger.error("[playerLogin]" + playerName + "没有该玩家的信息");
                return res.redirect('/playerLogin');
            } else {
                logger.info("[playerLogin]" + playerName);
                logger.info("[playerLogin][playerData]" + JSON.stringify(Player));
                req.session.player = Player;
                req.session.area = area;
                if (target != "playerLogin") {
                    return res.redirect('/' + target);
                }
                res.render('playerData', {
                    title: '玩家数据修改',
                    user: req.session.user,
                    player: req.session.player,
                    area: req.session.area,
                    success: req.flash('success').toString(),
                    error: req.flash('error').toString()
                });
            }
        });

    });


    app.get('/playerData', function (req, res) {
        if (req.session.player) {

            var player = {
                where: {
                    name: req.session.player.name,
                    areaId: req.session.area.id
                }
            };
            Player.getPlayerInfo(player, function (err, player) {
                if (err) {
                    req.flash('error', '没有该玩家的信息');
                    return res.redirect('/playerLogin');
                }
                else {
                    req.session.player = player;
                    res.render('playerData', {
                        title: '玩家数据修改',
                        user: req.session.user,
                        player: req.session.player,
                        area: req.session.area,
                        success: req.flash('success').toString(),
                        error: req.flash('error').toString()
                    });
                }
            });


        } else {
            res.redirect('/playerLogin?target=playerData');
        }
    });

    app.post('/playerData', function (req, res) {

        var url = Url.parse(req.url, true);
        var query = url.query;
        //console.log(req.url);
        var player = query['player'];
        var area = JSON.parse(query['area']);
        var data = JSON.parse(player);

        console.log(player, data);
        var options = {
            where: {
                name: data.name,
                areaId: area.id
            },
            data: data

        };

        Player.update(options, function (err, isOK) {
            if (err) {
                // console.log(err);
                logger.error("[update]" + err);
                res.send({type: 'error', info: '修改数据失败'});

            } else {
                logger.info("[update]" + player);
                res.send({type: 'success', info: '修改数据成功'});
            }

        });

    });

    app.get('/playerId', function (req, res) {
        var url = Url.parse(req.url, true);
        var query = url.query;
        var name = query['name'];
        var areaId = query['areaId'];

        var env = app.settings.env;
        var db = getDB(areaId, env);
        dbClient.init(db);

        Player.getPlayerId(name, areaId, function (err, id) {
            if (err) {
                res.send({type: 'error', info: err});
            } else {
                res.send({type: 'success', info: id});
            }
        });
    });

    function checkLogin(req, res, next) {
        if (!req.session.user) {
            req.flash('error', '请先登录');
            return res.redirect('/login');
        }
        next();
    }

};

module.exports = player;

