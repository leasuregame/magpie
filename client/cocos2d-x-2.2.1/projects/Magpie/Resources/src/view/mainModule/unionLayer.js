/**
 * Created by xiaoyu on 2014/10/16.
 */

var UnionLayer = cc.Layer.extend({
    _unionLayerFit: null,
    _unionNoticeLabel: null,

    init: function () {

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

        this._addedUnionLayer();

        return true;
    },

    _nonunionLayer: function () {
        var bgLayer = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgLayer.setContentSize(cc.size(460, 520));
        bgLayer.setPosition(gameFit.GAME_MIDPOINT);
        this.addChild(bgLayer);

        var titleBgIcon = cc.Sprite.create(main_scene_image.icon371);
        titleBgIcon.setPosition(cc.p(230, 520));
        bgLayer.addChild(titleBgIcon);

        titleIcon = cc.Sprite.create(main_scene_image.icon495);
        titleIcon.setPosition(cc.p(230, 525));
        bgLayer.addChild(titleIcon);

        var bgLabel = cc.Scale9Sprite.create(main_scene_image.icon169);
        bgLabel.setPosition(cc.p(230, 280));
        bgLabel.setContentSize(cc.size(350, 380));
        bgLayer.addChild(bgLabel);

        var applyForItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button1,
            main_scene_image.button1s,
            main_scene_image.button1d,
            main_scene_image.icon492,
            this._onClickApplyFor,
            this
        );
        applyForItem.setPosition(cc.p(230, 400));

        var createUnionItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button1,
            main_scene_image.button1s,
            main_scene_image.button1d,
            main_scene_image.icon493,
            this._onClickCreateUnion,
            this
        );
        createUnionItem.setPosition(cc.p(230, 280));

        var searchUnionItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button1,
            main_scene_image.button1s,
            main_scene_image.button1d,
            main_scene_image.icon494,
            this._onClickSearchUnion,
            this
        );
        searchUnionItem.setPosition(cc.p(230, 160));

        var menu = cc.Menu.create(applyForItem, createUnionItem, searchUnionItem);
        menu.setPosition(cc.p(0, 0));
        bgLayer.addChild(menu);
    },

    _addedUnionLayer: function () {

        var noticeLabel = cc.LabelTTF.create("公会宣言", "STHeitiTC-Medium", 35);
        noticeLabel.setPosition(this._unionLayerFit.noticeLabelPoint);
        this.addChild(noticeLabel);

        var bgSprite = cc.Sprite.create(main_scene_image.icon370);
        bgSprite.setPosition(this._unionLayerFit.unionNoticeLabelPoint);
        this.addChild(bgSprite);

        var unionNoticeLabel = cc.LabelTTF.create("明晚七点准时上线进行公会大战否则踢出公会", "STHeitiTC-Medium", 22);
        unionNoticeLabel.setPosition(this._unionLayerFit.unionNoticeLabelPoint);
        this.addChild(unionNoticeLabel);

        this._unionNoticeLabel = unionNoticeLabel;

        var updateNoticeItem = cc.MenuItemImage.create(
            main_scene_image.button78,
            main_scene_image.button78s,
            this._onClickUpdateNotice,
            this
        );
        updateNoticeItem.setPosition(this._unionLayerFit.updateNoticeItemPoint);

        var wishTreeItem = cc.MenuItemImage.create(
            main_scene_image.button46,
            main_scene_image.button46s,
            this._onClickWishTree,
            this
        );
        wishTreeItem.setPosition(this._unionLayerFit.wishTreeItemPoint);

        var unionWarsItem = cc.MenuItemImage.create(
            main_scene_image.button46,
            main_scene_image.button46s,
            this._onClickUnionWars,
            this
        );
        unionWarsItem.setPosition(this._unionLayerFit.unionWarsItemPoint);

        var unionShopItem = cc.MenuItemImage.create(
            main_scene_image.button46,
            main_scene_image.button46s,
            this._onClickUnionShop,
            this
        );
        unionShopItem.setPosition(this._unionLayerFit.unionShopItemPoint);

        var unionManageItem = cc.MenuItemImage.create(
            main_scene_image.button46,
            main_scene_image.button46s,
            this._onClickUnionManage,
            this
        );
        unionManageItem.setPosition(this._unionLayerFit.unionManageItemPoint);

        var menu = cc.Menu.create(updateNoticeItem, wishTreeItem, unionWarsItem, unionShopItem, unionManageItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);
    },

    _onClickApplyFor: function () {
        cc.log("UnionLayer _onClickApplyFor");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var unions = [];
        for (var i = 0; i < 10; i++) {
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

    _onClickCreateUnion: function () {
        cc.log("UnionLayer _onClickCreateUnion");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var createUnionLayer = CreateUnionLayer.create();
        MainScene.getInstance().switchTo(createUnionLayer);
    },

    _onClickSearchUnion: function () {
        cc.log("UnionLayer _onClickSearchUnion");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);
        var searchUnionLayer = SearchUnionLayer.create();
        MainScene.getInstance().switchTo(searchUnionLayer);
    },

    _onClickUpdateNotice: function () {
        cc.log("UnionLayer _onClickUpdateNotice");
        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var that = this;
        UpdateUnionNoticeLabel.pop(function (text) {
            that._unionNoticeLabel.setString(text);
        });
    },

    _onClickWishTree: function () {
        cc.log("UnionLayer _onClickWishTree");
        gameData.sound.playEffect(main_scene_image.click_button_sound, false);
    },

    _onClickUnionWars: function () {
        cc.log("UnionLayer _onClickUnionWars");
        gameData.sound.playEffect(main_scene_image.click_button_sound, false);
        TipLayer.tip("敬请期待");
    },

    _onClickUnionShop: function () {
        cc.log("UnionLayer _onClickUnionShop");
        gameData.sound.playEffect(main_scene_image.click_button_sound, false);
        TipLayer.tip("敬请期待");
    },

    _onClickUnionManage: function () {
        cc.log("UnionLayer _onClickUnionManage");
        gameData.sound.playEffect(main_scene_image.click_button_sound, false);
        var unionManageLayer = UnionManageLayer.create();
        MainScene.getInstance().switchTo(unionManageLayer);
    }
});

UnionLayer.create = function () {
    var ret = new UnionLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};
