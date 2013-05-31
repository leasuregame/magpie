/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-4-24
 * Time: 下午4:20
 * To change this template use File | Settings | File Templates.
 */

var testLayer = cc.Layer.extend({
    ctor : function() {
        this._super();
        cc.associateWithNative( this, cc.Layer );
    },

    init : function() {
        this._super();

        var size = cc.Director.getInstance().getWinSize();

        /*
        var bgSprite = cc.Sprite.create(s_game_bg);
        bgSprite.setPosition(size.width / 2, size.height / 2);
        this.addChild(bgSprite);

        var sprite = cc.Sprite.create("res/test1/bg.png");
        sprite.setPosition(size.width / 2, size.height / 2);
        this.addChild(sprite);

        var view = cc.Layer.create();
        var sprite = cc.Sprite.create("res/test1/view.png");
        sprite.setPosition(size.width / 2, size.height / 2);
        view.addChild(sprite);
        view.setVisible(false);

        var item = cc.MenuItemImage.create("res/test1/close.png", null, function(){
            view.setVisible(false);
        });
        item.setPosition(230, -320);
        var menu = cc.Menu.create(item);
        view.addChild(menu);

        this.addChild(view, 1);

        var menu = cc.Menu.create();
        for(var i = 1; i <= 5; ++i) {
            cc.log("res/test1/" + i + ".png");

            var item = cc.MenuItemImage.create("res/test1/" + i + ".png", "res/test1/" + i + ".png", function() {
                view.setVisible(true);
            });

            item.setPosition(i * 100 + -300, 200);
            menu.addChild(item);
        }
        this.addChild(menu);

        //var a = Dialog.create(4, "haha", cc.c4b(100, 100, 100, 100), 500, 700);
        CloudLayer.show();    */


        var layer = cc.Layer.create();
        var menu = cc.Menu.create();
        menu.setPosition(cc.p(0, 0));
        for(var j = 0; j < 9; ++j) {
            for(var i = 1; i <= 5; ++i) {
                cc.log("res/test1/" + i + ".png");
                var item = cc.MenuItemImage.create("res/test1/" + i + ".png", "res/test1/" + i + ".png", function() {
//                    console.log("xx");
                });

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