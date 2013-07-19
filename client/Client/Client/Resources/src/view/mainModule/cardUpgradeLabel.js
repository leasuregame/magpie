/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-13
 * Time: 下午5:55
 * To change this template use File | Settings | File Templates.
 */


/*
 * card upgrade label
 * */


var CardUpgradeLabel = cc.Node.extend({
    _leadCard: null,
    _retinueCard: [],

    onEnter: function () {
        cc.log("CardUpgradeLabel onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("CardUpgradeLabel init");

        if (!this._super()) return false;

        var bg = cc.LayerColor.create(cc.c4b(100, 0, 100, 100), GAME_WIDTH, 700);
        bg.setPosition(cc.p(GAME_HORIZONTAL_LACUNA, 200));
        this.addChild(bg);

        var leadCardLabel = cc.LayerColor.create(cc.c4b(150, 100, 100, 200), 250, 400);
        this.leadCardString = cc.LabelTTF.create("请选择\n升级主卡", 'Times New Roman', 25, cc.size(250, 400), cc.TEXT_ALIGNMENT_CENTER);
        this.leadCardString.setPosition(cc.p(125, 100));
        leadCardLabel.addChild(this.leadCardString);
        var selectLeadItem = cc.MenuItemLabel.create(leadCardLabel, this._onClickSelectLead, this);
        selectLeadItem.setPosition(cc.p(225, 600));

        var tipLabel = cc.LayerColor.create(cc.c4b(100, 150, 100, 200), 250, 200);
        tipLabel.setPosition(cc.p(350, 600));
        this.addChild(tipLabel);
        var tipString = cc.LabelTTF.create("温馨提示\n主卡通过吞噬从卡\n来提升等级", 'Times New Roman', 25, cc.size(250, 200), cc.TEXT_ALIGNMENT_CENTER);
        tipString.setPosition(cc.p(125, 50));
        tipLabel.addChild(tipString);

        var retinueCardLabel = cc.LayerColor.create(cc.c4b(100, 100, 150, 200), 250, 200);
        this.retinueCardString = cc.LabelTTF.create("请选择从卡", 'Times New Roman', 25, cc.size(250, 200), cc.TEXT_ALIGNMENT_CENTER);
        this.retinueCardString.setPosition(cc.p(125, 50));
        retinueCardLabel.addChild(this.retinueCardString);
        var retinueCardItem = cc.MenuItemLabel.create(retinueCardLabel, this._onClickSelectRetinue, this);
        retinueCardItem.setPosition(cc.p(475, 500));

        var Label = cc.LabelTTF.create("卡牌升级可以提升卡牌的基础攻击力和生命值", 'Times New Roman', 25);
        Label.setPosition(cc.p(GAME_WIDTH_MIDPOINT, 230));
        this.addChild(Label);

        var label = cc.LabelTTF.create("费用消耗：", 'Times New Roman', 25);
        label.setAnchorPoint(cc.p(0, 0));
        label.setPosition(cc.p(100, 350));
        this.addChild(label);

        this.consumeLabel = cc.LabelTTF.create("0", 'Times New Roman', 25);
        this.consumeLabel.setAnchorPoint(cc.p(0, 0));
        this.consumeLabel.setPosition(cc.p(280, 350));
        this.addChild(this.consumeLabel);

        this.okItem = cc.MenuItemFont.create("升级", this._onClickOk, this);
        this.okItem.setPosition(cc.p(350, 300));

        var menu = cc.Menu.create(selectLeadItem, retinueCardItem, this.okItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        return true;
    },

    update: function () {
        cc.log("CardUpgradeLabel update");

        var str = "请选择\n升级主卡";
        if(this._leadCard) {
            str = "";
            str += "卡名：" + this._leadCard.get("name") + "\n";
            str += "星级：" + this._leadCard.get("star") + "\n";
            str += "等级：" + this._leadCard.get("lv") + "\n";
            str += "经验：" + this._leadCard.get("exp") + "\n";
            str += "升级经验：" + this._leadCard.get("maxExp") + "\n";
            str += "生命：" + this._leadCard.get("hp") + "\n";
            str += "攻击：" + this._leadCard.get("atk");
        }
        this.leadCardString.setString(str);

        var str = "请选择从卡";
        if(this._retinueCard.length > 0) {
            str = "当前选择从卡 " + this._retinueCard.length + " 张";
        }
        this.retinueCardString.setString(str);

        if(this._leadCard && this._retinueCard.length > 0) {
            this.okItem.setEnabled(true);
        } else {
            this.okItem.setEnabled(false);
        }
    },

    _switchToCardListLayer: function(cardListLayer) {
        cc.log("CardUpgradeLabel _switchToCardListLayer");

        MainScene.getInstance().switch(cardListLayer);
        this.getParent().setVisible(false);
    },

    _backToThisLayer: function(cardListLayer) {
        cc.log("CardUpgradeLabel _backToThisLayer");

        var parent = this.getParent();
        MainScene.getInstance().switch(parent);
        this.update();
        parent.setVisible(true);
    },

    _onClickSelectLead: function () {
        cc.log("CardUpgradeLabel _onClickSelectLead");

        var cardListLayer = CardListLayer.create(function(data) {
            cc.log(data);

            this._leadCard = data[0] || null;
            this._backToThisLayer(cardListLayer);
        }, this, 1);

        this._switchToCardListLayer(cardListLayer);
    },

    _onClickSelectRetinue: function () {
        cc.log("CardUpgradeLabel _onClickSelectRetinue");

        var cardListLayer = CardListLayer.create(function(data) {
            cc.log(data);

            this._retinueCard = data;
            this._backToThisLayer(cardListLayer);
        }, this);

        this._switchToCardListLayer(cardListLayer);
    },

    _onClickOk: function() {
        cc.log("CardUpgradeLabel _onClickOk");
    }
})


CardUpgradeLabel.create = function () {
    var ret = new CardUpgradeLabel();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
}