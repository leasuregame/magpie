/**
 * Created by lcc3536 on 13-11-30.
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
        cc.log("AppStore Payment init");

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
        cc.log("AppStore Payment _load");

        var receiptListJson = sys.localStorage.getItem(this._paymentKey);

        if (receiptListJson) {
            this._receiptList = JSON.parse(receiptListJson) || [];
        }
    },

    _save: function () {
        cc.log("AppStore Payment _save");

        sys.localStorage.setItem(this._paymentKey, JSON.stringify(this._receiptList));
    },

    _judge: function () {
        cc.log("AppStore Payment _judge");

        var len = this._receiptList.length;

        for (var i = 0; i < len; ++i) {
            this._sendReceipt(this._receiptList[i]);
        }
    },

    _push: function (receipt) {
        cc.log("AppStore Payment _push");

        this._receiptList.push(receipt);

        this._save();

        this._sendReceipt(receipt);
    },

    _pop: function (receipt) {
        cc.log("AppStore Payment _pop");

        var len = this._receiptList.length;

        for (var i = len - 1; i >= 0; --i) {
            if (this._receiptList[i] == receipt) {
                this._receiptList.splice(i, 1);
            }
        }

        this._save();
    },

    buy: function (productId) {
        cc.log("AppStore Payment buy");

        if (lz.IAPHelp) {
            this._showWaitLayer();

            lz.IAPHelp.buy(productId, this, this._payCallback);
        }
    },

    _sendReceipt: function (receipt) {
        cc.log("AppStore Payment _sendReceipt");

        var that = this;
        lz.server.request("area.verifyHandler.appStore", {
            receipt: receipt
        }, function (data) {
            cc.log(data);

            var code = data.code;

            if (code == 200 || code == 600 || code == 501) {
                cc.log("send receipt success");

                that._pop(receipt);
            } else {
                cc.log("send receipt fail");
            }
        }, true);
    },

    _payCallback: function (paymentData) {
        cc.log("AppStore Payment _payCallback");

        cc.log("=============================================================");
        cc.log("paymentData state: " + paymentData.state);
        cc.log("paymentData product: " + paymentData.product);
        cc.log("paymentData receipt: " + paymentData.receipt);
        cc.log("paymentData msg: " + paymentData.msg);
        cc.log("=============================================================");

        var state = paymentData.state;

        if (state == PAYMENT_LOCK) {
            cc.log("payment lock");

            Dialog.pop("充值失败");
            this._closeWaitLayer();
        } else if (state == PAYMENT_PURCHASED) {
            cc.log("payment purchased");

            this._push(paymentData.receipt);

            Dialog.pop("充值已成功，请稍候");
            this._closeWaitLayer();
        } else if (state == PAYMENT_FAILED) {
            cc.log("payment failed");

            Dialog.pop("充值失败");
            this._closeWaitLayer();
        } else if (state == PAYMENT_RESTORED) {
            cc.log("payment restored");

            Dialog.pop("该商品已购买");
            this._closeWaitLayer();
        } else if (state == PAYMENT_PURCHASING) {
            cc.log("payment purchasing");
        } else {
            cc.log("payment error");

            Dialog.pop("未知错误");
            this._closeWaitLayer();
        }
    },

    _showWaitLayer: function () {
        cc.log("AppStore Payment _showWaitLayer");

        if (!this._waitLayer) {
            this._waitLayer = WaitLayer.pop();
        }
    },

    _closeWaitLayer: function () {
        cc.log("AppStore Payment _closeWaitLayer");

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