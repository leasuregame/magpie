/**
 * Created with JetBrains WebStorm.
 * User: lcc
 * Date: 13-7-10
 * Time: 下午3:29
 * To change this template use File | Settings | File Templates.
 */


/*
 * message
 * */


var ADD_FRIEND_MESSAGE = 1;
var LEAVE_MESSAGE = 2;
var BATTLE_MESSAGE = 3;
var SYSTEM_MESSAGE = 4;
var NOTICE_MESSAGE = 5;

var ASKING_STATUS = 1;
var ACCEPT_STATUS = 2;
var REJECT_STATUS = 3;
var HANDLED_STATUS = 4;
var UNHANDLED_STATUS = 5;
var NOTICE_STATUS = 6;

var Message = Entity.extend({
    _friendMessage: [],
    _battleMessage: [],
    _systemMessage: [],

    init: function () {
        cc.log("Message init");

        this.sync();

        return true;
    },

    sync: function () {
        cc.log("Message sync");

        var that = this;
        lzWindow.pomelo.request("area.messageHandler.messageList", {}, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);

            if (data.code == 200) {
                cc.log("sync success");

                var msg = data.msg;

                that._friendMessage = msg.friend || [];
                that._battleMessage = msg.battle || [];
                that._systemMessage = msg.system || [];

                that._sort();
            } else {
                cc.log("sync fail");

                that.sync();
            }
        });
    },

    push: function (msg) {
        cc.log("Message push");

        if (msg.type == ADD_FRIEND_MESSAGE || msg.type == LEAVE_MESSAGE) {
            this._friendMessage.push(msg);
        } else if (msg.type == BATTLE_MESSAGE) {
            this._battleMessage.push(msg);
        } else if (msg.type == SYSTEM_MESSAGE) {
            this._systemMessage.push(msg);
        }

        this._sort();
    },

    accept: function (msgId) {
        cc.log("Message accept: " + msgId);

        var that = this;
        lzWindow.pomelo.request("area.messageHandler.accept", {
            msgId: msgId
        }, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);

            if (data.code == 200) {
                cc.log("accept success");

                var msg = data.msg;

                gameData.friend.push(msg);
            } else {
                cc.log("accept fail");
            }
        });
    },

    reject: function (msgId) {
        cc.log("Message reject: " + msgId);

        var that = this;
        lzWindow.pomelo.request("area.messageHandler.reject", {
            msgId: msgId
        }, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);

            if (data.code == 200) {
                cc.log("accept success");
            } else {
                cc.log("accept fail");
            }
        });
    },

    playback: function (msgId) {
        cc.log("Message playback: " + msgId);


    },

    receive: function (msgId) {
        cc.log("Message receive: " + msgId);


    },

    _sort: function () {
        cc.log("Message _sort");

        this._friendMessage.sort(this._cmp);
        this._battleMessage.sort(this._cmp);
        this._systemMessage.sort(this._cmp);
    },

    _cmp: function (a, b) {
        return (a.createTime - b.createTime);
    }
});


Message.create = function () {
    var ret = new Message();

    if (ret) {
        return ret;
    }

    return null;
};