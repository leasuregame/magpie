/**
 * Created by xiaoyu on 2014/10/16.
 */

var UnionLayer = cc.Layer.extend({
    _unionLayerFit: null,

    init: function() {

        if (!this._super()) return false;

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

        var unions = [];
        for(var i = 0;i < 10;i++) {
            unions.push({
                id: i + 1,
                name: "公会" + (i + 1),
                lv: 5,
                notice: "哈哈哈哈哈哈",
                count: 30,
                maxCount: 50,
                created: "2014-10-10",
                ability: 123456
            })
        }

        var requestUnionLayer = RequestUnionLayer.create(unions);
        this.addChild(requestUnionLayer);
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
        var searchUnionLayer = SearchUnionLayer.create();
        MainScene.getInstance().switchTo(searchUnionLayer);
    }
});

UnionLayer.create = function () {
    var ret = new UnionLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};
