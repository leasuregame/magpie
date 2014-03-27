/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-8-28
 * Time: 下午4:26
 * To change this template use File | Settings | File Templates.
 */

var dbClient = require('../models/dao/mysql/mysql');
var getDB = require('../models/getDatabase');
var Player = require('../models/player');
var Card = require('../models/card');
var logger = require('../logger').logger('card');
var Url = require('url');

var card = function(app) {

    // app.get('/card',checkLogin);

    //卡牌数据修改
    app.get('/cardData', function(req, res) {

        if (req.session.player) {

            var player = {
                where: {
                    name: req.session.player.name,
                    areaId: req.session.area.id
                }
            };
            Player.getPlayerInfo(player, function(err, Player) {
                if (err) {
                    req.flash('error', '没有该玩家的信息');
                    return res.redirect('/playerLogin');
                } else {
                    //  console.log("player = " + Player);
                    req.session.player = Player;
                    res.render('cardData', {
                        title: '卡牌操作',
                        user: req.session.user,
                        player: req.session.player,
                        area: req.session.area,
                        success: req.flash('success').toString(),
                        error: req.flash('error').toString()
                    });
                }
            });

        } else {
            res.redirect('/playerLogin?target=cardData');
        }

    });


    app.post('/updateCard', function(req, res) {

        var url = Url.parse(req.url, true);
        var query = url.query;

        var data = JSON.parse(query['card']);
        //var lineUp = query['lineUp'];
        // console.log(lineUp);
        logger.info("[update]" + JSON.stringify(data));
        Card.update(data, function(err, cardName) {
            if (err) {
                logger.error("[update]" + err);
                res.send({
                    type: "fail",
                    info: err
                });
            } else {

                // Player.update({
                //     where: {
                //         id: data.playerId
                //     },
                //     data: {
                //         lineUp: lineUp
                //     }
                // }, function(err, isOk) {
                //     if (isOk) {
                        logger.info("[update]" + "success");
                        res.send({
                            type: "success",
                            info: cardName
                        });
                //     } else {
                //         logger.error("[update]" + err);
                //         res.send({
                //             type: "fail",
                //             info: err
                //         });
                //     }
                // });

            }
        });
    });

    app.post("/addCard", function(req, res) {
        var url = Url.parse(req.url, true);
        var query = url.query;
        var card = JSON.parse(query["card"]);
        logger.info("[add]" + JSON.stringify(card));
        // console.log(card);
        card.passiveSkills = [{
            id: 1,
            items: card.passiveSkills,
            active: true
        }, {
            id: 2,
            items: card.passiveSkills,
            active: false
        }, {
            id: 3,
            items: card.passiveSkills,
            active: false
        }];
        Card.create(card, function(err, result) {
            if (err) {
                if (err == 'tableIdError') {
                    logger.error("[add]" + "不存在tableId = " + card.tableId + "的卡牌");
                    res.send({
                        type: "fail",
                        info: "不存在tableId = " + card.tableId + "的卡牌"
                    });
                } else {
                    logger.error("[add]" + err);
                    res.send({
                        type: "fail",
                        info: "添加卡牌出错"
                    });
                }
            } else {

                logger.info("[add]" + "success");
                res.send({
                    type: "success",
                    info: result
                });
            }
        });
    });

    app.post("/delCard", function(req, res) {

        var url = Url.parse(req.url, true);
        var query = url.query;

        var cardId = query["cardId"];
        var lineUp = query['lineUp'];
        //  console.log(cardId);
        logger.info("[del]cardId = " + cardId);
        Card.delete(cardId, function(err, isOK) {
            // res.send(isOK);
            if (err) {
                logger.error("[del]" + err);
                res.send({
                    type: "fail",
                    info: err
                });
            } else {
                Player.update({
                    where: {
                        id: req.session.player.id
                    },
                    data: {
                        lineUp: lineUp
                    }
                }, function(err, isOk) {
                    if (isOk) {
                        logger.info("[del] " + "success");
                        res.send({
                            type: "success",
                            info: "删除成功"
                        });
                    } else {
                        logger.error("[del]" + err);
                        res.send({
                            type: "fail",
                            info: err
                        });
                    }
                });

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

module.exports = card;