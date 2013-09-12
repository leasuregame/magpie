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

        var mainLayerItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button7,
            main_scene_image.button7s,
            main_scene_image.icon5,
            this._onClickMainLayer,
            this
        );
        mainLayerItem.setPosition(cc.p(93, 141));

        var pveLayerItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button7,
            main_scene_image.button7s,
            main_scene_image.icon6,
            this._onClickPveLayer,
            this
        );
        pveLayerItem.setPosition(cc.p(200, 141));

        var tournamentLayerItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button7,
            main_scene_image.button7s,
            main_scene_image.icon7,
            this._onClickTournamentLayer,
            this
        );
        tournamentLayerItem.setPosition(cc.p(307, 141));

        var rankingLayerItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button7,
            main_scene_image.button7s,
            main_scene_image.icon8,
            this._onClickCardListLayer,
            this
        );
        rankingLayerItem.setPosition(cc.p(414, 141));

        var shopLayerItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button7,
            main_scene_image.button7s,
            main_scene_image.icon9,
            this._onClickShopLayer,
            this
        );
        shopLayerItem.setPosition(cc.p(521, 141));

        var messageLayerItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button7,
            main_scene_image.button7s,
            main_scene_image.icon10,
            this._onClickMessageLayer,
            this
        );
        messageLayerItem.setPosition(cc.p(628, 141));


        var mainMenu = cc.Menu.create(
            mainLayerItem,
            pveLayerItem,
            tournamentLayerItem,
            rankingLayerItem,
            shopLayerItem,
            messageLayerItem
        );
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
});


MainMenuLayer.create = function () {
    var ret = new MainMenuLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};