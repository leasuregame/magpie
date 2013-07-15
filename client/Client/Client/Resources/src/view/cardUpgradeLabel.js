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
    init : function() {
        cc.log("CardUpgradeLabel init");

        if(!this._super()) return false;

        var bg = cc.LayerColor.create(cc.c4b(100, 0, 100, 100), GAME_WIDTH, 700);
        bg.setPosition(cc.p(GAME_HORIZONTAL_LACUNA, 200));
        this.addChild(bg);

        var tipLabel = cc.LabelTTF.create("卡牌升级可以提升卡牌的基础攻击力和生命值", 'Times New Roman', 25);
        tipLabel.setPosition(cc.p(GAME_WIDTH_MIDPOINT, 250));
        this.addChild(tipLabel);

        var label = cc.LabelTTF.create("费用消耗：", 'Times New Roman', 25);
        label.setAnchorPoint(cc.p(0, 0));
        label.setPosition(cc.p(100, 300));
        this.addChild(label);

        this.consumeLabel = cc.LabelTTF.create("0", 'Times New Roman', 25);
        this.consumeLabel.setAnchorPoint(cc.p(0, 0));
        this.consumeLabel.setPosition(cc.p(250, 300));
        this.addChild(this.consumeLabel);

        return true;
    }
})


CardUpgradeLabel.create = function(){
    var ret = new CardUpgradeLabel();

    if(ret && ret.init()) {
        return ret;
    }

    return null;
}