/**
 * Created by xiaoyu on 2014/10/16.
 */

var UnionLayer = cc.Layer.extend({
    _unionLayerFit: null,

    init: function() {
        this._super();

        this._unionLayerFit = gameFit.mainScene.unionLayer;

        var bgSprite = cc.Sprite.create(main_scene_image.bg11);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._unionLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        var headIcon = cc.Sprite.create(main_scene_image.icon2);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(this._unionLayerFit.headIconPoint);
        this.addChild(headIcon);

        var titleIcon = cc.Sprite.create(main_scene_image.icon16);
        titleIcon.setPosition(this._unionLayerFit.titleIconPoint);
        this.addChild(titleIcon);

        var applyForItem = cc.MenuItemImage.create(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            this._onClickApplyFor,
            this
        );
        applyForItem.setPosition(this._unionLayerFit.applyForItemPoint);

        var createUnionItem = cc.MenuItemImage.create(
            main_scene_image.button10,
            main_scene_image.button10s,
            main_scene_image.button9d,
            this._onClickCreateUnion,
            this
        );
        createUnionItem.setPosition(this._unionLayerFit.createUnionItemPoint);

        var searchUnionItem = cc.MenuItemImage.create(
            main_scene_image.button11,
            main_scene_image.button11s,
            main_scene_image.button9d,
            this._onClickSearchUnion,
            this
        );
        searchUnionItem.setPosition(this._unionLayerFit.searchUnionItemPoint);

        var menu = cc.Menu.create(applyForItem, createUnionItem, searchUnionItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        return true;
    },

    _onClickApplyFor: function() {
        cc.log("UnionLayer _onClickApplyFor");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);
    },

    _onClickCreateUnion: function() {
        cc.log("UnionLayer _onClickCreateUnion");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var createUnionLayer = CreateUnionLayer.create();
        MainScene.getInstance().switchTo(createUnionLayer);
    },

    _onClickSearchUnion: function() {
        cc.log("UnionLayer _onClickSearchUnion");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);
    }
});

UnionLayer.create = function () {
    var ret = new UnionLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};
