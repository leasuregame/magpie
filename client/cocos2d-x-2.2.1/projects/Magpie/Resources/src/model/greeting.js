/**
 * Created by lujunyu on 14-2-14.
 */

var MAX_MSG_LEN = 50;

var Greeting = Entity.extend({

    _msgList: [],

    init: function () {
        cc.log("Greeting init");

        this._msgList = [];
        this.sync();
        return true;
    },

    sync: function () {
        cc.log("Greeting sync");
        var that = this;
        lz.server.request(
            "area.greetingHandler.getLatest",
            {},
            function (data) {
                cc.log("pomelo websocket callback data:");
                cc.log(data);
                if (data.code == 200) {
                    cc.log("sync success");
                    that.update(data.msg);
                    lz.server.on("onGreeting", function (data) {
                        cc.log("***** on Greeting:");
                        cc.log(data);

                        MainScene.getInstance().speaker(data.msg);
                        GreetingLabel.getInstance().pushMsg(data.msg);
                        that._push(data.msg);
                    });
                } else {
                    cc.log("sync fail");

                    that.sync();
                }
            },
            true
        );
    },

    sendMsg: function (cb, msg) {
        cc.log("Greeting send");
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

    update: function (data) {
        cc.log("Greeting update");
        this._msgList = data;
        GreetingLabel.getInstance().insertMessages();
    },

    _push: function (msg) {
        this._msgList.unshift(msg);
        var len = this._msgList.length;
        if (len >= MAX_MSG_LEN) {
            this._msgList.slice(0, MAX_MSG_LEN);
        }
    },

    getMsgList: function () {
        return this._msgList;
    }

});

Greeting.create = function () {
    var ret = new Greeting();

    if (ret) {
        return ret;
    }

    return null;
};