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
    _starLabel: null,
    _useLabel: null,
    _hookLabel: null,
    _hookBgLabel: null,
    _cardItem: null,
    _newCardMarkIcon: null,
    _otherData: null,

    init: function (target, card, selectType, otherData) {
        cc.log("CardLabel init");

        if (!this._super()) return false;

        this._target = target;
        this._card = card;
        this._otherData = otherData || {};
        this._useLabel = [];

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

        this._newCardMarkIcon = null;

        var cardHeadItem = CardHeadNode.getCardHeadItem(this._card, function () {
            CardDetails.pop(this._card);

            this._card.setNewCardMark(false);

            if (this._newCardMarkIcon) {
                this._newCardMarkIcon.removeFromParent();
                this._newCardMarkIcon = null;
            }
        }, this);
        cardHeadItem.setPosition(cc.p(70, 65));

        if (this._card.get("newCardMark")) {
            this._newCardMarkIcon = cc.Sprite.create(main_scene_image.icon93);
            this._newCardMarkIcon.setPosition(cc.p(25, 31));
            cardHeadItem.addChild(this._newCardMarkIcon);
        }

        var cardHeadItemMenu = LazyMenu.create(cardHeadItem);
        cardHeadItemMenu.setPosition(cc.p(0, 0));
        this.addChild(cardHeadItemMenu);

        var nameIcon = cc.Scale9Sprite.create(main_scene_image.icon29);
        nameIcon.setContentSize(cc.size(190, 30));
        nameIcon.setAnchorPoint(cc.p(0, 0.5));
        nameIcon.setPosition(cc.p(155, 100));
        this.addChild(nameIcon);

        var otherIcon = cc.Sprite.create(main_scene_image.icon30);
        otherIcon.setPosition(cc.p(200, 34));
        this.addChild(otherIcon);

        var skillType = this._card.get("skillType");
        if (skillType > 3) {
            skillType = 3;
        }

        var skillTypeIcon = cc.Sprite.create(this._card.getCardIcon(2));
        skillTypeIcon.setAnchorPoint(cc.p(0, 0.5));
        skillTypeIcon.setPosition(cc.p(142, 100));
        this.addChild(skillTypeIcon);

        var nameLabel = cc.LabelTTF.create(this._card.get("name"), "STHeitiTC-Medium", 20);
        nameLabel.setColor(cc.c3b(255, 242, 206));
        nameLabel.setAnchorPoint(cc.p(0, 0.5));
        nameLabel.setPosition(cc.p(180, 100));
        this.addChild(nameLabel);

        var lvLabel = cc.LabelTTF.create(this._card.get("lv"), "STHeitiTC-Medium", 22);
        lvLabel.setColor(cc.c3b(56, 3, 5));
        lvLabel.setAnchorPoint(cc.p(0, 0.5));
        lvLabel.setPosition(cc.p(180, 28));
        this.addChild(lvLabel);

        var abilityLabel = cc.LabelTTF.create(this._card.get("ability") || 0, "STHeitiTC-Medium", 22);
        abilityLabel.setColor(cc.c3b(56, 3, 5));
        abilityLabel.setAnchorPoint(cc.p(0, 0.5));
        abilityLabel.setPosition(cc.p(260, 28));
        this.addChild(abilityLabel);

        this._starLabel = StarLabel.create(this._card.get("star"));
        this._starLabel.setPosition(cc.p(142, 65));
        this.addChild(this._starLabel);


        var lineUp = gameData.lineUp;
        var index = lineUp.getCardOfLineUp(this._card.get("id"));
        var maxLineUp = lineUp.get("maxLineUp");
        var lineUpIcons = ["icon418", "icon419"];

        for (var i = 0; i < maxLineUp; ++i) {
            this._useLabel[i] = cc.Sprite.create(main_scene_image[lineUpIcons[i]]);
            this._useLabel[i].setPosition(cc.p(410, 100));
            this.addChild(this._useLabel[i]);
            this._useLabel[i].setVisible(index == i);
        }

        this._hookBgLabel = cc.Sprite.create(main_scene_image.icon27);
        this._hookBgLabel.setPosition(cc.p(525, 62));
        this.addChild(this._hookBgLabel);

        this._hookLabel = cc.Sprite.create(main_scene_image.icon20);
        this._hookLabel.setPosition(cc.p(525, 62));
        this.addChild(this._hookLabel);

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

        this._starLabel.setVisible(false);

        var expLabel = cc.LabelTTF.create("经验: " + this._card.getCardExp(), "STHeitiTC-Medium", 20);
        expLabel.setColor(cc.c3b(56, 3, 5));
        expLabel.setAnchorPoint(cc.p(0, 0.5));
        expLabel.setPosition(cc.p(142, 65));
        this.addChild(expLabel);
    },

    _initCardEvolutionRetinue: function () {
        cc.log("CardLabel _initCardEvolutionRetinue");

        this._starLabel.setVisible(false);

        var star = this._otherData.leadCard.getEvolutionNeedStar();
        if (star && this._card.get("star") == star) {
            var rateLabel = cc.LabelTTF.create("概率: " + this._otherData.leadCard.getPreCardRate() + "%", "STHeitiTC-Medium", 20);
            rateLabel.setColor(cc.c3b(56, 3, 5));
            rateLabel.setAnchorPoint(cc.p(0, 0.5));
            rateLabel.setPosition(cc.p(142, 65));
            this.addChild(rateLabel);
        }
    },

    _initSell: function () {
        cc.log("CardLabel _initSell");

        this._starLabel.setVisible(false);

        var moneyLabel = cc.LabelTTF.create("售价: " + this._card.getSellCardMoney(), "STHeitiTC-Medium", 20);
        moneyLabel.setColor(cc.c3b(56, 3, 5));
        moneyLabel.setAnchorPoint(cc.p(0, 0.5));
        moneyLabel.setPosition(cc.p(142, 65));
        this.addChild(moneyLabel);
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
            this._useLabel[this._otherData.index].setVisible(this._isSelect);

            this._card.setNewCardMark(false);

            if (this._newCardMarkIcon) {
                this._newCardMarkIcon.removeFromParent();
                this._newCardMarkIcon = null;
            }
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

    getCard: function () {
        cc.log("CardLabel getCard");

        return this._card;
    },

    _onClickCard: function () {
        cc.log("CardLabel _onClickCard" + this._card.get("id"));

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        if (this._selectType != SELECT_TYPE_DEFAULT) {
            if (noviceTeachingLayer.isNoviceTeaching()) {
                noviceTeachingLayer.clearAndSave();
                noviceTeachingLayer.next();
            }

            if (mandatoryTeachingLayer) {
                if (mandatoryTeachingLayer.isTeaching()) {
                    mandatoryTeachingLayer.clearAndSave();
                    mandatoryTeachingLayer.next();
                }
            }

            this.select();
        }
    }
});


CardLabel.create = function (target, card, selectType, otherData) {
    var ret = new CardLabel();

    if (ret && ret.init(target, card, selectType, otherData)) {
        return ret;
    }

    return null;
};