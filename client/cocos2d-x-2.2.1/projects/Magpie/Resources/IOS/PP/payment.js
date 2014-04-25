/**
 * Created by lcc3536 on 13-12-6.
 */


/*
 * payment
 * */


var Payment = Entity.extend({
    _waitLayer: null,
    _cb: null,
    _lastOrder: null,

    init: function () {
        cc.log("PP Payment init");

        this._waitLayer = null;
        this._cb = null;
        this._lastOrder = null;
    },

    buy: function (args) {
        cc.log("PP Payment buy");

        var product = args.product;
        this._cb = args.cb;

        this._showWaitLayer();

        var user = gameData.user;
        var player = gameData.player;

        this._lastOrder = product.id + "-" + user.get("area") + "-" + player.get("uid") + "-" + Date.now();

        ppAdapter.PPExchangeGoods(
            product.cash,
            this._lastOrder,
            product.product_id,
            player.get("id"),
            0
        );
    },

    _showWaitLayer: function () {
        cc.log("PP Payment _showWaitLayer");

        if (!this._waitLayer) {
            this._waitLayer = WaitLayer.pop();
        }
    },

    _closeWaitLayer: function () {
        cc.log("PP Payment _closeWaitLayer");

        if (this._waitLayer) {
            this._waitLayer.removeFromParent();
            this._waitLayer = null;
        }
    },

    buyGoodsSuccess: function () {
        cc.log("PP Payment buyGoodsSuccess: " + this._lastOrder);

        if (!this._lastOrder) {
            return;
        }

        var args = this._lastOrder.split("-");
        var productId = parseInt(args[0]);

        if (productId >= 8) {
            gameData.player.resetGoldCards(9 - productId);

            lz.server.request("area.cardHandler.buyGoldCard", {
                orderNo: this._lastOrder,
                productId: productId
            }, function (data) {
                cc.log(data);
                if (data.code == 200) {
                    cc.log("buyGoldCard success");
                } else {
                    cc.log("buyGoldCard fail");
                }
            }, true);
        } else {
            gameData.player.updateFirstPayment(productId);
        }

        this._cb();
    }
});


Payment.create = function () {
    var ret = new Payment();

    if (ret) {
        return ret;
    }

    return null;
};