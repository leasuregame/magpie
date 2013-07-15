/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-20
 * Time: 下午4:59
 * To change this template use File | Settings | File Templates.
 */


/*
 * 强化
 * */


var StrengthenLayer = cc.Layer.extend({
    _nowLabel : null,

    init: function () {
        cc.log("StrengthenLayer init");

        if (!this._super()) return false;

        var cardUpgradeItem = cc.MenuItemFont.create("卡牌升级", this._onClickCardUpgrade, this);
        var skillUpgradeItem = cc.MenuItemFont.create("技能升级", this._onClickSkillUpgrade, this);
        var passiveSkillUpgradeItem = cc.MenuItemFont.create("技能洗炼", this._onClickPassiveSkillUpgrade, this);

        cardUpgradeItem.setPosition(cc.p(-200, 400));
        skillUpgradeItem.setPosition(cc.p(0, 400));
        passiveSkillUpgradeItem.setPosition(cc.p(200, 400));

        var menu = cc.Menu.create(cardUpgradeItem, skillUpgradeItem, passiveSkillUpgradeItem);

        this.addChild(menu);

        this._nowLabel = CardUpgradeLabel.create();

        this.addChild(this._nowLabel);



        return true;
    },

    _onClickCardUpgrade: function() {
        this._switchLabel(CardUpgradeLabel);
    },

    _onClickSkillUpgrade: function() {
        this._switchLabel(SkillUpgradeLabel);
    },

    _onClickPassiveSkillUpgrade: function() {
        this._switchLabel(PassiveSkillUpgradeLabel);
    },

    _switchLabel: function(runLabel) {
        if (!(this._nowLayer instanceof runLabel)) {
            this.removeChild(this._nowLabel);
            this._nowLabel = runLabel.create();
            this.addChild(this._nowLabel);
        }
    }
})

StrengthenLayer.create = function () {
    var res = new StrengthenLayer();

    if (res && res.init()) {
        return res;
    }

    return null;
}