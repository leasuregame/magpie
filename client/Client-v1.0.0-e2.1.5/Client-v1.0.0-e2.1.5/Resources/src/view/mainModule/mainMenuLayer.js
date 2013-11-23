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
    _mainMenuLayerFit: null,

    _markSprite: null,
    _layer: [
        MainLayer,
        TaskLayer,
        PassLayer,
        TournamentLayer,
        CardListLayer,
        ShopLayer
    ],

    _passGuide: null,
    _tournamentGuide: null,

    onEnter: function () {
        this._super();
        this.update();
        this.updateGuide();
    },

    init: function () {
        cc.log("MainMenuLayer init");

        if (!this._super()) return false;

        this._mainMenuLayerFit = gameFit.mainScene.mainMenuLayer;

        var bgSprite = cc.Sprite.create(main_scene_image.icon10);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._mainMenuLayerFit.bgSpritePoint);
        this.addChild(bgSprite, -1);

        this._markSprite = cc.Sprite.create(main_scene_image.icon9);
        this.addChild(this._markSprite);

        var mainMenu = cc.Menu.create();
        mainMenu.setTouchPriority(MAIN_MENU_LAYER_HANDLER_PRIORITY);
        mainMenu.setPosition(cc.p(0, 0));
        this.addChild(mainMenu);

        var len = this._layer.length;
        var basePoint = this._mainMenuLayerFit.itemBasePoint;
        var offsetX = this._mainMenuLayerFit.itemOffsetX;

        for (var i = 0; i < len; ++i) {
            var url = "button" + (46 + i);

            var item = cc.MenuItemImage.create(
                main_scene_image[url],
                main_scene_image[url + "s"],
                this._onClickLayer(i),
                this
            );
            item.setPosition(cc.p(basePoint.x + offsetX * i, basePoint.y));
            mainMenu.addChild(item);
        }

        return true;
    },

    update: function () {
        cc.log("MainMenuLayer update");

        var runLayer = MainScene.getInstance().getLayer();

        var len = this._layer.length;
        var basePoint = this._mainMenuLayerFit.markSpriteBasePoint;
        var offsetX = this._mainMenuLayerFit.markSpriteOffsetX;

        for (var i = 0; i < len; ++i) {
            if (runLayer instanceof this._layer[i]) {
                this._markSprite.setPosition(cc.p(basePoint.x + offsetX * i, basePoint.y));
                this._markSprite.setVisible(true);
                return;
            }

        }

        this._markSprite.setVisible(false);
    },

    updateGuide: function () {
        cc.log("MainMenuLayer updateGuide");
        if (gameGuide.get("passGuide")) {

        }

        if (gameGuide.get("tournamentGuide")) {

        }
    },

    _onClickLayer: function (index) {
        return function () {
            cc.log("MainMenuLayer _onClickLayer: " + index);

            MainScene.getInstance().switchLayer(this._layer[index]);

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            if (noviceTeachingLayer.isNoviceTeaching()) {
                noviceTeachingLayer.clearAndSave();
                noviceTeachingLayer.next();
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