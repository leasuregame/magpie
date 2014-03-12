/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-10-22
 * Time: 下午10:27
 * To change this template use File | Settings | File Templates.
 */


/*
 * line up details layer
 * */


var LineUpDetailsLayer = cc.Layer.extend({
    _lineUpDetailsLayerFit: null,

    _index: 0,
    _maxIndex: 0,
    _turnLeftSprite: null,
    _turnRightSprite: null,

    onEnter: function () {
        cc.log("LineUpDetailsLayer onEnter");

        this._super();
        this.update();

        lz.um.beginLogPageView("上阵卡牌列表界面");
    },

    onExit: function () {
        cc.log("LineUpDetailsLayer onExit");

        this._super();

        lz.um.endLogPageView("上阵卡牌列表界面");
    },

    init: function (cardList, index) {
        cc.log("LineUpDetailsLayer init");
        if (!this._super()) return false;

        this.setTouchEnabled(true);

        this._lineUpDetailsLayerFit = gameFit.mainScene.lineUpDetailsLayer;
        
        cardList = cardList || [];

        this._index = index;
        var len = cardList.length;
        this._maxIndex = len;
        var scrollViewLayer = cc.Layer.create();
        var scrollViewWidth = len * 640;

        for (var i = 0; i < len; ++i) {
            var cardDetails = CardDetails.create(cardList[i]);
            cardDetails.setPosition(cc.p(640 * i - this._lineUpDetailsLayerFit.cardDetailsOffsetX, 0));
            scrollViewLayer.addChild(cardDetails);
            cardDetails.hideMenu();
        }

        this._scrollView = cc.ScrollView.create(this._lineUpDetailsLayerFit.scrollViewSize, scrollViewLayer);
        this._scrollView.setTouchPriority(MAIN_MENU_LAYER_HANDLER_PRIORITY - 1);
        this._scrollView.setContentSize(cc.size(scrollViewWidth, 1136));
        this._scrollView.setPosition(this._lineUpDetailsLayerFit.scrollViewPoint);
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_HORIZONTAL);
        this._scrollView.setBounceable(false);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);

        this._turnLeftSprite = cc.Sprite.create(main_scene_image.icon37);
        this._turnLeftSprite.setRotation(180);
        this._turnLeftSprite.setPosition(this._lineUpDetailsLayerFit.turnLeftSpritePoint);
        this.addChild(this._turnLeftSprite);

        this._turnRightSprite = cc.Sprite.create(main_scene_image.icon37);
        this._turnRightSprite.setPosition(this._lineUpDetailsLayerFit.turnRightSpritePoint);
        this.addChild(this._turnRightSprite);

        var closeItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            main_scene_image.icon36,
            this._onClickClose,
            this
        );
        closeItem.setPosition(this._lineUpDetailsLayerFit.closeItemPoint);

        this._menu = cc.Menu.create(closeItem);
        this._menu.setTouchPriority(MAIN_MENU_LAYER_HANDLER_PRIORITY);
        this._menu.setPosition(cc.p(0, 0));
        this.addChild(this._menu);

        this._scrollView.setContentOffset(this._getScrollViewOffset());

        return true;
    },

    update: function () {
        cc.log("LineUpDetailsLayer update");

        this._scrollView.setContentOffset(this._getScrollViewOffset(), true);
        this._turnLeftSprite.setVisible(this._index > 1);
        this._turnRightSprite.setVisible(this._index < this._maxIndex);
    },

    _getScrollViewOffset: function () {
        cc.log("LineUpDetailsLayer _getScrollViewOffset");
        cc.log(this._index);
        this._index = Math.max(this._index, 1);
        this._index = Math.min(this._index, this._maxIndex);

        return cc.p(-640 * (this._index - 1), 0);
    },

    /**
     * when a touch finished
     * @param {cc.Touch} touches
     * @param {event} event
     */
    onTouchesEnded: function (touches, event) {
        cc.log("LineUpDetailsLayer onTouchesEnded");

        this._scrollView.unscheduleAllCallbacks();
        this._scrollView.stopAllActions();

        var beganOffset = this._getScrollViewOffset();
        var endOffset = this._scrollView.getContentOffset();
        var len = beganOffset.x - endOffset.x;

        if (len !== 0) {
            if (len > 30) {
                this._index = 1 - Math.floor(endOffset.x / 640);
            } else if (len < -30) {
                this._index = 1 - Math.ceil(endOffset.x / 640);
            }

            this.update();
        }
    },

    _onClickClose: function () {
        cc.log("LineUpDetailsLayer update");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this.removeFromParent();
    }
});


LineUpDetailsLayer.create = function (cardList, index) {
    var ret = new LineUpDetailsLayer();

    if (ret && ret.init(cardList, index)) {
        return ret;
    }

    return null;
};

LineUpDetailsLayer.pop = function (cardList, index) {
    var lineUpDetailsLayer = LineUpDetailsLayer.create(cardList, index);

    MainScene.getInstance().addChild(lineUpDetailsLayer, 10);

    return lineUpDetailsLayer;
};

