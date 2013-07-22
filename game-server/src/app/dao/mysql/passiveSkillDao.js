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
var PassiveSkill = require("../../domain/passiveSkill");
var DaoBase = require("./daoBase");
var utility = require("../../common/utility");

var PassiveSkillDao = (function(_super) {
    utility.extends(PassiveSkillDao, _super);

    function PassiveSkillDao() {
        PassiveSkillDao.__super__.constructor.apply(this, arguments);
    }

    PassiveSkillDao.DEFAULT_VALUES = {
        name: '',
        value: 0
    };
    PassiveSkillDao.table = 'passiveSkill';
    PassiveSkillDao.domain = PassiveSkill;
    PassiveSkillDao.syncKey = 'passiveSkillSync.updatePassiveSkillById';

    PassiveSkillDao.createPassiveSkill = PassiveSkillDao.create;
    PassiveSkillDao.getPassiveSkillById = PassiveSkillDao.fetchOne;
    PassiveSkillDao.deletePassiveSkillById = PassiveSkillDao.delete;
    PassiveSkillDao.getPassiveSkillByCardId = PassiveSkillDao.fetchMany;

    return PassiveSkillDao;
})(DaoBase);

module.exports = PassiveSkillDao;