/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-10-25
 * Time: 上午2:11
 * To change this template use File | Settings | File Templates.
 */


/*
 * player upgrade layer
 * */


var PlayerUpgradeLayer = LazyLayer.extend({
    _playerUpgradeLayerFit: null,

    _cb: null,

    onEnter: function () {
        cc.log("PlayerUpgradeLayer onEnter");

        this._super();

        lz.dc.beginLogPageView("玩家升级界面");
    },

    onExit: function () {
        cc.log("PlayerUpgradeLayer onExit");

        this._super();

        lz.dc.endLogPageView("玩家升级界面");
    },

    init: function (data) {
        cc.log("PlayerUpgradeLayer init");

        if (!this._super()) return false;

        this._playerUpgradeLayerFit = gameFit.mainScene.playerUpgradeLayer;
        this.setTouchPriority(MAIN_MENU_LAYER_HANDLER_PRIORITY);

        this._cb = data.cb || null;

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 150), 640, 1136);
        bgLayer.setPosition(this._playerUpgradeLayerFit.bgLayerPoint);
        this.addChild(bgLayer);

        var ccbNode = cc.BuilderReader.load(main_scene_image.uiEffect32, this);
        ccbNode.setPosition(this._playerUpgradeLayerFit.bgSpritePoint);
        this.addChild(ccbNode);

        var label = ccbNode.controller.label;

        var str = lz.getRewardString(data.reward);
        var len = str.length;

        var offsetY = 150;

        var lv = gameData.player.get("lv");
        var lvLabel = cc.LabelTTF.create("等级：LV " + (lv - 1) + " -- LV " + lv, "STHeitiTC-Medium", 22);
        lvLabel.setColor(cc.c3b(115, 255, 100));
        lvLabel.setAnchorPoint(cc.p(0.5, 1));
        lvLabel.setPosition(cc.p(0, offsetY));
        label.addChild(lvLabel);

        for (var i = 0; i < len; ++i) {
            offsetY -= 45;
            if (str[i].icon) {
                var rewardIcon = cc.Sprite.create(main_scene_image[str[i].icon]);
                rewardIcon.setPosition(cc.p(-60, offsetY - 10));
                label.addChild(rewardIcon);
            }
            var rewardLabel = cc.LabelTTF.create(str[i].str, "STHeitiTC-Medium", 22);
            rewardLabel.setColor(str[i].color);
            rewardLabel.setAnchorPoint(cc.p(0, 1));
            rewardLabel.setPosition(cc.p(-30, offsetY));
            label.addChild(rewardLabel);

        }

        var okItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            main_scene_image.icon21,
            this._onClickOk,
            this
        );
        okItem.setPosition(this._playerUpgradeLayerFit.okItemPoint);

        var menu = cc.Menu.create(okItem);
        menu.setTouchPriority(MAIN_MENU_LAYER_HANDLER_PRIORITY);
        menu.setPosition(cc.p(0, 0));
        label.addChild(menu);

        return true;
    },

    _onClickOk: function () {
        cc.log("PlayerUpgradeLayer _onClickOk");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this.removeFromParent();

        if (this._cb) {
            this._cb();
        }
    }
});


PlayerUpgradeLayer.create = function (data) {
    var ret = new PlayerUpgradeLayer();

    if (ret && ret.init(data)) {
        return ret;
    }

    return null;
};

PlayerUpgradeLayer.pop = function (data) {
    lz.scheduleOnce(function () {
        var playerUpgradeLayer = PlayerUpgradeLayer.create(data);

        MainScene.getInstance().addChild(playerUpgradeLayer, 10);
    }, 0.1);
};
