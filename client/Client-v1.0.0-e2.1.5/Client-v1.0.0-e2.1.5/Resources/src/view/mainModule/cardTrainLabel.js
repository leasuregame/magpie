/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-8-13
 * Time: 下午5:00
 * To change this template use File | Settings | File Templates.
 */


/*
 * card train label
 * */


var TRAIN_CARD_NULL = 0;
var TRAIN_CARD_HP = 1;
var TRAIN_CARD_ATK = 2;

var TRAIN_ZERO_COUNT = 0;
var TRAIN_ONE_COUNT = 1;
var TRAIN_TEN_COUNT = 10;

var CardTrainLabel = cc.Layer.extend({
    _trainType: TRAIN_CARD_NULL,
    _trainCount: TRAIN_ZERO_COUNT,

    onEnter: function () {
        cc.log("CardTrainLabel onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("CardTrainLabel init");

        if (!this._super()) return false;

        var cardItemBgSprite = cc.Sprite.create(main_scene_image.icon88);
        cardItemBgSprite.setPosition(cc.p(358, 613));
        this.addChild(cardItemBgSprite);

        this._tipBgLabel = cc.Sprite.create(main_scene_image.icon50);
        this._tipBgLabel.setPosition(cc.p(360, 380));
        this.addChild(this._tipBgLabel);

        this._trainTypeLabel = cc.Sprite.create(main_scene_image.icon50);
        this._trainTypeLabel.setScaleY(0.4);
        this._trainTypeLabel.setPosition(cc.p(360, 412));
        this.addChild(this._trainTypeLabel);

        this._trainCountLabel = cc.Sprite.create(main_scene_image.icon50);
        this._trainCountLabel.setScaleY(0.4);
        this._trainCountLabel.setPosition(cc.p(360, 349));
        this.addChild(this._trainCountLabel);

        var elixirIcon = cc.Sprite.create(main_scene_image.icon89);
        elixirIcon.setPosition(cc.p(550, 750));
        this.addChild(elixirIcon);

        this._elixirLabel = cc.LabelTTF.create("0", "黑体", 22);
        this._elixirLabel.setColor(cc.c3b(255, 248, 69));
        this._elixirLabel.setAnchorPoint(cc.p(0, 0.5));
        this._elixirLabel.setPosition(cc.p(605, 750));
        this.addChild(this._elixirLabel);

        this._resLabel = cc.Node.create();
        this._resLabel.setPosition(cc.p(202, 445));
        this.addChild(this._resLabel, 1);

        var resLabelBgSprite = cc.Sprite.create(main_scene_image.icon49);
        resLabelBgSprite.setAnchorPoint(cc.p(0, 0));
        this._resLabel.addChild(resLabelBgSprite);

        var resLabelIcon = cc.Sprite.create(main_scene_image.icon90);
        resLabelIcon.setPosition(cc.p(90, 70));
        this._resLabel.addChild(resLabelIcon);

        this._hpLabel = cc.LabelTTF.create("0", "黑体", 22);
        this._hpLabel.setAnchorPoint(cc.p(0, 0.5));
        this._hpLabel.setPosition(cc.p(110, 104));
        this._resLabel.addChild(this._hpLabel);

        this._hpAdditionLabel = cc.LabelTTF.create("+0", "黑体", 22);
        this._hpAdditionLabel.setAnchorPoint(cc.p(0, 0.5));
        this._hpAdditionLabel.setColor(cc.c3b(118, 238, 60));
        this._hpAdditionLabel.setPosition(cc.p(180, 104));
        this._resLabel.addChild(this._hpAdditionLabel);

        this._atkLabel = cc.LabelTTF.create("0", "黑体", 22);
        this._atkLabel.setAnchorPoint(cc.p(0, 0.5));
        this._atkLabel.setPosition(cc.p(110, 70));
        this._resLabel.addChild(this._atkLabel);

        this._atkAdditionLabel = cc.LabelTTF.create("+0", "黑体", 22);
        this._atkAdditionLabel.setAnchorPoint(cc.p(0, 0.5));
        this._atkAdditionLabel.setColor(cc.c3b(118, 238, 60));
        this._atkAdditionLabel.setPosition(cc.p(180, 70));
        this._resLabel.addChild(this._atkAdditionLabel);

        this._needElixirLabel = cc.LabelTTF.create("0", "黑体", 22);
        this._needElixirLabel.setAnchorPoint(cc.p(0, 0.5));
        this._needElixirLabel.setPosition(cc.p(140, 33));
        this._resLabel.addChild(this._needElixirLabel);

        this._tipLabel = cc.Sprite.create(main_scene_image.icon91);
        this._tipLabel.setPosition(cc.p(360, 380));
        this.addChild(this._tipLabel);

        this._helpLabel = cc.Sprite.create(main_scene_image.icon92);
        this._helpLabel.setPosition(cc.p(390, 380));
        this.addChild(this._helpLabel);

        var selectLeadCardItem = cc.MenuItemImage.create(
            main_scene_image.card_frame1,
            main_scene_image.card_frame_s,
            this._onClickSelectLeadCard,
            this
        );
        selectLeadCardItem.setScale(1.1);
        selectLeadCardItem.setPosition(cc.p(354, 685));

        this._trainItem = cc.MenuItemImage.create(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            this._onClickTrain,
            this
        );
        this._trainItem.setPosition(cc.p(360, 270));

        this._trainHpItem = cc.MenuItemImage.create(
            main_scene_image.button25,
            main_scene_image.button25s,
            this._onClickTrainHp,
            this
        );
        this._trainHpItem.setPosition(cc.p(190, 412));

        this._trainAtkItem = cc.MenuItemImage.create(
            main_scene_image.button25,
            main_scene_image.button25s,
            this._onClickTrainAtk,
            this
        );
        this._trainAtkItem.setPosition(cc.p(410, 412));

        this._trainOneItem = cc.MenuItemImage.create(
            main_scene_image.button25,
            main_scene_image.button25s,
            this._onClickTrainOne,
            this
        );
        this._trainOneItem.setPosition(cc.p(190, 348));

        this._trainTenItem = cc.MenuItemImage.create(
            main_scene_image.button25,
            main_scene_image.button25s,
            this._onClickTrainTen,
            this
        );
        this._trainTenItem.setPosition(cc.p(410, 348));


        var menu = cc.Menu.create(
            selectLeadCardItem,
            this._trainItem,
            this._trainHpItem,
            this._trainAtkItem,
            this._trainOneItem,
            this._trainTenItem
        );
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);


        this._selectLeadCardIcon = cc.Sprite.create(main_scene_image.icon51);
        this._selectLeadCardIcon.setPosition(cc.p(354, 685));
        this.addChild(this._selectLeadCardIcon);

        var upgradeIcon = cc.Sprite.create(main_scene_image.icon95);
        upgradeIcon.setPosition(cc.p(360, 270));
        this.addChild(upgradeIcon);

        this._trainHpIcon = cc.Sprite.create(main_scene_image.icon75);
        this._trainHpIcon.setPosition(cc.p(190, 412));
        this.addChild(this._trainHpIcon);
        this._trainHpIcon.setVisible(false);

        this._trainAtkIcon = cc.Sprite.create(main_scene_image.icon75);
        this._trainAtkIcon.setPosition(cc.p(410, 412));
        this.addChild(this._trainAtkIcon);
        this._trainAtkIcon.setVisible(false);

        this._trainOneIcon = cc.Sprite.create(main_scene_image.icon75);
        this._trainOneIcon.setPosition(cc.p(190, 348));
        this.addChild(this._trainOneIcon);
        this._trainOneIcon.setVisible(false);

        this._trainTenIcon = cc.Sprite.create(main_scene_image.icon75);
        this._trainTenIcon.setPosition(cc.p(410, 348));
        this.addChild(this._trainTenIcon);
        this._trainTenIcon.setVisible(false);

        return true;
    },

    update: function () {
        cc.log("CardTrainLabel update");

        this._elixirLabel.setString(gameData.player.get("elixir"));

        if (this._leadCardHalfNode != null) {
            this._leadCardHalfNode.removeFromParent();
            this._leadCardHalfNode = null;
        }

        if (this._leadCard == null) {
            this._resLabel.setVisible(false);
            this._tipBgLabel.setVisible(true);
            this._tipLabel.setVisible(true);
            this._trainTypeLabel.setVisible(false);
            this._trainCountLabel.setVisible(false);
            this._helpLabel.setVisible(false);
            this._trainHpItem.setVisible(false);
            this._trainAtkItem.setVisible(false);
            this._trainOneItem.setVisible(false);
            this._trainTenItem.setVisible(false);

            this._selectLeadCardIcon.stopAllActions();
            this._selectLeadCardIcon.setOpacity(255);

            var selectLeadCardIconAction = cc.Sequence.create(
                cc.FadeOut.create(1),
                cc.FadeIn.create(1)
            );

            this._selectLeadCardIcon.runAction(cc.RepeatForever.create(selectLeadCardIconAction));

            this._trainItem.setEnabled(false);
        } else {
            this._leadCardHalfNode = CardHalfNode.create(this._leadCard);
            this._leadCardHalfNode.setScale(1.1);
            this._leadCardHalfNode.setPosition(cc.p(354, 685));
            this.addChild(this._leadCardHalfNode, 1);

            this._resLabel.setVisible(true);
            this._hpLabel.setString(this._leadCard.get("hp"));
            this._atkLabel.setString(this._leadCard.get("atk"));
            this._needElixirLabel.setString(this._trainCount * 10);

            this._hpAdditionLabel.stopAllActions();
            this._atkAdditionLabel.stopAllActions();
            this._hpAdditionLabel.setOpacity(255);
            this._atkAdditionLabel.setOpacity(255);

            if (this._trainType != TRAIN_CARD_NULL && this._trainCount != TRAIN_ZERO_COUNT) {
                this._hpAdditionLabel.setVisible(true);
                this._atkAdditionLabel.setVisible(true);

                if (this._trainType == TRAIN_CARD_HP) {
                    this._hpAdditionLabel.setString("+" + (this._trainCount * 3));
                    this._atkAdditionLabel.setString("+0");
                } else if (this._trainType == TRAIN_CARD_ATK) {
                    this._hpAdditionLabel.setString("+0");
                    this._atkAdditionLabel.setString("+" + this._trainCount);
                }

                var fadeOutAction = cc.FadeOut.create(1);
                var fadeInAction = cc.FadeIn.create(1);

                var hpAdditionLabelAction = cc.Sequence.create(
                    fadeOutAction.copy(),
                    fadeInAction.copy(),
                    fadeOutAction.copy(),
                    fadeInAction.copy()
                );

                var atkAdditionLabelAction = cc.Sequence.create(
                    fadeOutAction.copy(),
                    fadeInAction.copy(),
                    fadeOutAction,
                    fadeInAction
                );

                this._hpAdditionLabel.runAction(cc.RepeatForever.create(hpAdditionLabelAction));
                this._atkAdditionLabel.runAction(cc.RepeatForever.create(atkAdditionLabelAction));

                this._trainItem.setEnabled(true);
            } else {
                this._hpAdditionLabel.setVisible(false);
                this._atkAdditionLabel.setVisible(false);
                this._trainItem.setEnabled(false);
            }

            this._tipBgLabel.setVisible(false);
            this._tipLabel.setVisible(false);
            this._trainTypeLabel.setVisible(true);
            this._trainCountLabel.setVisible(true);
            this._helpLabel.setVisible(true);
            this._trainHpItem.setVisible(true);
            this._trainAtkItem.setVisible(true);
            this._trainOneItem.setVisible(true);
            this._trainTenItem.setVisible(true);
        }
    },

    _onClickSelectLeadCard: function () {
        cc.log("CardTrainLabel _onClickSelectLeadCard");

        var that = this;
        var cardListLayer = CardListLayer.create(SELECT_TYPE_CARD_UPGRADE_MASTER, function (data) {
            cc.log(data);

            if (data) {
                that._leadCard = data[0] || null;
                that._retinueCard = [];
            }

            that.getParent()._backToThisLayer();

            cc.log("this._leadCard :");
            cc.log(that._leadCard);
        }, {
            leadCard: this._leadCard
        });

        this.getParent()._switchToCardListLayer(cardListLayer);
    },

    _onClickTrain: function () {
        cc.log("CardTrainLabel _onClickTrain");

        var that = this;
        this._leadCard.train(function (data) {
            cc.log(data);

            that.update();
        }, this._trainCount, this._trainType);
    },

    _onClickTrainHp: function () {
        cc.log("CardTrainLabel _onClickTrainHp");

        if (this._trainType == TRAIN_CARD_NULL) {
            this._trainType = TRAIN_CARD_HP;
            this._trainHpIcon.setVisible(true);
        } else if (this._trainType == TRAIN_CARD_HP) {
            this._trainType = TRAIN_CARD_NULL;
            this._trainHpIcon.setVisible(false);
        } else if (this._trainType == TRAIN_CARD_ATK) {
            this._trainType = TRAIN_CARD_HP;
            this._trainHpIcon.setVisible(true);
            this._trainAtkIcon.setVisible(false);
        }

        this.update();
    },

    _onClickTrainAtk: function () {
        cc.log("CardTrainLabel _onClickTrainAtk");

        if (this._trainType == TRAIN_CARD_NULL) {
            this._trainType = TRAIN_CARD_ATK;
            this._trainAtkIcon.setVisible(true);
        } else if (this._trainType == TRAIN_CARD_HP) {
            this._trainType = TRAIN_CARD_ATK;
            this._trainHpIcon.setVisible(false);
            this._trainAtkIcon.setVisible(true);
        } else if (this._trainType == TRAIN_CARD_ATK) {
            this._trainType = TRAIN_CARD_NULL;
            this._trainAtkIcon.setVisible(false);
        }

        this.update();
    },

    _onClickTrainOne: function () {
        cc.log("CardTrainLabel _onClickTrainOne");

        if (this._trainCount == TRAIN_ZERO_COUNT) {
            this._trainCount = TRAIN_ONE_COUNT;
            this._trainOneIcon.setVisible(true);
        } else if (this._trainCount == TRAIN_ONE_COUNT) {
            this._trainCount = TRAIN_ZERO_COUNT;
            this._trainOneIcon.setVisible(false);
        } else if (this._trainCount == TRAIN_TEN_COUNT) {
            this._trainCount = TRAIN_ONE_COUNT;
            this._trainOneIcon.setVisible(true);
            this._trainTenIcon.setVisible(false);
        }

        this.update();
    },

    _onClickTrainTen: function () {
        cc.log("CardTrainLabel _onClickTrainTen");

        if (this._trainCount == TRAIN_ZERO_COUNT) {
            this._trainCount = TRAIN_TEN_COUNT;
            this._trainTenIcon.setVisible(true);
        } else if (this._trainCount == TRAIN_ONE_COUNT) {
            this._trainCount = TRAIN_TEN_COUNT;
            this._trainOneIcon.setVisible(false);
            this._trainTenIcon.setVisible(true);
        } else if (this._trainCount == TRAIN_TEN_COUNT) {
            this._trainCount = TRAIN_ZERO_COUNT;
            this._trainTenIcon.setVisible(false);
        }

        this.update();
    }
});


CardTrainLabel.create = function () {
    var ret = new CardTrainLabel();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};