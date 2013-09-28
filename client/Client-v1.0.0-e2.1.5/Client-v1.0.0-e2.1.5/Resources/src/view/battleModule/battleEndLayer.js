/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-9-14
 * Time: 下午5:45
 * To change this template use File | Settings | File Templates.
 */


/*
 * battle end layer
 * */


var BattleEndLayer = cc.Layer.extend({
    _battleLog: null,


    init: function (battleLog) {
        cc.log("BattleEndLayer init");

        if (!this._super()) return false;

        this._battleLog = battleLog;

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 230), 640, 1136);
        bgLayer.setPosition(cc.p(40, 0));
        this.addChild(bgLayer);

        if (this._battleLog.get("winner") == "own") {
            var winBgSprite = cc.Sprite.create(main_scene_image.bg17);
            winBgSprite.setPosition(cc.p(360, 580));
            this.addChild(winBgSprite);

            var obtainSprite = cc.Sprite.create(main_scene_image.icon227);
            obtainSprite.setPosition(cc.p(360, 718));
            this.addChild(obtainSprite);
        } else {
            var failBgSprite = cc.Sprite.create(main_scene_image.bg18);
            failBgSprite.setPosition(cc.p(360, 580));
            this.addChild(failBgSprite);
        }

        var str = lz.getRewardString(this._battleLog.get("reward"));
        var len = str.length;

        var offsetY = 655;
        for(var i = 0; i < len; ++i) {
            var rewardLabel = cc.LabelTTF.create(str[i], "STHeitiTC-Medium", 20);
            rewardLabel.setColor(cc.c3b(255, 239, 131));
            rewardLabel.setAnchorPoint(cc.p(0.5, 1));
            rewardLabel.setPosition(cc.p(360, offsetY));
            this.addChild(rewardLabel);

            offsetY -= 45;
        }

        var okItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon95,
            this.end,
            this
        );
        okItem.setPosition(cc.p(360, 415));

        var menu = cc.Menu.create(okItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);


        this.setVisible(false);

        return true;
    },

    play: function () {
        cc.log("BattleEndLayer play");

        this.setVisible(true);
    },

    end: function () {
        cc.log("BattleEndLayer end");

        BattlePlayer.getInstance().next();
    }
});


BattleEndLayer.create = function (battleLog) {
    var ret = new BattleEndLayer();

    if (ret && ret.init(battleLog)) {
        return ret;
    }

    return null;
};