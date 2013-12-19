/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-28
 * Time: 下午5:43
 * To change this template use File | Settings | File Templates.
 */


/*
 * line up detail
 * */


var LineUpDetail = LazyLayer.extend({
    _lineUpDetailFit: null,

    _cardList: [],
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

    onEnter: function () {
        cc.log("LineUpDetail onEnter");

        this._super();

        lz.dc.beginLogPageView("查看其他玩家阵型界面");
    },

    onExit: function () {
        cc.log("LineUpDetail onExit");

        this._super();

        lz.dc.endLogPageView("查看其他玩家阵型界面");
    },

    init: function (data) {
        cc.log("LineUpDetail init");

        if (!this._super()) return false;
        if (!data) return false;

        this._lineUpDetailFit = gameFit.mainScene.lineUpDetail;

        this._locate = this._lineUpDetailFit.locatePoints;
        this._touchRect = this._lineUpDetailFit.touchRect;

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 240), 640, 1136);
        bgLayer.setPosition(this._lineUpDetailFit.bgLayerPoint);
        this.addChild(bgLayer, -1);

        var bgSprite = cc.Sprite.create(main_scene_image.icon32);
        bgSprite.setPosition(this._lineUpDetailFit.bgSpritePoint);
        this.addChild(bgSprite);

        var titleLabel = cc.LabelTTF.create("查 看 阵 型", "STHeitiTC-Medium", 30);
        titleLabel.setColor(cc.c3b(255, 239, 131));
        titleLabel.setPosition(this._lineUpDetailFit.titleLabelPoint);
        this.addChild(titleLabel);

        var nameLabel = cc.LabelTTF.create(data.name, "STHeitiTC-Medium", 20);
        //nameLabel.setColor(cc.c3b(255, 239, 131));
        nameLabel.setPosition(this._lineUpDetailFit.nameLabelPoint);
        this.addChild(nameLabel);

        var lvLabel = cc.LabelTTF.create("等级: " + data.lv, "STHeitiTC-Medium", 20);
        //lvLabel.setColor(cc.c3b(255, 239, 131));
        lvLabel.setPosition(this._lineUpDetailFit.lvLabelPoint);
        this.addChild(lvLabel);

        var abilityLabel = cc.LabelTTF.create("战斗力: " + data.ability, "STHeitiTC-Medium", 20);
        //abilityLabel.setColor(cc.c3b(255, 239, 131));
        abilityLabel.setPosition(this._lineUpDetailFit.abilityLabelPoint);
        this.addChild(abilityLabel);

        this._cardList = [];
        var lineUp = data.lineUp;

        for (var i = 1; i <= MAX_LINE_UP_SIZE; ++i) {
            var point = this._locate[i];

            var nodeBgSprite = cc.Sprite.create(main_scene_image.icon33);
            nodeBgSprite.setPosition(point);
            this.addChild(nodeBgSprite);
            this._nodeBgSprite[i] = nodeBgSprite;

            if (lineUp[i] != undefined) {
                var node = null;

                if (typeof(lineUp[i]) == "number") {
                    node = SpiritNode.create(lineUp[i]);
                } else {
                    var card = Card.create(lineUp[i]);

                    this._cardList.push(card);
                    node = CardHalfNode.create(card);
                }

                node.setPosition(point);
                this.addChild(node, 1);
                this._node[i] = node;
            } else {
                this._node[i] = null;
            }
        }

        var closeItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon36,
            this._onClickClose,
            this
        );
        closeItem.setPosition(this._lineUpDetailFit.closeItemPoint);

        this._menu = cc.Menu.create(closeItem);
        this._menu.setPosition(cc.p(0, 0));
        this.addChild(this._menu);

        return true;
    },

    _onClickClose: function () {
        cc.log("LineUpDetail _onClickOk");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._menu.setEnabled(false);
        this.removeFromParent();
    },

    _onClickCard: function () {
        cc.log("LineUpDetail _onClickCard");
        cc.log(this._selectIndex);

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        if (this._cardList.length > 0) {
            LineUpDetailsLayer.pop(this._cardList, this._selectIndex);
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

    /**
     * callback when a touch event moved
     * @param {cc.Touch} touch
     * @param {event} event
     */
    onTouchBegan: function (touch, event) {
        cc.log("LineUpDetail onTouchBegan");

        var touchPoint = touch.getLocation();

        for (var i = 1; i <= MAX_LINE_UP_SIZE; ++i) {
            if (cc.rectContainsPoint(this._touchRect[i], touchPoint)) {
                if (this._node[i] != null) {
                    cc.log("touch card " + i);

                    this._selectNode = i;
                    this._node[i].setZOrder(2);
                    this._node[i].up();

                    this._beganPoint = touchPoint;
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
        cc.log("LineUpDetail onTouchMoved");

        if (this._selectNode > 0) {
            if (this._isClick) {
                var touchPoint = touch.getLocation();

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
        cc.log("LineUpDetail onTouchEnded");

        var index = this._selectNode;
        if (this._selectNode > 0) {
            this.onTouchCancelled(touch, event);

            if (this._isClick) {

                if (this._node[index] && typeof(this._node[index]) == "object") {
                    for (var i = 0; i < this._cardList.length; i++) {
                        var card = this._cardList[i];
                        if (card == this._node[index]._card) {
                            this._selectIndex = i + 1;
                            break;
                        }
                    }
                }

                if (this._selectIndex > 0) {
                    this._onClickCard();
                }
            }
        }

        this._super(touch, event);
    },

    /**
     * @param {cc.Touch} touch
     * @param {event} event
     */
    onTouchCancelled: function (touch, event) {
        cc.log("LineUpDetail onTouchCancelled");

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


LineUpDetail.create = function (data) {
    var ret = new LineUpDetail();

    if (ret && ret.init(data)) {
        return ret;
    }

    return null;
};

LineUpDetail.pop = function (data) {
    var lineUpDetail = LineUpDetail.create(data);

    MainScene.getInstance().getLayer().addChild(lineUpDetail, 10);

    return lineUpDetail;
};

