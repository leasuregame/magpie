/**
 * Created by lujunyu on 14-5-7.
 */

var ExploreCardLayer = LazyLayer.extend({

    _canClick: false,
    _ccbNode: null,
    _cb: null,
    _card: null,

    onEnter: function () {
        cc.log("ExploreCardLayer onEnter");

        this._super();
        lz.um.beginLogPageView("十连抽获得卡牌界面");
    },

    onExit: function () {
        cc.log("ExploreCardLayer onExit");

        this._super();
        lz.um.endLogPageView("十连抽获得卡牌界面");
    },

    init: function (data) {
        cc.log("ExploreCardLayer init");

        if (!this._super())  return false;

        this.setTouchPriority(MAIN_MENU_LAYER_HANDLER_PRIORITY);

        this._card = data.card;
        this._cb = data.cb;
        this._canClick = false;

        this._ccbNode = cc.BuilderReader.load(main_scene_image.uiEffect110, this);
        this._ccbNode.setPosition(gameFit.GAME_MIDPOINT);

        var controller = this._ccbNode.controller;

        controller.ccbNameLabel.setString(this._card.get("name"));

        var url = this._card.get("url");
        var star = this._card.get("star");
        var index = star > 2 ? star - 2 : 1;

        this["ccbCardFrame1"].setTexture(lz.getTexture(main_scene_image["card_frame" + star]));
        this["ccbCardHalf1"].setTexture(lz.getTexture(main_scene_image[url + "_half" + index]));
        this["ccbCardIcon1"].setTexture(lz.getTexture(this._card.getCardIcon()));

        this.addChild(this._ccbNode);

        this._ccbNode.animationManager.setCompletedAnimationCallback(this, function () {
            this._canClick = true;
        });

        return true;
    },

    ccbFnStartSetStar: function() {
        cc.log("ExploreCardLayer ccbFnStartSetStar");

        this._index = 0;

        this._setStar();
    },

    _setStar: function () {
        cc.log("ExploreCardLayer _setStar");

        var star = this._card.get("star");
        var offset = 60;

        if (this._index < star) {
            var starNode = cc.BuilderReader.load(main_scene_image.uiEffect31, this);
            starNode.setPosition(cc.p(this._index * offset - offset * (star - 1) / 2, -200));
            this._ccbNode.addChild(starNode);

            starNode.animationManager.setCompletedAnimationCallback(this, function () {
                this._setStar();
            });

            this._index += 1;
        }
    },

    onTouchBegan: function (touch, event) {
        cc.log("ExploreCardLayer onTouchBegan");

        if (this._canClick) {
            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            this.removeFromParent();
            if (this._cb) {
                this._cb();
            }
        }

        return true;
    }
});


ExploreCardLayer.create = function (data) {
    var ret = new ExploreCardLayer();

    if (ret && ret.init(data)) {
        return ret;
    }

    return null;
};


ExploreCardLayer.pop = function (data) {
    var exploreCardLayer = ExploreCardLayer.create(data);
    MainScene.getInstance().addChild(exploreCardLayer, 10);
    return exploreCardLayer;
};
