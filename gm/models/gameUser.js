/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-10-8
 * Time: 上午11:44
 * To change this template use File | Settings | File Templates.
 */
var getDB = require('./getDatabase');
var dbClient = require('./dao/mysql/mysql');
var async = require('async');
var userDao = require('./dao/mysql/userDao');

var GameUser = function(){};

GameUser.getUserByAccount = function (env, uid, aid,cb) {
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

module.exports = GameUser;
