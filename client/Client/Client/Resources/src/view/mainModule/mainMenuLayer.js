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

        var bgSprite = cc.Sprite.create(main_scene_image.main_menu_bg);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(GAME_ZERO);
        this.addChild(bgSprite, -1);

        var mainLayerItem = cc.MenuItemImage.create(main_scene_image.button7, main_scene_image.button7s, this._onClickMainLayer, this);
        mainLayerItem.setPosition(cc.p(110, 143));

        var pveLayerItem = cc.MenuItemImage.create(main_scene_image.button7, main_scene_image.button7s, this._onClickPveLayer, this);
        pveLayerItem.setPosition(cc.p(210, 143));

        var tournamentLayerItem = cc.MenuItemImage.create(main_scene_image.button7, main_scene_image.button7s, this._onClickTournamentLayer, this);
        tournamentLayerItem.setPosition(cc.p(310, 143));

        var rankingLayerItem = cc.MenuItemImage.create(main_scene_image.button7, main_scene_image.button7s, this._onClickCardListLayer, this);
        rankingLayerItem.setPosition(cc.p(410, 143));

        var shopLayerItem = cc.MenuItemImage.create(main_scene_image.button7, main_scene_image.button7s, this._onClickShopLayer, this);
        shopLayerItem.setPosition(cc.p(510, 143));

        var messageLayerItem = cc.MenuItemImage.create(main_scene_image.button7, main_scene_image.button7s, this._onClickMessageLayer, this);
        messageLayerItem.setPosition(cc.p(610, 143));

        var itemIcon = null;
        for(var i = 0; i < 6; ++i) {
            itemIcon = cc.Sprite.create(main_scene_image["icon" + (i + 5)]);
            itemIcon.setPosition(cc.p(110 + i * 100, 140));
            this.addChild(itemIcon, 1);
        }


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