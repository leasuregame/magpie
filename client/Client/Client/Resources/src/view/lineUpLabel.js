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
    _lineUpCard: {},
    _selectRect: cc.rect(40, 648, GAME_WIDTH, 150),
    _isMouseDown: false,

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

        this.setTouchEnabled(true);

        bg = cc.LayerColor.create(cc.c4b(100, 0, 100, 100), GAME_WIDTH, 150);
        bg.setAnchorPoint(cc.p(0, 0));
        this.addChild(bg);

        this._lineUpCard = {};
        for (var i = 1; i <= MAX_LINE_UP_CARD; ++i) {
            var cardBg = cc.LayerColor.create(cc.c4b(100, 20, 100, 200), 80, 80);
            cardBg.setPosition(cc.p(i * 100 - 70, 35));
            this.addChild(cardBg);

            var label = cc.LabelTTF.create("xx", 'Times New Roman', 30);
            label.setPosition(cc.p(i * 100 - 30, 75));
            this.addChild(label);

            this._lineUpCard[i] = label;
        }

        return true;
    },

    update: function () {
        cc.log("LineUpLabel update");
        cc.log(this._lineUp);

        for (var i = 1; i <= MAX_LINE_UP_CARD; ++i) {
            var cardId = this._lineUp.getLineUpByIndex(i);
            var card = this._cardList.getCardByIndex(cardId);
            //this._lineUpCard[i].setString(card.get("name"));
        }
    },

    onTouchesBegan: function (touches, event) {
        var point = touches[0].getLocation();
        if (cc.rectContainsPoint(this._selectRect, point)) {
            this._isMouseDown = true;
        }
    },

    onTouchesMoved: function (touches, event) {
    },

    onTouchesEnded: function (touches, event) {
        if (this._isMouseDown) {
            var point = touches[0].getLocation();

            if (cc.rectContainsPoint(this._selectRect, point)) {
                cc.log("LineUpLabel select");
                this._isMouseDown = false;
            }
        }
    },

    onTouchesCancelled: function (touches, event) {
        this._isMouseDown = false;
    }
})


LineUpLabel.create = function () {
    var ret = new LineUpLabel();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
}