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
        cc.log("Friend update");

        this.set("friendList", data.friends);
        this.set("giveCount", data.giveCount);
        this.set("receiveCount", data.receiveCount);
        this.set("maxFriendCount", data.friendsCount);
    },

    sync: function () {
        cc.log("Friend sync");

        var that = this;
        lz.server.request(
            "area.playerHandler.getFriends",
            {},
            function (data) {
                cc.log("pomelo websocket callback data:");
                cc.log(data);

                if (data.code == 200) {
                    cc.log("sync success");

                    var msg = data.msg;

                    that.update(msg);
                    that.setListener();

                    gameMark.updateFriendMark(false);

                    lz.um.event("event_friend");
                } else {
                    cc.log("sync fail");

                    that.sync();
                }
            },
            true
        );
    },

    setListener: function () {
        cc.log("Friend setListener");

        var that = this;

        lz.server.on("onBless", function (data) {
            cc.log("***** on bless:");
            cc.log(data);

            that._onBless(data.msg);
            gameMark.updateFriendMark(false);
        });

        lz.server.on("onFriendAction", function (data) {
            cc.log("***** on friend action:");
            cc.log(data);

            that._onFriendAction(data.msg);
        });
    },

    _sort: function (a, b) {
        cc.log("Friend _sort");

        if (a.canReceive && !b.canReceive) {
            return -1;
        }

        if (!a.canReceive && b.canReceive) {
            return 1;
        }

        return a.id - b.id;
    },

    getFriendList: function () {
        cc.log("Friend getFriendLise");

        this._friendList.sort(this._sort);
        return this._friendList;
    },

    _onBless: function (msg) {
        cc.log("Friend _onBless");

        var friend = this.getFriend(msg.sender);

        if (friend && this.get("receiveCount") > 0) {
            friend.canReceive = true;
            friend.msgId = msg.id;
        }
    },

    _onFriendAction: function (msg) {
        cc.log("Friend _onFriendAction");

        var type = msg.type;

        if (type == FRIEND_ACTION_ADD) {
            this.push(msg.friend);
        } else if (type == FRIEND_ACTION_DELETE) {
            this.deleteFriendById(msg.friend.id);
        }
    },

    push: function (friend) {
        cc.log("Friend push");

        friend.canGive = friend.canGive || true;
        friend.canReceive = friend.canReceive || false;
        friend.giveCount = friend.giveCount || 0;
        friend.receiveCount = friend.receiveCount || 0;
        this._friendList.push(friend);
    },

    deleteFriendById: function (friendId) {
        var len = this._friendList.length;

        for (var i = 0; i < len; ++i) {
            if (this._friendList[i].id === friendId) {
                this._friendList.splice(i, 1);
                break;
            }
        }
    },


    /*
     * param friend id or friend name
     * */
    getFriend: function (param) {
        var key = "id";

        if (typeof(param) == "string") {
            key = "name"
        }

        var len = this._friendList.length;

        for (var i = 0; i < len; ++i) {
            if (this._friendList[i][key] == param) {
                return this._friendList[i];
            }
        }

        return null;
    },

    searchFriend: function (name, cb) {
        cc.log("Friend searchFriend: " + name);

        var that = this;
        lz.server.request("area.playerHandler.searchPlayer", {
            name: name
        }, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);

            if (data.code == 200) {
                cc.log("searchFriend success");
                cb(data.msg);

            } else {
                cc.log("searchFriend fail");
                TipLayer.tip(data.msg);
                cb();
            }
        });
    },

    randomFriendsList: function (cb) {
        cc.log("Friend randomFriendsList");

        lz.server.request("area.playerHandler.randomPlayers", {}, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);

            if (data.code == 200) {
                cc.log("searchFriend success");
                cb(data.msg.players);

            } else {
                cc.log("searchFriend fail");
                cb();
            }
        });
    },

    addFriend: function (name) {
        cc.log("Friend addFriend: " + name);

        if (gameData.player.get("name") == name) {
            TipLayer.tip("不能加自己为好友");
            return;
        }

        if (this._friendList.length >= this._maxFriendCount) {
            TipLayer.tip("好友已满");
            return;
        }

        var friend = this.getFriend(name);
        if (friend) {
            TipLayer.tip("该好友已经存在");
            return;
        }

        var that = this;
        lz.server.request("area.messageHandler.addFriend", {
            friendName: name
        }, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);

            if (data.code == 200) {
                cc.log("addFriend success");

                TipLayer.tip("请求已发送");

                lz.um.event("event_add_friend");
            } else if (data.code == 501) {
                cc.log("addFriend fail");

                TipLayer.tip(data.msg);
            } else {
                cc.log("addFriend fail");

                TipLayer.tip("添加好友失败");
            }
        });
    },

    deleteFriend: function (cb, friendId) {
        cc.log("Friend deleteFriend");

        var that = this;
        lz.server.request("area.messageHandler.deleteFriend", {
            friendId: friendId
        }, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);

            if (data.code == 200) {
                cc.log("deleteFriend success");

                that.deleteFriendById(friendId);

                TipLayer.tip("删除成功");

                cb();

                lz.um.event("event_delete_friend");
            } else {
                cc.log("deleteFriend fail");

                TipLayer.tip("删除失败");
                cb();
            }
        });
    },

    giveBless: function (cb, friendId) {
        cc.log("Friend giveBless: " + friendId);

        var friend = this.getFriend(friendId);
        if (friend) {
            var that = this;
            lz.server.request("area.messageHandler.giveBless", {
                friendId: friendId
            }, function (data) {
                cc.log("pomelo websocket callback data:");
                cc.log(data);

                if (data.code == 200) {
                    cc.log("giveBless success");

                    var msg = data.msg;

                    that._giveCount -= 1;
                    friend.canGive = false;
                    friend.giveCount += 1;
                    gameData.player.add("energy", msg.energy);

                    lz.tipReward("energy", msg.energy);

                    cb("success");

                    lz.um.event("event_give_bless");
                } else {
                    cc.log("giveBless fail");
                    TipLayer.tip(data.msg);
                    cb();
                }
            });
        } else {
            TipLayer.tip("祝福好友出错");
        }
    },

    receiveBless: function (cb, friendId) {
        cc.log("Friend receiveBless: " + friendId);

        var friend = this.getFriend(friendId);
        if (friend && friend.msgId) {
            var that = this;
            lz.server.request("area.messageHandler.receiveBless", {
                msgId: friend.msgId
            }, function (data) {
                cc.log("pomelo websocket callback data:");
                cc.log(data);

                if (data.code == 200) {
                    cc.log("receiveBless success");

                    var msg = data.msg;

                    that._receiveCount -= 1;
                    friend.canReceive = false;
                    friend.receiveCount += 1;
                    delete friend.msgId;

                    gameData.player.add("energy", msg.energy);

                    lz.tipReward("energy", msg.energy);

                    cb("success");

                    lz.um.event("event_receive_bless");
                } else {
                    cc.log("receiveBless fail");
                    TipLayer.tip(data.msg);
                    cb();
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