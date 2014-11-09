/**
 * Created by lujunyu on 14-2-14.
 */

var MAX_MSG_LEN = 50;

var Greeting = Entity.extend({

    _worldList: [],
    _unionChatList: [],
    TYPE: {
        WORLD: '_worldList',
        UNIONCHAT: '_unionChatList'
    },

    init: function () {
        cc.log("Greeting init");

        this._worldList = [];
        this._unionChatList = [];
        this.sync();
        return true;
    },

    sync: function () {
        this.syncGreeting();
        this.syncUnionChat();
    },

    syncGreeting: function() {
        cc.log("Greeting sync");
        var that = this;
        var type = this.TYPE.WORLD;

        lz.server.request(
            "area.greetingHandler.getLatest",
            {},
            function (data) {
                cc.log("pomelo websocket callback data:");
                cc.log(data);
                if (data.code == 200) {
                    cc.log("sync success");
                    that.update(data.msg, type);
                    lz.server.on("onGreeting", function (data) {
                        cc.log("***** on Greeting:");
                        cc.log(data);

                        MainScene.getInstance().speaker(data.msg);
                        GreetingLabel.getInstance().pushMsg(data.msg, type);
                        that._push(data.msg, type);
                    });
                } else {
                    cc.log("sync fail");

                    that.sync();
                }
            },
            true
        );
    },

    syncUnionChat: function() {
        cc.log("Union Chat sync");
        var that = this;
        var type = this.TYPE.UNIONCHAT;
        lz.server.request(
            "area.unionChatHandler.chatList",
            {},
            function (data) {
                cc.log("pomelo websocket callback data:");
                cc.log(data);
                if (data.code == 200) {
                    cc.log("sync success");
                    that.update(data.msg.chatList, type);
                    lz.server.on("onUnionChatMessage", function (data) {
                        cc.log("***** on Greeting:");
                        cc.log(data);

                        GreetingLabel.getInstance().pushMsg(data.msg, type);
                        that._push(data.msg, type);
                    });
                } else {
                    cc.log("sync fail");
                }
            },
            true
        );
    },

    sendWorldMsg: function (cb, msg) {
        cc.log("Greeting send: " + msg);

        lz.server.request(
            "area.greetingHandler.send",
            {content: msg},
            function (data) {
                if (data.code == 200) {
                    cc.log("send success");
                    gameData.player.add("speaker", -1);
                    cb();
                } else {
                    cc.log("send fail");
                    TipLayer.tip(data.msg);
                    cb();
                }
            }
        );
    },

    sendUnionMsg: function (cb, msg) {
        cc.log("Greeting send: " + msg);

        lz.server.request(
            "area.unionChatHandler.send",
            {content: msg},
            function (data) {
                if (data.code == 200) {
                    cc.log("send success");
                    cb();
                } else {
                    cc.log("send fail");
                    TipLayer.tip(data.msg);
                    cb();
                }
            }
        );
    },

    update: function (data, type) {
        cc.log("Greeting update");
        this[type] = data;
        GreetingLabel.getInstance().insertMessages(type);
    },

    _push: function (msg, type) {
        this[type].unshift(msg);
        var len = this[type].length;
        if (len >= MAX_MSG_LEN) {
            this[type].slice(0, MAX_MSG_LEN);
        }
    },

    getMsgList: function (type) {
        if (type) {
            return this[type];
        }

        return this._worldList;
    }

});

Greeting.create = function () {
    var ret = new Greeting();

    if (ret) {
        return ret;
    }

    return null;
};