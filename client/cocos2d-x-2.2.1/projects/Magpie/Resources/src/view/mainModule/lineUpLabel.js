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

var MAX_LINEUP_LIST = 3;

var lineUpIcon = ["icon416", "icon417", "icon417"];

var LineUpLabel = cc.Layer.extend({
    _cardList: null,
    _lineUp: null,
    _lineUpNode: null,
    _index: 0,

    _card3Guide: null,
    _card4Guide: null,
    _card5Guide: null,

    onEnter: function () {
        cc.log("LineUpLabel onEnter");

        this._super();
        this.update();
        this.updateGuide();
    },

    init: function () {
        cc.log("LineUpLabel init");

        if (!this._super()) return false;

        this.setTouchEnabled(true);

        this._cardList = gameData.cardList;
        this._lineUp = gameData.lineUp;
        this._index = MAX_LINEUP_LIST - 1;
        this._lineUpNode = [];

        var lineUpCardList = this._lineUp.getLineUpCardList();

        for (var i = 0; i < MAX_LINEUP_LIST; i++) {

            this._lineUpNode[i] = cc.Node.create();
            this._lineUpNode[i].setPosition(cc.p(0, 0));
            this.addChild(this._lineUpNode[i]);

            var lineUpName = cc.Sprite.create(main_scene_image[lineUpIcon[i]]);
            lineUpName.setAnchorPoint(cc.p(0.5, 0));
            lineUpName.setPosition(cc.p(320, 63));
            this._lineUpNode[i].addChild(lineUpName);

            if (i != 0) {
                var turnLeftIcon = cc.Sprite.create(main_scene_image.icon415);
                turnLeftIcon.setScaleX(-1);
                turnLeftIcon.setPosition(cc.p(20, 0));
                this._lineUpNode[i].addChild(turnLeftIcon);
            }

            if (i != MAX_LINEUP_LIST - 1) {
                var turnRightIcon = cc.Sprite.create(main_scene_image.icon415);
                turnRightIcon.setPosition(cc.p(620, 0));
                this._lineUpNode[i].addChild(turnRightIcon);
            }
        }

        var scrollViewLayer = MarkLayer.create(cc.rect(35, -54, 570, 158));

        //var scrollViewLayer = cc.Layer.create();

        var menu = LazyMenu.create();
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu, 1);

        for (var i = 0; i < MAX_LINEUP_LIST * 5; ++i) {
            var cardHeadItem = null;
            var effect = null;

            var x = 54 + i * 117;
            if (i < 5) {
                cardHeadItem = CardHeadNode.getCardHeadItem(lineUpCardList[i], this._onClickCard, this);

                if (lineUpCardList[i]) {
                    effect = cc.BuilderReader.load(main_scene_image.uiEffect44, this);
                    effect.setAnchorPoint(cc.p(0.5, 0));
                    effect.setPosition(cc.p(x, 0));
                    scrollViewLayer.addChild(effect, 2);
                }

            } else {
                cardHeadItem = CardHeadNode.getCardHeadItem(-1, this._onClickLock(i), this);
            }
            cardHeadItem.setAnchorPoint(cc.p(0.5, 0));
            cardHeadItem.setPosition(cc.p(x, 0));
            menu.addChild(cardHeadItem);
        }

        this._scrollView = cc.ScrollView.create(cc.size(570, 158), scrollViewLayer);
        this._scrollView.setContentSize(cc.size(117 * MAX_LINEUP_LIST * 5, 158));
        this._scrollView.setPosition(cc.p(35, -54));
        this._scrollView.setBounceable(false);
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_HORIZONTAL);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);

        return true;
    },

    update: function () {
        cc.log("LineUpLabel update");

        for (var i = 0; i < MAX_LINEUP_LIST; i++) {
            this._lineUpNode[i].setVisible(false);
        }

        this._lineUpNode[MAX_LINEUP_LIST - this._index - 1].setVisible(true);

        var offset = this._scrollView.minContainerOffset();
        offset.x += this._index * 585 + 15;

        this._scrollView.setContentOffset(offset, true);
    },

    updateGuide: function () {
        cc.log("LineUpLabel updateGuide");

        if (gameGuide.get("card5Guide") && !this._card5Guide) {
            this._card5Guide = cc.BuilderReader.load(main_scene_image.uiEffect43);
            this._card5Guide.setPosition(cc.p(79 + 122 * 4, 0));
            this.addChild(this._card5Guide, 10);
        } else if (gameGuide.get("card4Guide") && !this._card4Guide) {
            this._card4Guide = cc.BuilderReader.load(main_scene_image.uiEffect43);
            this._card4Guide.setPosition(cc.p(79 + 122 * 3, 0));
            this.addChild(this._card4Guide, 10);
        } else if (gameGuide.get("card3Guide") && !this._card3Guide) {
            this._card3Guide = cc.BuilderReader.load(main_scene_image.uiEffect43);
            this._card3Guide.setPosition(cc.p(79 + 122 * 2, 0));
            this.addChild(this._card3Guide, 10);
        }
    },

    _onClickCard: function () {
        cc.log("LineUpLabel _onClickCard");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        if (this._card5Guide) {
            this._card5Guide.removeFromParent();
            this._card5Guide = null;
            gameGuide.set("card5Guide", false);
        }

        if (this._card4Guide) {
            this._card4Guide.removeFromParent();
            this._card4Guide = null;
            gameGuide.set("card4Guide", false);
        }

        if (this._card3Guide) {
            this._card3Guide.removeFromParent();
            this._card3Guide = null;
            gameGuide.set("card3Guide", false);
        }

        MainScene.getInstance().switchTo(CardListLayer.create(SELECT_TYPE_LINEUP, {index: this._index}));

        if (noviceTeachingLayer.isNoviceTeaching()) {
            noviceTeachingLayer.clearAndSave();
            noviceTeachingLayer.next();
        }
    },

    _onClickLock: function (index) {
        var table = outputTables.function_limit.rows[1];

        return function () {
            cc.log("LineUpLabel _onClickLock");

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);
            if (index == 2) {
                TipLayer.tip(table.card3_position + " 级开启");
            } else if (index == 3) {
                TipLayer.tip(table.card4_position + " 级开启");
            } else if (index == 4) {
                TipLayer.tip(table.card5_position + " 级开启");
            }
        }
    },

    /**
     * when a touch finished
     * @param {cc.Touch} touches
     * @param {event} event
     */
    onTouchesEnded: function (touches, event) {
        cc.log("LineUpLabel onTouchesEnded");

        this._scrollView.unscheduleAllCallbacks();
        this._scrollView.stopAllActions();

        var beganOffset = this._scrollView.minContainerOffset();
        var endOffset = this._scrollView.getContentOffset();
        beganOffset.x += this._index * 570;

        var len = beganOffset.x - endOffset.x;
        if (len !== 0) {
            if (len > 80) {
                this._index = MAX_LINEUP_LIST + Math.floor(endOffset.x / 570) - 1;
            } else if (len < -80) {
                this._index = MAX_LINEUP_LIST + Math.ceil(endOffset.x / 570) - 1;
            }

            this.update();
        }
    },

    /**
     * @param touch
     * @param event
     */
    onTouchesCancelled: function (touch, event) {
        cc.log("LineUpLabel onTouchesCancelled");

        this.onTouchEnded(touch, event);
    }
});


LineUpLabel.create = function () {
    var ret = new LineUpLabel();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};