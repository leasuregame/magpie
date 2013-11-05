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
    _str: [],

    init: function () {
        cc.log("TipLayer init");

        if (!this._super()) return false;

        this._str = [];

        return true;
    },

    tip: function (hasBg, str, color, fontName, fontSize) {
        cc.log("TipLayer tip: " + str);

        if (!str) return;

        var len = this._str.length;

        if (len && (str == this._str[len - 1])) return;

        this._str.push(str);

        color = color || cc.c3b(255, 255, 255);
        fontName = fontName || "STHeitiTC-Medium";
        fontSize = fontSize || 25;

        var label = cc.Node.create();
        label.setPosition(cc.p(360, 550));
        this.addChild(label);

        var strLabel = StrokeLabel.create(str, fontName, fontSize);
        strLabel.setColor(color);
        label.addChild(strLabel, 1);

        if (hasBg) {
            var strLabelSize = strLabel.getContentSize();
            var bgLabelSize = cc.size(strLabelSize.width + 60, strLabelSize.height + 30);

            var bgLabel = cc.Scale9Sprite.create(main_scene_image.icon3);
            bgLabel.setContentSize(bgLabelSize);
            label.addChild(bgLabel);
        }

        label.setOpacity = function (opacity) {
            strLabel.setOpacity(opacity);

            if (bgLabel) bgLabel.setOpacity(opacity);
        };

        label.runAction(
            cc.Sequence.create(
                cc.MoveTo.create(1, cc.p(360, 650)),
                cc.FadeOut.create(0.2),
                cc.CallFunc.create(function () {
                    this._str.shift();
                    label.removeFromParent();
                }, this)
            )
        );
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
    var _tipLayer = null;

    TipLayer.getInstance = function () {
        if (_tipLayer == null) {
            _tipLayer = TipLayer.create();
            cc.Director.getInstance().getRunningScene().addChild(_tipLayer, 10);
        }

        return _tipLayer;
    };

    TipLayer.destroy = function () {
        if (_tipLayer) {
            _tipLayer.removeFromParent();
        }

        _tipLayer = null;
    };

    TipLayer.tip = function (str, color, fontName, fontSize) {
        TipLayer.getInstance().tip(true, str, color, fontName, fontSize);
    };

    TipLayer.tipNoBg = function (str, color, fontName, fontSize) {
        TipLayer.getInstance().tip(false, str, color, fontName, fontSize);
    };
})();