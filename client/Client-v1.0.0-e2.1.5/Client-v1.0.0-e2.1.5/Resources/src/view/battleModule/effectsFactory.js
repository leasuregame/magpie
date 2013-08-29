/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-8
 * Time: 下午6:03
 * To change this template use File | Settings | File Templates.
 */

/*
 * 特效
 * */

var EffectsFactory = {
    init: function () {
        var spritesCache = cc.SpriteFrameCache.getInstance();
        for (var i = 0; i < 5; ++i) {
            var texture = cc.TextureCache.getInstance().addImage(bang[i]);

            for (var j = 0; j < 8; ++j) {
                cc.log("bang_" + i + "_" + j + ".png");
                var frame = cc.SpriteFrame.create(texture, cc.RectMake(104, 0, 64, 110));
                spritesCache.addSpriteFrame(frame, "bang_" + i + "_" + j + ".png");
            }
        }
    },

    testEffect: function () {
        var rand_num = 5;
        rand_num = rand_num.getRandom();
        cc.log(rand_num);

        var animFrames = [];
        for (var j = 0; j < 8; ++j)
            animFrames.push(cc.SpriteFrame.create(bang[rand_num], cc.RectMake(0, j * 267, 1067, 267)));
        var animation = cc.Animation.create(animFrames, 0.05);
        var animate = cc.Animate.create(animation);

        cc.log(animFrames);

//        var sprite = cc.Sprite.createWithSpriteFrame(animFrames[0]);
        var sprite = cc.Sprite.createWithSpriteFrameName("bang_3_2.png");
//        var sprite = cc.Sprite.create(bang[rand_num]);

        cc.log(sprite);
        //sprite.setVisible(false);

        var callback = cc.CallFunc.create(function () {
            sprite.removeFromParent();
        }, this);

        sprite.showEffects = function () {
            sprite.setVisible(true);
            //sprite.runAction(cc.Sequence.create(animate, callback));
        }

        return sprite;
    }
};