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

        return true;
    },

    update: function () {
        cc.log("LineUpLabel update");

        this.removeAllChildren();

        var lineUpCardList = this._lineUp.getLineUpCardList();

        var menu = cc.Menu.create();
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu, 1);

        for (var i = 0; i < 5; ++i) {
            var cardHeadItem = null;

            if (i < MAX_LINE_UP_CARD) {
                cardHeadItem = CardHeadNode.getCardHeadItem(lineUpCardList[i], this._onClickCard, this);

            } else {
                cardHeadItem = CardHeadNode.getCardHeadItem(-1, this._onClickLock(i), this);
            }

            cardHeadItem.setPosition(cc.p(79 + 122 * i, 0));
            menu.addChild(cardHeadItem);
        }
    },

    _onClickCard: function () {
        cc.log("LineUpLabel _onClickCard");

        MainScene.getInstance().switch(CardListLayer.create(SELECT_TYPE_LINEUP));

        if (NoviceTeachingLayer.getInstance().isNoviceTeaching()) {
            NoviceTeachingLayer.getInstance().clearAndSave();
            NoviceTeachingLayer.getInstance().next();
        }
    },

    _onClickLock: function (index) {
        var table = outputTables.function_limit.rows[1];

        return function () {
            cc.log("LineUpLabel _onClickLock");

            if (index == 3) {
                TipLayer.tip(table.card4_position + " 级开启");
            } else if (index == 4) {
                TipLayer.tip(table.card5_position + " 级开启");
            }
        }
    }
});


LineUpLabel.create = function () {
    var ret = new LineUpLabel();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};