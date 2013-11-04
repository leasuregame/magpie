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

    init: function (target, card, selectType) {
        cc.log("CardLabel init");

        if (!this._super()) return false;

        this._target = target;
        this._card = card;

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
        cardHeadItem.setPosition(cc.p(70, 65));

        var cardHeadItemMenu = LazyMenu.create(cardHeadItem);
        cardHeadItemMenu.setPosition(cc.p(0, 0));
        this.addChild(cardHeadItemMenu);

        var nameIcon = cc.Scale9Sprite.create(main_scene_image.icon29);
        nameIcon.setContentSize(cc.size(190, 30));
        nameIcon.setAnchorPoint(cc.p(0, 0.5));
        nameIcon.setPosition(cc.p(145, 100));
        this.addChild(nameIcon);

        var otherIcon = cc.Sprite.create(main_scene_image.icon30);
        otherIcon.setPosition(cc.p(200, 34));
        this.addChild(otherIcon);

        var nameLabel = cc.LabelTTF.create(this._card.get("name"), "STHeitiTC-Medium", 20);
        nameLabel.setColor(cc.c3b(255, 242, 206));
        nameLabel.setAnchorPoint(cc.p(0, 0.5));
        nameLabel.setPosition(cc.p(150, 100));
        this.addChild(nameLabel);

        var lvLabel = cc.LabelTTF.create(this._card.get("lv"), "STHeitiTC-Medium", 22);
        lvLabel.setColor(cc.c3b(56, 3, 5));
        lvLabel.setAnchorPoint(cc.p(0, 0.5));
        lvLabel.setPosition(cc.p(180, 28));
        this.addChild(lvLabel);

        var abilityLabel = cc.LabelTTF.create(this._card.get("ability"), "STHeitiTC-Medium", 22);
        abilityLabel.setColor(cc.c3b(56, 3, 5));
        abilityLabel.setAnchorPoint(cc.p(0, 0.5));
        abilityLabel.setPosition(cc.p(260, 28));
        this.addChild(abilityLabel);

        this._starLabel = StarLabel.create(this._card.get("star"));
        this._starLabel.setPosition(cc.p(142, 65));
        this.addChild(this._starLabel);

        this._useLabel = cc.Sprite.create(main_scene_image.icon26);
        this._useLabel.setPosition(cc.p(400, 100));
        this.addChild(this._useLabel);
        this._useLabel.setVisible(gameData.lineUp.isLineUpCard(this._card.get("id")));

        this._hookBgLabel = cc.Sprite.create(main_scene_image.icon27);
        this._hookBgLabel.setPosition(cc.p(545, 62));
        this.addChild(this._hookBgLabel);

        this._hookLabel = cc.Sprite.create(main_scene_image.icon20);
        this._hookLabel.setPosition(cc.p(545, 62));
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

        var rateLabel = cc.LabelTTF.create("概率: " + this._card.getPreCardRate() + "%", "STHeitiTC-Medium", 20);
        rateLabel.setColor(cc.c3b(56, 3, 5));
        rateLabel.setAnchorPoint(cc.p(0, 0.5));
        rateLabel.setPosition(cc.p(142, 65));
        this.addChild(rateLabel);
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
            if(NoviceTeachingLayer.getInstance().isNoviceTeaching()) {
                NoviceTeachingLayer.getInstance().clearAndSave();
                NoviceTeachingLayer.getInstance().next();
            }
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