/**
 * Created by lcc3536 on 13-12-6.
 */


/*
 * payment
 * */


var Payment = Entity.extend({
    _waitLayer: null,

    init: function () {
        cc.log("TB Payment init");

        this._waitLayer = null;
    },

    buy: function (product) {
        cc.log("TB Payment buy");

        this._showWaitLayer();

        var user = gameData.user;
        var player = gameData.player;

        tbAdapter.TBUnipayForCoinWithOrder(
            product.id + "-" + player.get("uid") + "-" + Date.now(),
            product.cash,
            player.get("id") + ":" + user.get("area") + ":" + product.id
        );
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
    },

    buyGoodsSuccess: function (order) {
        cc.log("TB Payment buyGoodsSuccess: " + order);

        var args = order.split("-");
        var productId = parseInt(args[0]);

        if (productId >= 8) {
            lz.server.request("area.cardHandler.buyGoldCard", {
                orderNo: order,
                productId: productId
            }, function (data) {
                cc.log(data);
                if (data.code == 200) {
                    cc.log("buyGoldCard success");
                } else {
                    cc.log("buyGoldCard fail");
                }
            }, true);
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