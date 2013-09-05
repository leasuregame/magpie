/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-6-26
 * Time: 下午5:13
 * To change this template use File | Settings | File Templates.
 */


/*
 * passiveSkill dao
 *
 * create
 * update
 * select
 * delete
 * */
var PassiveSkill = require("../../domain/entity/passiveSkill");
var DaoBase = require("./daoBase");
var utility = require("../../common/utility");

var PassiveSkillDao = (function(_super) {
    utility.extends(PassiveSkillDao, _super);

    function PassiveSkillDao() {
        PassiveSkillDao.__super__.constructor.apply(this, arguments);
    }

    PassiveSkillDao.table = 'passiveSkill';
    PassiveSkillDao.domain = PassiveSkill;
    PassiveSkillDao.syncKey = 'passiveSkillSync.updatePassiveSkillById';

    return PassiveSkillDao;
})(DaoBase);

module.exports = PassiveSkillDao;