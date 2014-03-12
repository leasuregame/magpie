/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-12-15
 * Time: 下午2:27
 * To change this template use File | Settings | File Templates.
 */


var TenLotteryCardLayer = LazyLayer.extend({
    _tenLotteryCardLayerFit: null,

    _canClick: false,
    _cardList: [],
    _fragment: null,
    _ccbNode: null,

    onEnter: function () {
        cc.log("TenLotteryCardLayer onEnter");

        this._super();
        lz.um.beginLogPageView("十连抽获得卡牌界面");
    },

    onExit: function () {
        cc.log("TenLotteryCardLayer onExit");

        this._super();
        lz.um.endLogPageView("十连抽获得卡牌界面");
    },

    init: function (data) {
        cc.log("TenLotteryCardLayer init");

        if (!this._super())  return false;

        this._tenLotteryCardLayerFit = gameFit.mainScene.tenLotteryCardLayer;

        this.setTouchPriority(MAIN_MENU_LAYER_HANDLER_PRIORITY);

        this._canClick = false;
        this._cardList = data.card;
        this._fragment = data.fragment;

        this._ccbNode = cc.BuilderReader.load(main_scene_image.uiEffect64, this);
        this._ccbNode.setPosition(this._tenLotteryCardLayerFit.ccbNodePoint);
        this._setCard();
        this.addChild(this._ccbNode);

        this._ccbNode.animationManager.setCompletedAnimationCallback(this, function () {
            this._canClick = true;
        });

        return true;
    },

    _setCard: function () {
        cc.log("TenLotteryCardLayer _setCard");

        for (var i = 0; i < this._cardList.length; i++) {

            var card = this._cardList[i];
            var url = card.get("url");
            var star = card.get("star");
            var index = star > 2 ? star - 2 : 1;

            this["ccbCardFrame" + (i + 1)].setTexture(lz.getTexture(main_scene_image["card_frame" + star]));
            this["ccbCardHalf" + (i + 1)].setTexture(lz.getTexture(main_scene_image[url + "_half" + index]));
            this["ccbCardIcon" + (i + 1)].setTexture(lz.getTexture(main_scene_image[card.getCardIcon()]));
        }
    },

    ccbFnSetFragment: function () {
        cc.log("TenLotteryCardLayer ccbFnSetFragment: " + this._fragment);

        if (this._fragment) {
            var ccbNode = cc.BuilderReader.load(main_scene_image.uiEffect23, this);
            ccbNode.setPosition(this._tenLotteryCardLayerFit.ccbNodePoint1);
            ccbNode.controller.ccbFragment.setString("+" + this._fragment);
            ccbNode.animationManager.runAnimationsForSequenceNamedTweenDuration("animation_1", 0);
            this.addChild(ccbNode, 1);
        }
    },

    onTouchBegan: function (touch, event) {
        cc.log("LazyLayer onTouchBegan");

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


TenLotteryCardLayer.create = function (data) {
    var ret = new TenLotteryCardLayer();

    if (ret && ret.init(data)) {
        return ret;
    }

    return null;
};


TenLotteryCardLayer.pop = function (data) {
    var tenLotteryCardLayer = TenLotteryCardLayer.create(data);
    MainScene.getInstance().addChild(tenLotteryCardLayer, 10);
    return tenLotteryCardLayer;
};
