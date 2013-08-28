/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-23
 * Time: 下午3:10
 * To change this template use File | Settings | File Templates.
 */


/*
 * card label
 * */


var CardLabel = cc.Node.extend({
    _target: null,
    _card: null,
    _selectType: null,
    _isSelect: false,
    _otherLabel: null,
    _starLabel: null,
    _useLabel: null,
    _hookLabel: null,
    _hookBgLabel: null,
    _cardItem: null,

    init: function (target, card, selectType) {
        cc.log("CardLabel init");

        if (!this._super()) return false;

        this._target = target;
        this._card = card;

        var star = this._card.get("star");

        this._cardItem = cc.MenuItemImage.create(
            main_scene_image.button15,
            main_scene_image.button15s,
            main_scene_image.button15d,
            this._onClickCard,
            this
        );
        this._cardItem.setAnchorPoint(cc.p(0, 0));
        this._cardItem.setPosition(cc.p(0, 0));

        var cardItemMenu = LazyMenu.create(this._cardItem);
        cardItemMenu.setPosition(cc.p(0, 0));
        this.addChild(cardItemMenu);

        var cardHeadItem = CardHeadNode.getCardHeadItem(this._card);
        cardHeadItem.setPosition(cc.p(80, 60));

        var cardHeadItemMenu = LazyMenu.create(cardHeadItem);
        cardHeadItemMenu.setPosition(cc.p(0, 0));
        this.addChild(cardHeadItemMenu);

        var nameLabel = cc.LabelTTF.create(this._card.get("name"), "黑体", 22);
        nameLabel.setAnchorPoint(cc.p(0, 0.5));
        nameLabel.setPosition(cc.p(170, 88));
        this.addChild(nameLabel);

        var lvBgSprite = cc.Sprite.create(main_scene_image.icon28);
        lvBgSprite.setPosition(cc.p(80, 27));
        this.addChild(lvBgSprite);

        var lvLabel = cc.LabelTTF.create(this._card.get("lv"), "黑体", 22);
        lvLabel.setAnchorPoint(cc.p(0, 0.5));
        lvLabel.setPosition(cc.p(90, 27));
        this.addChild(lvLabel);

        var abilityLabel = cc.LabelTTF.create(this._card.get("ability"), "黑体", 22);
        abilityLabel.setAnchorPoint(cc.p(0, 0.5));
        abilityLabel.setPosition(cc.p(200, 40));
        this.addChild(abilityLabel);

        this._starLabel = StarLabel.create(star);
        this._starLabel.setPosition(cc.p(325, 41));
        this.addChild(this._starLabel);

        this._useLabel = cc.Sprite.create(main_scene_image.icon26);
        this._useLabel.setPosition(cc.p(280, 40));
        this.addChild(this._useLabel);
        this._useLabel.setVisible(gameData.lineUp.isLineUpCard(this._card.get("id")));

        this._hookBgLabel = cc.Sprite.create(main_scene_image.icon27);
        this._hookBgLabel.setPosition(cc.p(545, 62));
        this.addChild(this._hookBgLabel);

        this._hookLabel = cc.Sprite.create(main_scene_image.icon20);
        this._hookLabel.setPosition(cc.p(545, 62));
        this.addChild(this._hookLabel);

        this._otherLabel = cc.Node.create();
        this.addChild(this._otherLabel);

        selectType = selectType || SELECT_TYPE_DEFAULT;
        this.setSelectType(selectType);

        return true;
    },

    _initDefault: function () {
        cc.log("CardLabel _initDefault");

    },

    _initLineUp: function () {
        cc.log("CardLabel _initLineUp");

    },

    _initCardUpgradeMaster: function () {
        cc.log("CardLabel _initCardUpgradeMaster");
    },

    _initCardEvolutionMaster: function () {
        cc.log("CardLabel _initCardEvolutionMaster");
    },

    _initSkillUpgradeMaster: function () {
        cc.log("CardLabel _initSkillUpgradeMaster");
    },

    _initPassiveSkillAfreshMaster: function () {
        cc.log("CardLabel _initPassiveSkillAfreshMaster");
    },

    _initCardTrainMaster: function () {
        cc.log("CardLabel _initCardTrainMaster");
    },

    _initCardUpgradeRetinue: function () {
        cc.log("CardLabel _initCardUpgradeRetinue");

        this._clearOtherLabel();

        var expLabel = cc.LabelTTF.create(this._card.getCardExp(), "黑体", 35);
        expLabel.setPosition(cc.p(380, 64));
        this._otherLabel.addChild(expLabel);

        var expIcon = cc.Sprite.create(main_scene_image.icon29);
        expIcon.setPosition(cc.p(470, 64));
        this._otherLabel.addChild(expIcon);

        this._otherLabel.setOpacity = function (opacity) {
            expLabel.setOpacity(opacity);
            expIcon.setOpacity(opacity);
        };

        this._blinkOtherLabel();
    },

    _initCardEvolutionRetinue: function () {
        cc.log("CardLabel _initCardEvolutionRetinue");

        this._clearOtherLabel();

        var rateLabel = cc.LabelTTF.create(this._card.getPreCardRate() + "%", "黑体", 35);
        rateLabel.setPosition(cc.p(380, 64));
        this._otherLabel.addChild(rateLabel);

        this._otherLabel.setOpacity = function (opacity) {
            rateLabel.setOpacity(opacity);
        };

        this._blinkOtherLabel();
    },

    _initSell: function () {
        cc.log("CardLabel _initSell");

        this._clearOtherLabel();

        var moneyLabel = cc.LabelTTF.create(this._card.getSellCardMoney(), "黑体", 35);
        moneyLabel.setPosition(cc.p(380, 64));
        this._otherLabel.addChild(moneyLabel);

        var moneyIcon = cc.Sprite.create(main_scene_image.icon30);
        moneyIcon.setPosition(cc.p(470, 64));
        this._otherLabel.addChild(moneyIcon);

        this._otherLabel.setOpacity = function (opacity) {
            moneyLabel.setOpacity(opacity);
            moneyIcon.setOpacity(opacity);
        };

        this._blinkOtherLabel();
    },

    _updateHookLabel: function () {
        cc.log("CardLabel _showHookLabel");

        if (this._selectType == SELECT_TYPE_DEFAULT) {
            this._hookBgLabel.setVisible(false);
            this._hookLabel.setVisible(false);
            this._isSelect = false;
        } else {
            this._hookBgLabel.setVisible(true);
            this._hookLabel.setVisible(this._isSelect);
        }
    },

    _clearOtherLabel: function () {
        cc.log("CardLabel _clearOtherLabel");

        this._starLabel.stopAllActions();
        this._starLabel.setOpacity(255);

        if (this._otherLabel) {
            this._otherLabel.stopAllActions();
            this._otherLabel.removeAllChildren();
        }

        this._otherLabel.setOpacity = function (opacity) {
        };
    },

    _blinkOtherLabel: function () {
        cc.log("CardLabel _blinkOtherLabel");

        this._starLabel.setOpacity(0);
        this._otherLabel.setOpacity(255);

        var fadeOutAction = cc.FadeOut.create(1);
        var fadeInAction = cc.FadeIn.create(1);
        var delayTimeAction = cc.DelayTime.create(1);

        var starLabelAction = cc.Sequence.create(
            delayTimeAction.copy(),
            delayTimeAction.copy(),
            fadeInAction.copy(),
            delayTimeAction.copy(),
            fadeOutAction.copy(),
            delayTimeAction.copy()
        );

        var otherLabelAction = cc.Sequence.create(
            delayTimeAction.copy(),
            fadeOutAction,
            delayTimeAction.copy(),
            delayTimeAction.copy(),
            delayTimeAction,
            fadeInAction
        );

        this._starLabel.runAction(cc.RepeatForever.create(starLabelAction));
        this._otherLabel.runAction(cc.RepeatForever.create(otherLabelAction));
    },

    setSelectType: function (selectType) {
        cc.log("CardLabel setSelectType");

        if (selectType != this._selectType) {
            this._selectType = selectType;

            switch (this._selectType) {
                case SELECT_TYPE_LINEUP :
                    this._initLineUp();
                    break;
                case SELECT_TYPE_CARD_UPGRADE_MASTER :
                    this._initCardUpgradeMaster();
                    break;
                case SELECT_TYPE_CARD_EVOLUTION_MASTER :
                    this._initCardEvolutionMaster();
                    break;
                case SELECT_TYPE_SKILL_UPGRADE_MASTER :
                    this._initSkillUpgradeMaster();
                    break;
                case SELECT_TYPE_PASSIVE_SKILL_AFRESH_MASTER :
                    this._initPassiveSkillAfreshMaster();
                    break;
                case SELECT_TYPE_CARD_TRAIN_MASTER :
                    this._initCardTrainMaster();
                    break;
                case SELECT_TYPE_CARD_UPGRADE_RETINUE :
                    this._initCardUpgradeRetinue();
                    break;
                case SELECT_TYPE_CARD_EVOLUTION_RETINUE :
                    this._initCardEvolutionRetinue();
                    break;
                case SELECT_TYPE_SELL :
                    this._initSell();
                    break;
                default :
                    this._initDefault();
                    break;
            }

            this._updateHookLabel();
        }
    },

    setEnabled: function (enabled) {
        cc.log("CardLabel setEnabled");

        this._cardItem.setEnabled(enabled);
    },

    isEnabled: function () {
        cc.log("CardLabel getEnabled");

        return this._cardItem.isEnabled();
    },

    select: function () {
        cc.log("CardLabel select");

        this._isSelect = !this._isSelect;
        this._hookLabel.setVisible(this._isSelect);
        if (this._selectType == SELECT_TYPE_LINEUP) {
            this._useLabel.setVisible(this._isSelect);
        }

        this._target.selectCallback(this._card.get("id"));
    },

    isSelect: function () {
        cc.log("CardLabel isSelect");

        return this._isSelect;
    },

    update: function (selectType, enabled) {
        cc.log("CardLabel update");

        this.setSelectType(selectType);
        this.setEnabled(enabled);
    },

    _onClickCard: function () {
        cc.log("CardLabel _onClickCard" + this._card.get("id"));

        if (this._selectType != SELECT_TYPE_DEFAULT) {
            this.select();
        }
    }
});


CardLabel.create = function (target, card, selectType) {
    var ret = new CardLabel();

    if (ret && ret.init(target, card, selectType)) {
        return ret;
    }

    return null;
};