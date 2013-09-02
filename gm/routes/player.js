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

var player = function(app) {

    //玩家数据修改
    app.get('/playerLogin',function(req , res){


        var url = Url.parse(req.url,true);
        var query = url.query;
       // console.log(url + "   " + query);
        var target = query["target"] || 'playerLogin';
       // console.log(target);
        if(!req.session.player)
            target = 'playerLogin';
        Area.getAreasList(function(areas) {

            res.render(target,{
                title : '玩家数据修改',
                user : req.session.user,
                player:req.session.player,
                area:req.session.area,
                areas:areas,
                success:req.flash('success').toString(),
                error:req.flash('error').toString()
            });
        });

    });

    app.post('/playerLogin',function(req,res){

        var playerName = req.body.playerName;//query['playerName'];
        var area = JSON.parse(req.body.area);//JSON.parse(query['area']);
        var db = getDB(area["id"]);
        dbClient.init(db);

        var player = {
            where :{
                name : playerName,
                areaId : area.id
            }
        };

        Player.getPlayerInfo(player,function(err,Player){
            if(err) {
                req.flash('error','没有该玩家的信息');
                return res.redirect('/playerLogin');
            }else {
                console.log(Player);
                req.session.player = Player;
                req.session.area = area;
                res.render('playerData',{
                    title : '玩家数据修改',
                    user : req.session.user,
                    player : req.session.player,
                    area : req.session.area,
                    success:req.flash('success').toString(),
                    error:req.flash('error').toString()
                });
            }
        });

    });


    app.get('/playerData',function(req,res){
        if(req.session.player) {
            var player = {
                where :{
                    name : req.session.player.name,
                    areaId : req.session.area.id
                }
            };
            Player.getPlayerInfo(player,function(err,Player){
                if(err) {
                    req.flash('error','没有该玩家的信息');
                    return res.redirect('/playerLogin');
                }
                else{
                  //  console.log("player = " + Player);
                    req.session.player = Player;
                    //console.log(req.session.player);
                    res.render('playerData',{
                        title : '玩家数据修改',
                        user : req.session.user,
                        player : req.session.player,
                        area : req.session.area,
                        success:req.flash('success').toString(),
                        error:req.flash('error').toString()
                    });
                }
            });


        }else {
            res.redirect('/playerLogin?target=playerData');
        }
    });

    app.post('/playerData',function(req , res){

        var url = Url.parse(req.url,true);
        var query = url.query;
        //console.log(req.url);
        var player = JSON.parse(query['player']);
        var area = JSON.parse(query['area']);
      //  console.log((player["spiritor"]));
        var data = player;


        var options = {
            where :{
                name : data.name,
                areaId : area.id
            },
            data:data

        };

        Player.update(options,function(err,isOK){
            if(err) {
               // console.log(err);
                res.send('修改数据失败');

            }else {
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

