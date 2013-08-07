/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-28
 * Time: 下午5:43
 * To change this template use File | Settings | File Templates.
 */


/*
 * line up layer
 * */


var LineUpLayer = LazyLayer.extend({
    _cardNode: {},
    _selectCard: 0,
    _locate: {
        1: cc.p(172, 764),
        2: cc.p(360, 764),
        3: cc.p(548, 764),
        4: cc.p(172, 553),
        5: cc.p(360, 553),
        6: cc.p(548, 553)
    },
    _touchRect: {
        1: cc.rect(97, 676, 150, 175),
        2: cc.rect(285, 676, 150, 175),
        3: cc.rect(473, 676, 150, 175),
        4: cc.rect(97, 465, 150, 175),
        5: cc.rect(285, 465, 150, 175),
        6: cc.rect(473, 465, 150, 175)
    },

    init: function () {
        cc.log("LineUpLayer init");

        if (!this._super()) return false;

        var bgSprite = cc.Sprite.create(main_scene_image.bg3);
        bgSprite.setPosition(GAME_MIDPOINT);
        this.addChild(bgSprite);

        var lineUp = gameData.lineUp;
        var cardList = gameData.cardList;
        for (var i = 1; i <= MAX_LINE_UP_SIZE; ++i) {
            var cardId = lineUp.getLineUpByIndex(i);

            if (cardId) {
                var card = cardList.getCardByIndex(cardId);

                var cardNode = CardHalfNode.create(card);
                cardNode.setPosition(this._locate[i]);
                this.addChild(cardNode);

                this._cardNode[i] = cardNode;
            } else {
                this._cardNode[i] = null;
            }
        }

        var okItem = cc.MenuItemImage.create(main_scene_image.button9, main_scene_image.button9s, this._onClickOk, this);
        okItem.setPosition(cc.p(GAME_WIDTH_MIDPOINT, 390));
        this.addMenuItem(okItem);

        var closeItem = cc.MenuItemImage.create(main_scene_image.button0, main_scene_image.button0s, this._onClickClose, this);
        closeItem.setPosition(cc.p(620, 1000));
        this.addMenuItem(closeItem);

        var okLabel = cc.Sprite.create(main_scene_image.icon32);
        okLabel.setPosition(cc.p(GAME_WIDTH_MIDPOINT, 390));
        this.addChild(okLabel, 1);

        return true;
    },

    _onClickOk: function () {
        cc.log("LineUpLayer _onClickOk");

        this.setCanClick(false);

        var that = this;
        gameData.lineUp.changeLineUp(function(data) {
            cc.log("yes");
            that.removeFromParent();
        }, this._getLineUpData());
    },

    _onClickClose: function() {
        cc.log("LineUpLayer _okClickClose");

        this.setCanClick(false);
        this.removeFromParent();
    },

    _getLineUpData: function() {
        cc.log("LineUpLayer _getLineUpData");

        var lineUp = {};

        for (var i = 1; i <= MAX_LINE_UP_SIZE; ++i) {
            if(this._cardNode[i] != null) {
                lineUp[i] = this._cardNode[i].getCardId();
            }
        }

        return lineUp;
    },

    /**
     * callback when a touch event moved
     * @param {cc.Touch} touch
     * @param {event} event
     */
    onTouchBegan: function (touch, event) {
        cc.log("LineUpLayer onTouchBegan");

        var point = touch.getLocation();

        for (var i = 1; i <= MAX_LINE_UP_SIZE; ++i) {
            if (cc.rectContainsPoint(this._touchRect[i], point)) {
                if (this._cardNode[i] != null) {
                    cc.log("touch card " + i);

                    this._selectCard = i;
                    this._cardNode[i].setZOrder(1);
                    this._cardNode[i].setPosition(point);

                    return true;
                }
            }
        }

        return this._super(touch, event);
    },

    /**
     * callback when a touch event moved
     * @param {cc.Touch} touch
     * @param {event} event
     */
    onTouchMoved: function (touch, event) {
        cc.log("LineUpLayer onTouchMoved");

        if (this._selectCard > 0) {
            var point = touch.getLocation();

            this._cardNode[this._selectCard].setPosition(point);

            return;
        }

        this._super(touch, event);
    },

    /**
     * callback when a touch event finished
     * @param {cc.Touch} touch
     * @param {event} event
     */
    onTouchEnded: function (touch, event) {
        cc.log("LineUpLayer onTouchEnded");

        if (this._selectCard > 0) {
            var point = touch.getLocation();

            for (var i = 1; i <= MAX_LINE_UP_SIZE; ++i) {
                if (cc.rectContainsPoint(this._touchRect[i], point)) {
                    var cardNode = this._cardNode[this._selectCard];


                    this._cardNode[this._selectCard] = this._cardNode[i];
                    if (this._cardNode[i] != null) {
                        this._cardNode[i].setPosition(this._locate[this._selectCard]);
                    }

                    this._cardNode[i] = cardNode;
                    if (cardNode != null) {
                        cardNode.setPosition(this._locate[i]);
                        cardNode.setZOrder(0);
                    }

                    this._selectCard = 0;

                    return;
                }
            }

            this.onTouchCancelled(touch, event);
        }

        this._super(touch, event);
    },

    /**
     * @param {cc.Touch} touch
     * @param {event} event
     */
    onTouchCancelled: function (touch, event) {
        cc.log("LineUpLayer onTouchCancelled");

        if (this._selectCard > 0) {
            this._cardNode[this._selectCard].setPosition(this._locate[this._selectCard]);
            this._cardNode[this._selectCard].setZOrder(0);
            this._selectCard = 0;
        }

        this._super(touch, event);
    }
})


LineUpLayer.create = function () {
    var ret = new LineUpLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
}