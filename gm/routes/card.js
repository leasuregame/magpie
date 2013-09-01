/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-8-28
 * Time: 下午4:26
 * To change this template use File | Settings | File Templates.
 */

var dbClient = require('../models/dao/mysql/mysql');
var cardDao = require('../models/dao/mysql/cardDao');
var passiveSkillDao = require('../models/dao/mysql/passiveSkillDao');
var Card = require('../models/card');

var Url = require('url');

var card = function(app) {

   // app.get('/card',checkLogin);

    //卡牌数据修改
    app.get('/cardData',function(req , res){

        if(req.session.player) {
            res.render('cardData',{
                title : '卡牌操作',
                user : req.session.user,
                player:req.session.player,
                area : req.session.area,
                success:req.flash('success').toString(),
                error:req.flash('error').toString()
            });
        }else {
            res.redirect('/playerLogin?target=card');
        }

    });


    app.post('/updateCard',function(req,res){

        var url = Url.parse(req.url,true);
        var query = url.query;

        var data = JSON.parse(query['card']);

        Card.update(data,function(err,isOK){
            res.send("更新成功");
        });
    });

    app.post("/addCard",function(req,res){
        var url = Url.parse(req.url,true);
        var query = url.query;
        var card = JSON.parse(query["card"]);
        console.log(card);
        Card.create(card,function(err,card){
            if(err) {
                console.log(err);

            } else{
                console.log(card);
                res.send(card);
            }
        });
    });

    app.post("/delCard",function(req,res){

        var url = Url.parse(req.url,true);
        var query = url.query;

        var cardId = query["cardId"];
      //  console.log(cardId);

        Card.delete(cardId,function(err,isOK){
            res.send(isOK);
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