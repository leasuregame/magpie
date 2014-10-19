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

        var bgLayer = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgLayer.setContentSize(cc.size(500, 600));
        bgLayer.setPosition(gameFit.GAME_MIDPOINT);
        this.addChild(bgLayer);

        var titleBgIcon = cc.Sprite.create(main_scene_image.icon371);
        titleBgIcon.setPosition(cc.p(250, 600));
        bgLayer.addChild(titleBgIcon);

        titleIcon = cc.Sprite.create(main_scene_image.icon495);
        titleIcon.setPosition(cc.p(250, 605));
        bgLayer.addChild(titleIcon);

        var bgLabel = cc.Scale9Sprite.create(main_scene_image.icon169);
        bgLabel.setPosition(cc.p(250, 300));
        bgLabel.setContentSize(cc.size(410, 400));
        bgLayer.addChild(bgLabel);

        var applyForItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button1,
            main_scene_image.button1s,
            main_scene_image.button1d,
            main_scene_image.icon492,
            this._onClickApplyFor,
            this
        );
        applyForItem.setPosition(cc.p(250, 430));

        var createUnionItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button1,
            main_scene_image.button1s,
            main_scene_image.button1d,
            main_scene_image.icon493,
            this._onClickCreateUnion,
            this
        );
        createUnionItem.setPosition(cc.p(250, 300));

        var searchUnionItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button1,
            main_scene_image.button1s,
            main_scene_image.button1d,
            main_scene_image.icon494,
            this._onClickSearchUnion,
            this
        );
        searchUnionItem.setPosition(cc.p(250, 170));

        var menu = cc.Menu.create(applyForItem, createUnionItem, searchUnionItem);
        menu.setPosition(cc.p(0, 0));
        bgLayer.addChild(menu);

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
                ability: 123456,
                isRequest: ((i % 2 == 0) ? true : false)
            })
        }

        var requestUnionLayer = RequestUnionLayer.create(unions);
        MainScene.getInstance().switchTo(requestUnionLayer);
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
