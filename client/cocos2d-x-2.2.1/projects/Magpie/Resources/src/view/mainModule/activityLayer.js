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


var titleIcons = ["icon261", "icon356", "icon344", "icon262", "icon263", "icon265"];

var ActivityLayer = cc.Layer.extend({
    _activityLayerFit: null,

    _layer: [
        SignInLayer,
        NewYearLayer,
        GoldCardsLayer,
        PowerRewardLayer,
        GoldRewardLayer,
        InvitationLayer
    ],
    _selectIcon: null,
    _mark: [],
    _item: [],
    _scrollView: null,

    onEnter: function () {
        cc.log("ActivityLayer onEnter");

        this._super();
        this.updateMark();

        lz.dc.beginLogPageView("活动界面");
    },

    onExit: function () {
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
        this.addChild(headSprite, 2);

        var turnRightIcon = cc.Sprite.create(main_scene_image.icon348);
        turnRightIcon.setAnchorPoint(cc.p(0, 0));
        turnRightIcon.setPosition(this._activityLayerFit.turnRightIconPoint);
        this.addChild(turnRightIcon, 2);

        var turnLeftIcon = cc.Sprite.create(main_scene_image.icon348);
        turnLeftIcon.setRotation(180);
        turnLeftIcon.setAnchorPoint(cc.p(0, 0));
        turnLeftIcon.setPosition(this._activityLayerFit.turnLeftIconPoint);
        this.addChild(turnLeftIcon, 2);

        var len = this._layer.length;

        var scrollViewLayer = cc.Layer.create();
        var mainMenu = LazyMenu.create();
        mainMenu.setTouchPriority(LAZY_LAYER_HANDLER_PRIORITY);
        mainMenu.setPosition(cc.p(0, 0));

        for (var i = 0; i < len; ++i) {
            var url = titleIcons[i];

            this._item[i] = cc.MenuItemImage.create(
                main_scene_image[url],
                null,
                this._onClickLayer(i),
                this
            );
            this._item[i].setScale(0.9);
            this._item[i].setAnchorPoint(cc.p(0, 0));
            this._item[i].setPosition(cc.p(107 * i, 10));

            this._mark[i] = cc.BuilderReader.load(main_scene_image.uiEffect34, this);
            this._mark[i].setAnchorPoint(cc.p(0, 0));
            this._mark[i].setPosition(cc.p(107 * i + 70, 80));
            this._mark[i].setVisible(false);
            scrollViewLayer.addChild(this._mark[i], 2);
            mainMenu.addChild(this._item[i]);
        }
        scrollViewLayer.addChild(mainMenu);

        this._selectIcon = cc.Sprite.create(main_scene_image.icon19);
        this._selectIcon.setAnchorPoint(cc.p(0, 0));
        this._selectIcon.setPosition(this._item[0].getPosition());
        this._selectIcon.setScale(0.9);
        scrollViewLayer.addChild(this._selectIcon);

        this._scrollView = cc.ScrollView.create(cc.size(540, 106), scrollViewLayer);
        this._scrollView.setTouchPriority(LAZY_LAYER_HANDLER_PRIORITY - 1);
        this._scrollView.setPosition(this._activityLayerFit.scrollViewPoint);
        this._scrollView.setBounceable(false);
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_HORIZONTAL);
        this._scrollView.updateInset();
        this.addChild(this._scrollView, 10);

        this._scrollView.setContentSize(cc.size(len * 107, 106));

        this.switchLayer(this._layer[0]);
        return true;
    },

    _onClickLayer: function (index) {
        return function () {
            cc.log("ActivityLayer _onClickLayer: " + index);

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            this._selectIcon.setPosition(this._item[index].getPosition());
            this.switchLayer(this._layer[index]);
        }
    },

    switchLayer: function (runLayer) {
        cc.log("ActivityLayer switchMenu");
        cc.log("this._nowLayer is runLayer " + (this._nowLayer instanceof runLayer));

        if (!(this._nowLayer instanceof runLayer)) {
            if (this._nowLayer != null) this.removeChild(this._nowLayer);
            this._nowLayer = runLayer.create();
            this.addChild(this._nowLayer);
        }
    },

    updateMark: function () {
        cc.log("ActivityLayer updateMark");

        this._mark[0].setVisible(gameMark.getSignInMark());
        this._mark[1].setVisible(gameMark.getNewYearMark());
        this._mark[2].setVisible(gameMark.getGoldCardsMark());
        this._mark[3].setVisible(gameMark.getPowerRewardMark());
        this._mark[4].setVisible(gameMark.getGoldRewardMark());
        this._mark[5].setVisible(gameMark.getRechargeMark());
    }
});


ActivityLayer.create = function () {
    var ret = new ActivityLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};