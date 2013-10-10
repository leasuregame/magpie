/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-9-16
 * Time: 下午3:33
 * To change this template use File | Settings | File Templates.
 */


var playerDao = require('./dao/mysql/playerDao');
var userDao = require('./dao/mysql/userDao');
var cardDao = require('./dao/mysql/cardDao');
var getDB = require('./getDatabase');
var dbClient = require('./dao/mysql/mysql');
var async = require('async');
var Explore = function () {
};

var maxId = 500;
var result = [];

Explore.simulate = function (env, areaId, playerId,task, cb) {

    //console.log(JSON.parse(task));
    var options = {
        where: {
            id: playerId,
            areaId: areaId
        },
        data: {
            power: {
                time: Date.now(),
                value: 100000
            },
            task:JSON.parse(task)
        }
    };

    dbClient.shutdown();
    var db = getDB(areaId, env);
    dbClient.init(db);

    return playerDao.update(options, cb);


};

Explore.getUserByAccount = function (env, uid, aid,cb) {
    dbClient.shutdown();
    var db = getDB('userdb', env);
    dbClient.init(db);
    userDao.getUserByAccount({where: {id: uid}}, function(err,user){

        dbClient.shutdown();
        var db = getDB(aid, env);
        dbClient.init(db);
        return cb(err,user);
    });
};

Explore.delCards = function (pid, cb) {

    cardDao.deleteExploreCards(pid, function (err, isOK) {
        if (!err) {
            cb(null, true);
        } else {
            cb(err, false);
        }
    })

}


module.exports = Explore;