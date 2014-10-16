/**
 * Created by lujunyu on 14-2-25.
 */

var InstancesLayer = cc.Layer.extend({
    _instancesLayerFit: null,

    _taskLayerItem: null,
    _passLayerItem: null,
    _dailyInstancesLayerItem: null,
    _passGuide: null,
    _dailyInstancesGuide: null,

    onEnter: function () {
        this._super();
        this.updateGuide();
    },

    init: function () {
        cc.log("InstancesLayer init");

        if (!this._super()) return false;

        this._instancesLayerFit = gameFit.mainScene.instancesLayer;

        var bgSprite = cc.Sprite.create(main_scene_image.bg11);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._instancesLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        var headIcon = cc.Sprite.create(main_scene_image.icon2);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(this._instancesLayerFit.headIconPoint);
        this.addChild(headIcon);

        var titleIcon = cc.Sprite.create(main_scene_image.icon16);
        titleIcon.setPosition(this._instancesLayerFit.titleIconPoint);
        this.addChild(titleIcon);

        var scrollViewLayer = MarkLayer.create(this._instancesLayerFit.scrollViewLayerRect);

        var menu = LazyMenu.create();
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu);

        var layers = [TaskLayer, PassLayer, DailyInstancesLayer, BossListLayer];
        var name = ["修行", "天道", "搜仙", "降魔"];
        var len = layers.length;
        var scrollViewHeight = len * 140;

        for (var i = 0; i < len; i++) {
            var y = scrollViewHeight - 70 - i * 140;
            var layerItem = cc.MenuItemImage.create(
                main_scene_image.button15,
                main_scene_image.button15s,
                main_scene_image.button15d,
                this._onSelectLayer(layers[i]),
                this
            );
            layerItem.setAnchorPoint(cc.p(0, 0.5));
            layerItem.setPosition(cc.p(20, y));
            menu.addChild(layerItem);

            var nameLabel = cc.LabelTTF.create(name[i], "STHeitiTC-Medium", 30);
            nameLabel.setPosition(cc.p(300, 70));
            layerItem.addChild(nameLabel);
        }

        this._scrollView = cc.ScrollView.create(this._instancesLayerFit.scrollViewSize, scrollViewLayer);
        this._scrollView.setPosition(this._instancesLayerFit.scrollViewPoint);
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);

        this._scrollView.setContentSize(cc.size(640, scrollViewHeight));
        this._scrollView.setContentOffset(this._scrollView.minContainerOffset());


        return true;
    },

    updateGuide: function () {
        cc.log("InstancesLayer updateGuide");

        if (gameGuide.get("passGuide") && !this._passGuide) {
            this._passGuide = cc.BuilderReader.load(main_scene_image.uiEffect43);
            this._passGuide.setPosition(this._instancesLayerFit.passLayerItemPoint);
            this.addChild(this._passGuide, 2);
        }

        if (gameGuide.get("dailyInstancesGuide") && !this._dailyInstancesGuide) {
            this._dailyInstancesGuide = cc.BuilderReader.load(main_scene_image.uiEffect43);
            this._dailyInstancesGuide.setPosition(this._instancesLayerFit.dailyInstancesLayerItemPoint);
            this.addChild(this._dailyInstancesGuide, 2);
        }

    },

    _onSelectLayer: function(layer) {
        var self = this;
        return function() {
            cc.log("InstancesLayer _onSelectLayer");
            gameData.sound.playEffect(main_scene_image.click_button_sound, false);
            self.switchLayer(layer);
        }
    },

    _onClickTaskLayer: function () {
        cc.log("InstancesLayer _onClickVipLayer");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._taskLayerItem.setEnabled(false);
        this._passLayerItem.setEnabled(true);
        this._dailyInstancesLayerItem.setEnabled(true);

        this.switchLayer(TaskLayer);
    },

    _onClickPassLayer: function () {
        cc.log("InstancesLayer _onClickPropsLayer");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        if (this._passGuide) {
            this._passGuide.removeFromParent();
            this._passGuide = null;
            gameGuide.set("passGuide", false);
        }

        if (this.switchLayer(PassLayer)) {
            this._taskLayerItem.setEnabled(true);
            this._passLayerItem.setEnabled(false);
            this._dailyInstancesLayerItem.setEnabled(true);
        }
    },

    _onClickDailyInstancesLayer: function () {
        cc.log("InstancesLayer _onClickDailyInstancesLayer");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        if (this._dailyInstancesGuide) {
            this._dailyInstancesGuide.removeFromParent();
            this._dailyInstancesGuide = null;
            gameGuide.set("dailyInstancesGuide", false);
        }

        if (this.switchLayer(DailyInstancesLayer)) {
            this._taskLayerItem.setEnabled(true);
            this._passLayerItem.setEnabled(true);
            this._dailyInstancesLayerItem.setEnabled(false);
        }
    },

    switchLayer: function (runLayer) {
        cc.log("InstancesLayer switchMenu");
        cc.log("this._nowLayer is runLayer " + (this._nowLayer instanceof runLayer));

        if (runLayer.canEnter && !runLayer.canEnter()) {
            return false;
        }

        if (!(this._nowLayer instanceof runLayer)) {
            if (this._nowLayer != null) this.removeChild(this._nowLayer);
            this._nowLayer = runLayer.create();
            this.addChild(this._nowLayer);
        }

        return true;
    }
});


InstancesLayer.create = function () {
    cc.log("InstancesLayer create");

    var ref = new InstancesLayer();
    if (ref && ref.init()) {
        return ref;
    }

    return null;
};