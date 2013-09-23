/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-9-12
 * Time: 下午3:54
 * To change this template use File | Settings | File Templates.
 */


/*
 * tip layer
 * */


var TipLayer = cc.Layer.extend({
    _tipLabel: [],

    init: function () {
        cc.log("TipLayer init");

        if (!this._super()) return false;

        this._tipLabel = [];

        return true;
    },

    tip: function (str, color, fontName, fontSize) {
        cc.log("TipLayer tip: " + str);

        if (!str) return;

        color = color || cc.c3b(255, 240, 170);
        fontName = fontName || "STHeitiTC-Medium";
        fontSize = fontSize || 30;

        var strLabel = cc.LabelTTF.create(str, fontName, fontSize);
        strLabel.setColor(color);
        strLabel.setPosition(cc.p(360, 550));
        this.addChild(strLabel);

        var len = this._tipLabel.length;

        for (var i = 0; i < len; ++i) {
            var _tipLabel = this._tipLabel[i];
            _tipLabel.speed += 0.3;
            _tipLabel.action.setSpeed(_tipLabel.speed);
        }

        var moveAction = cc.MoveTo.create(1.5, cc.p(360, 700));
        var callFuncAction = cc.CallFunc.create(function () {

            this._tipLabel.shift();

            strLabel.stopAllActions();
            strLabel.removeFromParent();

            if (!this._tipLabel.length) {
                this.removeFromParent();
            }
        }, this);

        var speed = 1;

        var sequenceAction = cc.Sequence.create(moveAction, callFuncAction);
        var speedAction = cc.Speed.create(sequenceAction, speed);

        this._tipLabel.push({
            label: strLabel,
            action: speedAction,
            speed: speed
        });

        strLabel.runAction(speedAction);
    }
});


TipLayer.create = function () {
    var ret = new TipLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};


(function () {
    var tipLayer = null;

    TipLayer.tip = function (str, color, fontName, fontSize) {
        if (tipLayer == null) {
            tipLayer = TipLayer.create();
            tipLayer.retain();
        }

        if (tipLayer.getParent() == null) {
            cc.Director.getInstance().getRunningScene().addChild(tipLayer);
        }

        tipLayer.tip(str, color, fontName, fontSize);
    };
})();