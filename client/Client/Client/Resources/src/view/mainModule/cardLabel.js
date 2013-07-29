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
    _isSelect: false,
    _enabled: true,
    _nameLabel: null,
    _lvLabel: null,
    _expLabel: null,
    _moneyLabel: null,
    _elixirLabel: null,
    _starLabel: null,
    _useLabel: null,
    _abilityLabel: null,
    _hookLabel: null,
    _hookBgLabel: null,
    _cardItem: null,

    onEnter: function () {
        cc.log("CardLabel onEnter");

        this._super();
        this.update();
    },

    init: function (card) {
        cc.log("CardLabel init");

        this._cardItem = cc.MenuItemImage.create(main_scene_image.button15, main_scene_image.button15s, main_scene_image.button15d, this._onClickCard, this);
        this._cardItem.setAnchorPoint(cc.p(0, 0));

        var cardHeadItem = cc.MenuItemImage.create(main_scene_image.button15, this._onClickCardHead, this);
        cardHeadItem.setPosition(cc.p());

        var menu = LazyMenu.create(cardItem, cardHeadItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);
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
    },

    _initMoney: function () {
        cc.log("CardLabel _initMoney");
    },

    _initElixir: function () {
        cc.log("CardLabel _initElixir");
    },

    update: function (enabled) {
        cc.log("CardLabel update");

        this._enabled = enabled;
    },

    _onClickCard: function () {
        cc.log("CardLabel _onClickCardHead");
        this._cardItem.setEnabled(false);
    },

    _onClickCardHead: function () {
        cc.log("CardLabel _onClickCardHead");
    }
})


CardLabel.create = function (card) {
    var ret = new CardLabel();

    if (ret && ret.init(card)) {
        return ret;
    }

    return null;
}