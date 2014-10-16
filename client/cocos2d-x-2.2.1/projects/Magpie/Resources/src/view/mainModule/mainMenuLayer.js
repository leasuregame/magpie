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
        [MainLayer],
        [InstancesLayer, ExploreLayer, ExpInstanceLayer],
        [TournamentLayer],
        [UnionLayer],
        [CardListLayer],
        [ShopLayer]
    ],

    _instancesGuide: null,
    _tournamentGuide: null,
    _bossGuide: null,
    _bossMark: null,

    onEnter: function () {
        this._super();
        this.update();
        this.updateGuide();
        this.updateMark();
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

        this._bossMark = cc.BuilderReader.load(main_scene_image.uiEffect91, this);
        this._bossMark.setPosition(cc.p(basePoint.x + offsetX * 3, basePoint.y));
        this.addChild(this._bossMark);

        return true;
    },

    update: function () {
        cc.log("MainMenuLayer update");

        var runLayer = MainScene.getInstance().getLayer();

        var len = this._layer.length;
        var basePoint = this._mainMenuLayerFit.markSpriteBasePoint;
        var offsetX = this._mainMenuLayerFit.markSpriteOffsetX;

        for (var i = 0; i < len; ++i) {
            for (var j = 0; j < this._layer[i].length; j++) {
                if (runLayer instanceof this._layer[i][j]) {
                    this._markSprite.setPosition(cc.p(basePoint.x + offsetX * i, basePoint.y));
                    this._markSprite.setVisible(true);
                    return;
                }
            }
        }

        this._markSprite.setVisible(false);
    },

    updateGuide: function () {
        cc.log("MainMenuLayer updateGuide");

        var basePoint = this._mainMenuLayerFit.itemBasePoint;
        var offsetX = this._mainMenuLayerFit.itemOffsetX;

        if (gameGuide.get("instancesGuide") && !this._instancesGuide) {
            this._instancesGuide = cc.BuilderReader.load(main_scene_image.uiEffect43);
            this._instancesGuide.setRotation(180);
            this._instancesGuide.setPosition(cc.p(basePoint.x + offsetX, basePoint.y));
            this.addChild(this._instancesGuide);
        }

        if (gameGuide.get("tournamentGuide") && !this._tournamentGuide) {
            this._tournamentGuide = cc.BuilderReader.load(main_scene_image.uiEffect43);
            this._tournamentGuide.setRotation(180);
            this._tournamentGuide.setPosition(cc.p(basePoint.x + offsetX * 2, basePoint.y));
            this.addChild(this._tournamentGuide);
        }

        if (gameGuide.get("bossGuide") && !this._bossGuide) {
            this._bossGuide = cc.BuilderReader.load(main_scene_image.uiEffect43);
            this._bossGuide.setRotation(180);
            this._bossGuide.setPosition(cc.p(basePoint.x + offsetX * 3, basePoint.y));
            this.addChild(this._bossGuide);
        }
    },

    updateMark: function () {
        cc.log("MainMenuLayer updateMark");

        var mark = gameMark.getBossMark();

        if (mark) {
            var nowLayer = MainScene.getInstance().getLayer();
            var len = this._layer[2].length;

            for (var i = 0; i < len; ++i) {
                if (nowLayer instanceof this._layer[2][i]) {
                    gameMark.updateBossMark(false);
                    return;
                }
            }
        }

        this._bossMark.setVisible(mark);
    },

    _onClickLayer: function (index) {
        return function () {
            cc.log("MainMenuLayer _onClickLayer: " + index);

            if (index == 1) {
                if (this._instancesGuide) {
                    this._instancesGuide.removeFromParent();
                    this._instancesGuide = null;
                    gameGuide.set("instancesGuide", false);
                }
            }

            if (index == 2) {
                if (this._tournamentGuide) {
                    this._tournamentGuide.removeFromParent();
                    this._tournamentGuide = null;
                    gameGuide.set("tournamentGuide", false);
                }
            }

            if (index == 3) {
                if (this._bossGuide) {
                    this._bossGuide.removeFromParent();
                    this._bossGuide = null;
                    gameGuide.set("bossGuide", false);
                }
            }

            if (mandatoryTeachingLayer) {
                if (mandatoryTeachingLayer.isTeaching()) {
                    mandatoryTeachingLayer.clearAndSave();
                    mandatoryTeachingLayer.next();
                }
            }

            MainScene.getInstance().switchLayer(this._layer[index][0]);

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