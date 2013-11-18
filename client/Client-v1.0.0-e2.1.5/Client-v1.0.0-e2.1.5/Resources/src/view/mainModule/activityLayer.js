/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-16
 * Time: 下午5:33
 * To change this template use File | Settings | File Templates.
 */


/*
 * activity layer
 * */


var ActivityLayer = cc.Layer.extend({
    _activityLayerFit: null,

    _layer: [
        SignInLayer,
        PowerRewardLayer,
        GoldRewardLayer,
        RechargeLayer
    ],
    _selectIcon: null,

    onEnter: function() {
        cc.log("ActivityLayer onEnter");

        this._super();

        lz.dc.beginLogPageView("活动界面");
    },

    onExit: function() {
        cc.log("ActivityLayer onExit");

        this._super();

        lz.dc.endLogPageView("活动界面");
    },

    init: function () {
        cc.log("ActivityLayer init");

        if (!this._super()) return false;

        this._activityLayerFit = gameFit.mainScene.activityLayer;

        var bgSprite = cc.Sprite.create(main_scene_image.bg11);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._activityLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        var headSprite = cc.Sprite.create(main_scene_image.icon10);
        headSprite.setAnchorPoint(cc.p(0, 0));
        headSprite.setPosition(this._activityLayerFit.headSpritePoint);
        headSprite.setRotation(180);
        this.addChild(headSprite);

        var mainMenu = cc.Menu.create();
        mainMenu.setTouchPriority(MAIN_MENU_LAYER_HANDLER_PRIORITY);
        mainMenu.setPosition(cc.p(0, 0));
        this.addChild(mainMenu);

        //var len = this._layer.length;

        for (var i = 0; i < 4; ++i) {
            var url = "icon" + (261 + i);

            var item = cc.MenuItemImage.create(
                main_scene_image[url],
                null,
                this._onClickLayer(i),
                this
            );
            item.setScale(0.9);
            item.setAnchorPoint(cc.p(0, 0));
            item.setPosition(cc.p(this._activityLayerFit.itemBasePoint.x + this._activityLayerFit.itemOffsetX * i, this._activityLayerFit.itemBasePoint.y));
            mainMenu.addChild(item);
        }

        this._selectIcon = cc.Sprite.create(main_scene_image.icon265);
        this._selectIcon.setAnchorPoint(cc.p(0, 0));
        this._selectIcon.setPosition(this._activityLayerFit.itemBasePoint);
        this._selectIcon.setScale(0.9);
        this.addChild(this._selectIcon);
        this.switchLayer(this._layer[0]);
        return true;
    },

    _onClickLayer: function (index) {
        return function () {
            cc.log("MainMenuLayer _onClickLayer: " + index);

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            this._selectIcon.setPosition(cc.p(this._activityLayerFit.itemBasePoint.x + this._activityLayerFit.itemOffsetX * index, this._activityLayerFit.itemBasePoint.y));
            this.switchLayer(this._layer[index]);
        }
    },

    switchLayer: function (runLayer) {
        cc.log("MessageLayer switchMenu");
        cc.log("this._nowLayer is runLayer " + (this._nowLayer instanceof runLayer));

        if (!(this._nowLayer instanceof runLayer)) {
            if (this._nowLayer != null) this.removeChild(this._nowLayer);
            this._nowLayer = runLayer.create();
            this.addChild(this._nowLayer);
        }
    }


});


ActivityLayer.create = function () {
    var ret = new ActivityLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};