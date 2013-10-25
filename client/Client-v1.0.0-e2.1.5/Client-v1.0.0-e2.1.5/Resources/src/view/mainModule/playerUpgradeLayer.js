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

        if (!this._uper()) return false;

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 230), 640, 960);
        bgLayer.setPosition(GAME_ZERO);
        layer.addChild(bgLayer);

        var bgSprite = cc.Sprite.create(main_scene_image.bg17);
        bgSprite.setPosition(cc.p(360, 580));
        layer.addChild(bgSprite);

        var obtainSprite = cc.Sprite.create(main_scene_image.icon258);
        obtainSprite.setPosition(cc.p(360, 718));
        layer.addChild(obtainSprite);

        var str = lz.getRewardString(data);
        var len = str.length;

        var offsetY = 655;
        for (var i = 0; i < len; ++i) {
            var rewardLabel = cc.LabelTTF.create(str[i], "STHeitiTC-Medium", 20);
            rewardLabel.setColor(cc.c3b(255, 239, 131));
            rewardLabel.setAnchorPoint(cc.p(0.5, 1));
            rewardLabel.setPosition(cc.p(360, offsetY));
            layer.addChild(rewardLabel);

            offsetY -= 45;
        }

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
    var playerUpgradeLayer = PlayerUpgradeLayer.create(data);

    MainScene.getInstance().getLayer().addChild(playerUpgradeLayer, 10);
};
