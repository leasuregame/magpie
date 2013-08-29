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
    _giveBlessCount: 0,
    _receiveBlessCount: 0,
    _friendList: [],

    init: function (data) {
        cc.log("Friend init");

        this._friendList = data.friendList;
        this._giveBlessCount = data.giveBlessCount;
        this._receiveBlessCount = data.receiveBlessCount;

        cc.log(this);

        return true;
    },

    addFriend: function (name) {
        cc.log("Friend addFriend: " + name);

        var that = this;
        lzWindow.pomelo.request("area.messageHandler.addFriend", {
            friendName: name
        }, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);

            if (data.code == 200) {
                cc.log("addFriend success");
            } else {
                cc.log("addFriend fail");
            }
        });
    },

    deleteFriend: function (cb, playerId) {
        cc.log("Friend deleteFriend");
    },

    giveBless: function (cb, friendId) {
        cc.log("Friend giveBless: " + friendId);

        var that = this;
        lzWindow.pomelo.request("area.messageHandler.giveBless", {
            friendId: friendId
        }, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);

            if (data.code == 200) {
                cc.log("giveBless success");

                that._giveBlessCount -= 1;

                cb("success");
            } else {
                cc.log("giveBless fail");

                cb("fail");
            }
        });
    },

    receiveBless: function (cb, friendId) {
        cc.log("Friend receiveBless: " + friendId);

        var that = this;
        lzWindow.pomelo.request("area.messageHandler.receiveBless", {
            friendId: friendId
        }, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);

            if (data.code == 200) {
                cc.log("receiveBless success");

                that._receiveBlessCount -= 1;

                cb("success");
            } else {
                cc.log("receiveBless fail");

                cb("fail");
            }
        });
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