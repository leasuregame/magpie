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
    init: function (data) {
        cc.log("PlayerUpgradeLayer init");

        if (!this._super()) return false;

        this.setTouchPriority(MAIN_MENU_LAYER_HANDLER_PRIORITY);

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 230), 640, 1136);
        bgLayer.setPosition(GAME_ZERO);
        this.addChild(bgLayer);

        var layer = cc.Layer.create();
        layer.setPosition(cc.p(0, 0));
        this.addChild(layer);

        var bgSprite = cc.Scale9Sprite.create(main_scene_image.icon259);
        bgSprite.setContentSize(cc.size(450, 400));
        bgSprite.setPosition(cc.p(360, 600));
        layer.addChild(bgSprite);

        var obtainSprite = cc.Sprite.create(main_scene_image.icon258);
        obtainSprite.setPosition(cc.p(360, 820));
        layer.addChild(obtainSprite);

        var str = lz.getRewardString(data);
        var len = str.length;

        var offsetY = 720;
        for (var i = 0; i < len; ++i) {
            var rewardLabel = cc.LabelTTF.create(str[i], "STHeitiTC-Medium", 22);
            rewardLabel.setColor(cc.c3b(255, 239, 131));
            rewardLabel.setAnchorPoint(cc.p(0.5, 1));
            rewardLabel.setPosition(cc.p(360, offsetY));
            layer.addChild(rewardLabel);

            offsetY -= 45;
        }

        var okItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            main_scene_image.icon21,
            this._onClickOk,
            this
        );
        okItem.setPosition(cc.p(360, 460));

        var menu = cc.Menu.create(okItem);
        menu.setTouchPriority(MAIN_MENU_LAYER_HANDLER_PRIORITY);
        menu.setPosition(cc.p(0, 0));
        layer.addChild(menu);

        layer.setScale(0.1);
        layer.runAction(
            cc.Sequence.create(
                cc.ScaleTo.create(0.3, 1.05, 1.05),
                cc.ScaleTo.create(0.05, 1, 1)
            )
        );

        return true;
    },

    _onClickOk: function () {
        cc.log("PlayerUpgradeLayer _onClickOk");

        this.removeFromParent();
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
