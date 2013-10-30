/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-10-30
 * Time: 上午11:33
 * To change this template use File | Settings | File Templates.
 */

var Activity = Entity.extend({

    _goldRewardList: null,
    init: function () {
        cc.log("Activity init");

        this.sync();

        return true;
    },

    sync: function () {
        cc.log("Activity sync");
    },

    update: function(data) {
        cc.log("Activity update");
    },

    getPowerReward: function(cb) {

    },

    getGoldReward: function() {

    }

});