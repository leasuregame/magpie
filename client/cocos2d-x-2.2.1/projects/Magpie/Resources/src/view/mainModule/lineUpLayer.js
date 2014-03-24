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
    _lineUpLayerFit: null,

    _menu: null,
    _nodeBgSprite: {},
    _node: {},
    _selectNode: 0,
    _isClick: false,
    _beganPoint: null,
    _oldPoint: null,
    _locate: null,
    _touchRect: null,
    _selectIndex: 0,
    _index: 0,

    onEnter: function () {
        cc.log("LineUpLayer onEnter");

        this._super();
        this.update();

        lz.um.beginLogPageView("调整阵型界面");
    },

    onExit: function () {
        cc.log("LineUpLayer onExit");

        this._super();

        lz.um.endLogPageView("调整阵型界面");
    },

    init: function () {
        cc.log("LineUpLayer init");

        if (!this._super()) return false;

        this._lineUpLayerFit = gameFit.mainScene.lineUpLayer;

        this._locate = this._lineUpLayerFit.locatePoints;
        this._touchRect = this._lineUpLayerFit.touchRect;
        this._index = 0;
        this._lineUpItem = [];
        this._lineUp = [];

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 240), 640, 1136);
        bgLayer.setPosition(this._lineUpLayerFit.bgLayerPoint);
        this.addChild(bgLayer, -1);

        var bgSprite = cc.Sprite.create(main_scene_image.icon32);
        bgSprite.setPosition(this._lineUpLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        var len = gameData.lineUp.get("maxLineUp");
        var lineUpIcons = ["icon420", "icon421"];

        var menu = cc.Menu.create();
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        var i;

        for (i = 0; i < len; i++) {
            this._lineUpItem[i] = cc.MenuItemImage.createWithIcon(
                main_scene_image.button76,
                main_scene_image.button76s,
                main_scene_image.button76d,
                main_scene_image[lineUpIcons[i]],
                this._onClickLineUp(i),
                this
            );

            menu.addChild(this._lineUpItem[i]);
        }

        var player = gameData.player;

        var nameLabel = cc.LabelTTF.create(player.get("name"), "STHeitiTC-Medium", 20);
        nameLabel.setPosition(this._lineUpLayerFit.nameLabelPoint);
        this.addChild(nameLabel);

        var lvLabel = cc.LabelTTF.create("等级: " + player.get("lv"), "STHeitiTC-Medium", 20);
        lvLabel.setPosition(this._lineUpLayerFit.lvLabelPoint);
        this.addChild(lvLabel);

        var abilityLabel = cc.LabelTTF.create("战斗力: " + player.get("ability"), "STHeitiTC-Medium", 20);
        abilityLabel.setPosition(this._lineUpLayerFit.abilityLabelPoint);
        this.addChild(abilityLabel);


        for (i = 1; i <= MAX_LINE_UP_SIZE; ++i) {
            var point = this._locate[i];

            var nodeBgSprite = cc.Sprite.create(main_scene_image.icon33);
            nodeBgSprite.setPosition(point);
            this.addChild(nodeBgSprite);
            this._nodeBgSprite[i] = nodeBgSprite;

            var effect = cc.BuilderReader.load(main_scene_image["uiEffect" + (97 + i)], this);
            effect.setPosition(point);
            this.addChild(effect);

        }

        var okItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon21,
            this._onClickOk,
            this
        );
        okItem.setPosition(this._lineUpLayerFit.okItemPoint);

        this._menu = cc.Menu.create(okItem);
        this._menu.setPosition(cc.p(0, 0));
        this.addChild(this._menu);

        this._addLineUp();

        return true;
    },

    _addLineUp: function () {
        cc.log("LineUpLayer addLineUp");

        var lineUp = gameData.lineUp;
        var len = lineUp.get("maxLineUp");
        var cardList = gameData.cardList;

        for (var i = 0; i < len; ++i) {
            var array = [];
            for (var j = 1; j <= MAX_LINE_UP_SIZE; ++j) {
                var point = this._locate[j];
                var id = lineUp.getLineUpCard(i, j);

                if (id != undefined) {
                    var node = null;

                    if (id == -1) {
                        node = SpiritNode.create();
                    } else {
                        node = CardHalfNode.create(cardList.getCardByIndex(id));
                    }

                    node.setPosition(point);
                    this.addChild(node, 1);
                    array[j] = node;
                } else {
                    array[j] = null;
                }
            }
            this._lineUp[i] = array;
        }
    },

    update: function () {

        var lineUp = gameData.lineUp;
        var len = lineUp.get("maxLineUp");

        var point = this._lineUpLayerFit.lineUpItemPoint;

        for (var i = 0; i < len; ++i) {
            var x = point.x + i * 133;

            if (this._index == i) {
                this._lineUpItem[i].setPosition(cc.p(x, point.y - 13));
                this._lineUpItem[i].setOffset(cc.p(0, 13));
                this._lineUpItem[i].setEnabled(false);
            } else {
                var offsetPoint = this._lineUpItem[i].getOffset();
                this._lineUpItem[i].setPosition(cc.p(x, point.y));
                if (offsetPoint.y >= 13) {
                    this._lineUpItem[i].setOffset(cc.p(0, -13));
                }
                this._lineUpItem[i].setEnabled(true);
            }

            var array = this._lineUp[i];
            for (j = 1; j <= MAX_LINE_UP_SIZE; ++j) {
                var node = array[j];
                if (node) {
                    node.setVisible(i == this._index);
                }
            }
        }
    },

    _onClickLineUp: function (index) {
        var that = this;

        return function () {
            cc.log("LineUpLayer _onClickLineUp: " + index);

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            that._index = index;
            that.update();
        }
    },

    _onClickOk: function () {
        cc.log("LineUpLayer _onClickOk");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._menu.setEnabled(false);

        var that = this;
        gameData.lineUp.changeLineUp(function (data) {
            that.removeFromParent();
        }, this._getLineUpData());
    },

    _onClickCard: function () {
        cc.log("LineUpLayer _onClickCard");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var cardList = gameData.lineUp.getLineUpCardList(this._index);

        if (cardList.length > 0) {
            LineUpDetailsLayer.pop(cardList, this._selectIndex, LINEUP_TYPE_MYSELF);
            this._selectIndex = 0;
        }
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

        var len = gameData.lineUp.get("maxLineUp");
        var data = [];

        for (var i = 0; i < len; ++i) {
            var lineUp = {};
            var node = this._lineUp[i];

            for (var j = 1; j <= MAX_LINE_UP_SIZE; ++j) {
                if (node[j] != null) {
                    lineUp[j] = node[j].getId();
                }
            }

            data[i] = lineUp;
        }


        return data;
    },

    /**
     * callback when a touch event moved
     * @param {cc.Touch} touch
     * @param {event} event
     */
    onTouchBegan: function (touch, event) {
        cc.log("LineUpLayer onTouchBegan");

        var touchPoint = touch.getLocation();
        var array = this._lineUp[this._index];

        for (var i = 1; i <= MAX_LINE_UP_SIZE; ++i) {
            if (cc.rectContainsPoint(this._touchRect[i], touchPoint)) {

                if (array[i] != null) {
                    cc.log("touch card " + i);

                    this._selectNode = i;
                    array[i].setZOrder(2);
                    array[i].up();

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
        var array = this._lineUp[this._index];

        if (this._selectNode > 0) {
            var node = array[this._selectNode];
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

        var array = this._lineUp[this._index];

        if (this._selectNode > 0) {
            var index = this._selectNode;

            if (this._isClick) {
                this.onTouchCancelled(touch, event);
                if (array[index] && typeof(array[index]) == "object") {
                    var cardList = gameData.lineUp.getLineUpCardList(this._index);
                    for (var i = 0; i < cardList.length; i++) {
                        var card = cardList[i];
                        if (card == array[index]._card) {
                            this._selectIndex = i + 1;
                            break;
                        }
                    }
                }
                if (this._selectIndex > 0) {
                    this._onClickCard();
                }
                return;
            }

            var node = array[this._selectNode];
            var point = node.getPosition();

            for (var i = 1; i <= MAX_LINE_UP_SIZE; ++i) {
                if (cc.rectContainsPoint(this._touchRect[i], point)) {
                    array[this._selectNode] = array[i];
                    if (array[i] != null) {
                        array[i].setPosition(this._locate[this._selectNode]);
                        this._setCard(this._selectNode);
                    }

                    array[i] = node;
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

        var array = this._lineUp[this._index];
        if (this._selectNode > 0) {
            var node = array[this._selectNode];

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

LineUpLayer.pop = function () {
    var lineUpLayer = LineUpLayer.create();

    MainScene.getInstance().getLayer().addChild(lineUpLayer, 10);

    return lineUpLayer;
};