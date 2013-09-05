/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-6-26
 * Time: 下午5:13
 * To change this template use File | Settings | File Templates.
 */


/*
 * battleLog dao
 * */


var sqlHelper = require("./sqlHelper");

var express = require('express');
var app = express();
var dbClient = app.get('dbClient');
var log4js = require('log4js');
var logger = log4js.getLogger();

var BattleLog = require("../../domain/entity/battleLog");
var DaoBase = require("./daoBase");
var utility = require("../../common/utility");


var BattleLogDao = (function(_super) {
    utility.extends(BattleLogDao, _super);

    function BattleLogDao() {
        BattleLogDao.__super__.constructor.apply(this, arguments);
    }

    BattleLogDao.table = 'battleLog';
    BattleLogDao.domain = BattleLog;
    BattleLogDao.syncKey = 'battleLogSync.updateBattleLogById';

    return BattleLogDao;
})(DaoBase);

module.exports = BattleLogDao;