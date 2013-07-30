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
var app = require("pomelo").app;
var dbClient = app.get("dbClient");
var logger = require("pomelo-logger").getLogger(__filename);
var BattleLog = require("../../domain/battleLog");
var DaoBase = require("./daoBase");
var utility = require("../../common/utility");


var BattleLogDao = (function(_super) {
    utility.extends(BattleLogDao, _super);

    function BattleLogDao() {
        BattleLogDao.__super__.constructor.apply(this, arguments);
    }

    BattleLogDao.DEFAULT_VALUES = {
        battleLog: {}
    };
    BattleLogDao.table = 'battleLog';
    BattleLogDao.domain = BattleLog;
    BattleLogDao.syncKey = 'battleLogSync.updateBattleLogById';

    return BattleLogDao;
})(DaoBase);

module.exports = BattleLogDao;