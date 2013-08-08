/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-8-7
 * Time: 上午10:25
 * To change this template use File | Settings | File Templates.
 */


/*
 * passive skill upgrade label
 * */


var PassiveSkillUpgradeLabel = cc.Layer.extend({
    onEnter: function () {
        cc.log("PassiveSkillUpgradeLabel onEnter");

        this._super();
        this.update();
    },


    init: function () {
        cc.log("PassiveSkillUpgradeLabel init");

        if (!this._super()) return false;


        return true;
    },

    update: function () {
        cc.log("PassiveSkillUpgradeLabel update");


    }
})


PassiveSkillUpgradeLabel.create = function () {
    var ret = new PassiveSkillUpgradeLabel();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
}