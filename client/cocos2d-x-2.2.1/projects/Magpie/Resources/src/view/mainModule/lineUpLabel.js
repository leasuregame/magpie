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

var MAX_LINEUP_LIST = 2;
var LINE_UP_INDEX = 0;

var LineUpLabel = cc.Layer.extend({
    _cardList: null,
    _lineUp: null,
    _lineUpItem: null,
    _index: 0,

    _card3Guide: null,
    _card4Guide: null,
    _card5Guide: null,

    _succorCardsGuide: null,
    _isClick: false,

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
        this._index = LINE_UP_INDEX;
        this._lineUpItem = [];
        this._succorCardsGuide = [];
        this._isClick = false;

        var bgSprite = cc.Sprite.create(main_scene_image.icon428);
        bgSprite.setPosition(cc.p(320, 0));
        this.addChild(bgSprite);

        var lineUpMenu = cc.Menu.create();
        lineUpMenu.setPosition(cc.p(0, 0));
        this.addChild(lineUpMenu);

        var lineUp = gameData.lineUp;
        var len = lineUp.get("maxLineUp");

        for (var i = 0; i < len; i++) {
            this._lineUpItem[i] = cc.MenuItemImage.create(
                main_scene_image["button" + (81 + i)],
                main_scene_image["button" + (81 + i) + "s"],
                main_scene_image["button" + (81 + i) + "d"],
                this._onClickLineUp,
                this
            );

            this._lineUpItem[i].setAnchorPoint(cc.p(0, 0));
            this._lineUpItem[i].setPosition(cc.p(0 + i * 114, 60));
            lineUpMenu.addChild(this._lineUpItem[i]);
        }

        var scrollViewLayer = MarkLayer.create(cc.rect(0, 0, 600, 165));

        var menu = LazyMenu.create();
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu, 1);

        for (var i = 0; i < len; ++i) {
            var cardList = lineUp.getLineUpCardList(i);
            var count = lineUp.getPerLineUpCount(i);

            for (var j = 0; j < MAX_LINE_UP_CARD; j++) {
                var cardHeadItem = null;
                var effect = null;
                var x = 59 + (i * 5 + j) * 122;
                if (j < count) {
                    cardHeadItem = CardHeadNode.getCardHeadItem(cardList[j], this._onClickCard, this);

                    if (cardList[j]) {
                        effect = cc.BuilderReader.load(main_scene_image.uiEffect44, this);
                        effect.setPosition(cc.p(x, 60));
                        scrollViewLayer.addChild(effect, 2);
                    }

                } else {
                    cardHeadItem = CardHeadNode.getCardHeadItem(-1, this._onClickLock(j), this);
                }

                cardHeadItem.setPosition(cc.p(x, 60));
                menu.addChild(cardHeadItem);
            }
        }

        this._scrollView = cc.ScrollView.create(cc.size(610, 165), scrollViewLayer);
        this._scrollView.setContentSize(cc.size(610 * MAX_LINEUP_LIST, 165));
        this._scrollView.setPosition(cc.p(20, -60));
        this._scrollView.setBounceable(false);
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_HORIZONTAL);
        this._scrollView.updateInset();
        this._scrollView.setContentOffset(this._getScrollViewOffset());
        this.addChild(this._scrollView);

        return true;
    },

    update: function () {
        cc.log("LineUpLabel update");

        var len = gameData.lineUp.get("maxLineUp");
        for (var i = 0; i < len; i++) {
            if (this._index == i) {
                this._lineUpItem[i].setEnabled(false);
                this._lineUpItem[i].setZOrder(2);
            } else {
                this._lineUpItem[i].setEnabled(true);
                this._lineUpItem[i].setZOrder(1);
            }
        }

        this._scrollView.setContentOffset(this._getScrollViewOffset(), true);

        if (this._card3Guide) {
            this._card3Guide.setVisible(this._index == 0);
        }

        if (this._card4Guide) {
            this._card4Guide.setVisible(this._index == 0);
        }

        if (this._card4Guide) {
            this._card3Guide.setVisible(this._index == 0);
        }

        for (var i = 0; i < 5; i++) {
            if (this._succorCardsGuide[i]) {
                this._succorCardsGuide[i].setVisible(this._index == 1);
            }
        }

        LINE_UP_INDEX = this._index;

    },

    _getScrollViewOffset: function () {
        cc.log("LineUpLabel _getScrollViewOffset");

        return cc.p(this._index * -610, 0);
    },

    updateGuide: function () {
        cc.log("LineUpLabel updateGuide");

        if (gameGuide.get("card5Guide") && !this._card5Guide) {
            this._card5Guide = cc.BuilderReader.load(main_scene_image.uiEffect43);
            this._card5Guide.setPosition(cc.p(79 + 122 * 4, 0));
            this._card5Guide.setVisible(false);
            this.addChild(this._card5Guide, 10);
        } else if (gameGuide.get("card4Guide") && !this._card4Guide) {
            this._card4Guide = cc.BuilderReader.load(main_scene_image.uiEffect43);
            this._card4Guide.setPosition(cc.p(79 + 122 * 3, 0));
            this._card4Guide.setVisible(false);
            this.addChild(this._card4Guide, 10);
        } else if (gameGuide.get("card3Guide") && !this._card3Guide) {
            this._card3Guide = cc.BuilderReader.load(main_scene_image.uiEffect43);
            this._card3Guide.setPosition(cc.p(79 + 122 * 2, 0));
            this._card3Guide.setVisible(false);
            this.addChild(this._card3Guide, 10);
        }

        if (gameGuide.get("succorCardsGuide")) {
            for (var i = 0; i < 5; i++) {
                if (!this._succorCardsGuide[i]) {
                    this._succorCardsGuide[i] = cc.BuilderReader.load(main_scene_image.uiEffect43);
                    this._succorCardsGuide[i].setPosition(cc.p(79 + 122 * i, 0));
                    this._succorCardsGuide[i].setVisible(false);
                    this.addChild(this._succorCardsGuide[i], 10);
                }
            }
        }

        this.update();
    },

    _onClickLineUp: function () {
        cc.log("LineUpLabel _onClickCard");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var len = gameData.lineUp.get("maxLineUp");

        this._index = (this._index + 1) % len;
        this._isClick = true;

        this.update();
    },

    _onClickCard: function () {
        cc.log("LineUpLabel _onClickCard");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        if (this._index == 0) {
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
        } else {
            for (var i = 0; i < 5; i++) {
                if (this._succorCardsGuide[i]) {
                    this._succorCardsGuide[i].removeFromParent();
                    this._succorCardsGuide[i] = null;
                }
            }
            gameGuide.set("succorCardsGuide", false);
        }

        MainScene.getInstance().switchTo(CardListLayer.create(SELECT_TYPE_LINEUP, {index: this._index}));

        if (noviceTeachingLayer.isNoviceTeaching()) {
            noviceTeachingLayer.clearAndSave();
            noviceTeachingLayer.next();
        }
    },

    _onClickLock: function (index) {
        var that = this;

        return function () {
            cc.log("LineUpLabel _onClickLock");

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            var table = outputTables.card_lineup_limit.rows[that._index];
            TipLayer.tip(table["card_" + (index + 1)] + " 级开启");
        }
    },

    /**
     * when a touch finished
     * @param {cc.Touch} touches
     * @param {event} event
     */
    onTouchesEnded: function (touches, event) {
        cc.log("LineUpLabel onTouchesEnded");

        if (this._isClick) {
            this._isClick = false;
            return;
        }

        this._scrollView.unscheduleAllCallbacks();
        this._scrollView.stopAllActions();

        var beganOffset = this._getScrollViewOffset();
        var endOffset = this._scrollView.getContentOffset();
        var len = beganOffset.x - endOffset.x;

        if (len !== 0) {
            if (len > 30) {
                this._index = 0 - Math.floor(endOffset.x / 610);
            } else if (len < -30) {
                this._index = 0 - Math.ceil(endOffset.x / 610);
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