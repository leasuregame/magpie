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
    _menu: null,
    _node: {},
    _selectNode: 0,
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
                var node = null;

                if (cardId == -1) {
                    node = SpiritNode.create();
                } else {
                    node = CardHalfNode.create(cardList.getCardByIndex(cardId));
                }

                node.setPosition(this._locate[i]);
                this.addChild(node);
                this._node[i] = node;
            } else {
                this._node[i] = null;
            }
        }

        var okItem = cc.MenuItemImage.create(
            main_scene_image.button9,
            main_scene_image.button9s,
            this._onClickOk,
            this
        );
        okItem.setPosition(cc.p(GAME_WIDTH_MIDPOINT, 390));

        var closeItem = cc.MenuItemImage.create(
            main_scene_image.button0,
            main_scene_image.button0s,
            this._onClickClose,
            this
        );
        closeItem.setPosition(cc.p(620, 1000));

        this._menu = cc.Menu.create(okItem, closeItem);
        this._menu.setPosition(cc.p(0, 0));
        this.addChild(this._menu);

        var okLabel = cc.Sprite.create(main_scene_image.icon21);
        okLabel.setPosition(cc.p(360, 390));
        this.addChild(okLabel, 1);

        return true;
    },

    _onClickOk: function () {
        cc.log("LineUpLayer _onClickOk");

        this._menu.setEnabled(false);

        var that = this;
        gameData.lineUp.changeLineUp(function (data) {
            that.removeFromParent();
        }, this._getLineUpData());
    },

    _onClickClose: function () {
        cc.log("LineUpLayer _okClickClose");

        this._menu.setEnabled(false);

        this.removeFromParent();
    },

    _getLineUpData: function () {
        cc.log("LineUpLayer _getLineUpData");

        var lineUp = {};

        for (var i = 1; i <= MAX_LINE_UP_SIZE; ++i) {
            if (this._node[i] != null) {
                lineUp[i] = this._node[i].getId();
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
                if (this._node[i] != null) {
                    cc.log("touch card " + i);

                    this._selectNode = i;
                    this._node[i].setZOrder(1);
                    this._node[i].setPosition(point);

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

        if (this._selectNode > 0) {
            var point = touch.getLocation();

            this._node[this._selectNode].setPosition(point);

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

        if (this._selectNode > 0) {
            var point = touch.getLocation();

            for (var i = 1; i <= MAX_LINE_UP_SIZE; ++i) {
                if (cc.rectContainsPoint(this._touchRect[i], point)) {
                    var node = this._node[this._selectNode];


                    this._node[this._selectNode] = this._node[i];
                    if (this._node[i] != null) {
                        this._node[i].setPosition(this._locate[this._selectNode]);
                    }

                    this._node[i] = node;
                    if (node != null) {
                        node.setPosition(this._locate[i]);
                        node.setZOrder(0);
                    }

                    this._selectNode = 0;

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

        if (this._selectNode > 0) {
            this._node[this._selectNode].setPosition(this._locate[this._selectNode]);
            this._node[this._selectNode].setZOrder(0);
            this._selectNode = 0;
        }

        this._super(touch, event);
    }
});


LineUpLayer.create = function () {
    var ret = new LineUpLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};