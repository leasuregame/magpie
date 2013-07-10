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
    _mainScene: null,

    init: function (mainScene) {
        cc.log("MainMenuLayer init");

        if (!this._super()) return false;
        if (!mainScene) return false;

        this._mainScene = mainScene;

        var mainLayerItem = cc.MenuItemFont.create("主页", this._onClickMainLayer, this);
        mainLayerItem.setAnchorPoint(cc.p(0, 0));
        mainLayerItem.setPosition(42, 88);

        var shopLayerItem = cc.MenuItemFont.create("商城", this._onClickShopLayer, this);
        shopLayerItem.setAnchorPoint(cc.p(0, 0));
        shopLayerItem.setPosition(148, 88);

        var cardLibraryLayerItem = cc.MenuItemFont.create("卡库", this._onClickCardLibraryLayer, this);
        cardLibraryLayerItem.setAnchorPoint(cc.p(0, 0));
        cardLibraryLayerItem.setPosition(254, 88);

        var rankingLayerItem = cc.MenuItemFont.create("排行", this._onClickRankingLayer, this);
        rankingLayerItem.setAnchorPoint(cc.p(0, 0));
        rankingLayerItem.setPosition(360, 88);

        var friendLayerItem = cc.MenuItemFont.create("好友", this._onClickFriendLayer, this);
        friendLayerItem.setAnchorPoint(cc.p(0, 0));
        friendLayerItem.setPosition(466, 88);

        var otherLayerItem = cc.MenuItemFont.create("消息", this._onClickOtherLayer, this);
        otherLayerItem.setAnchorPoint(cc.p(0, 0));
        otherLayerItem.setPosition(572, 88);


        var menu = cc.Menu.create(mainLayerItem, shopLayerItem, cardLibraryLayerItem, rankingLayerItem, friendLayerItem, otherLayerItem);
        menu.setPosition(cc.p(0, 0));

        this.addChild(menu);

        return true;
    },

    _onClickMainLayer: function () {
        cc.log("MainMenuLayer _onClickMainLayer");
        if (this._mainScene) this._mainScene.switchLayer(MainLayer);
    },

    _onClickShopLayer: function () {
        cc.log("MainMenuLayer _onClickShopLayer");
        if (this._mainScene) this._mainScene.switchLayer(ShopLayer);
    },

    _onClickCardLibraryLayer: function () {
        cc.log("MainMenuLayer _onClickCardLibraryLayer");
        if (this._mainScene) this._mainScene.switchLayer(CardLibraryLayer);
    },

    _onClickRankingLayer: function () {
        cc.log("MainMenuLayer _onClickRankingLayer");
        if (this._mainScene) this._mainScene.switchLayer(RankingLayer);
    },

    _onClickFriendLayer: function () {
        cc.log("MainMenuLayer _onClickFriendLayer");
        if (this._mainScene) this._mainScene.switchLayer(FriendLayer);
    },

    _onClickOtherLayer: function () {
        cc.log("MainMenuLayer _onClickOtherLayer");
        if (this._mainScene) this._mainScene.switchLayer(MessageLayer);
    }
})


MainMenuLayer.create = function (mainScene) {
    var ret = new MainMenuLayer();

    if (ret && ret.init(mainScene)) {
        return ret;
    }

    return null;
}