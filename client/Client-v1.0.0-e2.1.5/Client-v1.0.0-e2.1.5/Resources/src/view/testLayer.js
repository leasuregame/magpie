/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-4-24
 * Time: 下午4:20
 * To change this template use File | Settings | File Templates.
 */

var testLayer = cc.Layer.extend({
    init: function () {
        this._super();

        var size = cc.Director.getInstance().getWinSize();


        var bgSprite = cc.Sprite.create(s_game_bg);
        bgSprite.setPosition(size.width / 2, size.height / 2);
        this.addChild(bgSprite);

        var sprite = cc.Sprite.create("res1/test1/bg.png");
        sprite.setPosition(size.width / 2, size.height / 2);
        this.addChild(sprite);

        var menu = cc.Menu.create();
        menu.setPosition(cc.p(0, 0));
        for (var i = 1; i <= 5; ++i) {
            var k = Math.ceil(i / 2);
            cc.log("res1/test1/HeadRebels" + k + ".png");

            var fun = function (i) {
                return function () {
                    var layer = CardDetails.create(i);
                    layer.setPosition(size.width / 2, size.height / 2);
                    this.addChild(layer, 2);
                }
            }(i);

            var item = cc.MenuItemImage.create("res1/test1/HeadRebels" + k + ".png", "res1/test1/HeadRebels" + k + ".png", fun, this);

            item.setPosition(i * 100 + 50, 750);
            menu.addChild(item);

            var sprite = cc.Sprite.create("res1/test1/HeadFrame.png");
            sprite.setPosition(i * 100 + 50, 750);
            this.addChild(sprite);

            if (k == 2) {
                var sprite = cc.Sprite.create("res1/test1/HeadRebels1.png");
                sprite.setPosition(i * 100 + 50, 750);
                this.addChild(sprite);
            }
        }

        for (var i = 1; i <= 5; ++i) {
            var k = Math.ceil(i / 2);
            cc.log("res1/test1/HeadRebels" + k + ".png");

            var item = cc.MenuItemImage.create("res1/test1/GrayHeadRebels" + k + ".png");

            item.setPosition(i * 100 + 50, 600);
            menu.addChild(item);

            var sprite = cc.Sprite.create("res1/test1/HeadFrame.png");
            sprite.setPosition(i * 100 + 50, 600);
            this.addChild(sprite);

            if (k == 2) {
                var sprite = cc.Sprite.create("res1/test1/GrayHeadRebels1.png");
                sprite.setPosition(i * 100 + 50, 600);
                this.addChild(sprite);
            }

            var sprite = cc.Sprite.create("res1/test1/lock.png");
            sprite.setPosition(i * 100 + 50, 600);
            this.addChild(sprite, 1);
        }

        this.addChild(menu);

        for (var i = 1; i <= 3; ++i) {
            var node = cc.Node.create();

            node.setAnchorPoint(cc.p(0.5, 0.5));

            var sprite = cc.Sprite.create("res1/test1/BustFrame.png");
            node.addChild(sprite);

            sprite = cc.Sprite.create("res1/test1/BustRebels" + i + ".png");
            node.addChild(sprite);

            sprite = cc.Sprite.create("res1/test1/Expression" + i + ".png");
            node.addChild(sprite);

            var waitTime1 = cc.DelayTime.create(0.5 * (i - 1));
            var waitTime2 = cc.DelayTime.create(0.5 * (3 - i));

            var a1 = cc.FadeIn.create(0.3);
            var a2 = cc.FadeOut.create(0.3);
            var a = cc.Sequence.create(waitTime1, a1, a2, waitTime2);
            sprite.runAction(cc.RepeatForever.create(a));

            this.addChild(node);

            node.setPosition(180 * i, 300);

            a = cc.Sequence.create(waitTime1, cc.ScaleTo.create(0.3, 1.1), cc.ScaleTo.create(0.3, 1.0), waitTime2);
            node.runAction(cc.RepeatForever.create(a));
        }

//        var xx = cc.ParticleGalaxy.create();
//        cc.log(xx);
//        xx.setPosition(100, 100);
//        this.addChild(xx);

        //var a = Dialog.create(4, "haha", cc.c4b(100, 100, 100, 100), 500, 700);
        //CloudLayer.show();


        var layer = cc.Layer.create();
        var menu = LazyMenu.create();
        menu.setPosition(cc.p(0, 0));
        for (var j = 0; j < 9; ++j) {
            for (var i = 1; i <= 5; ++i) {
                var fun = function (i, j) {
                    return function () {
                        cc.log(i + "  " + j);
                    }
                }(i, j);

                cc.log("res1/test1/" + i + ".png");
                var item = cc.MenuItemImage.create("res1/test1/" + i + ".png", "res1/test1/" + i + ".png", fun);

                item.setPosition(i * 100, 100 * j);
                menu.addChild(item);
            }
        }
        layer.addChild(menu);
        //        this.addChild(layer);

        var view = cc.ScrollView.create(cc.size(700, 1000), layer);
        cc.log(view);
        view.setDirection(0);
        this.addChild(view);

    }
})