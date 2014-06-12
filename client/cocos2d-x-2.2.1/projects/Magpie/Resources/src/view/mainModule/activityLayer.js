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

    _layers: [
        {
            titleIcon: "icon429",
            layer: NewAreaRewardLayer,
            nameString: "newAreaRewardLayer"
        },
        {
            titleIcon: "icon261",
            layer: SignInLayer,
            nameString: "signInLayer"
        },
        {
            titleIcon: "icon344",
            layer: GoldCardsLayer,
            nameString: "goldCardsLayer"
        },
        {
            titleIcon: "icon433",
            layer: GrowthPlanLayer,
            nameString: "growthPlanLayer"
        },
        {
            titleIcon: "icon262",
            layer: PowerRewardLayer,
            nameString: "powerRewardLayer"
        },
        {
            titleIcon: "icon442",
            layer: VipDailyRewardLayer,
            nameString: "vipDailyRewardLayer"
        },
        {
            titleIcon: "icon263",
            layer: GoldRewardLayer,
            nameString: "goldRewardLayer"
        },
        {
            titleIcon: "icon265",
            layer: InvitationLayer,
            nameString: "invitationLayer"
        },
        {
            titleIcon: "worldCupIcon1",
            layer: WorldCupLayer,
            nameString: "worldCupLayer"
        }
    ],
    _selectIcon: null,
    _mark: [],
    _item: [],
    _scrollView: null,

    onEnter: function () {
        cc.log("ActivityLayer onEnter");

        this._super();
        this.updateMark();

        lz.um.beginLogPageView("活动界面");
    },

    onExit: function () {
        cc.log("ActivityLayer onExit");

        this._super();

        lz.um.endLogPageView("活动界面");
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

        var scrollViewLayer = cc.Layer.create();
        var mainMenu = LazyMenu.create();
        mainMenu.setTouchPriority(LAZY_LAYER_HANDLER_PRIORITY);
        mainMenu.setPosition(cc.p(0, 0));

        var index = 0;
        var showIndex = -1;
        var len = this._layers.length;

        for (var i = 0; i < len; ++i) {

            var layer = this._layers[i];

            if (!Activity.ActivityIsShowHandler[layer.nameString]()) {
                continue;
            }

            this._item[i] = cc.MenuItemImage.create(
                main_scene_image[layer.titleIcon],
                null,
                this._onClickLayer(i),
                this
            );
            this._item[i].setScale(0.9);
            this._item[i].setAnchorPoint(cc.p(0, 0));
            this._item[i].setPosition(cc.p(107 * index, 10));

            this._mark[i] = cc.BuilderReader.load(main_scene_image.uiEffect34, this);
            this._mark[i].setAnchorPoint(cc.p(0, 0));
            this._mark[i].setPosition(cc.p(107 * index + 70, 80));
            this._mark[i].setVisible(false);
            scrollViewLayer.addChild(this._mark[i], 2);
            mainMenu.addChild(this._item[i]);

            if (showIndex == -1) {
                showIndex = i;
            }

            index++;
        }
        scrollViewLayer.addChild(mainMenu);

        this._selectIcon = cc.Sprite.create(main_scene_image.icon19);
        this._selectIcon.setAnchorPoint(cc.p(0, 0));

        this._selectIcon.setPosition(this._item[showIndex].getPosition());
        this._selectIcon.setScale(0.9);
        scrollViewLayer.addChild(this._selectIcon);

        this._scrollView = cc.ScrollView.create(cc.size(540, 106), scrollViewLayer);
        this._scrollView.setTouchPriority(LAZY_LAYER_HANDLER_PRIORITY - 1);
        this._scrollView.setPosition(this._activityLayerFit.scrollViewPoint);
        this._scrollView.setBounceable(false);
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_HORIZONTAL);
        this._scrollView.updateInset();
        this.addChild(this._scrollView, 10);

        this._scrollView.setContentSize(cc.size(index * 107, 106));

        this.switchLayer(this._layers[showIndex].layer);
        return true;
    },

    _onClickLayer: function (index) {
        return function () {
            cc.log("ActivityLayer _onClickLayer: " + index);

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            this.switchLayer(this._layers[index].layer);
        }
    },

    switchLayer: function (runLayer) {
        cc.log("ActivityLayer switchMenu");
        cc.log("this._nowLayer is runLayer " + (this._nowLayer instanceof runLayer));

        if (!(this._nowLayer instanceof runLayer)) {
            if (this._nowLayer != null) this.removeChild(this._nowLayer);

            var index = 0;
            var len = this._layers.length;
            for (var i = 0; i < len; i++) {
                if (this._layers[i].layer == runLayer) {
                    cc.log(i);
                    index = i;
                    break;
                }
            }

            this._nowLayer = runLayer.create();
            this.addChild(this._nowLayer);

            this._selectIcon.setPosition(this._item[index].getPosition());
        }
    },

    updateMark: function () {
        cc.log("ActivityLayer updateMark");

        var len = this._layers.length;

        for (var i = 0; i < len; ++i) {
            var layer = this._layers[i];
            if (!Activity.ActivityIsShowHandler[layer.nameString]()) {
                continue;
            }
            this._mark[i].setVisible(Activity.ActivityIsMarkHandler[layer.nameString]());
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