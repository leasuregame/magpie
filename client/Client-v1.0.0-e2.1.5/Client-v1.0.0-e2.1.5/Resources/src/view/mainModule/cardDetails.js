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
    _cb: null,

    init: function (card, cb) {
        cc.log("CardDetails init");

        if (!this._super()) return false;

        this._card = card;
        this._cb = cb;

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 240), 640, 960);
        bgLayer.setPosition(GAME_ZERO);
        this.addChild(bgLayer, -1);

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

        var lvIcon = cc.LabelTTF.create("LV:", "STHeitiTC-Medium", 20);
        lvIcon.setColor(cc.c3b(255, 239, 131));
        lvIcon.setAnchorPoint(cc.p(0, 0.5));
        lvIcon.setPosition(cc.p(500, 910));
        this.addChild(lvIcon);

        var hpIcon = cc.LabelTTF.create("生命:", "STHeitiTC-Medium", 20);
        hpIcon.setColor(cc.c3b(255, 239, 131));
        hpIcon.setAnchorPoint(cc.p(0, 0.5));
        hpIcon.setPosition(cc.p(500, 850));
        this.addChild(hpIcon);

        var atkIcon = cc.LabelTTF.create("攻击:", "STHeitiTC-Medium", 20);
        atkIcon.setColor(cc.c3b(255, 239, 131));
        atkIcon.setAnchorPoint(cc.p(0, 0.5));
        atkIcon.setPosition(cc.p(500, 790));
        this.addChild(atkIcon);

        var nameLabel = StrokeLabel.create(this._card.get("name"), "STHeitiTC-Medium", 35);
        nameLabel.setColor(cc.c3b(255, 239, 131));
        nameLabel.setPosition(cc.p(360, 1020));
        this.addChild(nameLabel);

        var star = this._card.get("star");
        for (var i = 0; i < star; ++i) {
            var starIcon = cc.Sprite.create(main_scene_image.star2);
            starIcon.setPosition(cc.p(610 - i * 50, 970));
            this.addChild(starIcon);
        }

        var lvLabel = cc.LabelTTF.create(this._card.get("lv") + " / " + this._card.get("maxLv"), "STHeitiTC-Medium", 20);
        lvLabel.setColor(cc.c3b(255, 239, 131));
        lvLabel.setPosition(cc.p(588, 908));
        this.addChild(lvLabel);

        var hpLabel = cc.LabelTTF.create(this._card.get("hp"), "STHeitiTC-Medium", 20);
        hpLabel.setColor(cc.c3b(255, 239, 131));
        hpLabel.setPosition(cc.p(588, 848));
        this.addChild(hpLabel);

        var atkLabel = cc.LabelTTF.create(this._card.get("atk"), "STHeitiTC-Medium", 20);
        atkLabel.setColor(cc.c3b(255, 239, 131));
        atkLabel.setPosition(cc.p(588, 788));
        this.addChild(atkLabel);

        var description = lz.format(this._card.get("description"), 6);
        var len = description.length;
        for (var i = 0; i < len; ++i) {
            var descriptionLabel = cc.LabelTTF.create(description[i], "STHeitiTC-Medium", 20);
            descriptionLabel.setColor(cc.c3b(255, 239, 131));
            descriptionLabel.setAnchorPoint(cc.p(0, 0.5));
            descriptionLabel.setPosition(cc.p(495, 730 - i * 30));
            this.addChild(descriptionLabel);
        }

        var skillIcon = cc.LabelTTF.create("主动技能:", "STHeitiTC-Medium", 30);
        skillIcon.setColor(cc.c3b(255, 248, 69));
        skillIcon.setAnchorPoint(cc.p(0, 0.5));
        skillIcon.setPosition(cc.p(100, 520));
        this.addChild(skillIcon);

        if (this._card.hasSkill()) {
            var skillNameLabel = cc.LabelTTF.create(this._card.get("skillName"), "STHeitiTC-Medium", 20);
            skillNameLabel.setColor(cc.c3b(255, 239, 131));
            skillNameLabel.setAnchorPoint(cc.p(0, 0.5));
            skillNameLabel.setPosition(cc.p(250, 520));
            this.addChild(skillNameLabel);

            var skillDescriptionLabel = cc.LabelTTF.create(this._card.get("skillDescription"), "STHeitiTC-Medium", 20);
            skillDescriptionLabel.setColor(cc.c3b(255, 239, 131));
            skillDescriptionLabel.setAnchorPoint(cc.p(0, 0.5));
            skillDescriptionLabel.setPosition(cc.p(100, 480));
            this.addChild(skillDescriptionLabel);

            var skillRateIcon = cc.LabelTTF.create("触发概率:", "STHeitiTC-Medium", 20);
            skillRateIcon.setColor(cc.c3b(255, 239, 131));
            skillRateIcon.setAnchorPoint(cc.p(0, 0.5));
            skillRateIcon.setPosition(cc.p(100, 410));
            this.addChild(skillRateIcon);

            var skillHarmIcon = cc.LabelTTF.create(this._card.getSkillType() + "效果:", "STHeitiTC-Medium", 20);
            skillHarmIcon.setColor(cc.c3b(255, 239, 131));
            skillHarmIcon.setAnchorPoint(cc.p(0, 0.5));
            skillHarmIcon.setPosition(cc.p(100, 440));
            this.addChild(skillHarmIcon);

            var skillRateLabel = cc.LabelTTF.create(this._card.get("skillRate") + "%", "STHeitiTC-Medium", 20);
            skillRateLabel.setColor(cc.c3b(255, 239, 131));
            skillRateLabel.setPosition(cc.p(240, 408));
            this.addChild(skillRateLabel);

            var skillHarmLabel = cc.LabelTTF.create(this._card.get("skillHarm") + "%", "STHeitiTC-Medium", 20);
            skillHarmLabel.setColor(cc.c3b(255, 239, 131));
            skillHarmLabel.setPosition(cc.p(240, 438));
            this.addChild(skillHarmLabel);

            var skillLvIcon = cc.LabelTTF.create("技能等级:", "STHeitiTC-Medium", 18);
            skillLvIcon.setColor(cc.c3b(255, 239, 131));
            skillLvIcon.setAnchorPoint(cc.p(0, 0.5));
            skillLvIcon.setPosition(cc.p(500, 410));
            this.addChild(skillLvIcon);

            var skillLvLabel = cc.LabelTTF.create(
                this._card.get("skillLv") + " / " + this._card.get("skillMaxLv"),
                "STHeitiTC-Medium",
                18
            );
            skillLvLabel.setColor(cc.c3b(255, 239, 131));
            skillLvLabel.setPosition(cc.p(605, 408));
            this.addChild(skillLvLabel);
        } else {
            var tipLabel = cc.LabelTTF.create("无", "STHeitiTC-Medium", 20);
            tipLabel.setColor(cc.c3b(255, 239, 131));
            tipLabel.setAnchorPoint(cc.p(0, 0.5));
            tipLabel.setPosition(cc.p(250, 520));
            this.addChild(tipLabel);

            var tipDescriptionLabel = cc.LabelTTF.create("三星以上拥有主动技能。", "STHeitiTC-Medium", 20);
            tipDescriptionLabel.setColor(cc.c3b(255, 239, 131));
            tipDescriptionLabel.setAnchorPoint(cc.p(0, 0.5));
            tipDescriptionLabel.setPosition(cc.p(100, 480));
            this.addChild(tipDescriptionLabel);
        }

        var passiveSkillIcon = cc.LabelTTF.create("被动效果:", "STHeitiTC-Medium", 30);
        passiveSkillIcon.setColor(cc.c3b(255, 248, 69));
        passiveSkillIcon.setAnchorPoint(cc.p(0, 0.5));
        passiveSkillIcon.setPosition(cc.p(100, 340));
        this.addChild(passiveSkillIcon);

        if (this._card.hasPassiveSkill()) {
            var passiveSkill = this._card.get("passiveSkill");
            var y = 330;
            for (var key in passiveSkill) {

                var value = passiveSkill[key].value.toFixed(1);

                y -= 40;

                passiveSkillIcon = cc.Sprite.create(main_scene_image.button25);
                passiveSkillIcon.setAnchorPoint(cc.p(0, 0.5));
                passiveSkillIcon.setPosition(cc.p(100, y));
                this.addChild(passiveSkillIcon);
                passiveSkillIcon.setScale(0.8);

                var passiveSkillNameLabel = cc.LabelTTF.create(passiveSkill[key].description, "STHeitiTC-Medium", 20);
                passiveSkillNameLabel.setColor(cc.c3b(255, 239, 131));
                passiveSkillNameLabel.setAnchorPoint(cc.p(0, 0.5));
                passiveSkillNameLabel.setPosition(cc.p(150, y));
                this.addChild(passiveSkillNameLabel);

                var passiveSkillValueLabel = cc.LabelTTF.create("+ " + value + "%", "STHeitiTC-Medium", 20);
                passiveSkillValueLabel.setPosition(cc.p(250, y - 2));
                this.addChild(passiveSkillValueLabel);

                if (value >= 8.0) {
                    passiveSkillValueLabel.setColor(cc.c3b(255, 248, 69));
                } else if (value >= 5.0) {
                    passiveSkillValueLabel.setColor(cc.c3b(105, 218, 255));
                } else {
                    passiveSkillValueLabel.setColor(cc.c3b(118, 238, 60));
                }
            }
        } else {
            var tipLabel = cc.LabelTTF.create("无", "STHeitiTC-Medium", 20);
            tipLabel.setColor(cc.c3b(255, 239, 131));
            tipLabel.setAnchorPoint(cc.p(0, 0.5));
            tipLabel.setPosition(cc.p(250, 340));
            this.addChild(tipLabel);

            var tipDescriptionLabel = cc.LabelTTF.create("三星以上拥有被动效果。", "STHeitiTC-Medium", 20);
            tipDescriptionLabel.setColor(cc.c3b(255, 239, 131));
            tipDescriptionLabel.setAnchorPoint(cc.p(0, 0.5));
            tipDescriptionLabel.setPosition(cc.p(100, 300));
            this.addChild(tipDescriptionLabel);
        }

        var closeItem = cc.MenuItemImage.create(
            main_scene_image.button17,
            main_scene_image.button17s,
            this._onClickClose,
            this
        );
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

        if (this._cb) {
            this._cb();
        }
    }
});


CardDetails.create = function (card, cb) {
    var ret = new CardDetails();

    if (ret && ret.init(card, cb)) {
        return ret;
    }

    return null;
};

