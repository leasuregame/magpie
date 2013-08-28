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
var playerDao = require('../models/dao/mysql/playerDao');
var Player = require('../models/player');
var Url = require('url');

var player = function(app) {

    // app.get('/player',checkLogin);

    //玩家数据修改
    app.get('/player',function(req , res){


        Area.getAreasList(function(areas) {
            res.render('player',{
                title : '玩家数据修改',
                user : req.session.user,
                areas:areas,
                success:req.flash('success').toString(),
                error:req.flash('error').toString()
            });
        });


    });
   /*
    app.post('/player',function(req , res){

        var playerName = req.body.playerName;
        var areaId = req.body.areaId;
        var player = {
            where :{
                name : playerName,
                areaId : areaId
            }
        }
       // res.session.player = player;
       //res.createSession(req,player);
       // res.redirect('/playerData?name=' + playerName.toString() + '&areaId=' + areaId.toString());
        var db = getDB(areaId);
        dbClient.init(db);

        playerDao.getPlayerInfo(player,function(err,player){
            if(err) {
                console.log(err);
                return res.redirect('/player');
            }else {
               // console.log(player);
                //$(document).ready(function(){
                //    document.getElementById("lv").val = player.lv;
                //});
                //console.log(player);
                var pp = new Player(player);
                console.log(pp);
                res.redirect('/playerData?player='+pp);
            }
        });
        //   req.flash('success', '通过');

    });
     */
    // app.get('/playerData',checkLogin);


    app.get('/playerData',function(req ,res){

        var url = Url.parse(req.url,true);
        var query = url.query;

       // console.log(req);
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
                return res.redirect('/player');
            }else {
                console.log(Player);
                res.render('playerData',{
                    title : '玩家数据修改',
                    user : req.session.user,
                    player : Player,
                    success:req.flash('success').toString(),
                    error:req.flash('error').toString()
                });
            }
        });

    });

    app.post('/playerData',function(req , res){
        //console.log(req.url);
        var url = Url.parse(req.url,true);
        var query = url.query;

        console.log(req.body);
        var playerName = query['playerName'];
        var areaId = query['areaId'];

        var data = req.body;
        var time = new Date();

        data["power"] = {
            time : time,
            value : data["power"]
        }


        console.log(data["spiritor"]);
        data["spiritor"] = {
            lv : data.spiritor[0],
            spirit:data.spiritor[1]
        }
        data["spiritPool"] = {
            lv:data.spiritPool[0],
            exp:data.spiritPool[1],
            collectCount:data.spiritPool[2]
        }


        var player = {
            where :{
                name : playerName,
                areaId : areaId
            },
            data:req.body

        };


        playerDao.update(player,function(err,isOK){
            if(err) {
                console.log(err);
                req.flash('error','修改数据失败');
                res.redirect(req.url);
            }else {
                console.log(isOK);
                req.flash('success','修改数据成功');
                res.redirect(req.url);
            }

        });

    });

};

module.exports = player;

