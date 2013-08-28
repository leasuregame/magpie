/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-8-26
 * Time: 下午5:56
 * To change this template use File | Settings | File Templates.
 */


/*
 * friend
 * */


var Friend = Entity.extend({
    _friendList: [],

    init: function () {
        cc.log("Friend init");
    },

    add: function (cb, playerId) {
        cc.log("Friend add");
    },

    delete: function (cb, playerId) {
        cc.log("Friend delete");
    },

    blessing: function (cb, playerId) {
        cc.log("Friend delete");
    },

    receive: function (cb, playerId) {
        cc.log("Friend receive");
    },

    sendMessage: function (cb, playerId, msg) {
        cc.log("Friend sendMessage: " + palyerId + " " + msg);
    }
});


Friend.create = function () {
    var ret = new Friend();

    if (ret) {
        return ret;
    }

    return null;
};