/**
 * Created by lcc3536 on 14-2-26.
 */


/*
 * boss
 * */


var Boss = Entity.extend({
    init: function () {
        cc.log("Boss init");


        return true;
    },

    getBossList: function (cb) {
        cc.log("Boss getBossList");

        lz.server.request("", {

        }, function () {

        });
    },

    getBoss

    defiance: function (cb, id) {
        cc.log("Boss defiance");

        lz.server.request("", {

        }, function () {

        });
    }
});

Boss.create = function () {
    var ret = new Boss();

    if (ret) {
        return ret;
    }

    return null;
};