/**
 * Created by lujunyu on 14-6-16.
 */

var DailyInstances = Entity.extend({

    init: function () {
        cc.log("DailyInstances init");
    },

    update: function () {
        cc.log("DailyInstances update");
    },

    sync: function () {
        cc.log("DailyInstances sync");
    }

});

DailyInstances.create = function () {
    cc.log("DailyInstance create");

    var ret = new DailyInstances();

    if (ret) {
        return ret;
    }

    return null;
};

DailyInstances.IsShowHandler = {
    "expInstanceLayer": function () {
        return true;
    }
};

DailyInstances.IsMarkHandler = {
    "expInstanceLayer": function () {
        return false;
    }
};