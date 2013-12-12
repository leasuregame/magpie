/**
 * Created by lcc3536 on 13-12-6.
 */


/*
 * payment
 * */


var PAYMENT_LOCK = 0;
var PAYMENT_PURCHASED = 1;
var PAYMENT_FAILED = 2;
var PAYMENT_RESTORED = 3;
var PAYMENT_PURCHASING = 4;

var JUDGE_INTERVAL = 300;

var Payment = Entity.extend({
    _paymentKey: "",
    _receiptList: null,
    _waitLayer: null,

    init: function () {
        cc.log("TB Payment init");

        this._paymentKey = gameData.player.get("uid") + "_payment_key";
        this._receiptList = [];

        lz.server.on("onVerifyResult", function (data) {
            cc.log("***** on verify result:");
            cc.log(data);

            var msg = data.msg;

            cc.log(msg.gold);
            cc.log(msg.cash);

            var player = gameData.player;

            player.set("gold", msg.gold);
            player.set("cash", msg.cash);

            var nowVip = msg.vip;
            var oldVip = player.get("vip");

            if (nowVip && nowVip != oldVip) {
                cc.log(nowVip);
                cc.log(oldVip);

                player.set("vip", nowVip);

                var oldPrivilegeTable = outputTables.vip_privilege.rows[oldVip];
                var nowPrivilegeTable = outputTables.vip_privilege.rows[nowVip];

                gameData.treasureHunt.add("freeCount", nowPrivilegeTable.lottery_free_count - oldPrivilegeTable.lottery_free_count);
                gameData.friend.adds({
                    "maxFriendCount": nowPrivilegeTable.friend_count - oldPrivilegeTable.friend_count,
                    "giveCount": nowPrivilegeTable.give_bless_count - oldPrivilegeTable.give_bless_count,
                    "receiveCount": nowPrivilegeTable.receive_bless_count - oldPrivilegeTable.receive_bless_count
                });
                gameData.shop.add("powerBuyCount", nowPrivilegeTable.buy_power_count - oldPrivilegeTable.buy_power_count);
                gameData.tournament.add("count", nowPrivilegeTable.challenge_count - oldPrivilegeTable.challenge_count);
                gameData.spiritPool.add("collectCount", nowPrivilegeTable.spirit_collect_count - oldPrivilegeTable.spirit_collect_count);
            }
        });

        this._load();
        this.schedule(this._judge, JUDGE_INTERVAL);
    },

    _load: function () {
        cc.log("TB Payment _load");
    },

    _save: function () {
        cc.log("TB Payment _save");
    },

    _judge: function () {
        cc.log("TB Payment _judge");
    },

    _push: function (receipt) {
        cc.log("TB Payment _push");

        this._sendReceipt(receipt);
    },

    _pop: function (receipt) {
        cc.log("TB Payment _pop");

        var len = this._receiptList.length;

        for (var i = len - 1; i >= 0; --i) {
            if (this._receiptList[i] == receipt) {
                this._receiptList.splice(i, 1);
            }
        }

        this._save();
    },

    buy: function (productId) {
        cc.log("TB Payment buy");

//        if (lz.IAPHelp) {
//            this._showWaitLayer();
//
//            lz.IAPHelp.buy(productId, this, this._payCallback);
//        }

        this._push(productId);
    },

    _sendReceipt: function (receipt) {
        cc.log("TB Payment _sendReceipt");

        var that = this;
        lz.server.request("area.verifyHandler.appStore", {
            id: receipt
        }, function (data) {
            cc.log(data);

            var code = data.code;

            if (code == 200 || code == 600 || code == 501) {
                cc.log("send receipt success");
            } else {
                cc.log("send receipt fail");
            }
        }, true);
    },

    _payCallback: function (paymentData) {
        cc.log("TB Payment _payCallback");

        cc.log("=============================================================");
        cc.log("TB PaymentData state: " + paymentData.state);
        cc.log("TB PaymentData product: " + paymentData.product);
        cc.log("TB PaymentData receipt: " + paymentData.receipt);
        cc.log("TB PaymentData msg: " + paymentData.msg);
        cc.log("=============================================================");

        var state = paymentData.state;

        if (state == PAYMENT_LOCK) {
            cc.log("TB Payment lock");

            Dialog.pop("充值失败");
            this._closeWaitLayer();
        } else if (state == PAYMENT_PURCHASED) {
            cc.log("TB Payment purchased");

            this._push(paymentData.receipt);

            Dialog.pop("充值已成功，请稍候");
            this._closeWaitLayer();
        } else if (state == PAYMENT_FAILED) {
            cc.log("TB Payment failed");

            Dialog.pop("充值失败");
            this._closeWaitLayer();
        } else if (state == PAYMENT_RESTORED) {
            cc.log("TB Payment restored");

            Dialog.pop("该商品已购买");
            this._closeWaitLayer();
        } else if (state == PAYMENT_PURCHASING) {
            cc.log("TB Payment purchasing");
        } else {
            cc.log("TB Payment error");

            Dialog.pop("未知错误");
            this._closeWaitLayer();
        }
    },

    _showWaitLayer: function () {
        cc.log("TB Payment _showWaitLayer");

        if (!this._waitLayer) {
            this._waitLayer = WaitLayer.pop();
        }
    },

    _closeWaitLayer: function () {
        cc.log("TB Payment _closeWaitLayer");

        if (this._waitLayer) {
            this._waitLayer.removeFromParent();
            this._waitLayer = null;
        }

        if (this._waitTimes <= 0 && this._waitLayer) {
            this._waitLayer.removeFromParent();
            this._waitLayer = null;
        }
    }
});


Payment.create = function () {
    var ret = new Payment();

    if (ret) {
        return ret;
    }

    return null;
};