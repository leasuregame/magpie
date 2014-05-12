/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-8-13
 * Time: 下午4:54
 * To change this template use File | Settings | File Templates.
 */


/*
 * card evolution layer
 * */


var CardEvolutionLabel = cc.Layer.extend({
    _cardEvolutionLayerFit: null,

    _leadCard: null,
    _retinueCard: [],
    _leadCardHalfNode: null,
    _tipLabel: null,
    _helpLabel: null,
    _moneyLabel: null,
    _cardCountLabel: null,
    _resLabel: null,
    _nameLabel: null,
    _evolutionRateLabel: null,
    _selectRetinueCardItem: null,
    _evolutionItem: null,
    _selectLeadCardIcon: null,

    _evolutionEffect: null,
    _index: null,
    _newCard: null,
    _virtualCard: null,

    _cardLvLabel: [],
    _cardHpLabel: [],
    _cardAtkLabel: [],
    _cardSkillRateLabel: [],
    _cardPssSkillLabel: [],
    _oldStarIcon: [],
    _newStarIcon: [],
    _resBgIcon: [],
    _resBgIcon2: [],

    onEnter: function () {
        cc.log("CardEvolutionLayer onEnter");

        this._super();
        this.update();

        lz.um.beginLogPageView("卡牌升星界面");
    },

    onExit: function () {
        cc.log("CardEvolutionLayer onExit");

        this._super();

        lz.um.endLogPageView("卡牌升星界面");
    },

    init: function () {
        cc.log("CardEvolutionLayer init");

        if (!this._super()) return false;

        this._cardEvolutionLayerFit = gameFit.mainScene.cardEvolutionLayer;

        var cardBgSpritePoint = this._cardEvolutionLayerFit.cardBgSpritePoint;
        var cardBgSprite = cc.Sprite.create(main_scene_image.icon336);
        cardBgSprite.setPosition(cc.p(cardBgSpritePoint.x - 145, cardBgSpritePoint.y));
        this.addChild(cardBgSprite);

        var cardBgSprite2 = cc.Sprite.create(main_scene_image.icon336);
        cardBgSprite2.setPosition(cc.p(cardBgSpritePoint.x + 145, cardBgSpritePoint.y));
        this.addChild(cardBgSprite2);

        this._resLabel = cc.Node.create();
        this._resLabel.setPosition(this._cardEvolutionLayerFit.resLabelPoint);
        this.addChild(this._resLabel);


        var icons = ["icon337", "icon426"];

        for (var i = 0; i < 2; ++i) {

            this._resBgIcon[i] = cc.Sprite.create(main_scene_image[icons[i]]);
            this._resBgIcon[i].setPosition(cc.p(-145, 0));
            this._resLabel.addChild(this._resBgIcon[i]);

            this._resBgIcon2[i] = cc.Sprite.create(main_scene_image[icons[i]]);
            this._resBgIcon2[i].setPosition(cc.p(145, 0));
            this._resLabel.addChild(this._resBgIcon2[i]);

            this._cardLvLabel[i] = cc.LabelTTF.create("0/0", "STHeitiTC-Medium", 22);
            this._cardLvLabel[i].setPosition(-140 + i * 290, 82);
            this._resLabel.addChild(this._cardLvLabel[i], 1);

            this._cardHpLabel[i] = cc.LabelTTF.create("0", "STHeitiTC-Medium", 22);
            this._cardHpLabel[i].setPosition(-140 + i * 290, 41);
            this._resLabel.addChild(this._cardHpLabel[i], 1);

            this._cardAtkLabel[i] = cc.LabelTTF.create("0", "STHeitiTC-Medium", 22);
            this._cardAtkLabel[i].setPosition(-140 + i * 290, 0);
            this._resLabel.addChild(this._cardAtkLabel[i], 1);

            this._cardSkillRateLabel[i] = cc.LabelTTF.create("0%", "STHeitiTC-Medium", 22);
            this._cardSkillRateLabel[i].setPosition(-95 + i * 290, -41);
            this._resLabel.addChild(this._cardSkillRateLabel[i], 1);

            this._cardPssSkillLabel[i] = cc.LabelTTF.create("0", "STHeitiTC-Medium", 22);
            this._cardPssSkillLabel[i].setPosition(-95 + i * 290, -82);
            this._resLabel.addChild(this._cardPssSkillLabel[i], 1);

            if (i == 1) {
                var color = cc.c3b(118, 238, 60);

                this._cardLvLabel[i].setColor(color);
                this._cardHpLabel[i].setColor(color);
                this._cardAtkLabel[i].setColor(color);
                this._cardSkillRateLabel[i].setColor(color);
                this._cardPssSkillLabel[i].setColor(color);
            }
        }

        var successBgIcon = cc.Sprite.create(main_scene_image.icon338);
        successBgIcon.setPosition(this._cardEvolutionLayerFit.successBgIconPoint);
        this.addChild(successBgIcon);

        var helpBgSprite = cc.Sprite.create(main_scene_image.icon50);
        helpBgSprite.setPosition(this._cardEvolutionLayerFit.helpBgSpritePoint);
        this.addChild(helpBgSprite);

        this._evolutionRateLabel = cc.LabelTTF.create("0%", "STHeitiTC-Medium", 24);
        this._evolutionRateLabel.setPosition(this._cardEvolutionLayerFit.evolutionRatePoint);
        this.addChild(this._evolutionRateLabel);

        var point = this._cardEvolutionLayerFit.starPoint;
        for (var i = 0; i < MAX_CARD_STAR; ++i) {
            var x = point.x - 240;
            var y = point.y - 30 * i;
            var starBgIcon = cc.Sprite.create(main_scene_image.icon339);
            starBgIcon.setPosition(cc.p(x, y));
            this.addChild(starBgIcon);

            this._oldStarIcon[i] = cc.Sprite.create(main_scene_image.star1);
            this._oldStarIcon[i].setScaleX(0.8);
            this._oldStarIcon[i].setScaleY(0.75);
            this._oldStarIcon[i].setPosition(cc.p(x, y));
            this.addChild(this._oldStarIcon[i], 2);

            x = point.x + 240;
            var starBgIcon2 = cc.Sprite.create(main_scene_image.icon339);
            starBgIcon2.setPosition(cc.p(x, y));
            this.addChild(starBgIcon2);

            this._newStarIcon[i] = cc.Sprite.create(main_scene_image.star1);
            this._newStarIcon[i].setScaleX(0.8);
            this._newStarIcon[i].setScaleY(0.75);
            this._newStarIcon[i].setPosition(cc.p(x, y));
            this.addChild(this._newStarIcon[i], 2);
        }

        this._tipLabel = cc.Node.create();
        this._tipLabel.setPosition(this._cardEvolutionLayerFit.tipLabelPoint);
        this.addChild(this._tipLabel);

        var tipLabel1 = cc.LabelTTF.create("卡牌消耗素材卡和精元进行升星", "STHeitiTC-Medium", 22);
        tipLabel1.setPosition(cc.p(0, 20));
        this._tipLabel.addChild(tipLabel1);

        var tipLabel2 = cc.LabelTTF.create("进阶失败主卡保留，素材卡和精元消失", "STHeitiTC-Medium", 22);
        tipLabel2.setPosition(cc.p(0, -20));
        this._tipLabel.addChild(tipLabel2);


        this._helpLabel = cc.Node.create();
        this._helpLabel.setPosition(this._cardEvolutionLayerFit.helpLabelPoint);
        this.addChild(this._helpLabel);

        var moneyIcon = cc.LabelTTF.create("消耗仙币:", "STHeitiTC-Medium", 22);
        moneyIcon.setPosition(cc.p(-160, 20));
        this._helpLabel.addChild(moneyIcon);

        this._cardCountIcon = cc.LabelTTF.create("从牌数量:", "STHeitiTC-Medium", 22);
        this._cardCountIcon.setPosition(cc.p(120, 20));
        this._helpLabel.addChild(this._cardCountIcon);

        var superHonorIcon = ColorLabelTTF.create(
            {
                string: "消耗精元",
                fontName: "STHeitiTC-Medium",
                fontSize: 22
            },
            {
                iconName: "superHonor",
                scale: 0.8
            }
        );
        superHonorIcon.setPosition(cc.p(-40, 0));
        this._helpLabel.addChild(superHonorIcon);

        this._moneyLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 22);
        this._moneyLabel.setAnchorPoint(cc.p(0, 0.5));
        this._moneyLabel.setPosition(cc.p(-100, 18));
        this._helpLabel.addChild(this._moneyLabel);

        this._cardCountLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 22);
        this._cardCountLabel.setAnchorPoint(cc.p(0, 0.5));
        this._cardCountLabel.setPosition(cc.p(200, 18));
        this._helpLabel.addChild(this._cardCountLabel);

        this._superHonorLabel = cc.LabelTTF.create("0/0", "STHeitiTC-Medium", 22);
        this._superHonorLabel.setAnchorPoint(cc.p(0, 0.5));
        this._superHonorLabel.setPosition(cc.p(25, -26));
        this._helpLabel.addChild(this._superHonorLabel);

        var selectLeadCardItem = cc.MenuItemImage.create(
            main_scene_image.card_frame1,
            main_scene_image.card_frame_s,
            this._onClickSelectLeadCard,
            this
        );
        selectLeadCardItem.setScale(1.1);
        selectLeadCardItem.setPosition(this._cardEvolutionLayerFit.selectLeadCardItemPoint);

        var newCardItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.card_frame1,
            main_scene_image.card_frame1,
            main_scene_image.icon340,
            this._onClickNewCard,
            this
        );
        newCardItem.setEnabled(false);
        newCardItem.setPosition(this._cardEvolutionLayerFit.newCardItemPoint);
        newCardItem.setScale(1.1);

        this._evolutionItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            main_scene_image.icon84,
            this._onClickEvolution,
            this
        );
        this._evolutionItem.setPosition(this._cardEvolutionLayerFit.evolutionItemPoint);

        this._selectRetinueCardItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            main_scene_image.icon53,
            this._onClickSelectRetinueCard,
            this
        );
        this._selectRetinueCardItem.setPosition(this._cardEvolutionLayerFit.selectRetinueCardItemPoint);

        var helpItem = cc.MenuItemImage.create(
            main_scene_image.button41,
            main_scene_image.button41s,
            this._onClickHelp,
            this
        );

        helpItem.setPosition(this._cardEvolutionLayerFit.helpItemPoint);

        var menu = cc.Menu.create(selectLeadCardItem, newCardItem, this._selectRetinueCardItem, this._evolutionItem, helpItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        this._selectLeadCardIcon = cc.Sprite.create(main_scene_image.icon51);
        this._selectLeadCardIcon.setPosition(this._cardEvolutionLayerFit.selectLeadCardIconPoint);
        this.addChild(this._selectLeadCardIcon);

        return true;
    },

    update: function () {
        cc.log("CardEvolutionLayer update");

        if (this._leadCardHalfNode != null) {
            this._leadCardHalfNode.removeFromParent();
            this._leadCardHalfNode = null;
        }

        if (this._newCard) {
            this._newCard.removeFromParent();
            this._newCard = null;
        }

        for (var i = 0; i < MAX_CARD_STAR; i++) {
            this._newStarIcon[i].setVisible(false);
            this._oldStarIcon[i].setVisible(false);
        }

        if (this._leadCard == null) {
            this._retinueCard = [];

            this._selectLeadCardIcon.stopAllActions();
            this._selectLeadCardIcon.setOpacity(255);

            this._selectLeadCardIcon.runAction(
                cc.RepeatForever.create(
                    cc.Sequence.create(
                        cc.FadeOut.create(1),
                        cc.FadeIn.create(1)
                    )
                )
            );

            for (var i = 0; i < MAX_CARD_STAR; i++) {
                this._oldStarIcon[i].setVisible(false);
                this._newStarIcon[i].setVisible(false);
            }

            this._resLabel.setVisible(false);
            this._helpLabel.setVisible(false);
            this._evolutionRateLabel.setVisible(false);
            this._tipLabel.setVisible(true);

            this._selectRetinueCardItem.setEnabled(false);
            this._evolutionItem.setEnabled(false);
        } else {
            this._leadCardHalfNode = CardHalfNode.create(this._leadCard);
            this._leadCardHalfNode.setScale(1.1);
            this._leadCardHalfNode.setPosition(this._cardEvolutionLayerFit.selectLeadCardItemPoint);
            this.addChild(this._leadCardHalfNode, 1);

            this._resLabel.setVisible(true);

            var star = this._leadCard.get("star");

            var str1, str2;
            if (star < 5) {
                str1 = (star < 3) ? 0 : star - 2;
                str2 = str1 + 1;
            } else {
                str1 = outputTables.passive_skill_config.rows[star].full_attribute;
                str2 = outputTables.passive_skill_config.rows[Math.min(star + 1, MAX_CARD_STAR)].full_attribute;
            }

            this._cardPssSkillLabel[0].setString(str1);

            var needMoney = this._leadCard.getEvolutionNeedMoney();
            var needSuperHonor = this._leadCard.getEvolutionNeedSuperHonor();
            var player = gameData.player;

            this._cardCountIcon.setString(outputTables.star_upgrade.rows[star].source_card_star + "星从卡数量:");
            this._evolutionRateLabel.setString(player.getEvolutionRate(star) + "%");
            this._cardCountLabel.setString("0");
            this._moneyLabel.setString(needMoney);
            this._superHonorLabel.setString(needSuperHonor + "/" + player.get("superHonor"));

            if (needMoney > player.get("money")) {
                this._moneyLabel.setColor(cc.c3b(255, 40, 40));
            } else {
                this._moneyLabel.setColor(cc.c3b(255, 255, 255));
            }

            if (needSuperHonor > player.get("superHonor")) {
                this._superHonorLabel.setColor(cc.c3b(255, 40, 40));
            } else {
                this._superHonorLabel.setColor(cc.c3b(255, 255, 255));
            }

            this._cardLvLabel[0].setString(this._leadCard.get("lv") + "/" + this._leadCard.get("maxLv"));
            this._cardHpLabel[0].setString(this._leadCard.get("hp"));
            this._cardAtkLabel[0].setString(this._leadCard.get("atk"));
            this._cardSkillRateLabel[0].setString(this._leadCard.get("skillRate") + "%");


            for (var i = 0; i < star; i++) {
                this._oldStarIcon[i].setVisible(true);
            }

            if (star < MAX_CARD_STAR) {
                this._virtualCard = lz.clone(this._leadCard);
                this._virtualCard.set("tableId", this._leadCard.get("tableId") + 1);
                this._virtualCard.update();

                this._cardLvLabel[1].setString(this._virtualCard.get("lv") + "/" + this._virtualCard.get("maxLv"));
                this._cardHpLabel[1].setString(this._virtualCard.get("hp"));
                this._cardAtkLabel[1].setString(this._virtualCard.get("atk"));
                this._cardSkillRateLabel[1].setString(this._virtualCard.get("skillRate") + "%");

                this._cardPssSkillLabel[1].setString(str2);

                for (var i = 0; i <= star; i++) {
                    this._newStarIcon[i].setVisible(true);
                }

                this._newCard = CardHalfNode.create(this._virtualCard);
                this._newCard.setScale(1.1);
                this._newCard.setPosition(this._cardEvolutionLayerFit.newCardItemPoint);
                this.addChild(this._newCard, 1);
            }

            this._resBgIcon[0].setVisible(star < 5);
            this._resBgIcon2[0].setVisible(star < 5);
            this._resBgIcon[1].setVisible(star >= 5);
            this._resBgIcon2[1].setVisible(star >= 5);

            this._helpLabel.setVisible(true);
            this._tipLabel.setVisible(false);
            this._evolutionRateLabel.setVisible(true);
            this._selectRetinueCardItem.setEnabled(true);
            this._evolutionItem.setEnabled(false);

        }

        var cardCount = this._retinueCard.length;

        if (cardCount > 0) {
            var rate = this._leadCard.getPreCardRate() * cardCount + gameData.player.getEvolutionRate(star);
            rate = Math.min(rate, 100);

            this._evolutionRateLabel.setString(rate + "%");
            if (rate == 100) {
                this._evolutionRateLabel.setColor(cc.c3b(118, 238, 60));
            } else {
                this._evolutionRateLabel.setColor(cc.c3b(255, 255, 255));
            }
            this._cardCountLabel.setString(cardCount);
            this._evolutionItem.setEnabled(true);
        }
    },

    _update: function (state) {
        cc.log("CardEvolutionLayer _update: " + state);

        this._evolutionRateLabel.setColor(cc.c3b(255, 255, 255));
        this._retinueCard = [];

        if (state == EVOLUTION_SUCCESS) {
            this._leadCardHalfNode.removeFromParent();
            this._leadCardHalfNode = null;
            this._leadCard = null;

            this._cardLvLabel[0].setString("");
            this._cardHpLabel[0].setString("");
            this._cardAtkLabel[0].setString("");
            this._cardSkillRateLabel[0].setString("");
            this._cardPssSkillLabel[0].setString("");
            this._evolutionRateLabel.setString("");

            this._selectLeadCardIcon.stopAllActions();
            this._selectLeadCardIcon.setOpacity(255);

            this._selectLeadCardIcon.runAction(
                cc.RepeatForever.create(
                    cc.Sequence.create(
                        cc.FadeOut.create(1),
                        cc.FadeIn.create(1)
                    )
                )
            );

            for (var i = 0; i < MAX_CARD_STAR; i++) {
                this._oldStarIcon[i].setVisible(false);
            }
        } else {
            var star = this._leadCard.get("star");
            this._evolutionRateLabel.setString(gameData.player.getEvolutionRate(star) + "%");
            this._cardCountLabel.setString("0");
            this._evolutionItem.setEnabled(false);
        }
    },

    _onClickSelectLeadCard: function () {
        cc.log("CardEvolutionLayer _onClickSelectLeadCard");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var that = this;
        var cardListLayer = CardListLayer.create(SELECT_TYPE_CARD_EVOLUTION_MASTER, function (data) {
            cc.log(data);

            if (data) {
                that._leadCard = data[0] || null;
                that._retinueCard = [];
            }

            that.getParent().backToThisLayer();

            cc.log("this._leadCard :");
            cc.log(that._leadCard);
        }, {
            leadCard: this._leadCard
        });

        this.getParent().switchToCardListLayer(cardListLayer);
    },

    _onClickSelectRetinueCard: function () {
        cc.log("CardEvolutionLayer _onClickSelectRetinueCard");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var that = this;
        var cardListLayer = CardListLayer.create(SELECT_TYPE_CARD_EVOLUTION_RETINUE, function (data) {
            cc.log(data);

            if (data) {
                that._retinueCard = data;
            }
            that.getParent().backToThisLayer();

            cc.log("this._retinueCard :");
            cc.log(that._retinueCard);
        }, {
            leadCard: this._leadCard,
            retinueCard: this._retinueCard
        });

        this.getParent().switchToCardListLayer(cardListLayer);
    },

    _onClickEvolution: function () {
        cc.log("CardEvolutionLayer _onClickEvolution");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var money = gameData.player.get("money");
        var superHonor = gameData.player.get("superHonor");

        if (money < this._leadCard.getEvolutionNeedMoney()) {
            TipLayer.tip("仙币不足");
            return;
        }

        if (superHonor < this._leadCard.getEvolutionNeedSuperHonor()) {
            TipLayer.tip("精元不足");
            return;
        }

        var cardIdList = [];
        var len = this._retinueCard.length;
        for (var i = 0; i < len; ++i) {
            cardIdList.push(this._retinueCard[i].get("id"));
        }

        var card = lz.clone(this._leadCard);

        var that = this;
        this._leadCard.evolution(function (state) {
            cc.log("state = " + state);
            if (state != EVOLUTION_ERROR) {
                CardEvolutionLayer.pop({card: card, state: state});
            }
            that.scheduleOnce(function () {
                that._update(state);
            }, 0.5);
        }, cardIdList);
    },

    _onClickNewCard: function () {
        cc.log("CardEvolutionLayer _onClickNewCard");

        CardDetails.pop(this._virtualCard);
    },

    _onClickHelp: function () {
        cc.log("CardEvolutionLayer _onClickHelp");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        GameHelpLabel.pop(gameHelp["cardEvolution"]);
    }
});


CardEvolutionLabel.create = function () {
    var ret = new CardEvolutionLabel();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};