/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-17
 * Time: 上午11:04
 * To change this template use File | Settings | File Templates.
 */


/*
 * main menu layer
 * */


var MAIN_MENU_LAYER_HANDLER_PRIORITY = -200;

var MainMenuLayer = cc.Layer.extend({
    _markSprite: null,
    _layer: [
        MainLayer,
        TaskLayer,
        PassLayer,
        TournamentLayer,
        CardListLayer,
        ShopLayer
    ],

    onEnter: function () {
        this._super();
        this.update();
    },

    init: function () {
        cc.log("MainMenuLayer init");

        if (!this._super()) return false;

        var bgSprite = cc.Sprite.create(main_scene_image.icon10);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(cc.p(40, 88));
        this.addChild(bgSprite, -1);

        this._markSprite = cc.Sprite.create(main_scene_image.icon9);
        this.addChild(this._markSprite);

        var mainMenu = cc.Menu.create();
        mainMenu.setTouchPriority(MAIN_MENU_LAYER_HANDLER_PRIORITY);
        mainMenu.setPosition(cc.p(0, 0));
        this.addChild(mainMenu);

        var len = this._layer.length;

        for (var i = 0; i < len; ++i) {
            var url = "button" + (46 + i);

            var item = cc.MenuItemImage.create(
                main_scene_image[url],
                main_scene_image[url + "s"],
                this._onClickLayer(i),
                this
            );
            item.setPosition(cc.p(93 + 107 * i, 142));
            mainMenu.addChild(item);
        }

        return true;
    },

    update: function () {
        cc.log("MainMenuLayer update");

        var runLayer = MainScene.getInstance().getLayer();

        var len = this._layer.length;

        for (var i = 0; i < len; ++i) {
            if (runLayer instanceof this._layer[i]) {
                this._markSprite.setPosition(93 + 107 * i, 142);
                this._markSprite.setVisible(true);
                return;
            }

        }

        this._markSprite.setVisible(false);
    },

    _onClickLayer: function (index) {
        return function () {
            cc.log("MainMenuLayer _onClickLayer: " + index);

            MainScene.getInstance().switchLayer(this._layer[index]);

            if(NoviceTeachingLayer.getInstance().isNoviceTeaching()) {
                NoviceTeachingLayer.getInstance().clearAndSave();
                NoviceTeachingLayer.getInstance().next();
            }
        }
    }
});


MainMenuLayer.create = function () {
    var ret = new MainMenuLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};