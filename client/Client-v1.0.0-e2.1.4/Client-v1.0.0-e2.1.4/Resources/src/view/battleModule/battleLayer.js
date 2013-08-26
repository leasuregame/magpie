/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-4-21
 * Time: 下午4:37
 * To change this template use File | Settings | File Templates.
 */


/*
 * battle layer
 * */


var BatterLayer = cc.Layer.extend({
    _battleLog: null,
    _battleNode: null,
    _locate: [
        cc.p(130, 450),
        cc.p(355, 450),
        cc.p(590, 450),
        cc.p(130, 250),
        cc.p(355, 250),
        cc.p(590, 250),
        cc.p(130, 750),
        cc.p(355, 750),
        cc.p(590, 750),
        cc.p(130, 950),
        cc.p(355, 950),
        cc.p(590, 950)
    ],

    init: function (battleLog) {
        cc.log("BatterLayer init");

        if (!this._super()) return false;

        this._battleLog = battleLog;

        var url = main_scene_image.pve_bg1;

        if (this._battleLog.get("type") == PVP_BATTLE_LOG) {
            url = main_scene_image.pvp_bg1;
        }

        var bgSprite = cc.Sprite.create(url);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(cc.p(40, 0));
        this.addChild(bgSprite);

        this._cardList = [];
        this._tipLabel = cc.LabelTTF.create("", '黑体', 30);
        this._tipLabel.setAnchorPoint(cc.p(0, 0));
        this._tipLabel.setPosition(150, 20);
        this.addChild(this._tipLabel);

        for (var i = 0; i < 12; ++i) {
            label = cc.LabelTTF.create(i, '黑体', 60);
            label.setColor(cc.c3b(255, 255, 0));
            this.addChild(label, 1);
            label.setPosition(this._locate[i].x - 70, this._locate[i].y + 50);
        }

        var backItem = cc.MenuItemFont.create("结束战斗", this._onClickBack, this);
        backItem.setPosition(cc.p(250, -460));

        var menu = cc.Menu.create(backItem);
        this.addChild(menu);

        var battleNode = battleLog.getBattleNode();

        cc.log(battleNode);

        this._battleNode = {};
        for (var key in battleNode) {
            if (battleNode[key] != undefined) {
                cc.log(battleNode[key]);

                if (typeof(battleNode[key]) == "number") {
                    this._battleNode[key] = BattleSpiritNode.create(battleNode[key]);
                } else {
                    this._battleNode[key] = BattleCardNode.create(battleNode[key]);
                }

                this._battleNode[key].setPosition(this._locate[key]);
                this.addChild(this._battleNode[key]);

            }
        }

        this._tipLabel.setString("");

        BattlePlayer.getInstance().setBattleElement(this._battleNode, this._tipLabel);

        return true;
    },

    _onClickBack: function () {
        cc.log("BattleLayer _onClickBack");

        this.stopAllActions();
        BattlePlayer.getInstance().end();
    }
});


BatterLayer.create = function (battleLog) {
    var ret = new BatterLayer();

    if (ret && ret.init(battleLog)) {
        return ret;
    }

    return null;
};