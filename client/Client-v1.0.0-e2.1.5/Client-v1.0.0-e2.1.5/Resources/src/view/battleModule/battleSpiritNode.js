/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-8-24
 * Time: 下午3:58
 * To change this template use File | Settings | File Templates.
 */


/*
 * battle spirit node
 * */


var BattleSpiritNode = cc.Node.extend({
    _spiritSprite: null,
    _tipLabel: null,

    init: function (spiritLv) {
        cc.log("BattleSpiritNode init");

        if (!this._super()) return false;

        var spiritLv = gameData.spirit.get("lv");

        if (spiritLv < 1) {
            spiritLv = 1;
        }

        this._spiritSprite = cc.Sprite.create(main_scene_image["spirit" + spiritLv]);
        this.addChild(this._spiritSprite);

        this._tipLabel = cc.LabelTTF.create("", '黑体', 60);
        this.addChild(this._tipLabel);

        return true;
    },

    setOpacity: function (opacity) {
        this._spiritSprite.setOpacity(opacity);
    },

    getColor: function () {
        return this._spiritSprite.getColor();
    },

    setColor: function (color3) {
        this._spiritSprite.setColor(color3);
    },

    _tip: function (str) {
        var a1 = cc.FadeIn.create(0.5);
        var a2 = cc.ScaleTo.create(0.2, 1.5);
        var a3 = cc.ScaleTo.create(0.1, 1.0);
        var a4 = cc.FadeOut.create(1);

        var a = cc.Sequence.create(a1, a2, a3, a4);

        this._tipLabel.setFontSize(80);
        this._tipLabel.setColor(cc.c3b(255, 0, 0));
        this._tipLabel.setOpacity(0);
        this._tipLabel.setString(str);
        this._tipLabel.runAction(a);
    },

    atk: function () {
        var a1 = cc.RotateBy.create(0.3 / GAME_COMBAT_SPEED, 30);
        var a2 = cc.RotateBy.create(0.4 / GAME_COMBAT_SPEED, -60);
        var a3 = cc.RotateBy.create(0.3 / GAME_COMBAT_SPEED, 30);
        var a = cc.Sequence.create(a1, a2, a3);

        var b = cc.Sequence.create(cc.ScaleTo.create(0.3, 1.2), cc.ScaleTo.create(0.3, 1.0));

        this.runAction(cc.Spawn.create(a, b));

        this._tip("我怒了");
    }
});


BattleSpiritNode.create = function (spiritLv) {
    var ret = new BattleSpiritNode();

    if (ret && ret.init(spiritLv)) {
        return ret;
    }

    return null;
};