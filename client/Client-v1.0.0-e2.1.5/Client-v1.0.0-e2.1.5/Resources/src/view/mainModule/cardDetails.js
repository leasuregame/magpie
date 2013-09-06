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
        line1Icon.setPosition(cc.p(360, 550));
        this.addChild(line1Icon);

        var line2Icon = cc.Sprite.create(main_scene_image.icon18);
        line2Icon.setPosition(cc.p(360, 370));
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
        for (var i = 0; i < star; ++i) {
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

        var description = this._getDescription();
        var len = description.length;
        for (var i = 0; i < len; ++i) {
            var descriptionLabel = cc.LabelTTF.create(description[i], "黑体", 20);
            descriptionLabel.setAnchorPoint(cc.p(0, 0.5));
            descriptionLabel.setPosition(cc.p(495, 730 - i * 30));
            this.addChild(descriptionLabel);
        }

        var skillIcon = cc.LabelTTF.create("主动技能:", "黑体", 30);
        skillIcon.setColor(lz.getColor("yellow"));
        skillIcon.setAnchorPoint(cc.p(0, 0.5));
        skillIcon.setPosition(cc.p(100, 520));
        this.addChild(skillIcon);

        var skillNameLabel = cc.LabelTTF.create(this._card.get("skillName"), "黑体", 20);
        skillNameLabel.setAnchorPoint(cc.p(0, 0.5));
        skillNameLabel.setPosition(cc.p(250, 520));
        this.addChild(skillNameLabel);

        var skillDescriptionLabel = cc.LabelTTF.create(this._card.get("skillDescription"), "黑体", 20);
        skillDescriptionLabel.setAnchorPoint(cc.p(0, 0.5));
        skillDescriptionLabel.setPosition(cc.p(100, 480));
        this.addChild(skillDescriptionLabel);

        var skillRateIcon = cc.LabelTTF.create("触发概率:", "黑体", 20);
        skillRateIcon.setAnchorPoint(cc.p(0, 0.5));
        skillRateIcon.setPosition(cc.p(100, 440));
        this.addChild(skillRateIcon);

        var skillHarmIcon = cc.LabelTTF.create("技能伤害:", "黑体", 20);
        skillHarmIcon.setAnchorPoint(cc.p(0, 0.5));
        skillHarmIcon.setPosition(cc.p(100, 410));
        this.addChild(skillHarmIcon);

        var skillRateLabel = cc.LabelTTF.create(this._card.get("skillRate") + "%", "黑体", 20);
        skillRateLabel.setPosition(cc.p(220, 438));
        this.addChild(skillRateLabel);

        var skillHarmLabel = cc.LabelTTF.create(this._card.get("skillHarm") + "%", "黑体", 20);
        skillHarmLabel.setPosition(cc.p(220, 408));
        this.addChild(skillHarmLabel);

        var skillLvIcon = cc.LabelTTF.create("技能等级:", "黑体", 18);
        skillLvIcon.setAnchorPoint(cc.p(0, 0.5));
        skillLvIcon.setPosition(cc.p(500, 410));
        this.addChild(skillLvIcon);

        var skillLvLabel = cc.LabelTTF.create(this._card.get("skillLv") + " / " + this._card.get("skillMaxLv"), "黑体", 18);
        skillLvLabel.setPosition(cc.p(605, 408));
        this.addChild(skillLvLabel);

        var passiveSkillIcon = cc.LabelTTF.create("被动技能:", "黑体", 30);
        passiveSkillIcon.setColor(lz.getColor("yellow"));
        passiveSkillIcon.setAnchorPoint(cc.p(0, 0.5));
        passiveSkillIcon.setPosition(cc.p(100, 340));
        this.addChild(passiveSkillIcon);

        var passiveSkill = this._card.get("passiveSkill");
        var y = 330;
        for (var key in passiveSkill) {

            var value = passiveSkill[key].value.toFixed(1);

            y -= 40;

            passiveSkillIcon = cc.Sprite.create(main_scene_image.button25);
            passiveSkillIcon.setAnchorPoint(cc.p(0, 0.5));
            passiveSkillIcon.setPosition(cc.p(100, y));
            this.addChild(passiveSkillIcon);

            var passiveSkillNameLabel = cc.LabelTTF.create(passiveSkill[key].description, "黑体", 20);
            passiveSkillNameLabel.setAnchorPoint(cc.p(0, 0.5));
            passiveSkillNameLabel.setPosition(cc.p(150, y));
            this.addChild(passiveSkillNameLabel);

            var passiveSkillValueLabel = cc.LabelTTF.create("+" + value + "%", "黑体", 20);
            passiveSkillValueLabel.setPosition(cc.p(250, y - 2));
            this.addChild(passiveSkillValueLabel);

            if (value >= 8.0) {
                passiveSkillValueLabel.setColor(lz.getColor("yellow"));
            } else if (value >= 5.0) {
                passiveSkillValueLabel.setColor(lz.getColor("bule"));
            } else {
                passiveSkillValueLabel.setColor(lz.getColor("green"));
            }
        }

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
    },

    _getDescription: function () {
        cc.log("CardDetails _getDescription");

        var description = [];
        var str = this._card.get("description");
        var len = str.length;

        for (var i = 0; len > 0; ++i) {
            if (len < 6) {
                description[i] = str.substring(i * 6);
            } else {
                description[i] = str.substring(i * 6, i * 6 + 6);
            }

            len -= 6;
        }

        return description;
    }
});


CardDetails.create = function (card) {
    var ret = new CardDetails();

    if (ret && ret.init(card)) {
        return ret;
    }

    return null;
};

