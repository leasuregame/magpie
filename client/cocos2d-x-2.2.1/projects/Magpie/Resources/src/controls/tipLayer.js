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


var TipLayer = {
    _tip: function (hasBg, str, color, fontName, fontSize) {
        cc.log("TipLayer tip: " + str);

        if (!str) return;

        color = color || cc.c3b(255, 255, 255);
        fontName = fontName || "STHeitiTC-Medium";
        fontSize = fontSize || 30;

        var labelPoint = gameFit.controls.tipLayer.labelPoint;

        var label = cc.Node.create();
        label.setPosition(labelPoint);
        cc.Director.getInstance().getRunningScene().addChild(label, 10000);

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

        var point = gameFit.controls.tipLayer.actionPoint;

        label.runAction(
            cc.Sequence.create(
                cc.MoveTo.create(1, point),
                cc.FadeOut.create(0.2),
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
        controller.goodsIcon.setTexture(lz.getTexture(main_scene_image[icon]));
        controller.goodsLabel.setString(str);
        effect.setPosition(gameFit.GAME_MIDPOINT);
        effect.animationManager.setCompletedAnimationCallback(this, function () {
            effect.removeFromParent();
        });
        cc.Director.getInstance().getRunningScene().addChild(effect, 10000);

    },


};