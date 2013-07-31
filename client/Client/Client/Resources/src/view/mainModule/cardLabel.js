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


var SELECT_TYPE_DEFAULT = 0;
var SELECT_TYPE_LINEUP = 1;
var SELECT_TYPE_MASTER = 2;
var SELECT_TYPE_EXP = 3;
var SELECT_TYPE_MONEY = 4;
var SELECT_TYPE_ELIXIR = 5;

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

        this._cardItem = cc.MenuItemImage.create(main_scene_image.button15, main_scene_image.button15s, main_scene_image.button15d, this._onClickCard, this);
        this._cardItem.setAnchorPoint(cc.p(0, 0));
        this._cardItem.setPosition(cc.p(0, 0));

        var cardItemMenu = LazyMenu.create(this._cardItem);
        cardItemMenu.setPosition(cc.p(0, 0));
        this.addChild(cardItemMenu);

        var cardHeadItem = cc.MenuItemImage.create(main_scene_image["card_item_bg" + star], main_scene_image["card_item_bg" + star], this._onClickCardHead, this);
        cardHeadItem.setPosition(cc.p(80, 67));

        var cardHeadItemMenu = LazyMenu.create(cardHeadItem);
        cardHeadItemMenu.setPosition(cc.p(0, 0));
        this.addChild(cardHeadItemMenu);

        var cardHeadSprite = cc.Sprite.create(s_h_hero_1);
        cardHeadSprite.setPosition(cc.p(80, 67));
        this.addChild(cardHeadSprite);

        var cardFrameSprite = cc.Sprite.create(main_scene_image["card_item_frame" + star]);
        cardFrameSprite.setPosition(cc.p(80, 67));
        this.addChild(cardFrameSprite);

        var nameLabel = cc.LabelTTF.create(this._card.get("name"), 'Times New Roman', 22);
        nameLabel.setPosition(cc.p(200, 93));
        this.addChild(nameLabel);

        var lvBgSprite = cc.Sprite.create(main_scene_image.icon28);
        lvBgSprite.setPosition(cc.p(80, 32));
        this.addChild(lvBgSprite);

        var lvLabel = cc.LabelTTF.create(this._card.get("lv"), 'Times New Roman', 22);
        lvLabel.setAnchorPoint(cc.p(0, 0.5));
        lvLabel.setPosition(cc.p(90, 32));
        this.addChild(lvLabel);

        var abilityLabel = cc.LabelTTF.create(this._card.get("ability"), 'Times New Roman', 22);
        abilityLabel.setAnchorPoint(cc.p(0, 0.5));
        abilityLabel.setPosition(cc.p(200, 45));
        this.addChild(abilityLabel);

        this._starLabel = StarLabel.create(star);
        this._starLabel.setPosition(cc.p(325, 46));
        this.addChild(this._starLabel);

        this._useLabel = cc.Sprite.create(main_scene_image.icon26);
        this._useLabel.setPosition(cc.p(290, 45));
        this.addChild(this._useLabel);

        this._hookBgLabel = cc.Sprite.create(main_scene_image.icon27);
        this._hookBgLabel.setPosition(cc.p(545, 67));
        this.addChild(this._hookBgLabel);

        this._hookLabel = cc.Sprite.create(main_scene_image.icon20);
        this._hookLabel.setPosition(cc.p(545, 67));
        this.addChild(this._hookLabel);

        this._otherLabel = cc.Node.create();

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

    _initMaster: function () {
        cc.log("CardLabel _initMaster");

    },

    _initExp: function () {
        cc.log("CardLabel _initExp");

        this._clearOtherLabel();

        var expLabel = cc.LabelTTF.create(this._card.get("exp"), 'Times New Roman', 22);
        expLabel.setPosition(cc.p(0, 0));
        this._otherLabel.addChild(expLabel);

        var expIcon = cc.Sprite.create(main_scene_image.icon29);
        expIcon.setPosition(cc.p(0, 0));
        this._otherLabel.addChild(expIcon);

        this._blinkOtherLabel();
    },

    _initMoney: function () {
        cc.log("CardLabel _initMoney");

        this._clearOtherLabel();

        var moneyLabel = cc.LabelTTF.create(this._card.get("money"), 'Times New Roman', 22);
        moneyLabel.setPosition(cc.p(0, 0));
        this._otherLabel.addChild(moneyLabel);

        var moneyIcon = cc.Sprite.create(main_scene_image.icon30);
        moneyIcon.setPosition(cc.p(0, 0));
        this._otherLabel.addChild(moneyIcon);

        this._blinkOtherLabel();
    },

    _initElixir: function () {
        cc.log("CardLabel _initElixir");

        this._clearOtherLabel();

        var elixirLabel = cc.LabelTTF.create(this._card.get("elixir"), 'Times New Roman', 22);
        elixirLabel.setPosition(cc.p(0, 0));
        this._otherLabel.addChild(elixirLabel);

        var elixirIcon = cc.Sprite.create(main_scene_image.icon31);
        elixirIcon.setPosition(cc.p(0, 0));
        this._otherLabel.addChild(elixirIcon);

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

        if (this._otherLabel) {
            this._otherLabel.stopAllActions();
            this._otherLabel.removeAllChildren();
        }
    },

    _blinkOtherLabel: function () {
        cc.log("CardLabel _blinkOtherLabel");

    },

    setSelectType: function (selectType) {
        cc.log("CardLabel setSelectType");

        if (selectType != this._selectType) {
            this._selectType = selectType;

            if (this._selectType == SELECT_TYPE_DEFAULT) {
                this._initDefault();
            } else if (this._selectType == SELECT_TYPE_LINEUP) {
                this._initLineUp();
            } else if (this._selectType == SELECT_TYPE_MASTER) {
                this._initMaster();
            } else if (this._selectType == SELECT_TYPE_EXP) {
                this._initExp();
            } else if (this._selectType == SELECT_TYPE_MONEY) {
                this._initMoney();
            } else if (this._selectType == SELECT_TYPE_ELIXIR) {
                this._initElixir();
            }

            this._updateHookLabel();
        }
    },

    setEnabled: function (enabled) {
        cc.log("CardLabel setEnabled");

        this._cardItem.setEnabled(enabled);
    },

    select: function() {
        this._isSelect = !this._isSelect;
        this._target.selectCallback(this._card.get("id"));

        this._hookLabel.setVisible(this._isSelect);
    },

    isSelect: function() {
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
    },

    _onClickCardHead: function () {
        cc.log("CardLabel _onClickCardHead");
    }
})


CardLabel.create = function (target, card, selectType) {
    var ret = new CardLabel();

    if (ret && ret.init(target, card, selectType)) {
        return ret;
    }

    return null;
}