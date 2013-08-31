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
var passiveSkillDao = require('../models/dao/mysql/passiveSkillDao');

var Url = require('url');

var card = function(app) {

   // app.get('/card',checkLogin);

    //卡牌数据修改
    app.get('/card',function(req , res){


        Area.getAreasList(function(areas) {
            res.render('card',{
                title : '卡牌操作',
                user : req.session.user,
                playerId:req.session.playerId,
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
        var area = JSON.parse(query['area']);
        console.log(area);
        var db = getDB(area.id);
        dbClient.init(db);

        var player = {
            where :{
                name : playerName,
                areaId : area.id
            }
        };

        playerDao.getPlayerInfo(player,function(err,Player){
            if(err) {
               // console.log(err);
                req.flash('error','没有该玩家的信息');
                return res.redirect('/card');
            }else {
                //console.log(Player);
                var player = {
                    where:{
                       playerId : Player["id"]
                    }
                }
                req.session.playerId = Player.id,
                cardDao.getCards(player,function(err,cards){
                   // console.log(cards);
                    res.render('cardData',{
                        title : '卡牌操作',
                        user : req.session.user,
                        cards : cards,
                        playerName:Player.name,
                        playerId:req.session.playerId,
                        areaName:area.name,
                        success:req.flash('success').toString(),
                        error:req.flash('error').toString()
                    });

               });

            }
        });

    });

    app.post('/updateCard',function(req,res){

        var url = Url.parse(req.url,true);
        var query = url.query;

        var data = JSON.parse(query['card']);
        var card = {
            where:{
                id:data.id
            },
            data:{
                lv:data.lv,
                skillLv:data.skillLv,
                elixir:data.elixir,
                star:data.star,
                tableId:data.tableId
            }
        };

       // console.log(req.url);
      //  console.log(card.data);
        var passSkills = data.passSkills;
        console.log(passSkills);
        cardDao.update(card,function(err,isOK){
            if(err) {
                console.log(err);
            }else {
                 passSkills.forEach(function(pss){
                     if(pss.id == '' && pss.name != '' && pss.value !='') {
                         var options = {
                             data:{
                                 cardId:data.id,
                                 name:pss.name,
                                 value:pss.value,
                                 createTime:Date.now()
                             }
                         }
                         passiveSkillDao.create(options,function(err,res){
                             if(err){
                                 console.log(err);
                             }else {
                                 console.log(res);
                             }
                         });
                     }else if(pss.id != '' && pss.name == '') {
                         console.log("id = " + pss.id);
                         var options = {
                             where:{
                                 cardId:data.id,
                                 id:pss.id
                             }
                         };
                         passiveSkillDao.delete(options,function(err,isOK){
                             if(err){
                                 console.log(err);
                             }else {
                                 console.log("del = " + isOK);
                             }
                         });

                     }else {
                         var options = {
                            where:{
                              id:pss.id
                            },
                            data:{
                               cardId:data.id,
                               name:pss.name,
                               value:pss.value
                            }
                         }
                         passiveSkillDao.update(options,function(err,isOK){
                             if(err){
                                 console.log(err);
                             }else {
                                 console.log(isOK);
                             }
                         });
                     }
                 });

            }
            res.send("更新成功");
        });
    });

    app.post("/addCard",function(req,res){
        var url = Url.parse(req.url,true);
        var query = url.query;
        var card = JSON.parse(query["card"]);
        var time = Date.now();
        var options = {
            data:{
                lv:card.lv,
                skillLv:card.skillLv,
                elixir:card.elixir,
                tableId:card.tableId,
                playerId:req.session.playerId,
                star:card.star,
                createTime:time
            }
        };
        var passSkills = card.passSkills;
        var error = "success";
      //  console.log(card);
        var cardId;
        cardDao.create(options, function(err,card){
            if(err) {
                error = err;
            }else {
                cardId = card["insertId"];


                //cardDao.getCardInfo(options,function(err,card){
                  //  if(err) {
                  //      error = err;
                  //  }else {
                        //console.log("card=" + JSON.stringify(res));
                        //var card =  JSON.stringify(card);

                      //  console.log(cardId);

                        passSkills.forEach(function(pss){
                            if(!(pss.name == '' || pss.value == '')) {
                                var options = {
                                    data:{
                                        cardId:cardId,
                                        name:pss.name,
                                        value:pss.value,
                                        createTime:Date.now()
                                    }
                                }
                                passiveSkillDao.create(options,function(err,res){
                                    if(err){
                                        error = err;
                                    }else {
                                        console.log(res);
                                    }
                                });
                            }

                        });

                        console.log("cc="+cardId);
                        if(error == "success") {
                            var options = {
                                where:{
                                    id:cardId
                                }
                            };
                            cardDao.getCardInfo(options,function(err,card){
                                console.log(card);
                                console.log(JSON.stringify(card));
                                res.send(card);
                            });
                        }
                    }
                });

          //  }

       // });




    });

    app.post("/delCard",function(req,res){

        var url = Url.parse(req.url,true);
        var query = url.query;

        var cardId = query["cardId"];
        console.log(cardId);
        var options = {
            where:{
                id:cardId
            }
        };
        cardDao.delete(options,function(err,isOK){
            if(err) {
                console.log(err);
            }else {
                var options = {
                    where:{
                        cardId:cardId
                    }
                };
                passiveSkillDao.delete(options,function(err,isOK){
                    if(err) {
                        console.log(err);
                    } else {
                        res.send("true");
                    }
                });
            }
        });
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