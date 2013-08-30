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

   // app.get('/playerData',checkLogin);

    app.get('/playerData',function(req ,res){

        console.log(req.url);
        var url = Url.parse(req.url,true);
        var query = url.query;

        var playerName = query['playerName'];
       // console.log(url);
        var area = JSON.parse(query['area']);
        //console.log(area);

        var db = getDB(area["id"]);
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
                return res.redirect('/player');
            }else {
                console.log(Player);
                res.render('playerData',{
                    title : '玩家数据修改',
                    user : req.session.user,
                    player : Player,
                    area : area,
                    success:req.flash('success').toString(),
                    error:req.flash('error').toString()
                });
            }
        });

    });

    app.post('/playerData',function(req , res){

        var url = Url.parse(req.url,true);
        var query = url.query;
        //console.log(req.url);
        var player = JSON.parse(query['player']);
        var area = JSON.parse(query['area']);
      //  console.log((player["spiritor"]));
        var data = player;

       // console.log(area.id);
       /*
        data["power"] = {
            time : time,
            value : data["power"]
        }

        var spiritor = player["spiritor"];
        data["spiritor"] = {
            lv : data.spiritor,
            spirit: spiritor["spirit"] || 0
        }

        spiritPool = player["spiritPool"];
        data["spiritPool"] = {
            lv:data.spiritPoolLv,
            exp:spiritPool["exp"] || 0,
            collectCount:data.spiritPoolCount
        }
        */
        //console.log(data);
        var options = {
            where :{
                name : player["name"],
                areaId : area.id
            },
            data:data

        };


        playerDao.update(options,function(err,isOK){
            if(err) {
                console.log(err);
                res.send('修改数据失败');
               // req.flash('error','修改数据失败');
              //  res.redirect(req.url);
            }else {
               // req.flash('success','修改数据成功');
                //return res.msg = "修改数据成功";
                //res.redirect('/playerData?playerName=' + player["name"] + '&area=' + JSON.stringify(area));
                res.send("修改数据成功");
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

module.exports = player;

