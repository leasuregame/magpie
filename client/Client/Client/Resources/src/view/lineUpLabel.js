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

    onEnter: function() {
        this._super();
        this.update();
    },

    init : function() {
        cc.log("LineUpLabel init");

        if(!this._super()) return false;

        this._cardList = gameData.cardList;
        this._lineUp = gameData.lineUp;

        bg = cc.LayerColor.create(cc.c4b(100, 0, 100, 100), GAME_WIDTH, 150);
        bg.setAnchorPoint(cc.p(0, 0));
        this.addChild(bg);

        this._lineUpCard = {};
        for(var i = 1; i <= MAX_LINE_UP_CARD; ++i) {
            var cardBg = cc.LayerColor.create(cc.c4b(100, 0, 100, 100), 100, 100);
            cardBg.setPosition(cc.p(i * 100, 648));
            this.addChild(cardBg);

            var label = cc.LabelTTF.create("", 'Times New Roman', 30);
            label.setPosition(cc.p(i * 100, 648));
            this.addChild(label);

            this._lineUpCard[i] = label;
        }

        return true;
    },

    update: function() {
        for(var i = 1; i <= MAX_LINE_UP_CARD; ++i) {
            var cardId = this._lineUp.getLineUpByIndex(i);
            cc.log(cardId);
            var card = this._cardList.getCardByIndex(cardId);
            cc.log(card);
            this._lineUpCard[i].setString(card.get("name"));
        }
    }
})


LineUpLabel.create = function() {
    var ret = new LineUpLabel();

    if(ret && ret.init()) {
        return ret;
    }

    return null;
}