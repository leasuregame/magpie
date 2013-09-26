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

    onEnter: function () {
        cc.log("TipLayer onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("TipLayer init");

        if (!this._super()) return false;

        this._tipLabel = [];

        return true;
    },

    update: function () {
        cc.log("TipLayer update");

        cc.log(this._tipLabel);

        var len = this._tipLabel.length;
        for (var i = 0; i < len; ++i) {
            this._tipLabel[i].label.removeFromParent();
        }

        this._tipLabel = [];
    },

    tip: function (str, color, fontName, fontSize) {
        cc.log("TipLayer tip: " + str);

        if (!str) return;

        color = color || cc.c3b(255, 240, 170);
        fontName = fontName || "STHeitiTC-Medium";
        fontSize = fontSize || 25;

        var label = cc.Node.create();
        label.setPosition(cc.p(360, 550));
        this.addChild(label);

        var strLabel = cc.LabelTTF.create(str, fontName, fontSize);
        strLabel.setColor(color);
        label.addChild(strLabel, 1);

        var strLabelSize = strLabel.getContentSize();
        var bgLabelSize = cc.size(strLabelSize.width + 60, strLabelSize.height + 30);

        var bgLabel = cc.Scale9Sprite.create(main_scene_image.icon3);
        bgLabel.setContentSize(bgLabelSize);
        label.addChild(bgLabel);

        var len = this._tipLabel.length;

        for (var i = 0; i < len; ++i) {
            var _tipLabel = this._tipLabel[i];
            _tipLabel.speed += 0.3;
            _tipLabel.action.setSpeed(_tipLabel.speed);
        }

        var moveAction = cc.MoveTo.create(1.5, cc.p(360, 700));
        var callFuncAction = cc.CallFunc.create(function () {
            this._tipLabel.shift();

            label.removeFromParent();

            if (!this._tipLabel.length) {
                this.removeFromParent();
            }
        }, this);

        var speed = 1;

        var sequenceAction = cc.Sequence.create(moveAction, callFuncAction);
        var speedAction = cc.Speed.create(sequenceAction, speed);

        this._tipLabel.push({
            label: label,
            action: speedAction,
            speed: speed
        });

        label.runAction(speedAction);
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
            cc.Director.getInstance().getRunningScene().addChild(tipLayer, 10);
        }

        tipLayer.tip(str, color, fontName, fontSize);
    };
})();