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
    _leadCard: null,
    _retinueCard: [],
    _leadCardHalfNode: null,
    _tipLabel: null,
    _helpLabel: null,
    _expLabel: null,
    _maxExpLabel: null,
    _moneyLabel: null,
    _cardCountLabel: null,
    _cardLabel: null,
    _hpLabel: null,
    _hpAdditionLabel: null,
    _atkLabel: null,
    _atkAdditionLabel: null,
    _lvLabel: null,
    _yellowProgress: null,
    _greenProgress: null,
    _selectRetinueCardItem: null,
    _upgradeItem: null,

    onEnter: function () {
        cc.log("CardUpgradeLabel onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("CardUpgradeLabel init");

        if (!this._super()) return false;

        var cardItemBgSprite = cc.Sprite.create(main_scene_image.icon48);
        cardItemBgSprite.setPosition(cc.p(360, 600));
        this.addChild(cardItemBgSprite);

        var helpBgSprite = cc.Sprite.create(main_scene_image.icon50);
        helpBgSprite.setPosition(cc.p(360, 380));
        this.addChild(helpBgSprite);

        this._cardLabel = cc.Node.create();
        this._cardLabel.setPosition(cc.p(202, 445));
        this.addChild(this._cardLabel, 1);

        var cardLabelBgSprite = cc.Sprite.create(main_scene_image.icon49);
        cardLabelBgSprite.setAnchorPoint(cc.p(0, 0));
        this._cardLabel.addChild(cardLabelBgSprite);

        var cardLabelIcon = cc.Sprite.create(main_scene_image.icon54);
        cardLabelIcon.setPosition(cc.p(70, 95));
        this._cardLabel.addChild(cardLabelIcon);

        this._lvLabel = cc.LabelTTF.create("0", 'Times New Roman', 40);
        this._lvLabel.setPosition(cc.p(70, 40));
        this._cardLabel.addChild(this._lvLabel);

        this._hpLabel = cc.LabelTTF.create("0", 'Times New Roman', 25);
        this._hpLabel.setAnchorPoint(cc.p(0, 0.5));
        this._hpLabel.setPosition(cc.p(110, 112));
        this._cardLabel.addChild(this._hpLabel);

        this._hpAdditionLabel = cc.LabelTTF.create("+0", 'Times New Roman', 25);
        this._hpAdditionLabel.setAnchorPoint(cc.p(0, 0.5));
        this._hpAdditionLabel.setColor(cc.c3b(118, 238, 60));
        this._hpAdditionLabel.setPosition(cc.p(180, 112));
        this._cardLabel.addChild(this._hpAdditionLabel);

        this._atkLabel = cc.LabelTTF.create("0", 'Times New Roman', 25);
        this._atkLabel.setAnchorPoint(cc.p(0, 0.5));
        this._atkLabel.setPosition(cc.p(110, 78));
        this._cardLabel.addChild(this._atkLabel);

        this._atkAdditionLabel = cc.LabelTTF.create("+0", 'Times New Roman', 25);
        this._atkAdditionLabel.setAnchorPoint(cc.p(0, 0.5));
        this._atkAdditionLabel.setColor(cc.c3b(118, 238, 60));
        this._atkAdditionLabel.setPosition(cc.p(180, 78));
        this._cardLabel.addChild(this._atkAdditionLabel);

        var progressBgSprite = cc.Sprite.create(main_scene_image.progress4);
        progressBgSprite.setPosition(cc.p(190, 40));
        this._cardLabel.addChild(progressBgSprite);

        this._greenProgress = Progress.create(null, main_scene_image.progress6, 9, 10);
        this._greenProgress.setPosition(cc.p(190, 40));
        this._cardLabel.addChild(this._greenProgress);

        this._yellowProgress = Progress.create(null, main_scene_image.progress5, 7, 10);
        this._yellowProgress.setPosition(cc.p(190, 40));
        this._cardLabel.addChild(this._yellowProgress);

        this._tipLabel = cc.Sprite.create(main_scene_image.icon56);
        this._tipLabel.setPosition(cc.p(360, 380));
        this.addChild(this._tipLabel);

        this._helpLabel = cc.Sprite.create(main_scene_image.icon55);
        this._helpLabel.setPosition(cc.p(320, 380));
        this.addChild(this._helpLabel);

        var selectLeadCardItem = cc.MenuItemImage.create(
            main_scene_image.card_frame1,
            main_scene_image.card_frame_s,
            this._onClickSelectLeadCard,
            this
        );
        selectLeadCardItem.setPosition(cc.p(355, 685));

        this._selectRetinueCardItem = cc.MenuItemImage.create(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            this._onClickSelectRetinueCard,
            this
        );
        this._selectRetinueCardItem.setPosition(cc.p(260, 270));

        this._upgradeItem = cc.MenuItemImage.create(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            this._onClickUpgrade,
            this
        );
        this._upgradeItem.setPosition(cc.p(460, 270));


        var menu = cc.Menu.create(selectLeadCardItem, this._selectRetinueCardItem, this._upgradeItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        this._expLabel = cc.LabelTTF.create("0", 'Times New Roman', 25);
        this._expLabel.setAnchorPoint(cc.p(0, 0.5));
        this._expLabel.setPosition(cc.p(240, 405));
        this.addChild(this._expLabel);

        this._maxExpLabel = cc.LabelTTF.create("0", 'Times New Roman', 25);
        this._maxExpLabel.setAnchorPoint(cc.p(0, 0.5));
        this._maxExpLabel.setPosition(cc.p(500, 405));
        this.addChild(this._maxExpLabel);

        this._moneyLabel = cc.LabelTTF.create("0", 'Times New Roman', 25);
        this._moneyLabel.setAnchorPoint(cc.p(0, 0.5));
        this._moneyLabel.setPosition(cc.p(240, 357));
        this.addChild(this._moneyLabel);

        this._cardCountLabel = cc.LabelTTF.create("0", 'Times New Roman', 25);
        this._cardCountLabel.setAnchorPoint(cc.p(0, 0.5));
        this._cardCountLabel.setPosition(cc.p(480, 357));
        this.addChild(this._cardCountLabel);

        var selectLeadCardIcon = cc.Sprite.create(main_scene_image.icon51);
        selectLeadCardIcon.setPosition(cc.p(355, 685));
        this.addChild(selectLeadCardIcon);

        var selectRetinueCardIcon = cc.Sprite.create(main_scene_image.icon53);
        selectRetinueCardIcon.setPosition(cc.p(260, 270));
        this.addChild(selectRetinueCardIcon);

        var upgradeIcon = cc.Sprite.create(main_scene_image.icon52);
        upgradeIcon.setPosition(cc.p(460, 270));
        this.addChild(upgradeIcon);

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
        this._hpAdditionLabel.stopAllActions();
        this._atkAdditionLabel.stopAllActions();
        this._yellowProgress.stopAllActions();
        this._greenProgress.stopAllActions();
    },

    _addLeadCard: function () {
        cc.log("CardUpgradeLabel _addLeadCard");

        if (this._leadCardHalfNode != null) {
            this._leadCardHalfNode.removeFromParent();
            this._leadCardHalfNode = null;
        }

        if (this._leadCard == null) {
            this._retinueCard = [];

            this._hpLabel.setString("0");
            this._hpAdditionLabel.setString("+0");
            this._atkLabel.setString("0");
            this._atkAdditionLabel.setString("+0");

            this._expLabel.setString("0");
            this._maxExpLabel.setString("0");
            this._moneyLabel.setString("0");
            this._cardCountLabel.setString("0");

            this._lvLabel.setString("0");
            this._yellowProgress.setAllValue(0, 0);
            this._greenProgress.setAllValue(0, 0);

            this._selectRetinueCardItem.setEnabled(false);
            this._upgradeItem.setEnabled(false);

            this._tipLabel.setVisible(true);
            this._helpLabel.setVisible(false);
            this._expLabel.setVisible(false);
            this._maxExpLabel.setVisible(false);
            this._moneyLabel.setVisible(false);
            this._cardCountLabel.setVisible(false);

            this._cardLabel.setVisible(false);
            this._hpAdditionLabel.setVisible(false);
            this._atkAdditionLabel.setVisible(false);
        } else {
            this._leadCardHalfNode = CardHalfNode.create(this._leadCard);
            this._leadCardHalfNode.setPosition(cc.p(355, 685));
            this.addChild(this._leadCardHalfNode, 1);

            this._hpLabel.setString(this._leadCard.get("hp"));
            this._hpAdditionLabel.setString("+0");
            this._atkLabel.setString(this._leadCard.get("atk"));
            this._atkAdditionLabel.setString("+0");

            this._expLabel.setString("0");
            this._maxExpLabel.setString(this._leadCard.getCardFullLvExp());
            this._moneyLabel.setString("0");
            this._cardCountLabel.setString("0");

            this._lvLabel.setString(this._leadCard.get("lv"));
            this._yellowProgress.setAllValue(this._leadCard.get("exp"), this._leadCard.get("maxExp"));
            this._greenProgress.setAllValue(0, 0);

            this._selectRetinueCardItem.setEnabled(true);
            this._upgradeItem.setEnabled(false);

            this._tipLabel.setVisible(false);
            this._helpLabel.setVisible(true);
            this._expLabel.setVisible(true);
            this._maxExpLabel.setVisible(true);
            this._moneyLabel.setVisible(true);
            this._cardCountLabel.setVisible(true);

            this._cardLabel.setVisible(true);
            this._hpAdditionLabel.setVisible(true);
            this._atkAdditionLabel.setVisible(true);
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
            cc.log(exp);

            var dummyCard = cc.clone(this._leadCard);
            cc.log(this._leadCard);

            var money = dummyCard.addExp(exp);
            cc.log(dummyCard);

            this._hpAdditionLabel.setString("+" + dummyCard.get("hp"));
            this._atkAdditionLabel.setString("+" + dummyCard.get("atk"));

            this._expLabel.setString(exp);
            this._moneyLabel.setString(money);
            this._cardCountLabel.setString(cardCount);

            var isDummyCardLv = false;
            var lvCallFuncAction = cc.CallFunc.create(function () {
                this._lvLabel.setString(isDummyCardLv ? this._leadCard.get("lv") : dummyCard.get("lv"));
                isDummyCardLv = !isDummyCardLv;
            }, this);

            var isDummyCardProgress = false;
            var ProgressCallFuncAction = cc.CallFunc.create(function () {
                if (this._leadCard.get("lv") < dummyCard.get("lv")) {
                    if (isDummyCardProgress) {
                        this._yellowProgress.setAllValue(0, 0);
                        this._greenProgress.setAllValue(dummyCard.get("exp"), dummyCard.get("maxExp"));
                    } else {
                        this._yellowProgress.setAllValue(this._leadCard.get("exp"), this._leadCard.get("maxExp"));
                        this._greenProgress.setAllValue(this._leadCard.get("maxExp"), this._leadCard.get("maxExp"));
                    }
                } else {
                    this._yellowProgress.setAllValue(this._leadCard.get("exp"), this._leadCard.get("maxExp"));
                    this._greenProgress.setAllValue(dummyCard.get("exp"), dummyCard.get("maxExp"));
                }

                isDummyCardProgress = !isDummyCardLv;
            }, this);

            var fadeOutAction = cc.FadeOut.create(1);
            var fadeInAction = cc.FadeIn.create(1);

            var lvLabelAction = cc.Sequence.create(
                fadeOutAction.copy(),
                lvCallFuncAction.copy(),
                fadeInAction.copy(),
                fadeOutAction.copy(),
                lvCallFuncAction,
                fadeInAction.copy()
            );

            var yellowProgressAction = cc.Sequence.create(
                fadeOutAction.copy(),
                ProgressCallFuncAction.copy(),
                fadeInAction.copy(),
                fadeOutAction.copy(),
                ProgressCallFuncAction,
                fadeInAction.copy()
            );

            var greenProgressAction = cc.Sequence.create(
                fadeOutAction.copy(),
                fadeInAction.copy(),
                fadeOutAction.copy(),
                fadeInAction.copy()
            );

            var hpAdditionLabelAction = cc.Sequence.create(
                fadeOutAction.copy(),
                fadeInAction.copy()
            );

            var atkAdditionLabelAction = cc.Sequence.create(
                fadeOutAction,
                fadeInAction
            );

            this._lvLabel.runAction(cc.RepeatForever.create(lvLabelAction));
//            this._yellowProgress.runAction(cc.RepeatForever.create(yellowProgressAction));
            this._greenProgress.runAction(cc.RepeatForever.create(greenProgressAction));
            this._hpAdditionLabel.runAction(cc.RepeatForever.create(hpAdditionLabelAction));
            this._atkAdditionLabel.runAction(cc.RepeatForever.create(atkAdditionLabelAction));

            this._upgradeItem.setEnabled(true);
        }
    },

    _switchToCardListLayer: function (cardListLayer) {
        cc.log("CardUpgradeLabel _switchToCardListLayer");

        MainScene.getInstance().switch(cardListLayer);
        this.getParent().setVisible(false);
    },

    _backToThisLayer: function (cardListLayer) {
        cc.log("CardUpgradeLabel _backToThisLayer");

        var parent = this.getParent();
        MainScene.getInstance().switch(parent);
        this.update();
        parent.setVisible(true);
    },

    _onClickSelectLeadCard: function () {
        cc.log("CardUpgradeLabel _onClickSelectLeadCard");

        this._leadCard = gameData.cardList.getCardByIndex(1);

        this.update();

//        var cardListLayer = CardListLayer.create(function (data) {
//            cc.log(data);
//
//            this._leadCard = data[0] || null;
//            this._backToThisLayer(cardListLayer);
//        }, this, 1);
//
//        this._switchToCardListLayer(cardListLayer);
    },

    _onClickSelectRetinueCard: function () {
        cc.log("CardUpgradeLabel _onClickSelectRetinueCard");

        this._retinueCard.push(gameData.cardList.getCardByIndex(2));
        this._retinueCard.push(gameData.cardList.getCardByIndex(3));

        this.update();

//        var cardListLayer = CardListLayer.create(function (data) {
//            cc.log(data);
//
//            this._retinueCard = data;
//            this._backToThisLayer(cardListLayer);
//        }, this);
//
//        this._switchToCardListLayer(cardListLayer);
    },

    _onClickUpgrade: function () {
        cc.log("CardUpgradeLabel _onClickUpgrade");

        this._retinueCard = [];

        this.update();
    }
})


CardUpgradeLabel.create = function () {
    var ret = new CardUpgradeLabel();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
}