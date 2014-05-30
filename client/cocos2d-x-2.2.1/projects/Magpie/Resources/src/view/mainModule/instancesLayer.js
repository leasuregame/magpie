/**
 * Created by lujunyu on 14-2-25.
 */

var InstancesLayer = cc.Layer.extend({
    _instancesLayerFit: null,

    _taskLayerItem: null,
    _passLayerItem: null,
    _passGuide: null,

    onEnter: function () {
        this._super();
        this.updateGuide();
    },

    init: function () {
        cc.log("InstancesLayer init");

        if (!this._super()) return false;

        this._instancesLayerFit = gameFit.mainScene.instancesLayer;

        var headIcon = cc.Sprite.create(main_scene_image.icon1);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(this._instancesLayerFit.headIconPoint);
        this.addChild(headIcon, 1);

        this._taskLayerItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button22,
            main_scene_image.button22s,
            main_scene_image.button22d,
            main_scene_image.icon389,
            this._onClickTaskLayer,
            this
        );
        this._taskLayerItem.setPosition(this._instancesLayerFit.taskLayerItemPoint);
        this._taskLayerItem.setOffset(cc.p(-6, -5));

        if (gameData.player.get("lv") < outputTables.function_limit.rows[1].pass) {
            this._passLayerItem = cc.MenuItemImage.createWithIcon(
                main_scene_image.button23h,
                main_scene_image.button23h,
                main_scene_image.button23h,
                main_scene_image.icon390,
                this._onClickPassLayer,
                this
            );
        } else {
            this._passLayerItem = cc.MenuItemImage.createWithIcon(
                main_scene_image.button23,
                main_scene_image.button23s,
                main_scene_image.button23d,
                main_scene_image.icon390,
                this._onClickPassLayer,
                this
            );
        }
        this._passLayerItem.setPosition(this._instancesLayerFit.passLayerItemPoint);
        this._passLayerItem.setOffset(cc.p(0, -5));

        var menu = cc.Menu.create(
            this._taskLayerItem,
            this._passLayerItem
        );
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu, 1);

        this._taskLayerItem.setEnabled(false);
        this._passLayerItem.setEnabled(true);
        this.switchLayer(TaskLayer);

        return true;
    },

    updateGuide: function () {
        cc.log("InstancesLayer updateGuide");

        if (gameGuide.get("passGuide") && !this._passGuide) {
            this._passGuide = cc.BuilderReader.load(main_scene_image.uiEffect43);
            this._passGuide.setPosition(this._instancesLayerFit.passLayerItemPoint);
            this.addChild(this._passGuide, 2);
        }
    },

    _onClickTaskLayer: function () {
        cc.log("ShopLayer _onClickVipLayer");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._taskLayerItem.setEnabled(false);
        this._passLayerItem.setEnabled(true);

        this.switchLayer(TaskLayer);
    },

    _onClickPassLayer: function () {
        cc.log("ShopLayer _onClickPropsLayer");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        if (this._passGuide) {
            this._passGuide.removeFromParent();
            this._passGuide = null;
            gameGuide.set("passGuide", false);
        }

        if (this.switchLayer(PassLayer)) {
            this._taskLayerItem.setEnabled(true);
            this._passLayerItem.setEnabled(false);
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