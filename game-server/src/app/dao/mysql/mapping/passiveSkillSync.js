/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-1
 * Time: 下午3:11
 * To change this template use File | Settings | File Templates.
 */


/*
* passive skill sync
* */
var PassiveSkillDao = require('../passiveSkillDao');

var passiveSkillSync = {
    /*
     * 根据 id 更新一条 passiveSkill 记录
     * @param {number} id 需要更新的记录号
     * @param {object} param 字面量，更新需要的数据
     * @param {function} cb  回调函数
     * */
    updatePassiveSkillById: function (dbClient, param) {
        var cb = function() {};
        if(typeof (param.cb) != "undefined") {
            cb = param.cb;
        }

        if (typeof (param.id) == "undefined" || typeof (param.data) == "undefined") {
            return cb("param error", null);
        }

        return PassiveSkillDao.update({
            where: {id: param.id},
            data: param.data
        }, cb);
    }
};

module.exports = passiveSkillSync;