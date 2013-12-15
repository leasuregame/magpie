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
        lz.dc.beginLogPageView("十连抽获得卡牌界面");
    },

    onExit: function () {
        cc.log("TenLotteryCardLayer onExit");

        this._super();
        lz.dc.endLogPageView("十连抽获得卡牌界面");
    },

    init: function (data) {
        cc.log("TenLotteryCardLayer init");

        if(!this._super())  return false;

        this._tenLotteryCardLayerFit = gameFit.mainScene.tenLotteryCardLayer;

        this._canClick = false;
        this._card = data.card;
        this._fragment = data.fragment;

        this.setTouchPriority(MAIN_MENU_LAYER_HANDLER_PRIORITY);

        this._ccbNode = cc.BuilderReader.load(main_scene_image.uiEffect64, this);
        this._ccbNode.setPosition(this._tenLotteryCardLayerFit.ccbNodePoint);
        this._setCard();
        this.addChild(this._ccbNode);

        return true;
    },

    _setCard: function () {
        cc.log("CardEvolutionLayer _setCard");

        for(var i = 0; i < this._cardList.length;i++) {
            var card = this._cardList[i];
            var url = card.get("url");
            var star = card.get("star");
            var index = star > 2 ? star - 2 : 1;
            var skillType = card.get("skillType");

            if (skillType > 3) {
                skillType = 3;
            }

            var cardNode = this._evolutionEffect.controller["card" + i];

            cardNode["card_half"].setTexture(lz.getTexture(main_scene_image[url + "_half" + index]));
            cardNode["card_icon"].setTexture(lz.getTexture(main_scene_image["card_icon" + skillType]));
        }
    },


    onTouchBegan: function (touch, event) {
        cc.log("LazyLayer onTouchBegan");

        if (this._canClick) {
            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            this.removeFromParent();
            if(this._cb) {
                this._cb();
            }
        }
        return true;
    }

});

TenLotteryCardLayer.create = function (data) {
    var ref = new TenLotteryCardLayer();

    if (ref && ref.init(data)) {
        return ref;
    }

    return null;
};

TenLotteryCardLayer.pop = function (data) {
    var tenLotteryCardLayer = TenLotteryCardLayer.create(data);
    MainScene.getInstance().addChild(tenLotteryCardLayer, 10);
};
