/**
 * Created by lcc3536 on 13-11-14.
 */


/*
 * lottery card layer
 * */


var LotteryCardLayer = LazyLayer.extend({
    _lotteryCardLayerFit: null,
    _index: 0,
    _card: null,
    _fragment: null,
    _cb: null,
    _canClick: false,
    _ccbNode: null,

    onEnter: function () {
        cc.log("LotteryCardLayer onEnter");

        this._super();

        lz.dc.beginLogPageView("抽卡获得卡牌界面");
    },

    onExit: function () {
        cc.log("LotteryCardLayer onExit");

        this._super();

        lz.dc.endLogPageView("抽卡获得卡牌界面");
    },

    init: function (data) {
        cc.log("LotteryCardLayer init");

        if (!this._super()) return false;

        this._lotteryCardLayerFit = gameFit.mainScene.lotteryCardLayer;

        this._card = data.card;
        this._fragment = data.fragment;
        this._cb = data.cb || null;

        this.setTouchPriority(MAIN_MENU_LAYER_HANDLER_PRIORITY);

        this._ccbNode = cc.BuilderReader.load(main_scene_image.uiEffect7, this);
        this._ccbNode.setPosition(this._lotteryCardLayerFit.ccbNodePoint);
        this.addChild(this._ccbNode);

        var controller = this._ccbNode.controller;

        controller.nameLabel.setString(this._card.get("name"));

        var urlList = this._card.getCardFullUrl();
        var len = urlList.length;

        for (var i = 0; i < 3; ++i) {
            if (i < len) {
                controller["cardFull" + i].setTexture(lz.getTexture(urlList[i]));
            } else {
                controller["cardFull" + i].setVisible(false);
            }
        }

        this._ccbNode.animationManager.setCompletedAnimationCallback(this, function () {
            this._canClick = true;
        });


        return true;
    },

    startSetStar: function () {
        cc.log("LotteryCardLayer startSetStar");

        this._index = 0;

        if (this._fragment) {
            var ccbNode = cc.BuilderReader.load(main_scene_image.uiEffect23, this);
            ccbNode.setPosition(this._lotteryCardLayerFit.ccbNodePoint1);
            this.addChild(ccbNode, 1);

            ccbNode.animationManager.runAnimationsForSequenceNamedTweenDuration("animation_1", 0);

        }

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
            if (noviceTeachingLayer.isNoviceTeaching()) {
                noviceTeachingLayer.setVisible(true);
                noviceTeachingLayer.next();
            }

            if(this._cb) {
                this._cb();
            }
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

    return lotteryCardLayer;
};
