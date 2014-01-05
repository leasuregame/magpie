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

var ASKING_STATUS = 1;
var ACCEPT_STATUS = 2;
var REJECT_STATUS = 3;
var UNHANDLED_STATUS = 4;
var HANDLED_STATUS = 5;
var NOTICE_STATUS = 6;

var Message = Entity.extend({
    _friendMessage: [],
    _battleMessage: [],
    _systemMessage: [],

    init: function () {
        cc.log("Message init");

        lz.server.on("onSystemMessage", function (data) {
            cc.log("***** on system message:");
            cc.log(data);

            MainScene.getInstance().changeMessage(data.msg);
        });

        this.sync();

        return true;
    },

    update: function (data) {
        cc.log("Message update");

        this._friendMessage = data.friend || [];
        this._battleMessage = data.battle || [];
        this._systemMessage = data.system || [];

        this._sort();
    },

    sync: function () {
        cc.log("Message sync");

        var that = this;
        lz.server.request(
            "area.messageHandler.messageList",
            {},
            function (data) {
                cc.log("pomelo websocket callback data:");
                cc.log(data);

                if (data.code == 200) {
                    cc.log("sync success");

                    var msg = data.msg;

                    that.update(msg);

                    lz.server.on("onMessage", function (data) {
                        cc.log("***** on message:");
                        cc.log(data);

                        gameData.message.push(data.msg);

                    });

                    gameMark.updateMessageMark(false);

                    lz.dc.event("event_message_list");
                } else {
                    cc.log("sync fail");

                    that.sync();
                }
            },
            true
        );
    },

    push: function (msg) {
        cc.log("Message push");

        if (msg.type == ADD_FRIEND_MESSAGE) {
            this._friendMessage.push(msg);
            gameMark.updateFriendMessageMark(true);
        } else if (msg.type == LEAVE_MESSAGE) {
            this._friendMessage.push(msg);
            gameMark.updateFriendMessageMark(true);
        } else if (msg.type == BATTLE_MESSAGE) {
            this._battleMessage.push(msg);
        } else if (msg.type == SYSTEM_MESSAGE) {
            this._systemMessage.push(msg);
            gameMark.updateSystemMessageMark(true);
        }

        this._sort();
    },

    accept: function (cb, msgId) {
        cc.log("Message accept: " + msgId);

        var len = this._friendMessage.length;
        var message = null;
        for (var i = 0; i < len; ++i) {
            if (this._friendMessage[i].id == msgId) {
                message = this._friendMessage[i];
                break;
            }
        }

        if (message) {
            var that = this;
            lz.server.request("area.messageHandler.accept", {
                msgId: msgId
            }, function (data) {
                cc.log("pomelo websocket callback data:");
                cc.log(data);

                if (data.code == 200) {
                    cc.log("accept success");

                    var msg = data.msg;

                    message.status = ACCEPT_STATUS;

                    gameData.friend.push(msg);
                    cb();
                    lz.dc.event("event_friend_accept");
                } else {
                    cc.log("accept fail");
                }
            });
        } else {
            TipLayer.tip("找不到这个消息");
        }
    },

    reject: function (cb, msgId) {
        cc.log("Message reject: " + msgId);

        var len = this._friendMessage.length;
        var message = null;
        for (var i = 0; i < len; ++i) {
            if (this._friendMessage[i].id == msgId) {
                message = this._friendMessage[i];
                break;
            }
        }

        if (message) {
            var that = this;
            lz.server.request("area.messageHandler.reject", {
                msgId: msgId
            }, function (data) {
                cc.log("pomelo websocket callback data:");
                cc.log(data);

                if (data.code == 200) {
                    cc.log("reject success");

                    message.status = REJECT_STATUS;
                    cb();
                    lz.dc.event("event_friend_reject");
                } else {
                    cc.log("reject fail");
                }
            });
        } else {
            TipLayer.tip("找不到这个消息");
        }
    },

    receive: function (cb, msgId) {
        cc.log("Message receive: " + msgId);

        var len = this._systemMessage.length;
        var message = null;
        for (var i = 0; i < len; ++i) {
            if (this._systemMessage[i].id == msgId) {
                message = this._systemMessage[i];
                break;
            }
        }

        if (message) {
            var that = this;
            lz.server.request("area.messageHandler.handleSysMsg", {
                msgId: msgId
            }, function (data) {
                cc.log("pomelo websocket callback data:");
                cc.log(data);

                if (data.code == 200) {
                    cc.log("receive success");

                    var msg = data.msg;

                    message.status = HANDLED_STATUS;

                    gameData.player.adds({
                        gold: msg.gold,
                        money: msg.money,
                        power: msg.powerValue,
                        skillPoint: msg.skillPoint,
                        elixir: msg.elixir
                    });

                    gameData.spirit.add("exp", msg.spirit);

                    lz.tipReward(msg);

                    cb();

                    lz.dc.event("event_handle_sys_message");
                } else {
                    TipLayer.tip(data.msg);
                    cc.log("receive fail");
                }
            });
        } else {
            TipLayer.tip("找不到这个消息");
        }
    },

    playback: function (id) {
        cc.log("Message playback");

        var battleLogPool = BattleLogPool.getInstance();

        cc.log(battleLogPool.getBattleLogById(id));

        if (battleLogPool.getBattleLogById(id)) {
            BattlePlayer.getInstance().play(id, true);
            return;
        }

        var that = this;
        lz.server.request("area.battleHandler.playBack", {
            battleLogId: id
        }, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);

            if (data.code == 200) {
                cc.log("playback success");

                var msg = data.msg;

                var battleLogId = battleLogPool.pushBattleLog(msg.battleLog, PVP_BATTLE_LOG);

                BattlePlayer.getInstance().play(battleLogId, true);

                lz.dc.event("event_battle_play_back");
            } else {
                cc.log("playback fail");

                TipLayer.tip("战斗回放出错");
            }
        });
    },

    setAsRead: function (id,cb) {

        var len = this._friendMessage.length;
        var message = null;
        for (var i = 0; i < len; ++i) {
            if (this._friendMessage[i].id == id) {
                message = this._friendMessage[i];
                break;
            }
        }

        lz.server.request("area.messageHandler.setAsRead", {
            msgId: id
        }, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);
            if (data.code == 200) {
                 cc.log("setAsRead success");
                 message.status = HANDLED_STATUS;
                 cb();
            } else {
                cc.log("setAsRead fail");
            }
        })
    },

    _sort: function () {
        cc.log("Message _sort");

        this._friendMessage.sort(this._cmp);
        this._battleMessage.sort(this._cmp);
        this._systemMessage.sort(this._cmp);
    },

    _cmp: function (a, b) {
        return (b.createTime - a.createTime);
    }
});


Message.create = function () {
    var ret = new Message();

    if (ret) {
        return ret;
    }

    return null;
};