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

            var label = cc.LabelTTF.create("xx", 'Times New Roman', 30);
            label.setPosition(cc.p(i * 100 - 30, 75));
            this.addChild(label);

            this._lineUpCard[i] = label;
        }

        return true;
    },

    update: function () {
        cc.log("LineUpLabel update");

        this.removeAllChildren();

        var lineUpList = this._lineUp.getLineUpList();

        var menu = cc.Menu.create();
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        for (var i = 0; i < MAX_LINE_UP_CARD; ++i) {
            var card = lineUpList[i];
            var star = 1;

            if (card) {
                star = card.get("star");

                var cardItem = cc.MenuItemImage.create(s_h_hero_1, s_h_hero_1, this._onClickCard(card), this);
                cardItem.setPosition(cc.p(80 + 120 * i, 0));
                menu.addChild(cardItem);
            }

            var cardItemBg = cc.Sprite.create(main_scene_image["card_item_bg" + star]);
            cardItemBg.setPosition(cc.p(80 + 120 * i, 0));
            this.addChild(cardItemBg, -1);

            var cardItemFrame = cc.Sprite.create(main_scene_image["card_item_frame" + star]);
            cardItemFrame.setPosition(cc.p(80 + 120 * i, 0));
            this.addChild(cardItemFrame, 1);
        }
    },

    _onClickCard: function (card) {
        return function () {
            cc.log("LineUpLabel _onClickCard");
            cc.log(card);

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