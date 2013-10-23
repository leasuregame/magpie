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
    _nodeBgSprite: {},
    _node: {},
    _selectNode: 0,
    _isClick: false,
    _beganPoint: null,
    _oldPoint: null,
    _locate: {
        1: cc.p(190, 760),
        2: cc.p(360, 760),
        3: cc.p(530, 760),
        4: cc.p(190, 550),
        5: cc.p(360, 550),
        6: cc.p(530, 550)
    },
    _touchRect: {
        1: cc.rect(123, 681, 135, 158),
        2: cc.rect(293, 681, 135, 158),
        3: cc.rect(463, 681, 135, 158),
        4: cc.rect(123, 471, 135, 158),
        5: cc.rect(293, 471, 135, 158),
        6: cc.rect(463, 471, 135, 158)
    },

    init: function () {
        cc.log("LineUpLayer init");

        if (!this._super()) return false;

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 240), 640, 1136);
        bgLayer.setPosition(cc.p(40, 0));
        this.addChild(bgLayer, -1);

        var bgSprite = cc.Sprite.create(main_scene_image.icon32);
        bgSprite.setPosition(cc.p(360, 700));
        this.addChild(bgSprite);

        var titleLabel = cc.LabelTTF.create("调 整 阵 型", "STHeitiTC-Medium", 30);
        titleLabel.setColor(cc.c3b(255, 239, 131));
        titleLabel.setPosition(cc.p(190, 948));
        this.addChild(titleLabel);

        var player = gameData.player;

        var nameLabel = cc.LabelTTF.create(player.get("name"), "STHeitiTC-Medium", 20);
        nameLabel.setPosition(cc.p(220, 882));
        this.addChild(nameLabel);

        var lvLabel = cc.LabelTTF.create("等级: " + player.get("lv"), "STHeitiTC-Medium", 20);
        lvLabel.setPosition(cc.p(360, 882));
        this.addChild(lvLabel);

        var abilityLabel = cc.LabelTTF.create("战斗力: " + player.get("ability"), "STHeitiTC-Medium", 20);
        abilityLabel.setPosition(cc.p(500, 882));
        this.addChild(abilityLabel);

        var lineUp = gameData.lineUp;
        var cardList = gameData.cardList;
        for (var i = 1; i <= MAX_LINE_UP_SIZE; ++i) {
            var point = this._locate[i];

            var nodeBgSprite = cc.Sprite.create(main_scene_image.icon33);
            nodeBgSprite.setPosition(point);
            this.addChild(nodeBgSprite);
            this._nodeBgSprite[i] = nodeBgSprite;

            var id = lineUp.getLineUpByIndex(i);

            if (id) {
                var node = null;

                if (id == -1) {
                    node = SpiritNode.create();
                } else {
                    node = CardHalfNode.create(cardList.getCardByIndex(id));
                }

                node.setPosition(point);
                this.addChild(node, 1);
                this._node[i] = node;
            } else {
                this._node[i] = null;
            }
        }

        var okItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon21,
            this._onClickOk,
            this
        );
        okItem.setPosition(cc.p(GAME_WIDTH_MIDPOINT, 350));

        this._menu = cc.Menu.create(okItem);
        this._menu.setPosition(cc.p(0, 0));
        this.addChild(this._menu);

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

    _onClickCard: function () {
        cc.log("LineUpLayer _onClickCard");

        LineUpDetailsLayer.pop(gameData.lineUp.getLineUpCardList());
    },

    _setCard: function (index) {
        this._nodeBgSprite[index].runAction(
            cc.Sequence.create(
                cc.ScaleTo.create(0.15, 1.08, 1.08),
                cc.ScaleTo.create(0.3, 1, 1)
            )
        );
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

        var touchPoint = touch.getLocation();

        for (var i = 1; i <= MAX_LINE_UP_SIZE; ++i) {
            if (cc.rectContainsPoint(this._touchRect[i], touchPoint)) {
                if (this._node[i] != null) {
                    cc.log("touch card " + i);

                    this._selectNode = i;
                    this._node[i].setZOrder(2);
                    this._node[i].up();

                    this._beganPoint = touchPoint;
                    this._oldPoint = touchPoint;
                    this._isClick = true;

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
            var node = this._node[this._selectNode];
            var touchPoint = touch.getLocation();
            var nodePoint = node.getPosition();

            nodePoint.x += touchPoint.x - this._oldPoint.x;
            nodePoint.y += touchPoint.y - this._oldPoint.y;

            node.setPosition(nodePoint);

            this._oldPoint = touchPoint;

            if (this._isClick) {
                var x = touchPoint.x - this._beganPoint.x;
                var y = touchPoint.y - this._beganPoint.y;
                var len = x * x + y * y;

                if (len > 100) {
                    cc.log("is no click");

                    this._isClick = false;
                }
            }

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
            if (this._isClick) {
                this.onTouchCancelled(touch, event);
                this._onClickCard();
                return;
            }

            var node = this._node[this._selectNode];
            var point = node.getPosition();

            for (var i = 1; i <= MAX_LINE_UP_SIZE; ++i) {
                if (cc.rectContainsPoint(this._touchRect[i], point)) {
                    this._node[this._selectNode] = this._node[i];
                    if (this._node[i] != null) {
                        this._node[i].setPosition(this._locate[this._selectNode]);
                        this._setCard(this._selectNode);
                    }

                    this._node[i] = node;
                    if (node != null) {
                        node.setPosition(this._locate[i]);
                        node.setZOrder(1);
                        node.put();
                        this._setCard(i);
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
            var node = this._node[this._selectNode];

            node.setPosition(this._locate[this._selectNode]);
            node.setZOrder(1);
            node.put();
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