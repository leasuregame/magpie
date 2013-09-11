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
    var sprite = arg.sprite;
    var zOrder = arg.zOrder;
    var cb = arg.cb || null;

    if (!effectId) return;
    if (!target && !sprite) return;

    var frames = [];
    var rect = effectRect[effectId];
    var isNewSprite = false;

    if (sprite && sprite instanceof cc.Sprite) {
        sprite.setVisible(true);
    } else {
        isNewSprite = true;
        sprite = cc.Sprite.create();
        target.addChild(sprite);
    }

    sprite.setTextureRect(rect);
    sprite.setPosition(position);

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

    if (zOrder) {
        sprite.setZOrder(zOrder);
    }

    for (var i = 0; i < effectConfig[effectId]; ++i) {
        var frame = cc.SpriteFrame.create(
            main_scene_image["effect" + effectId + "_frame" + i],
            rect
        );

        frames.push(frame);
    }

    var animation = cc.Animation.create(frames, delay);
    var animate = cc.Animate.create(animation);

    var action = null;
    if (loops > 0) {
        var repeatAction = cc.Repeat.create(animate, loops);

        var callFuncAction = cc.CallFunc.create(function () {
            if (isNewSprite) {
                sprite.removeFromParent();
            } else {
                sprite.setVisible(false);
            }

            if (cb) {
                cb.call(target);
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
