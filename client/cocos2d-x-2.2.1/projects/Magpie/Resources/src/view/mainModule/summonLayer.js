/**
 * Created by lujunyu on 14-1-23.
 */

var SummonLayer = cc.Layer.extend({
    _summonLayerFit: null,

    _lotteryLayerItem: null,
    _exchangeLayerItem: null,

    onEnter: function () {
        cc.log("SummonLayer onEnter");

        this._super();
        lz.um.beginLogPageView("召唤界面");
    },

    onExit: function () {
        cc.log("SummonLayer onExit");

        this._super();
        lz.um.endLogPageView("召唤界面");
    },

    init: function () {

        if (!this._super()) return false;

        this._summonLayerFit = gameFit.mainScene.summonLayer;

        var headIcon = cc.Sprite.create(main_scene_image.icon1);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(this._summonLayerFit.headIconPoint);
        this.addChild(headIcon, 1);

        this._lotteryLayerItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button22,
            main_scene_image.button22s,
            main_scene_image.button22d,
            main_scene_image.icon360,
            this._onClickLotteryLayer,
            this
        );
        this._lotteryLayerItem.setPosition(this._summonLayerFit.lotteryLayerItemPoint);
        this._lotteryLayerItem.setOffset(cc.p(0, -5));

        this._lotteryMark = cc.BuilderReader.load(main_scene_image.uiEffect34, this);
        this._lotteryMark.setPosition(cc.p(125, 50));
        this._lotteryMark.setVisible(false);
        this._lotteryLayerItem.addChild(this._lotteryMark, 3);

        this._exchangeLayerItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button23,
            main_scene_image.button23s,
            main_scene_image.button23d,
            main_scene_image.icon361,
            this._onClickExchangeLayer,
            this
        );
        this._exchangeLayerItem.setPosition(this._summonLayerFit.exChangeLayerItemPoint);
        this._exchangeLayerItem.setOffset(cc.p(-6, -5));

        this._treasureHuntLayerItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button23,
            main_scene_image.button23s,
            main_scene_image.button23d,
            main_scene_image.icon456,
            this._onClickTreasureHuntLayer,
            this
        );
        this._treasureHuntLayerItem.setOffset(cc.p(-6, -5));
        this._treasureHuntLayerItem.setPosition(this._summonLayerFit.treasureHuntLayerItemPoint);

        this._treasureHuntMark = cc.BuilderReader.load(main_scene_image.uiEffect34, this);
        this._treasureHuntMark.setPosition(cc.p(125, 50));
        this._treasureHuntMark.setVisible(false);
        this._treasureHuntLayerItem.addChild(this._treasureHuntMark, 3);

        var menu = cc.Menu.create(
            this._exchangeLayerItem,
            this._lotteryLayerItem,
            this._treasureHuntLayerItem
        );
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu, 1);

        this._lotteryLayerItem.setEnabled(false);
        this._exchangeLayerItem.setEnabled(true);
        this._treasureHuntLayerItem.setEnabled(true);
        this.switchLayer(LotteryLayer);

        return true;
    },

    updateMark: function () {
        cc.log("SummonLayer updateMark");
        this._lotteryMark.setVisible(gameMark.getLotteryMark());
        this._treasureHuntMark.setVisible(gameMark.getTreasureHuntMark());

    },

    _onClickLotteryLayer: function () {
        cc.log("SummonLayer _onClickLotteryLayer");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._lotteryLayerItem.setEnabled(false);
        this._exchangeLayerItem.setEnabled(true);
        this._treasureHuntLayerItem.setEnabled(true);

        this.switchLayer(LotteryLayer);
    },

    _onClickExchangeLayer: function () {
        cc.log("SummonLayer _onClickExchangeLayer");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._lotteryLayerItem.setEnabled(true);
        this._exchangeLayerItem.setEnabled(false);
        this._treasureHuntLayerItem.setEnabled(true);

        this.switchLayer(ExchangeLayer);
    },

    _onClickTreasureHuntLayer: function() {
        cc.log("SummonLayer _onClickTreasureHuntLayer");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._lotteryLayerItem.setEnabled(true);
        this._exchangeLayerItem.setEnabled(true);
        this._treasureHuntLayerItem.setEnabled(false);

        this.switchLayer(TreasureHuntLayer);
    },

    switchLayer: function (runLayer) {
        cc.log("SummonLayer switchMenu");
        cc.log("this._nowLayer is runLayer " + (this._nowLayer instanceof runLayer));

        if (!(this._nowLayer instanceof runLayer)) {
            if (this._nowLayer != null) this.removeChild(this._nowLayer);
            this._nowLayer = runLayer.create();
            this.addChild(this._nowLayer);
        }
    }

});

SummonLayer.create = function () {
    cc.log("SummonLayer create");

    var ref = new SummonLayer();
    if (ref && ref.init()) {
        return ref;
    }
    return null;
};
