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

var CARD_DETAILS_LAYER_HANDLER_PRIORITY = -205;

var CardDetails = LazyLayer.extend({
    _cardDetailsFit: null,

    _card: null,
    _menu: null,
    _cb: null,
    _hpLabel: null,
    _atkLabel: null,

    onEnter: function () {
        cc.log("CardDetails onEnter");

        this._super();

        lz.um.beginLogPageView("卡牌详细信息界面");
    },

    onExit: function () {
        cc.log("CardDetails onExit");

        this._super();

        lz.um.endLogPageView("卡牌详细信息界面");
    },

    init: function (card, cb) {
        cc.log("CardDetails init");

        if (!this._super()) return false;

        this.setTouchPriority(MAIN_MENU_LAYER_HANDLER_PRIORITY);

        this._cardDetailsFit = gameFit.mainScene.cardDetails;

        this._card = card;
        this._cb = cb;

        var bgLayer = cc.LayerColor.create(cc.c4b(30, 15, 10, 255), 640, 1136);
        bgLayer.setPosition(this._cardDetailsFit.bgLayerPoint);
        this.addChild(bgLayer, -1);

        var headBgSprite = cc.Sprite.create(main_scene_image.icon34);
        headBgSprite.setAnchorPoint(cc.p(0, 0));
        headBgSprite.setPosition(this._cardDetailsFit.headBgSpritePoint);
        this.addChild(headBgSprite);

        var cardFullNode = CardFullNode.create(this._card);
        cardFullNode.setPosition(this._cardDetailsFit.cardFullNodePoint);
        this.addChild(cardFullNode);

        var line1Icon = cc.Sprite.create(main_scene_image.icon18);
        line1Icon.setPosition(this._cardDetailsFit.line1IconPoint);
        this.addChild(line1Icon);

        var line2Icon = cc.Sprite.create(main_scene_image.icon18);
        line2Icon.setPosition(this._cardDetailsFit.line2IconPoint);
        this.addChild(line2Icon);

        var line3Icon = cc.Sprite.create(main_scene_image.icon18);
        line3Icon.setPosition(this._cardDetailsFit.line3IconPoint);
        this.addChild(line3Icon);

        var line4Icon = cc.Sprite.create(main_scene_image.icon18);
        line4Icon.setPosition(this._cardDetailsFit.line4IconPoint);
        this.addChild(line4Icon);

        var nameLabel = StrokeLabel.create(this._card.get("name"), "STHeitiTC-Medium", 35);
        nameLabel.setColor(cc.c3b(255, 236, 168));
        nameLabel.setPosition(this._cardDetailsFit.nameLabelPoint);
        this.addChild(nameLabel);

        var star = this._card.get("star");
        for (var i = 0; i < MAX_CARD_STAR; ++i) {
            var starBgSprite = cc.Sprite.create(main_scene_image.star3);
            starBgSprite.setPosition(cc.p(this._cardDetailsFit.starBasePoint.x + i * this._cardDetailsFit.starOffsetX, this._cardDetailsFit.starBasePoint.y));
            this.addChild(starBgSprite);

            if (i < star) {
                var starIcon = cc.Sprite.create(main_scene_image.star2);
                starIcon.setPosition(cc.p(this._cardDetailsFit.starBasePoint.x + i * this._cardDetailsFit.starOffsetX, this._cardDetailsFit.starBasePoint.y));
                this.addChild(starIcon);
            }
        }

        var lvBgSprite = cc.Sprite.create(main_scene_image.icon35);
        lvBgSprite.setPosition(this._cardDetailsFit.lvBgSpritePoint);
        this.addChild(lvBgSprite);

        var hpBgSprite = cc.Sprite.create(main_scene_image.icon35);
        hpBgSprite.setPosition(this._cardDetailsFit.hpBgSpritePoint);
        this.addChild(hpBgSprite);

        var atkBgSprite = cc.Sprite.create(main_scene_image.icon35);
        atkBgSprite.setPosition(this._cardDetailsFit.atkBgSpritePoint);
        this.addChild(atkBgSprite);

        var lvIcon = cc.LabelTTF.create("LV:", "STHeitiTC-Medium", 20);
        lvIcon.setAnchorPoint(cc.p(0, 0.5));
        lvIcon.setPosition(this._cardDetailsFit.lvIconPoint);
        this.addChild(lvIcon);

        var hpIcon = cc.LabelTTF.create("生命:", "STHeitiTC-Medium", 20);
        hpIcon.setAnchorPoint(cc.p(0, 0.5));
        hpIcon.setPosition(this._cardDetailsFit.hpIconPoint);
        this.addChild(hpIcon);

        var atkIcon = cc.LabelTTF.create("攻击:", "STHeitiTC-Medium", 20);
        atkIcon.setAnchorPoint(cc.p(0, 0.5));
        atkIcon.setPosition(this._cardDetailsFit.atkIconPoint);
        this.addChild(atkIcon);

        var lvLabel = cc.LabelTTF.create(this._card.get("lv") + " / " + this._card.get("maxLv"), "STHeitiTC-Medium", 20);
        lvLabel.setPosition(this._cardDetailsFit.lvLabelPoint);
        this.addChild(lvLabel);

        this._hpLabel = cc.LabelTTF.create(this._card.get("hp"), "STHeitiTC-Medium", 20);
        this._hpLabel.setPosition(this._cardDetailsFit.hpLabelPoint);
        this.addChild(this._hpLabel);

        this._atkLabel = cc.LabelTTF.create(this._card.get("atk"), "STHeitiTC-Medium", 20);
        this._atkLabel.setPosition(this._cardDetailsFit.atkLabelPoint);
        this.addChild(this._atkLabel);

        var potentialLv = this._card.get("potentialLv");

        var potentialLvIcon = cc.Sprite.create(main_scene_image.icon462);
        potentialLvIcon.setPosition(this._cardDetailsFit.potentialLvIconPoint);
        potentialLvIcon.setVisible(this._card.isLeadCard());
        this.addChild(potentialLvIcon);

        var potentialLvLabel = StrokeLabel.create(potentialLv, "STHeitiTC-Medium", 28);
        potentialLvLabel.setPosition(cc.p(21, 20));
        potentialLvLabel.setColor(cc.c3b(255, 255, 255));
        potentialLvLabel.setBgColor(cc.c3b(0, 0, 0));
        potentialLvIcon.addChild(potentialLvLabel);

        if (potentialLv > 0) {
            var addition = this._card.getPotentialLvAddition();

            var hpAdditionLabel = ColorLabelTTF.create(
                {
                    string: "(",
                    fontName: "STHeitiTC-Medium",
                    fontSize: 22,
                    color: cc.c3b(178, 255, 13)
                },
                {
                    iconName: "icon465",
                    offset: cc.p(0, 2)
                },
                {
                    string: addition + "%)",
                    fontName: "STHeitiTC-Medium",
                    fontSize: 22,
                    color: cc.c3b(178, 255, 13)
                }
            );
            hpAdditionLabel.setAnchorPoint(cc.p(0, 0.5));
            hpAdditionLabel.setPosition(this._cardDetailsFit.hpAdditionLabelPoint);
            this.addChild(hpAdditionLabel);

            var atkAdditionLabel = ColorLabelTTF.create(
                {
                    string: "(",
                    fontName: "STHeitiTC-Medium",
                    fontSize: 22,
                    color: cc.c3b(178, 255, 13)
                },
                {
                    iconName: "icon465",
                    offset: cc.p(0, 2)
                },
                {
                    string: addition + "%)",
                    fontName: "STHeitiTC-Medium",
                    fontSize: 22,
                    color: cc.c3b(178, 255, 13)
                }
            );
            atkAdditionLabel.setAnchorPoint(cc.p(0, 0.5));
            atkAdditionLabel.setPosition(this._cardDetailsFit.atkAdditionLabelPoint);
            this.addChild(atkAdditionLabel);
        }
        var description = lz.format(this._card.get("description"), 9);
        var len = description.length;
        for (var i = 0; i < len; ++i) {
            var descriptionLabel = cc.LabelTTF.create(description[i], "STHeitiTC-Medium", 20);
            descriptionLabel.setAnchorPoint(cc.p(0, 0.5));
            descriptionLabel.setPosition(cc.p(this._cardDetailsFit.descriptionLabelBasePoint.x, this._cardDetailsFit.descriptionLabelBasePoint.y - i * this._cardDetailsFit.descriptionLabelOffsetY));
            this.addChild(descriptionLabel);
        }

        var skillIcon = cc.LabelTTF.create("主动技能:", "STHeitiTC-Medium", 30);
        skillIcon.setColor(cc.c3b(255, 248, 69));
        skillIcon.setAnchorPoint(cc.p(0, 0.5));
        skillIcon.setPosition(this._cardDetailsFit.skillIconPoint);
        this.addChild(skillIcon);

        var passiveSkillIcon = cc.LabelTTF.create("被动效果:", "STHeitiTC-Medium", 30);
        passiveSkillIcon.setColor(cc.c3b(255, 248, 69));
        passiveSkillIcon.setAnchorPoint(cc.p(0, 0.5));
        passiveSkillIcon.setPosition(this._cardDetailsFit.passiveSkillIconPoint);
        this.addChild(passiveSkillIcon);

        var groupSkillIcon = cc.LabelTTF.create("情缘:", "STHeitiTC-Medium", 30);
        groupSkillIcon.setColor(cc.c3b(255, 248, 69));
        groupSkillIcon.setAnchorPoint(cc.p(0, 0.5));
        groupSkillIcon.setPosition(this._cardDetailsFit.groupSkillIconPoint);
        this.addChild(groupSkillIcon);

        var closeItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            main_scene_image.icon36,
            this._onClickClose,
            this
        );
        closeItem.setPosition(this._cardDetailsFit.closeItemPoint);

        var menu = cc.Menu.create(closeItem);
        menu.setTouchPriority(CARD_DETAILS_LAYER_HANDLER_PRIORITY);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        if (this._card.isExpCard()) {
            this._expCardSkillDesc();
            this._expCardPassiveSkillDesc();
            this._expCardGroupSkillDesc();
        } else {
            this._cardSkillDesc();
            this._cardPassiveSkillDesc();
            this._cardGroupSkillDesc();
        }


        return true;
    },

    _updatePassiveSkill: function () {
        cc.log("CardDetails _updatePassiveSkill");

        this._atkLabel.setString(this._card.get("atk"));
        this._hpLabel.setString(this._card.get("hp"));

        if (this._passiveSkillLayer) {
            this._passiveSkillLayer.removeFromParent();
            this._passiveSkillLayer = null;
        }

        this._passiveSkillLayer = cc.Layer.create();
        this.addChild(this._passiveSkillLayer);

        if (this._card.hasPassiveSkill()) {
            var passiveSkill = this._card.getActivePassiveSkill();
            var x = this._cardDetailsFit.passiveSkillOffsetX;

            for (var key in passiveSkill) {

                var value = passiveSkill[key].value.toFixed(1);
                x += 190;

                passiveSkillIcon = cc.Sprite.create(main_scene_image.icon275);
                passiveSkillIcon.setAnchorPoint(cc.p(0, 0.5));
                passiveSkillIcon.setPosition(cc.p(x, this._cardDetailsFit.passiveSkillIconPointY));
                this._passiveSkillLayer.addChild(passiveSkillIcon);
                passiveSkillIcon.setScale(0.8);

                var passiveSkillNameLabel = cc.LabelTTF.create(passiveSkill[key].description, "STHeitiTC-Medium", 20);
                passiveSkillNameLabel.setAnchorPoint(cc.p(0, 0.5));
                passiveSkillNameLabel.setPosition(cc.p(x + 30, this._cardDetailsFit.passiveSkillNameLabelPointY));
                this._passiveSkillLayer.addChild(passiveSkillNameLabel);

                var passiveSkillValueLabel = cc.LabelTTF.create("+ " + value + "%", "STHeitiTC-Medium", 20);
                passiveSkillValueLabel.setPosition(cc.p(x + 120, this._cardDetailsFit.passiveSkillValueLabelPointY));
                this._passiveSkillLayer.addChild(passiveSkillValueLabel);

                var table = outputTables.passive_skill_config.rows[this._card.get("star")];

                if (value == table.full_attribute) {
                    passiveSkillValueLabel.setString("+ " + value + "% (满)");
                } else {
                    passiveSkillValueLabel.setString("+ " + value + "%");
                }

                if (value >= table.yellow_attribute) {
                    passiveSkillValueLabel.setColor(cc.c3b(255, 248, 69));
                } else if (value >= table.blue_attribute) {
                    passiveSkillValueLabel.setColor(cc.c3b(105, 218, 255));
                } else {
                    passiveSkillValueLabel.setColor(cc.c3b(118, 238, 60));
                }
            }

            this._updatePassiveSkillEffect = cc.BuilderReader.load(main_scene_image.uiEffect105, this);
            this._updatePassiveSkillEffect.setAnchorPoint(cc.p(0, 0.5));
            this._updatePassiveSkillEffect.setPosition(this._cardDetailsFit.updatePassiveSKillItemPoint);
            this._updatePassiveSkillEffect.controller.ccbMenu.setTouchPriority(CARD_DETAILS_LAYER_HANDLER_PRIORITY);

            this.addChild(this._updatePassiveSkillEffect);
        } else {
            var tipLabel = cc.LabelTTF.create("无", "STHeitiTC-Medium", 20);
            tipLabel.setAnchorPoint(cc.p(0, 0.5));
            tipLabel.setPosition(this._cardDetailsFit.tipLabel3Point);
            this._passiveSkillLayer.addChild(tipLabel);

            var str = "三星以上拥有被动效果";
            var star = this._card.get("star");

            if (star === 3) {
                str = "三星卡拥有一个被动效果"
            } else if (star === 4) {
                str = "四星卡拥有两个被动效果"
            } else if (star === 5) {
                str = "五星卡拥有三个被动效果"
            }

            var tipDescriptionLabel = cc.LabelTTF.create(str + "，具体属性随机生成。", "STHeitiTC-Medium", 20);
            tipDescriptionLabel.setAnchorPoint(cc.p(0, 0.5));
            tipDescriptionLabel.setPosition(this._cardDetailsFit.tipDescriptionLabel3Point);
            this._passiveSkillLayer.addChild(tipDescriptionLabel);
        }
    },

    _cardSkillDesc: function () {
        cc.log("CardDetails _cardSkillDesc");

        if (this._card.hasSkill()) {
            var skillNameLabel = cc.LabelTTF.create(this._card.get("skillName"), "STHeitiTC-Medium", 20);
            skillNameLabel.setAnchorPoint(cc.p(0, 0.5));
            skillNameLabel.setPosition(this._cardDetailsFit.skillNameLabelPoint);
            this.addChild(skillNameLabel);

            var skillDescriptionLabel = cc.LabelTTF.create(this._card.get("skillDescription"), "STHeitiTC-Medium", 20);
            skillDescriptionLabel.setAnchorPoint(cc.p(0, 0.5));
            skillDescriptionLabel.setPosition(this._cardDetailsFit.skillDescriptionLabelPoint);
            this.addChild(skillDescriptionLabel);

            var skillRateIcon = cc.LabelTTF.create("触发概率:", "STHeitiTC-Medium", 20);
            skillRateIcon.setAnchorPoint(cc.p(0, 0.5));
            skillRateIcon.setPosition(this._cardDetailsFit.skillRateIconPoint);
            this.addChild(skillRateIcon);

            var skillHarmIcon = cc.LabelTTF.create(this._card.getSkillType() + "效果:", "STHeitiTC-Medium", 20);
            skillHarmIcon.setAnchorPoint(cc.p(0, 0.5));
            skillHarmIcon.setPosition(this._cardDetailsFit.skillHarmIconPoint);
            this.addChild(skillHarmIcon);

            var skillRateLabel = cc.LabelTTF.create(this._card.get("skillRate") + "%", "STHeitiTC-Medium", 20);
            skillRateLabel.setAnchorPoint(cc.p(0, 0.5));
            skillRateLabel.setPosition(this._cardDetailsFit.skillRateLabelPoint);
            this.addChild(skillRateLabel);

            var skillHarm = this._card.get("skillHarm");
            var str = "";
            if (skillHarm instanceof Array) {
                str = skillHarm[0] + "% ~ " + skillHarm[1] + "%";
            } else {
                str = skillHarm + "%";
            }
            skillHarmLabel = cc.LabelTTF.create(str, "STHeitiTC-Medium", 20);
            skillHarmLabel.setAnchorPoint(cc.p(0, 0.5));
            skillHarmLabel.setPosition(this._cardDetailsFit.skillHarmLabelPoint);
            this.addChild(skillHarmLabel);

            var skillLvIcon = cc.LabelTTF.create("技能等级:", "STHeitiTC-Medium", 18);
            skillLvIcon.setAnchorPoint(cc.p(0, 0.5));
            skillLvIcon.setPosition(this._cardDetailsFit.skillLvIconPoint);
            this.addChild(skillLvIcon);

            var skillLvLabel = cc.LabelTTF.create(
                this._card.get("skillLv") + " / " + this._card.get("skillMaxLv"),
                "STHeitiTC-Medium",
                18
            );
            skillLvLabel.setPosition(this._cardDetailsFit.skillLvLabelPoint);
            this.addChild(skillLvLabel);
        } else {
            var tipLabel = cc.LabelTTF.create("无", "STHeitiTC-Medium", 20);
            tipLabel.setAnchorPoint(cc.p(0, 0.5));
            tipLabel.setPosition(this._cardDetailsFit.tipLabelPoint);
            this.addChild(tipLabel);

            var tipDescriptionLabel = cc.LabelTTF.create("三星以上拥有主动技能。", "STHeitiTC-Medium", 20);
            tipDescriptionLabel.setAnchorPoint(cc.p(0, 0.5));
            tipDescriptionLabel.setPosition(this._cardDetailsFit.tipDescriptionLabelPoint);
            this.addChild(tipDescriptionLabel);
        }
    },

    _expCardSkillDesc: function () {
        cc.log("CardDetails _expCardSkillDesc");

        var tipLabel = cc.LabelTTF.create("无", "STHeitiTC-Medium", 20);
        tipLabel.setAnchorPoint(cc.p(0, 0.5));
        tipLabel.setPosition(this._cardDetailsFit.tipLabelPoint);
        this.addChild(tipLabel);

        var tipDescriptionLabel = cc.LabelTTF.create("当我拥有了技能，我将统治仙界。", "STHeitiTC-Medium", 20);
        tipDescriptionLabel.setAnchorPoint(cc.p(0, 0.5));
        tipDescriptionLabel.setPosition(this._cardDetailsFit.tipDescriptionLabelPoint);
        this.addChild(tipDescriptionLabel);

    },

    _cardPassiveSkillDesc: function () {
        cc.log("CardDetails _cardPassiveSkillDesc");
        this._updatePassiveSkill();
    },

    _expCardPassiveSkillDesc: function () {
        cc.log("CardDetails _expCardPassiveSkillDesc");

        var tipLabel = cc.LabelTTF.create("无", "STHeitiTC-Medium", 20);
        tipLabel.setAnchorPoint(cc.p(0, 0.5));
        tipLabel.setPosition(this._cardDetailsFit.tipLabel3Point);
        this.addChild(tipLabel);

        var tipDescriptionLabel = cc.LabelTTF.create("你信不信我能让你的等级突飞猛进。不信？多试几张。", "STHeitiTC-Medium", 20);
        tipDescriptionLabel.setAnchorPoint(cc.p(0, 0.5));
        tipDescriptionLabel.setPosition(this._cardDetailsFit.tipDescriptionLabel3Point);
        this.addChild(tipDescriptionLabel);
    },

    _cardGroupSkillDesc: function () {
        cc.log("CardDetails _cardGroupSkillDesc");

        var name = "无";
        var desc = "5星以上卡牌拥有组合技能";
        var color = cc.c3b(255, 255, 255);

        if (this._card.get("star") >= 5) {
            //目前这有一个组合技能
            var groupSkill = this._card.getGroupSkill(0);
            name = groupSkill.name || "无";
            desc = groupSkill.desc ? groupSkill.desc + (groupSkill.atk ? "， 攻击+" + groupSkill.atk + "%" : "") + (groupSkill.hp ? "， 生命+" + groupSkill.hp + "%" : "") : "暂无组合技能";
            color = groupSkill.isActive ? cc.c3b(255, 215, 57) : cc.c3b(116, 98, 91);
        }

        var groupSkillNameLabel = cc.LabelTTF.create(name, "STHeitiTC-Medium", 20);
        groupSkillNameLabel.setAnchorPoint(cc.p(0, 0.5));
        groupSkillNameLabel.setPosition(this._cardDetailsFit.groupSkillNameLabelPoint);
        this.addChild(groupSkillNameLabel);

        var groupSkillDescLabel = cc.LabelTTF.create(desc, "STHeitiTC-Medium", 20);
        groupSkillDescLabel.setAnchorPoint(cc.p(0, 0.5));
        groupSkillDescLabel.setPosition(this._cardDetailsFit.groupSkillDescLabelPoint);
        groupSkillDescLabel.setColor(color);
        this.addChild(groupSkillDescLabel);
    },

    _expCardGroupSkillDesc: function () {
        cc.log("CardDetails _expCardGroupSkillDesc");

        var tipLabel = cc.LabelTTF.create("无", "STHeitiTC-Medium", 20);
        tipLabel.setAnchorPoint(cc.p(0, 0.5));
        tipLabel.setPosition(this._cardDetailsFit.tipLabel2Point);
        this.addChild(tipLabel);

        var tipDescriptionLabel = cc.LabelTTF.create("你见过像我这么萌的神仙么", "STHeitiTC-Medium", 20);
        tipDescriptionLabel.setAnchorPoint(cc.p(0, 0.5));
        tipDescriptionLabel.setPosition(this._cardDetailsFit.tipDescriptionLabel2Point);
        this.addChild(tipDescriptionLabel);
    },

    hideMenu: function () {
        cc.log("CardDetails hideMenu");

        if (this._updatePassiveSkillEffect) {
            this._updatePassiveSkillEffect.setVisible(false);
        }
    },

    showMenu: function () {
        cc.log("CardDetails showMenu");

        this._menu.setVisible(true);
    },

    ccbFnUpdatePassiveSKill: function () {
        cc.log("CardDetails ccbFnUpdatePassiveSKill");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var that = this;
        var cb = function (id) {
            if (id != that._card.getActivePassiveSkillId()) {
                that._card.activePassiveSkill(function () {
                    that._updatePassiveSkill();
                }, id);
            }
        };

        var res = PassiveSkillLabel.create(
            {
                card: this._card,
                cb: cb
            }
        );

        this.addChild(res, 10);
    },

    _onClickClose: function () {
        cc.log("CardDetails _onClickClose");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

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

CardDetails.pop = function (card, cb) {
    var cardDetails = CardDetails.create(card, cb);

    cc.Director.getInstance().getRunningScene().addChild(cardDetails, 1);

    return cardDetails;
};