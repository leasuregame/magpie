/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-6-3
 * Time: 下午3:06
 * To change this template use File | Settings | File Templates.
 */


/*
 * card details
 * */


var CardDetails = LazyLayer.extend({
    _card: null,
    _menu: null,

    init: function (card) {
        cc.log("CardDetails init");

        if (!this._super()) return false;

        this._card = card;

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 230), 640, 960);
        bgLayer.setPosition(GAME_ZERO);
        this.addChild(bgLayer);

        var headBgSprite = cc.Sprite.create(main_scene_image.icon34);
        headBgSprite.setAnchorPoint(cc.p(0, 0));
        headBgSprite.setPosition(cc.p(40, 993));
        this.addChild(headBgSprite);

        var cardFullNode = CardFullNode.create(this._card);
        cardFullNode.setPosition(cc.p(232, 770));
        this.addChild(cardFullNode);

        var line1Icon = cc.Sprite.create(main_scene_image.icon18);
        line1Icon.setPosition(cc.p(360, 560));
        this.addChild(line1Icon);

        var line2Icon = cc.Sprite.create(main_scene_image.icon18);
        line2Icon.setPosition(cc.p(360, 380));
        this.addChild(line2Icon);

        var line3Icon = cc.Sprite.create(main_scene_image.icon18);
        line3Icon.setPosition(cc.p(360, 180));
        this.addChild(line3Icon);

        var lvBgSprite = cc.Sprite.create(main_scene_image.icon35);
        lvBgSprite.setPosition(cc.p(560, 910));
        this.addChild(lvBgSprite);

        var hpBgSprite = cc.Sprite.create(main_scene_image.icon35);
        hpBgSprite.setPosition(cc.p(560, 850));
        this.addChild(hpBgSprite);

        var atkBgSprite = cc.Sprite.create(main_scene_image.icon35);
        atkBgSprite.setPosition(cc.p(560, 790));
        this.addChild(atkBgSprite);

        var lvIcon = cc.LabelTTF.create("LV:", "黑体", 20);
        lvIcon.setAnchorPoint(cc.p(0, 0.5));
        lvIcon.setPosition(cc.p(500, 910));
        this.addChild(lvIcon);

        var hpIcon = cc.LabelTTF.create("生命:", "黑体", 20);
        hpIcon.setAnchorPoint(cc.p(0, 0.5));
        hpIcon.setPosition(cc.p(500, 850));
        this.addChild(hpIcon);

        var atkIcon = cc.LabelTTF.create("攻击:", "黑体", 20);
        atkIcon.setAnchorPoint(cc.p(0, 0.5));
        atkIcon.setPosition(cc.p(500, 790));
        this.addChild(atkIcon);

        var nameLabel = cc.LabelTTF.create(this._card.get("name"), "黑体", 35);
        nameLabel.setPosition(cc.p(360, 1020));
        this.addChild(nameLabel);

        var star = this._card.get("star");
        for(var i = 0; i < star; ++i) {
            var starIcon = cc.Sprite.create(main_scene_image.star2);
            starIcon.setPosition(cc.p(610 - i * 50, 970));
            this.addChild(starIcon);
        }

        var lvLabel = cc.LabelTTF.create(this._card.get("lv"), "黑体", 20);
        lvLabel.setPosition(cc.p(588, 908));
        this.addChild(lvLabel);

        var hpLabel = cc.LabelTTF.create(this._card.get("hp"), "黑体", 20);
        hpLabel.setPosition(cc.p(588, 848));
        this.addChild(hpLabel);

        var atkLabel = cc.LabelTTF.create(this._card.get("atk"), "黑体", 20);
        atkLabel.setPosition(cc.p(588, 788));
        this.addChild(atkLabel);

        var descriptionLabel = cc.LabelTTF.create(
            "西游记孙悟空\n封神榜雷震子\n白蛇传白素贞\n地狱黑白无常\n西游记孙悟空\n封神榜雷震子",
            "STKaiti", 25);
        descriptionLabel.setAnchorPoint(cc.p(0.5, 1));
        descriptionLabel.setPosition(cc.p(560, 730));
        this.addChild(descriptionLabel);

        var skillIcon = cc.LabelTTF.create("主动技能:", "黑体", 30);
        skillIcon.setColor(lz.getColor("yellow"));
        skillIcon.setAnchorPoint(cc.p(0, 0.5));
        skillIcon.setPosition(cc.p(100, 530));
        this.addChild(skillIcon);
         cc.log(this._card);
        var skillName = cc.LabelTTF.create(this._card.get("skillName"), "黑体", 20);
        skillName.setAnchorPoint(cc.p(0, 0.5));
        skillName.setPosition(cc.p(200, 530));
        this.addChild(skillName);

        var passiveSkillIcon = cc.LabelTTF.create("被动技能:", "黑体", 30);
        passiveSkillIcon.setColor(lz.getColor("yellow"));
        passiveSkillIcon.setAnchorPoint(cc.p(0, 0.5));
        passiveSkillIcon.setPosition(cc.p(100, 350));
        this.addChild(passiveSkillIcon);
//
//        var passiveSkillLabel = cc.Sprite.create(main_scene_image.icon35);
//        passiveSkillLabel.setPosition(cc.p(510, 640));
//        this.addChild(passiveSkillLabel);
//
//        var informationLabel = cc.Sprite.create(main_scene_image.icon36);
//        informationLabel.setPosition(cc.p(200, 610));
//        this.addChild(informationLabel);

        var closeItem = cc.MenuItemImage.create(main_scene_image.button17, main_scene_image.button17s, this._onClickClose, this);
        closeItem.setPosition(cc.p(360, 130));

        this._menu = cc.Menu.create(closeItem);
        this._menu.setPosition(cc.p(0, 0));
        this.addChild(this._menu);

        return true;
    },

    _onClickClose: function () {
        cc.log("CardDetails _onClickClose");

        this._menu.setEnabled(false);
        this.removeFromParent();
    }
});


CardDetails.create = function (card) {
    var ret = new CardDetails();

    if (ret && ret.init(card)) {
        return ret;
    }

    return null;
};

