/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-9-9
 * Time: 下午4:36
 * To change this template use File | Settings | File Templates.
 */


/*
 * achievement
 * */


var Achievement = Entity.extend({


    init: function () {
        cc.log("Achievement init");

        this.sync();
    },

    update: function () {
        cc.log("Achievement update");

    },

    sync: function () {
        cc.log("Achievement sync");

    },

    getAchievementList: function () {
        cc.log("Achievement getAchievementList");

        var achievementList = [];

        return achievementList;
    }
});


Achievement.create = function() {
    var ret = new Achievement();

    if(ret) {
        return ret;
    }

    return null;
}