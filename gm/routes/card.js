/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-8-28
 * Time: 下午4:26
 * To change this template use File | Settings | File Templates.
 */

var Area = require('../models/area');
var getDB = require('../models/getDatabase');
var dbClient = require('../models/dao/mysql/mysql');
var cardDao = require('../models/dao/mysql/cardDao');
var playerDao = require('../models/dao/mysql/playerDao');
var cardDomain = require('../public/javascripts/cards');

var Url = require('url');

var card = function(app) {

   // app.get('/card',checkLogin);

    //玩家数据修改
    app.get('/card',function(req , res){


        Area.getAreasList(function(areas) {
            res.render('card',{
                title : '卡牌操作',
                user : req.session.user,
                areas:areas,
                success:req.flash('success').toString(),
                error:req.flash('error').toString()
            });
        });


    });


    //app.get('/cardData',checkLogin);

    app.get('/cardData',function(req ,res){

        var url = Url.parse(req.url,true);
        var query = url.query;

        var playerName = query['playerName'];
        var areaId = query['areaId'];

        var db = getDB(areaId);
        dbClient.init(db);

        var player = {
            where :{
                name : playerName,
                areaId : areaId
            }
        };

        playerDao.getPlayerInfo(player,function(err,Player){
            if(err) {
                console.log(err);
                req.flash('error','没有该玩家的信息');
                return res.redirect('/card');
            }else {
                //console.log(Player);
                var player = {
                    where:{
                       playerId : Player["id"]
                    }
                }

                cardDao.getCards(player,function(err,cards){

                  // var data = {};
                    //console.log(cards[1]);
                   /* cards.forEach(function(card){
                        var option = {
                            where:{
                                id:card["id"]
                            }
                        }
                        cardDao.getCardInfo(option,function(err,card){
                            if(err){
                                console.log(err);
                            }else{
                                //console.log(card);

                                data.push(card);
                            }

                        }); */
                   // });

                    //var c = JSON.stringify(cards[0]);
                    //console.log(JSON.stringify(cards));
                   // console.log(c);
                    console.log(cards);
                    res.render('cardData',{
                        title : '卡牌操作',
                        user : req.session.user,
                        cards : cards,
                        success:req.flash('success').toString(),
                        error:req.flash('error').toString()
                    });

                    //CardData.setCard(cards[1]);

               });

            }
        });

    });

    app.post('/cardData',function(req,res){
        console.log(req.url);
        console.log(req.body);
    });

    app.delete('/cardData/del',function(req,res){
        console.log("del");
        console.log(req.body);
    });

    app.put('/cardData/add',function(req,res){
        console.log("add");
        console.log(req.body);
    });

    function checkLogin(req, res, next){
        if(!req.session.user){
            req.flash('error','请先登录');
            return res.redirect('/login');
        }
        next();
    }



};

module.exports = card;