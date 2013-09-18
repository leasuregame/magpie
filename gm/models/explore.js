/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-9-16
 * Time: 下午3:33
 * To change this template use File | Settings | File Templates.
 */


var playerDao = require('./dao/mysql/playerDao');
var userDao = require('./dao/mysql/userDao');
var getDB = require('./getDatabase');
var dbClient = require('./dao/mysql/mysql');
var async = require('async');
//var pomelo = window.pomelo;
var Explore = function(){};

var maxId = 500;
var result = [];

Explore.simulate = function(env,areaId,playerName,next){

    //var db = getDB(areaId,env);
    //dbClient.init(db);
    var options = {
        where :{
            name : playerName,
            areaId : areaId
        },
        data:{
            power:{
                time:Date.now(),
                value:100000
            },
            task:{
                id:1,
                progress:0
            }
        }
    };

    async.waterfall([
        function(cb) {
            var db = getDB(areaId,env);
            dbClient.init(db);
            return playerDao.update(options,cb);
        },
        function(isOk,cb){
           // console.log(isOk);
            if(isOk) {
                var player = {
                    where :{
                        name : playerName,
                        areaId : areaId
                    }
                };
              return playerDao.getPlayerInfo(player,cb);
            }
            else
                return cb("没有该玩家信息",null);
        },
        function(player,cb) {
        //    if(isOk) {
                dbClient.shutdown();
                var db = getDB('userdb',env);
                dbClient.init(db);
                //console.log(dd);
                return userDao.getUserByAccount({where:{id:player.userId}},cb);

        }

    ],function(err,data){
        dbClient.shutdown();
        var db = getDB(areaId,env);
        dbClient.init(db);
        if(err) {
            return next(err,null);
        }

        return next(null,data);
    });

};

Explore.queryEntry = function(callback) {
    var route = 'gate.gateHandler.queryEntry';
    pomelo.init({
        host: window.location.hostname,
        port: 3009,
        log: true
    }, function() {
        pomelo.request(route, {
            //uid: uid
        }, function(data) {
            pomelo.disconnect();
            if(data.code === 500) {
            //    showError(LOGIN_ERROR);
                return;
            }
            callback(data.host, data.port);
        });
    });
};



module.exports = Explore;