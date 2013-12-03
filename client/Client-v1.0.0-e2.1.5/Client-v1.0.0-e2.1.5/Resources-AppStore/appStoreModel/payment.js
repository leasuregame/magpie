/**
 * Created by lcc3536 on 13-11-30.
 */


/*
 * payment
 * */


var Payment = Entity.extend({
    _paymentKey: "",
    _receiptList: null,

    init: function () {
        cc.log("Payment init");

        this._paymentKey = gameData.user.get("Id") + "_" + gameData.player.get("id");
    },

    _load: function () {

    },

    _save: function() {
        cc.log("Payment _save");


    },

    buy: function (productId) {
        cc.log("Payment buy");

        lz.IAPHelp.buy(productId, this, this._payCallback);
    },

    _payCallback: function (paymentData) {
        cc.log("Payment _payCallback");

        cc.log("=============================================================");
        cc.log("paymentData state: " + paymentData.state);
        cc.log("paymentData product: " + paymentData.product);
        cc.log("paymentData receipt: " + paymentData.receipt);
        cc.log("paymentData msg: " + paymentData.msg);
        cc.log("=============================================================");
    }
});