/**
 * Created by lcc3536 on 13-12-3.
 */


/*
 * wait layer
 * */


// wait layer handler priority
var WAIT_LAYER_HANDLER_PRIORITY = -500;

var WaitLayer = LazyLayer.extend({
    init: function () {
        cc.log("WaitLayer init");

        if (!this._super()) return false;

        this.setTouchPriority(WAIT_LAYER_HANDLER_PRIORITY);

        cc.Director.getInstance().getRunningScene().addChild(this._waitLayer, 10000);

        var point = cc.p(320, 568);
        if (gameDevice != "Iphone5") {
            point = cc.p(360, 480);
        }

        var waitSprite = cc.Sprite.create(main_scene_image.icon42);
        waitSprite.setPosition(point);
        this._waitLayer.addChild(waitSprite);

        waitSprite.setOpacity(0);

        waitSprite.runAction(
            cc.Sequence.create(
                cc.DelayTime.create(0.3),
                cc.Spawn.create(
                    cc.FadeIn.create(0.3),
                    cc.RotateBy.create(0.3, -120)
                ),
                cc.CallFunc.create(function () {
                    waitSprite.runAction(
                        cc.RepeatForever.create(
                            cc.RotateBy.create(0.3, -120)
                        )
                    )
                })
            )
        );

        return true;
    }
});


WaitLayer.create = function () {
    var ret = new WaitLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};


WaitLayer.pop = function () {
    var waitLayer = new WaitLayer();

    cc.Director.getInstance().getRunningScene().addChild(waitLayer, 10000);

    return waitLayer;
};