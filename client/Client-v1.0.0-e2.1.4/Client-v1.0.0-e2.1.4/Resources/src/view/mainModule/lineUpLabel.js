/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-15
 * Time: 上午10:32
 * To change this template use File | Settings | File Templates.
 */


/*
 * line up label
 * */


var LineUpLabel = cc.Layer.extend({
    _cardList: null,
    _lineUp: null,

    onEnter: function () {
        cc.log("LineUpLabel onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("LineUpLabel init");

        if (!this._super()) return false;

        this._cardList = gameData.cardList;
        this._lineUp = gameData.lineUp;

        this._lineUpCard = {};
        for (var i = 1; i <= MAX_LINE_UP_SIZE; ++i) {
            var cardBg = cc.LayerColor.create(cc.c4b(100, 20, 100, 200), 80, 80);
            cardBg.setPosition(cc.p(i * 100 - 70, 35));
            this.addChild(cardBg);

            var label = cc.LabelTTF.create("xx", '黑体', 30);
            label.setPosition(cc.p(i * 100 - 30, 75));
            this.addChild(label);

            this._lineUpCard[i] = label;
        }

        return true;
    },

    update: function () {
        cc.log("LineUpLabel update");

        this.removeAllChildren();

        var lineUpList = this._lineUp.getLineUpCardList();

        var menu = cc.Menu.create();
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu, 1);

        for (var i = 0; i < MAX_LINE_UP_CARD; ++i) {
            var card = lineUpList[i];
            var star = 1;

            if (card) {
                var cardHeadItem = CardHeadNode.getCardHeadItem(card, this._onClickCard(card), this);
                cardHeadItem.setPosition(cc.p(79 + 122 * i, 0));
                menu.addChild(cardHeadItem);
            }
        }
    },

    _onClickCard: function (card) {
        return function () {
            cc.log("LineUpLabel _onClickCard");

            MainScene.getInstance().switch(CardListLayer.create(SELECT_TYPE_LINEUP));
        }
    }
})


LineUpLabel.create = function () {
    var ret = new LineUpLabel();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
}