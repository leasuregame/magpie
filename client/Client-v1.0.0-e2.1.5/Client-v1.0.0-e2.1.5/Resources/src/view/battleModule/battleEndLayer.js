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

        var bgSprite = null;

        if (this._battleLog.get("winner") == "own") {
            bgSprite = cc.Sprite.create(main_scene_image.bg17);
        } else {
            bgSprite = cc.Sprite.create(main_scene_image.bg18);
        }

        bgSprite.setPosition(cc.p(360, 580));
        this.addChild(bgSprite);

        var reward = this._battleLog.get("reward");

        cc.log(reward);

        var str = "";
        for (var key in reward) {
            str += "获得 " + key + " 数量 " + reward[key] + "\n";
        }

        var rewardLabel = cc.LabelTTF.create(str, "黑体", 20);
        rewardLabel.setAnchorPoint(cc.p(0.5, 1));
        rewardLabel.setPosition(cc.p(360, 590));
        this.addChild(rewardLabel);

        var endItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon95,
            this.end,
            this
        );
        endItem.setPosition(cc.p(360, 400));

        var menu = cc.Menu.create(endItem);
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