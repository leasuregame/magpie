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


var FRIEND_ACTION_ADD = 1;
var FRIEND_ACTION_DELETE = 2;

var Friend = Entity.extend({
    _friendList: [],
    _giveCount: 0,
    _receiveCount: 0,
    _maxFriendCount: 0,

    init: function () {
        cc.log("Friend init");

        this.sync();

        return true;
    },

    update: function (data) {
        cc.log("friend update");

        this.set("friendList", data.friends);
        this.set("giveCount", data.giveCount);
        this.set("receiveCount", data.receiveCount);
        this.set("maxFriendCount", data.friendsCount);
    },

    sync: function () {
        cc.log("friend sync");

        var that = this;
        lzWindow.pomelo.request("area.playerHandler.getFriends", {}, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);

            if (data.code == 200) {
                cc.log("sync success");

                var msg = data.msg;

                that.update(msg);

                lzWindow.pomelo.on("onBless", function (data) {
                    cc.log("***** on bless:");
                    cc.log(data);

                    that._onBless(data.msg);
                });

                lzWindow.pomelo.on("onFriendAction", function (data) {
                    cc.log("***** on accept:");
                    cc.log(data);

                    that._onFriendAction(data.msg);
                });
            } else {
                cc.log("sync fail");

                that.sync();
            }
        });
    },

    _onBless: function (msg) {
        cc.log("friend _onBless");

        var len = this._friendList.length;
        var friendId = msg.sender;

        for (var i = 0; i < len; ++i) {
            if (this._friendList[i].id === friendId) {
                this._friendList[i].canReceive = true;
                this._friendList[i].msgId = msg.id;
                break;
            }
        }
    },

    _onFriendAction: function (msg) {
        cc.log("friend _onFriendAction");

        var type = msg.type;

        if (type == FRIEND_ACTION_ADD) {
            this.push(msg.friend);
        } else if (type == FRIEND_ACTION_DELETE) {
            this.delete(msg.friend.id);
        }
    },

    push: function (friend) {
        cc.log("friend push");

        friend.canGive = friend.canGive || true;
        friend.canReceive = friend.canReceive || false;

        this._friendList.push(friend);
    },

    delete: function (friendId) {
        var len = this._friendList.length;

        for (var i = 0; i < len; ++i) {
            if (this._friendList[i].id === friendId) {
                this._friendList.splice(i, 1);
                break;
            }
        }
    },

    addFriend: function (name) {
        cc.log("Friend addFriend: " + name);

        if (this._friendList.length >= this._maxFriendCount) {
            TipLayer.tip("好友已满");

            return;
        }

        var that = this;
        lzWindow.pomelo.request("area.messageHandler.addFriend", {
            friendName: name
        }, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);

            if (data.code == 200) {
                cc.log("addFriend success");

                TipLayer.tip("请求已发送");
            } else {
                cc.log("addFriend fail");

                TipLayer.tip("添加好友失败");
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

                TipLayer.tip("删除成功");

                cb();
            } else {
                cc.log("deleteFriend fail");

                TipLayer.tip("删除失败");
            }
        });
    },

    giveBless: function (cb, friendId) {
        cc.log("Friend giveBless: " + friendId);

        var len = this._friendList.length;
        var friend = null;

        for (var i = 0; i < len; ++i) {
            if (this._friendList[i].id === friendId) {
                friend = this._friendList[i];
                break;
            }
        }

        if (friend) {
            var that = this;
            lzWindow.pomelo.request("area.messageHandler.giveBless", {
                friendId: friendId
            }, function (data) {
                cc.log("pomelo websocket callback data:");
                cc.log(data);

                if (data.code == 200) {
                    cc.log("giveBless success");

                    var msg = data.msg;

                    that._giveCount -= 1;
                    friend.canGive = false;

                    gameData.player.add("energy", msg.energy);

                    TipLayer.tipNoBg(lz.getNameByKey("energy") + ": " + msg.energy);

                    cb("success");
                } else {
                    cc.log("giveBless fail");
                }
            });
        } else {
            TipLayer.tip("祝福好友出错");
        }
    },

    receiveBless: function (cb, friendId) {
        cc.log("Friend receiveBless: " + friendId);

        var len = this._friendList.length;
        var friend = null;

        for (var i = 0; i < len; ++i) {
            if (this._friendList[i].id === friendId) {
                friend = this._friendList[i];
                break;
            }
        }

        if (friend && friend.msgId) {
            var that = this;
            lzWindow.pomelo.request("area.messageHandler.receiveBless", {
                msgId: friend.msgId
            }, function (data) {
                cc.log("pomelo websocket callback data:");
                cc.log(data);

                if (data.code == 200) {
                    cc.log("receiveBless success");

                    var msg = data.msg;

                    that._receiveCount -= 1;
                    friend.canReceive = false;

                    delete friend.msgId;

                    gameData.player.add("energy", msg.energy);

                    TipLayer.tipNoBg(lz.getNameByKey("energy") + ": " + msg.energy);

                    cb("success");
                } else {
                    cc.log("receiveBless fail");
                }
            });
        } else {
            TipLayer.tip("领取祝福出错");
        }
    }
});


Friend.create = function () {
    var ret = new Friend();

    if (ret) {
        return ret;
    }

    return null;
};