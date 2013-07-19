/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-17
 * Time: 上午11:04
 * To change this template use File | Settings | File Templates.
 */


/*
 * main menu layer
 * */


var MainMenuLayer = cc.Layer.extend({
    init: function () {
        cc.log("MainMenuLayer init");

        if (!this._super()) return false;

        var mainLayerItem = cc.MenuItemFont.create("首页", this._onClickMainLayer, this);
        mainLayerItem.setAnchorPoint(cc.p(0, 0));
        mainLayerItem.setPosition(42, 88);

        var pveLayerItem = cc.MenuItemFont.create("关卡", this._onClickPveLayer, this);
        pveLayerItem.setAnchorPoint(cc.p(0, 0));
        pveLayerItem.setPosition(148, 88);

        var tournamentLayerItem = cc.MenuItemFont.create("竞技", this._onClickTournamentLayer, this);
        tournamentLayerItem.setAnchorPoint(cc.p(0, 0));
        tournamentLayerItem.setPosition(254, 88);

        var rankingLayerItem = cc.MenuItemFont.create("卡牌", this._onClickCardListLayer, this);
        rankingLayerItem.setAnchorPoint(cc.p(0, 0));
        rankingLayerItem.setPosition(360, 88);

        var shopLayerItem = cc.MenuItemFont.create("商城", this._onClickShopLayer, this);
        shopLayerItem.setAnchorPoint(cc.p(0, 0));
        shopLayerItem.setPosition(466, 88);

        var messageLayerItem = cc.MenuItemFont.create("消息", this._onClickMessageLayer, this);
        messageLayerItem.setAnchorPoint(cc.p(0, 0));
        messageLayerItem.setPosition(572, 88);


        var mainMenu = cc.Menu.create(mainLayerItem, pveLayerItem, tournamentLayerItem, rankingLayerItem, shopLayerItem, messageLayerItem);
        mainMenu.setPosition(cc.p(0, 0));
        this.addChild(mainMenu);

        return true;
    },

    _onClickMainLayer: function () {
        cc.log("MainMenuLayer _onClickMainLayer");
        MainScene.getInstance().switchLayer(MainLayer);
    },

    _onClickPveLayer: function () {
        cc.log("MainMenuLayer _onClickPveLayer");
        MainScene.getInstance().switchLayer(PveLayer);
    },

    _onClickTournamentLayer: function () {
        cc.log("MainMenuLayer _onClickTournamentLayer");
        MainScene.getInstance().switchLayer(TournamentLayer);
    },

    _onClickCardListLayer: function () {
        cc.log("MainMenuLayer _onClickCardListLayer");
        MainScene.getInstance().switchLayer(CardListLayer);
    },

    _onClickShopLayer: function () {
        cc.log("MainMenuLayer _onClickShopLayer");
        MainScene.getInstance().switchLayer(ShopLayer);
    },

    _onClickMessageLayer: function () {
        cc.log("MainMenuLayer _onClickMessageLayer");
        MainScene.getInstance().switchLayer(MessageLayer);
    }
})


MainMenuLayer.create = function () {
    var ret = new MainMenuLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
}