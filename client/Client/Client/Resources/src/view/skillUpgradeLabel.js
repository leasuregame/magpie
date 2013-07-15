/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-13
 * Time: 下午6:07
 * To change this template use File | Settings | File Templates.
 */


/*
 * skill upgrade label
 * */


var SkillUpgradeLabel = cc.Node.extend({
    init : function() {
        cc.log("SkillUpgradeLabel init");

        if(!this._super()) return false;

        var bg = cc.LayerColor.create(cc.c4b(100, 0, 100, 100), GAME_WIDTH, 150);
        bg.setPosition(cc.p(0, 0));
        this.addChild(bg);

        var tipLabel = cc.LabelTTF.create("卡牌升级可以提升卡牌的基础攻击力和生命值", 'Times New Roman', 20);
        tipLabel.setPosition(cc.p(0, 0));
        this.addChild(tipLabel);



        return true;
    }
})


SkillUpgradeLabel.create = function(){
    var ret = new SkillUpgradeLabel();

    if(ret && ret.init()) {
        return ret;
    }

    return null;
}