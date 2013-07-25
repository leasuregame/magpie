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
    _isSelect: false,
    _nameLabel: null,
    _lvLabel: null,
    _moneyLabel: null,


    onEnter: function () {
        cc.log("CardLabel onEnter");

        this._super();
        this.update();
    },

    init: function (card) {
        cc.log("CardLabel init");

        var cardBgLabel = cc.Node.create();

        var bgSprite = cc.Sprite.create();
        bgSprite.setAnchorPoint(cc.p(0, 0));
        cardBgLabel.addChild(bgSprite);

        var cardBgItem = cc.MenuItemLabel(cardBgLabel, this._onClickCardBg, this);

        var menu = cc.Menu.create(cardBgItem);
    },

    update: function () {
        cc.log("CardLabel update");
    },

    _onClickCardBg: function () {
        cc.log("CardLabel onClickCardBg");
    },

    _onClickCard: function () {
        cc.log("CardLabel onClickCard");
    },

    _onClickSelect: function () {
        cc.log("CardLabel onClickSelect");
    }
})


CardLabel.create = function (card) {
    var ret = new CardLabel();

    if (ret && ret.init(card)) {
        return ret;
    }

    return null;
}