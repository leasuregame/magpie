/**
 * Created by lcc3536 on 13-11-14.
 */


/*
 * lottery card layer
 * */


var LotteryCardLayer = LazyLayer.extend({
    _index: 0,
    _card: null,
    _canClick: false,
    _ccbNode: null,

    init: function (data) {
        cc.log("LotteryCardLayer init");

        if (!this._super()) return false;

        this._card = data.card;

        this.setTouchPriority(MAIN_MENU_LAYER_HANDLER_PRIORITY);

        this._ccbNode = cc.BuilderReader.load(main_scene_image.uiEffect7, this);
        this._ccbNode.setPosition(cc.p(320, 568));
        this.addChild(this._ccbNode);

        var controller = this._ccbNode.controller;

        controller.nameLabel.setString(this._card.get("name"));
        controller.cardFull.setTexture(lz.getTexture(this._card.getCardFullUrl()));

        var cardFullOverlayUrl = this._card.getCardFullOverlayUrl();
        if (cardFullOverlayUrl) {
            controller.cardFullOverlay.setTexture(lz.getTexture(cardFullOverlayUrl));
        } else {
            controller.cardFullOverlay.setVisible(false);
        }

        this._ccbNode.animationManager.setCompletedAnimationCallback(this, function () {
            this._canClick = true;
        });

        if (data.fragment) {
            var ccbNode = cc.BuilderReader.load(main_scene_image.uiEffect23, this);
            ccbNode.setPosition(cc.p(320, 1020));
            this.addChild(ccbNode, 1);
        }

        return true;
    },

    startSetStar: function () {
        cc.log("LotteryCardLayer startSetStar");

        this._index = 0;

        this._setStar();
    },

    _setStar: function () {
        cc.log("LotteryCardLayer _setStar");

        var star = this._card.get("star");
        var offset = 60;

        if (this._index < star) {
            var starNode = cc.BuilderReader.load(main_scene_image.uiEffect31, this);
            starNode.setPosition(cc.p(this._index * offset - offset * (star - 1) / 2, -350));
            this._ccbNode.addChild(starNode);

            starNode.animationManager.setCompletedAnimationCallback(this, function () {
                this._setStar();
            });

            this._index += 1;
        }
    },

    /**
     * callback when a touch event moved
     * @param {cc.Touch} touch
     * @param {event} event
     */
    onTouchBegan: function (touch, event) {
        cc.log("LazyLayer onTouchBegan");

        if (this._canClick) {
            this.removeFromParent();
        }

        return true;
    }
});


LotteryCardLayer.create = function (data) {
    var ret = new LotteryCardLayer();

    if (ret && ret.init(data)) {
        return ret;
    }

    return null;
};


LotteryCardLayer.pop = function (data) {
    var lotteryCardLayer = LotteryCardLayer.create(data);

    MainScene.getInstance().addChild(lotteryCardLayer, 10);
};
