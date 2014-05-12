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


var CardUpgradeLabel = cc.Layer.extend({
    _cardUpgradeLabelFit: null,

    _leadCard: null,
    _retinueCard: [],
    _leadCardHalfNode: null,
    _tipLabel: null,
    _helpLabel: null,
    _expLabel: null,
    _moneyLabel: null,
    _expNeedLabel: null,
    _cardCountLabel: null,
    _resLabel: null,
    _hpLabel: null,
    _hpAdditionLabel: null,
    _atkLabel: null,
    _atkAdditionLabel: null,
    _lvLabel: null,
    _yellowProgress: null,
    _greenProgress: null,
    _selectRetinueCardItem: null,
    _upgradeItem: null,
    _selectLeadCardIcon: null,
    _money: null,
    _getExp: 0,
    _needExp: 0,
    _effect: null,

    onEnter: function () {
        cc.log("CardUpgradeLabel onEnter");

        this._super();
        this.update();

        lz.um.beginLogPageView("卡牌升级界面");
    },

    onExit: function () {
        cc.log("CardUpgradeLabel onExit");

        this._super();

        lz.um.endLogPageView("卡牌升级界面");
    },

    init: function () {
        cc.log("CardUpgradeLabel init");

        if (!this._super()) return false;

        this._cardUpgradeLabelFit = gameFit.mainScene.cardUpgradeLabel;

        var cardItemBgSprite = cc.Sprite.create(main_scene_image.icon48);
        cardItemBgSprite.setPosition(this._cardUpgradeLabelFit.cardItemBgSpritePoint);
        this.addChild(cardItemBgSprite);

        this._resLabel = cc.Node.create();
        this._resLabel.setPosition(this._cardUpgradeLabelFit.resLabelPoint);
        this.addChild(this._resLabel);

        var resLabelBgSprite = cc.Sprite.create(main_scene_image.icon49);
        this._resLabel.addChild(resLabelBgSprite);

        var hpIcon = cc.LabelTTF.create("生命:", "STHeitiTC-Medium", 22);
        hpIcon.setColor(cc.c3b(255, 239, 131));
        hpIcon.setPosition(cc.p(-85, 40));
        this._resLabel.addChild(hpIcon);

        this._hpLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 22);
        this._hpLabel.setPosition(cc.p(0, 38));
        this._resLabel.addChild(this._hpLabel);

        this._hpAdditionLabel = cc.LabelTTF.create("+ 0", "STHeitiTC-Medium", 22);
        this._hpAdditionLabel.setColor(cc.c3b(118, 238, 60));
        this._hpAdditionLabel.setPosition(cc.p(85, 38));
        this._resLabel.addChild(this._hpAdditionLabel);

        var atkIcon = cc.LabelTTF.create("攻击:", "STHeitiTC-Medium", 22);
        atkIcon.setColor(cc.c3b(255, 239, 131));
        atkIcon.setPosition(cc.p(-85, 5));
        this._resLabel.addChild(atkIcon);

        this._atkLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 22);
        this._atkLabel.setPosition(cc.p(0, 3));
        this._resLabel.addChild(this._atkLabel);

        this._atkAdditionLabel = cc.LabelTTF.create("+ 0", "STHeitiTC-Medium", 22);
        this._atkAdditionLabel.setColor(cc.c3b(118, 238, 60));
        this._atkAdditionLabel.setPosition(cc.p(85, 3));
        this._resLabel.addChild(this._atkAdditionLabel);

        this._lvLabel = StrokeLabel.create("0", "STHeitiTC-Medium", 35);
        this._lvLabel.setPosition(cc.p(-85, -35));
        this._resLabel.addChild(this._lvLabel);

        var progressBgSprite = cc.Sprite.create(main_scene_image.progress4);
        progressBgSprite.setPosition(cc.p(30, -35));
        this._resLabel.addChild(progressBgSprite);

        this._greenProgress = Progress.create(null, main_scene_image.progress6, 0, 1);
        this._greenProgress.setPosition(cc.p(30, -35));
        this._resLabel.addChild(this._greenProgress);

        this._yellowProgress = Progress.create(null, main_scene_image.progress5, 0, 1);
        this._yellowProgress.setPosition(cc.p(30, -35));
        this._resLabel.addChild(this._yellowProgress);

        var helpBgSprite = cc.Sprite.create(main_scene_image.icon50);
        helpBgSprite.setPosition(this._cardUpgradeLabelFit.helpBgSpritePoint);
        this.addChild(helpBgSprite);

        this._tipLabel = cc.LabelTTF.create("主卡通过吞噬从卡提升等级", "STHeitiTC-Medium", 22);
        this._tipLabel.setPosition(this._cardUpgradeLabelFit.tipLabelPoint);
        this.addChild(this._tipLabel);

        this._helpLabel = cc.Node.create();
        this._helpLabel.setPosition(this._cardUpgradeLabelFit.helpLabelPoint);
        this.addChild(this._helpLabel);

        var expIcon = cc.LabelTTF.create("获得经验:", "STHeitiTC-Medium", 22);
        expIcon.setPosition(cc.p(-180, 20));
        this._helpLabel.addChild(expIcon);

        var moneyIcon = cc.LabelTTF.create("消耗仙币:", "STHeitiTC-Medium", 22);
        moneyIcon.setPosition(cc.p(-180, -20));
        this._helpLabel.addChild(moneyIcon);

        var expNeedIcon = cc.LabelTTF.create("升级还需经验:", "STHeitiTC-Medium", 22);
        expNeedIcon.setPosition(cc.p(78, 20));
        this._helpLabel.addChild(expNeedIcon);

        var cardCountIcon = cc.LabelTTF.create("从牌数量:", "STHeitiTC-Medium", 22);
        cardCountIcon.setPosition(cc.p(100, -20));
        this._helpLabel.addChild(cardCountIcon);

        this._expLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 22);
        this._expLabel.setAnchorPoint(cc.p(0, 0.5));
        this._expLabel.setPosition(cc.p(-120, 18));
        this._helpLabel.addChild(this._expLabel);

        this._moneyLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 22);
        this._moneyLabel.setAnchorPoint(cc.p(0, 0.5));
        this._moneyLabel.setPosition(cc.p(-120, -22));
        this._helpLabel.addChild(this._moneyLabel);

        this._expNeedLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 22);
        this._expNeedLabel.setAnchorPoint(cc.p(0, 0.5));
        this._expNeedLabel.setPosition(cc.p(160, 18));
        this._helpLabel.addChild(this._expNeedLabel);

        this._cardCountLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 22);
        this._cardCountLabel.setAnchorPoint(cc.p(0, 0.5));
        this._cardCountLabel.setPosition(cc.p(160, -22));
        this._helpLabel.addChild(this._cardCountLabel);

        var selectLeadCardItem = cc.MenuItemImage.create(
            main_scene_image.card_frame1,
            main_scene_image.card_frame_s,
            this._onClickSelectLeadCard,
            this
        );
        selectLeadCardItem.setScale(1.1);
        selectLeadCardItem.setPosition(this._cardUpgradeLabelFit.selectLeadCardItemPoint);

        this._upgradeItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            main_scene_image.icon52,
            this._onClickUpgrade,
            this
        );
        this._upgradeItem.setPosition(this._cardUpgradeLabelFit.upgradeItemPoint);

        this._selectRetinueCardItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            main_scene_image.icon53,
            this._onClickSelectRetinueCard,
            this
        );
        this._selectRetinueCardItem.setPosition(this._cardUpgradeLabelFit.selectRetinueCardItemPoint);

        var helpItem = cc.MenuItemImage.create(
            main_scene_image.button41,
            main_scene_image.button41s,
            this._onClickHelp,
            this
        );

        helpItem.setPosition(this._cardUpgradeLabelFit.helpItemPoint);

        var menu = cc.Menu.create(
            helpItem,
            selectLeadCardItem,
            this._upgradeItem,
            this._selectRetinueCardItem
        );
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        this._selectLeadCardIcon = cc.Sprite.create(main_scene_image.icon51);
        this._selectLeadCardIcon.setPosition(this._cardUpgradeLabelFit.selectLeadCardIconPoint);
        this.addChild(this._selectLeadCardIcon);

        return true;
    },

    update: function () {
        cc.log("CardUpgradeLabel update");

        this._stopAllActions();
        this._addLeadCard();
        this._addRetinueCard();
    },

    _stopAllActions: function () {
        cc.log("CardUpgradeLabel _stopAllActions");

        this._lvLabel.stopAllActions();
        this._selectLeadCardIcon.stopAllActions();

        this._lvLabel.setOpacity(254);
        this._selectLeadCardIcon.setOpacity(254);
    },

    _addLeadCard: function () {
        cc.log("CardUpgradeLabel _addLeadCard");

        if (this._leadCardHalfNode != null) {
            this._leadCardHalfNode.removeFromParent();
            this._leadCardHalfNode = null;
        }

        if (this._leadCard == null) {
            this._retinueCard = [];

            this._selectLeadCardIcon.runAction(
                cc.RepeatForever.create(
                    cc.Sequence.create(
                        cc.FadeOut.create(1),
                        cc.FadeIn.create(1)
                    )
                )
            );

            this._selectRetinueCardItem.setEnabled(false);
            this._upgradeItem.setEnabled(false);

            this._tipLabel.setVisible(true);
            this._helpLabel.setVisible(false);
            this._resLabel.setVisible(false);
        } else {
            this._leadCardHalfNode = CardHalfNode.create(this._leadCard);
            this._leadCardHalfNode.setScale(1.1);
            this._leadCardHalfNode.setPosition(this._cardUpgradeLabelFit.leadCardHalfNodePoint);
            this.addChild(this._leadCardHalfNode, 1);

            this._hpLabel.setString(this._leadCard.get("hp"));
            this._hpAdditionLabel.setString("+ 0");
            this._atkLabel.setString(this._leadCard.get("atk"));
            this._atkAdditionLabel.setString("+ 0");

            this._moneyLabel.setColor(cc.c3b(255, 255, 255));

            this._expLabel.setString("0");
            this._moneyLabel.setString("0");
            cc.log(this._leadCard.getCardFullLvNeedExp());
            this._expNeedLabel.setString(this._leadCard.getCardNextLvNeedExp());
            this._cardCountLabel.setString("0");

            this._lvLabel.setString(this._leadCard.get("lv"));
            this._yellowProgress.setAllValue(this._leadCard.get("exp"), this._leadCard.get("maxExp"));
            this._greenProgress.setAllValue(0, 1);

            this._selectRetinueCardItem.setEnabled(true);
            this._upgradeItem.setEnabled(false);

            this._tipLabel.setVisible(false);
            this._helpLabel.setVisible(true);
            this._resLabel.setVisible(true);
        }
    },

    _addRetinueCard: function () {
        cc.log("CardUpgradeLabel _addRetinueCard");

        var cardCount = this._retinueCard.length;

        if (cardCount > 0) {
            var exp = 0;

            for (var i = 0; i < cardCount; ++i) {
                exp += this._retinueCard[i].getCardExp();
            }

            var dummyCard = lz.clone(this._leadCard);

            this._money = dummyCard.addExp(exp);
            this._getExp = exp;
            this._hpAdditionLabel.setString("+ " + (dummyCard.get("hp") - this._leadCard.get("hp")));
            this._atkAdditionLabel.setString("+ " + (dummyCard.get("atk") - this._leadCard.get("atk")));

            this._expLabel.setString(exp);
            this._moneyLabel.setString(this._money);
            this._needExp = this._leadCard.getCardNextLvNeedExp();
            this._expNeedLabel.setString(this._needExp);
            this._cardCountLabel.setString(cardCount);

            if (this._money > gameData.player.get("money")) {
                this._moneyLabel.setColor(cc.c3b(255, 40, 40));
            } else {
                this._moneyLabel.setColor(cc.c3b(255, 255, 255));
            }

            var isDummyCard = true;
            var lvCallFuncAction = cc.CallFunc.create(function () {
                this._lvLabel.setString(isDummyCard ? dummyCard.get("lv") : this._leadCard.get("lv"));

                if (this._leadCard.get("lv") < dummyCard.get("lv")) {
                    if (isDummyCard) {
                        this._yellowProgress.setAllValue(0, 1);
                        this._greenProgress.setAllValue(dummyCard.get("exp"), dummyCard.get("maxExp"));
                    } else {
                        this._yellowProgress.setAllValue(this._leadCard.get("exp"), this._leadCard.get("maxExp"));
                        this._greenProgress.setAllValue(0, 1);
                    }
                } else {
                    if (isDummyCard) {
                        this._yellowProgress.setAllValue(this._leadCard.get("exp"), this._leadCard.get("maxExp"));
                        this._greenProgress.setAllValue(dummyCard.get("exp"), dummyCard.get("maxExp"));
                    } else {
                        this._yellowProgress.setAllValue(this._leadCard.get("exp"), this._leadCard.get("maxExp"));
                        this._greenProgress.setAllValue(0, 1);
                    }
                }

                isDummyCard = !isDummyCard;
            }, this);

            var fadeOutAction = cc.FadeOut.create(1);
            var fadeInAction = cc.FadeIn.create(1);

            var lvLabelAction = cc.Sequence.create(
                fadeOutAction.clone(),
                lvCallFuncAction.clone(),
                fadeInAction.clone()
            );

            this._lvLabel.runAction(cc.RepeatForever.create(lvLabelAction));

            this._upgradeItem.setEnabled(true);
        }
    },

    _upgrade: function (dummyCard, exp, money, cardCount) {
        cc.log("CardUpgradeLabel _upgrade");

        this._stopAllActions();

        var nowExp = exp;
        this._effect = cc.BuilderReader.load(main_scene_image.uiEffect42, this);
        this._effect.setPosition(this._cardUpgradeLabelFit.selectLeadCardItemPoint);
        this.addChild(this._effect, 10);

        var that = this;
        var fn = function () {
            var addExp = Math.floor(dummyCard.get("maxExp") / 10);

            if (nowExp < addExp) {
                addExp = nowExp;
            }

            nowExp -= addExp;

            dummyCard.addExp(addExp);

            var factor = nowExp / exp;

            cc.log(dummyCard);
            cc.log(this._leadCard);

            this._lvLabel.setString(dummyCard.get("lv"));
            this._hpLabel.setString(dummyCard.get("hp"));
            this._hpAdditionLabel.setString("+ " + (this._leadCard.get("hp") - dummyCard.get("hp")));
            this._atkLabel.setString(dummyCard.get("atk"));
            this._atkAdditionLabel.setString("+ " + (this._leadCard.get("atk") - dummyCard.get("atk")));
            this._yellowProgress.setAllValue(dummyCard.get("exp"), dummyCard.get("maxExp"));

            if (this._leadCard.get("lv") > dummyCard.get("lv")) {
                this._greenProgress.setAllValue(dummyCard.get("maxExp"), dummyCard.get("maxExp"));
            } else {
                this._greenProgress.setAllValue(this._leadCard.get("exp"), this._leadCard.get("maxExp"));
            }
            this._expLabel.setString(nowExp);
            this._moneyLabel.setString(Math.round(money * factor));
            this._cardCountLabel.setString(Math.round(cardCount * factor));

            if (nowExp <= 0) {
                this.unschedule(fn);
                this._retinueCard = [];

                var moveByAction = cc.Sequence.create(
                    cc.MoveBy.create(0.1, cc.p(5, 0)),
                    cc.MoveBy.create(0.1, cc.p(-5, 0)),
                    cc.MoveBy.create(0.1, cc.p(5, 0)),
                    cc.MoveBy.create(0.1, cc.p(-5, 0))
                );
                var scaleToAction = cc.Sequence.create(
                    cc.ScaleTo.create(0.1, 1.5),
                    cc.ScaleTo.create(0.1, 1),
                    cc.ScaleTo.create(0.1, 1.5),
                    cc.ScaleTo.create(0.1, 1)

                );
                var spawnAction = cc.Spawn.create(moveByAction, scaleToAction);
                this._hpLabel.runAction(spawnAction.clone());
                this._atkLabel.runAction(spawnAction.clone());

                this.update();

                that._effect.animationManager.runAnimationsForSequenceNamedTweenDuration("animation_2", 0);
                that._effect.animationManager.setCompletedAnimationCallback(this, function () {
                    if (that._effect) {
                        that._effect.removeFromParent();
                        that._effect = null;
                    }

                    if (mandatoryTeachingLayer) {
                        if (mandatoryTeachingLayer.isTeaching()) {
                            mandatoryTeachingLayer.next();
                        }
                    }
                });
                LazyLayer.closeCloudLayer();
            }
        };

        this.schedule(fn, 0.05);
    },

    _onClickSelectLeadCard: function () {
        cc.log("CardUpgradeLabel _onClickSelectLeadCard");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        if (this._effect != null) {
            this._effect.removeFromParent();
            this._effect = null;
        }

        if (mandatoryTeachingLayer) {
            if (mandatoryTeachingLayer.isTeaching()) {
                mandatoryTeachingLayer.clearAndSave();
                mandatoryTeachingLayer.next();
            }
        }

        var that = this;
        var cardListLayer = CardListLayer.create(SELECT_TYPE_CARD_UPGRADE_MASTER, function (data) {
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
        cc.log("CardUpgradeLabel _onClickSelectRetinueCard");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        if (this._effect != null) {
            this._effect.removeFromParent();
            this._effect = null;
        }

        if (mandatoryTeachingLayer) {
            if (mandatoryTeachingLayer.isTeaching()) {
                mandatoryTeachingLayer.clearAndSave();
                mandatoryTeachingLayer.next();
            }
        }

        var that = this;
        var cardListLayer = CardListLayer.create(SELECT_TYPE_CARD_UPGRADE_RETINUE, function (data) {
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

    _showTip: function (cb) {
        cc.log("CardUpgradeLabel _showTip");

        var lazyLayer = LazyLayer.create();
        this.addChild(lazyLayer, 10);

        var bgSprite = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgSprite.setContentSize(cc.size(500, 230));
        bgSprite.setPosition(this._cardUpgradeLabelFit.bgSpritePoint2);
        lazyLayer.addChild(bgSprite);

        var msgBgIcon = cc.Sprite.create(main_scene_image.icon175);
        msgBgIcon.setPosition(this._cardUpgradeLabelFit.msgBgIconPoint);
        msgBgIcon.setScaleX(0.88);
        lazyLayer.addChild(msgBgIcon);

        var tip = cc.LabelTTF.create("卡牌经验已超过等级上限，确定继续么？", "STHeitiTC-Medium", 22);
        tip.setPosition(this._cardUpgradeLabelFit.tipPoint);
        lazyLayer.addChild(tip);

        var okItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon21,
            function () {
                cb();
                lazyLayer.removeFromParent();
            },
            this
        );

        okItem.setPosition(this._cardUpgradeLabelFit.okItemPoint);

        var closeItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon36,
            function () {
                lazyLayer.removeFromParent();
            },
            this
        );
        closeItem.setPosition(this._cardUpgradeLabelFit.closeItemPoint);

        var menu = cc.Menu.create(okItem, closeItem);
        menu.setPosition(cc.p(0, 0));
        lazyLayer.addChild(menu);
    },

    _onClickUpgrade: function () {
        cc.log("CardUpgradeLabel _onClickUpgrade");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        if (!this._leadCard.canUpgrade()) {
            TipLayer.tip("卡牌已满级");
            return;
        }

        if (this._money > gameData.player.get("money")) {
            TipLayer.tip("仙币不足");
            return;
        }

        if (mandatoryTeachingLayer) {
            if (mandatoryTeachingLayer.isTeaching()) {
                mandatoryTeachingLayer.clearAndSave();
            }
        }

        var that = this;

        var next = function () {
            LazyLayer.showCloudLayer();

            var cardIdList = [];
            var len = that._retinueCard.length;
            for (var i = 0; i < len; ++i) {
                cardIdList.push(that._retinueCard[i].get("id"));
            }

                var dummyCard = lz.clone(that._leadCard);

            that._leadCard.upgrade(function (data) {
                cc.log(data);

                if (data) {
                    that._retinueCard = [];
                    that._getExp = 0;
                    that._needExp = 0;
                    that._upgrade(dummyCard, data.exp, data.money, len);
                } else {
                    that.update();
                    LazyLayer.closeCloudLayer();
                }
            }, cardIdList);
        };

        var maxLvNeedExp = this._leadCard.getCardFullLvNeedExp();
        if (this._getExp > maxLvNeedExp) {
            this._showTip(next);
        } else {
            next();
        }
    },

    _onClickHelp: function() {
        cc.log("CardUpgradeLabel _onClickHelp");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        GameHelpLabel.pop(gameHelp["cardUpgrade"]);
    }
});


CardUpgradeLabel.create = function () {
    var ret = new CardUpgradeLabel();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};
