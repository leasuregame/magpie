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
    _giveBlessList: [],
    _receiveBlessCount: 0,
    _receiveBlessList: [],
    _friendCount: 0,
    _maxFriendCount: 0,
    _friendList: [],

    init: function (data) {
        cc.log("Friend init");

        this.set("friendList", data.friendList);
        this.set("giveBlessCount", data.giveBlessCount);
        this.set("giveBlessList", data.giveBlessList);
        this.set("receiveBlessCount", data.receiveBlessCount);
        this.set("receiveBlessList", data.receiveBlessList);
        this.set("friendCount", this._friendList.length);
        this.set("maxFriendCount", 30);

        cc.log(this);

        return true;
    },

    push: function (friend) {
        cc.log("friend push");

        this._friendList.push(friend);
        this._friendCount = this._friendList.length;
    },

    delete: function(friendId) {
        var len = this._friendList.length;

        for(var i = 0; i < len; ++i) {
            if(this._friendList[i].id === friendId) {
                this._friendList.splice(i, 1);

                break;
            }
        }

        this._friendCount = this._friendList.length;
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

    deleteFriend: function (cb, friendId) {
        cc.log("Friend deleteFriend");

        var that = this;
        lzWindow.pomelo.request("area.messageHandler.deleteFriend", {
            friendId: friendId
        }, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);

            if (data.code == 200) {
                cc.log("deleteFriend success");

                that.delete(friendId);

                cb();
            } else {
                cc.log("deleteFriend fail");
            }
        });
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
                gameData.player.add("energy", 5);

                cb("success");
            } else {
                cc.log("receiveBless fail");
            }
        });
    }
});


Friend.create = function () {
    var ret = new Friend();

    if (ret) {
        return ret;
    }

    return null;
};