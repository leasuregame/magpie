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


var TIP_LAYER_Z_ORDER = 10000;

var TipLayer = {
    _tip: function (hasBg, str, color, fontName, fontSize) {
        cc.log("TipLayer tip: " + str);

        if (!str) return;

        color = color || cc.c3b(255, 255, 255);
        fontName = fontName || "STHeitiTC-Medium";
        fontSize = fontSize || 30;

        var label = cc.Node.create();
        label.setPosition(gameFit.controls.tipLayer.labelPoint);
        cc.Director.getInstance().getRunningScene().addChild(label, TIP_LAYER_Z_ORDER);

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
                cc.Spawn.create(
                    cc.MoveBy.create(1.5, cc.p(0, 170)),
                    cc.Sequence.create(
                        cc.DelayTime.create(1.2),
                        cc.FadeOut.create(0.3)
                    )
                ),
                cc.CallFunc.create(function () {
                    label.removeFromParent();
                }, this)
            )
        );
    },

    tip: function (str, color, fontName, fontSize) {
        this._tip(true, str, color, fontName, fontSize);
    },

    tipNoBg: function (str, color, fontName, fontSize) {
        this._tip(false, str, color, fontName, fontSize);
    },

    tipWithIcon: function (icon, str) {
        cc.log("tipWithIcon: " + icon + " " + str);

        var effect = cc.BuilderReader.load(main_scene_image.uiEffect66, this);

        var controller = effect.controller;
        controller.ccbGoodsIcon.setTexture(lz.getTexture(main_scene_image[icon]));
        controller.ccbGoodsLabel.setString(str);

        effect.setPosition(gameFit.GAME_MIDPOINT);
        effect.animationManager.setCompletedAnimationCallback(this, function () {
            effect.removeFromParent();
        });

        cc.Director.getInstance().getRunningScene().addChild(effect, TIP_LAYER_Z_ORDER);
    },

    tipAbility: function (value) {
        if (value) {
            var animation = "animation_" + (value > 0 ? 1 : 2);
            var str = (value > 0 ? "+" : "") + value;

            var ccbNode = cc.BuilderReader.load(main_scene_image.uiEffect80, this);
            ccbNode.setPosition(gameFit.GAME_MIDPOINT);
            ccbNode.controller.ccbLabel.setString(str);
            ccbNode.animationManager.runAnimationsForSequenceNamedTweenDuration(animation, 0);
            cc.Director.getInstance().getRunningScene().addChild(ccbNode, TIP_LAYER_Z_ORDER);
        }
    }
};