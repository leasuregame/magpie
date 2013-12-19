/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-10-28
 * Time: 下午6:11
 * To change this template use File | Settings | File Templates.
 */


var itemTitle = ["元神", "修炼", "天道", "竞技", "好友", "VIP", "卡牌升级", "技能升级", "被动洗练", "星级进阶", "属性培养"];

var TipsLayer = LazyLayer.extend({
    _tipsLayerFit: null,

    onEnter: function () {
        cc.log("TipsLayer onEnter");

        this._super();

        lz.dc.beginLogPageView("帮助界面");
    },

    onExit: function () {
        cc.log("TipsLayer onExit");

        this._super();

        lz.dc.endLogPageView("帮助界面");
    },

    init: function () {
        cc.log("TipsLayer init");
        if (!this._super) return false;

        this._tipsLayerFit = gameFit.mainScene.tipsLayer;

        var lazyLayer = LazyLayer.create();
        this.addChild(lazyLayer);

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 230), 720, 1136);
        bgLayer.setPosition(cc.p(0, 88));
        this.addChild(bgLayer);

        var bgSprite = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgSprite.setContentSize(this._tipsLayerFit.bgSpriteContentSize);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._tipsLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        var title = StrokeLabel.create("攻略", "STHeitiTC-Medium", 40);
        title.setPosition(this._tipsLayerFit.titlePoint);
        this.addChild(title);

        var closeItem = cc.MenuItemImage.create(
            main_scene_image.button37,
            main_scene_image.button37s,
            this._onClickClose,
            this
        );
        closeItem.setPosition(this._tipsLayerFit.closeItemPoint);
        var menu = cc.Menu.create(closeItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);


        var scrollViewLayer = MarkLayer.create(this._tipsLayerFit.scrollViewLayerRect);
        var menu = LazyMenu.create();
        menu.setTouchPriority(-200);
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu, 1);

        var scrollViewHeight = 11 * 250;

        var scrollView = cc.ScrollView.create(this._tipsLayerFit.scrollViewSize, scrollViewLayer);
        scrollView.setTouchPriority(-300);
        scrollView.setPosition(this._tipsLayerFit.scrollViewPoint);
        scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        scrollView.updateInset();
        this.addChild(scrollView);
        var len = itemTitle.length;

        for (var i = 0; i < len; ++i) {
            var y = scrollViewHeight - 250 - i * 250;
            var bgSpriteUrl = main_scene_image.icon169;
            var bgSprite = cc.Scale9Sprite.create(bgSpriteUrl);
            bgSprite.setAnchorPoint(cc.p(0, 0));
            bgSprite.setPosition(cc.p(0, y));
            bgSprite.setContentSize(cc.size(580, 250));
            scrollViewLayer.addChild(bgSprite);

            var title = StrokeLabel.create(itemTitle[i], "STHeitiTC-Medium", 30);
            title.setAnchorPoint(cc.p(0, 0));
            title.setPosition(cc.p(10, y + 195));
            title.setColor(cc.c3b(255, 232, 75));
            scrollViewLayer.addChild(title);
        }

        //元神描述
        var y = scrollViewHeight - 55 - 30;
        var description = lz.format("元神相当于你的宠物，它为你所有上阵卡牌提供属性加成，并有概率触发额外效果。", 28);
        this._addDescription(description, y, scrollViewLayer);

        y -= description.length * 25;
        var description = lz.format("元神靠吸收灵气来升级。元神等级越高，所提供属性加成效果越强。", 28);
        this._addDescription(description, y, scrollViewLayer);

        //修炼描述
        y = scrollViewHeight - 55 - 30 - 250;
        var description = lz.format("主要产出：角色升级经验，仙币，卡牌强化所用的从卡。", 28);
        this._addDescription(description, y, scrollViewLayer);

        y -= description.length * 25;
        var description = lz.format("概率产出：高星级卡牌，以及用来兑换高星级卡的卡魂。", 28);
        this._addDescription(description, y, scrollViewLayer);

        //天道描述
        y = scrollViewHeight - 55 - 30 - 250 * 2;
        var description = lz.format("主要产出技能点，技能点可用来升级卡牌的技能等级。", 28);
        this._addDescription(description, y, scrollViewLayer);

        y -= description.length * 25;
        var description = lz.format("天道挑战难度系数较高。", 28);
        this._addDescription(description, y, scrollViewLayer);

        //竞技描述
        y = scrollViewHeight - 55 - 30 - 250 * 3;
        var description = lz.format("主要产出仙丹，仙丹可用来培养，提升卡牌的攻击力或生命值。", 28);
        this._addDescription(description, y, scrollViewLayer);

        y -= description.length * 25;
        var description = lz.format("竞技场是你一展雄风的好地方。", 28);
        this._addDescription(description, y, scrollViewLayer);

        //好友描述
        y = scrollViewHeight - 55 - 30 - 250 * 4;
        var description = lz.format("你可以通过祝福好友来获取活力点，活力点可以代替魔石进行卡牌召唤。", 28);
        this._addDescription(description, y, scrollViewLayer);

        //VIP描述
        y = scrollViewHeight - 55 - 30 - 250 * 5;
        var description = lz.format("充值可以成为VIP，尊享特权，购买专属礼包，同时获得更多的游戏特权。", 28);
        this._addDescription(description, y, scrollViewLayer);
        y -= description.length * 25;
        var description = lz.format("你可以点击商城按钮，进入礼包界面，查看VIP特权详情。", 28);
        this._addDescription(description, y, scrollViewLayer);

        //卡牌升级
        y = scrollViewHeight - 55 - 30 - 250 * 6;
        var description = lz.format("卡牌通过吞噬其他卡来提升自己的等级。", 28);
        this._addDescription(description, y, scrollViewLayer);
        y -= description.length * 25;
        var description = lz.format("升级还需要消耗仙币。", 28);
        this._addDescription(description, y, scrollViewLayer);
        y -= description.length * 25;
        var description = lz.format("1星卡等级上限为30级。", 28);
        this._addDescription(description, y, scrollViewLayer);
        y -= description.length * 25;
        var description = lz.format("2星卡等级上限为40级。", 28);
        this._addDescription(description, y, scrollViewLayer);
        y -= description.length * 25;
        var description = lz.format("3星卡等级上限为50级。", 28);
        this._addDescription(description, y, scrollViewLayer);
        y -= description.length * 25;
        var description = lz.format("4星卡等级上限为55级。", 28);
        this._addDescription(description, y, scrollViewLayer);
        y -= description.length * 25;
        var description = lz.format("5星卡等级上限为60级。", 28);
        this._addDescription(description, y, scrollViewLayer);

        //技能升级
        y = scrollViewHeight - 55 - 30 - 250 * 7;
        var description = lz.format("3星卡以及以上的卡牌，拥有1个技能，该技能可以升级。", 28);
        this._addDescription(description, y, scrollViewLayer);
        y -= description.length * 25;
        var description = lz.format("技能升级需要消耗技能点，技能点通过天道挑战可以获得。", 28);
        this._addDescription(description, y, scrollViewLayer);

        //被动洗练
        y = scrollViewHeight - 55 - 30 - 250 * 8;
        var description = lz.format("3星卡以及以上的卡牌，会拥有额外的被动属性。", 28);
        this._addDescription(description, y, scrollViewLayer);
        y -= description.length * 25;
        var description = lz.format("3星卡拥有1个被动效果。", 28);
        this._addDescription(description, y, scrollViewLayer);
        y -= description.length * 25;
        var description = lz.format("4星卡拥有2个被动效果。", 28);
        this._addDescription(description, y, scrollViewLayer);
        y -= description.length * 25;
        var description = lz.format("5星卡拥有3个被动效果。", 28);
        this._addDescription(description, y, scrollViewLayer);
        y -= description.length * 25;
        var description = lz.format("被动属性效果可以花费仙币或者魔石进行洗练，追求最佳属性搭配。", 28);
        this._addDescription(description, y, scrollViewLayer);

        //星级进阶
        y = scrollViewHeight - 55 - 30 - 250 * 9;
        var description = lz.format("满级的卡牌，可以通过吞噬同星级的卡，来提升自己的星级。", 28);
        this._addDescription(description, y, scrollViewLayer);
        y -= description.length * 25;
        var description = lz.format("你所吞噬的卡数量越多，进阶概率越高。最高可到100%。", 28);
        this._addDescription(description, y, scrollViewLayer);

        //属性培养
        y = scrollViewHeight - 55 - 30 - 250 * 10;
        var description = lz.format("你可以通过参与竞技场来获取仙丹奖励。仙丹可以用来提升卡牌的基本属性。", 28);
        this._addDescription(description, y, scrollViewLayer);
        y -= description.length * 25;
        var description = lz.format("每20点仙丹可以提升1点攻击力，或2点生命值。", 28);
        this._addDescription(description, y, scrollViewLayer);

        scrollView.setContentSize(cc.size(580, scrollViewHeight));
        scrollView.setContentOffset(scrollView.minContainerOffset());


        return true;
    },

    _addDescription: function (desc, y, parent) {
        for (var i = 0; i < desc.length; i++) {
            var itemText = cc.LabelTTF.create(desc[i], "STHeitiTC-Medium", 20);
            // y = scrollViewHeight - 35 - id * 315;
            itemText.setAnchorPoint(cc.p(0, 0));
            itemText.setPosition(cc.p(10, y - i * 25));
            parent.addChild(itemText);
        }
    },

    _onClickClose: function () {
        cc.log("TipsLayer _onClickClose");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this.removeFromParent();
    }
});


TipsLayer.create = function () {
    var ret = new TipsLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};


TipsLayer.pop = function () {
    var tipsLayer = TipsLayer.create();

    MainScene.getInstance().getLayer().addChild(tipsLayer, 10);

    return tipsLayer;
};
