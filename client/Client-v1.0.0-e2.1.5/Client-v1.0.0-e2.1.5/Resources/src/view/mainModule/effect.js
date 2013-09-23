/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-9-10
 * Time: 下午3:58
 * To change this template use File | Settings | File Templates.
 */


/*
 * effect
 * */


var playEffect = function (arg) {
    cc.log("playEffect");
    cc.log(arg);

    arg = arg || {};

    var effectId = arg.effectId;
    var target = arg.target;
    var delay = arg.delay || 0.1;
    var loops = arg.loops;
    var position = arg.position || GAME_MIDPOINT;
    var anchorPoint = arg.anchorPoint;
    var scale = arg.scale;
    var scaleX = arg.scaleX;
    var scaleY = arg.scaleY;
    var rotation = arg.rotation;
    var zOrder = arg.zOrder;
    var clear = arg.clear || (arg.cb ? false : true);
    var cb = arg.cb || null;

    if (!effectId || !target) {
        return;
    }

    var frames = [];
    var rect = effectRect[effectId];

    for (var i = 0; i < effectConfig[effectId]; ++i) {
        var frame = cc.SpriteFrame.create(
            main_scene_image["effect" + effectId + "_frame" + i],
            rect
        );

        frames.push(frame);
    }

    var animation = cc.Animation.create(frames, delay);
    var animate = cc.Animate.create(animation);

    var sprite = cc.Sprite.createWithSpriteFrame(frames[0]);
    sprite.setPosition(position);
    target.addChild(sprite);

    if (anchorPoint) {
        sprite.setAnchorPoint(anchorPoint);
    }

    if (scale) {
        sprite.setScale(scale);
    }

    if (scaleX) {
        sprite.setScaleX(scaleX);
    }

    if (scaleY) {
        sprite.setScaleY(scaleY);
    }

    if (rotation) {
        sprite.setRotation(rotation);
    }

    if (zOrder) {
        sprite.setZOrder(zOrder);
    }

    var action = null;
    if (loops > 0) {
        var repeatAction = cc.Repeat.create(animate, loops);

        var callFuncAction = cc.CallFunc.create(function () {
            if (cb) {
                cb();
            }

            if (clear) {
                sprite.removeFromParent();
            }
        });

        action = cc.Sequence.create(repeatAction, callFuncAction);
    } else {
        action = cc.RepeatForever.create(animate)
    }

    sprite.runAction(action);

    return sprite;
};


/*

 playEffect({
 effectId: 0,
 target: null,
 delay: 0.1,
 loops: 0,
 position: null,
 anchorPoint: null,
 scale: 1,
 scaleX: 1,
 scaleY: 1,
 sprite: null,
 zOrder: 0
 });

 */
