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

        var titleIcon = cc.Sprite.create(main_scene_image.icon504);
        titleIcon.setPosition(this._unionLayerFit.titleIconPoint);
        this.addChild(titleIcon);

        var id = gameData.union.get("id");
        if(id && id != -1) {
            this._addedUnionLayer();
        } else {
            this._nonunionLayer();
        }

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

        var leftIcon = cc.Sprite.create(main_scene_image.icon503);
        leftIcon.setScaleX(-1);
        leftIcon.setAnchorPoint(cc.p(0, 0.5));
        leftIcon.setPosition(this._unionLayerFit.leftIconPoint);
        this.addChild(leftIcon);

        var rightIcon = cc.Sprite.create(main_scene_image.icon503);
        rightIcon.setAnchorPoint(cc.p(1, 0.5));
        rightIcon.setPosition(this._unionLayerFit.rightIconPoint);
        this.addChild(rightIcon);

        var union = gameData.union;

        var idLabel= StrokeLabel.create("id：  " + union.get("id"), "STHeitiTC-Medium", 25);
        idLabel.setAnchorPoint(cc.p(0, 0.5));
        idLabel.setPosition(this._unionLayerFit.idLabelPoint);
        this.addChild(idLabel);

        var nameLabel= StrokeLabel.create("名字：" + union.get("name"), "STHeitiTC-Medium", 25);
        nameLabel.setAnchorPoint(cc.p(0, 0.5));
        nameLabel.setPosition(this._unionLayerFit.nameLabelPoint);
        this.addChild(nameLabel);

        var noticeLabel = StrokeLabel.create("公会宣言", "STHeitiTC-Medium", 35);
        noticeLabel.setPosition(this._unionLayerFit.noticeLabelPoint);
        this.addChild(noticeLabel);

        var bgSprite = cc.Sprite.create(main_scene_image.icon370);
        bgSprite.setPosition(this._unionLayerFit.unionNoticeLabelPoint);
        this.addChild(bgSprite);

        var notice = union.get("notice");
        var unionNoticeLabel = cc.LabelTTF.create(notice, "STHeitiTC-Medium", 22);
        unionNoticeLabel.setPosition(this._unionLayerFit.unionNoticeLabelPoint);
        this.addChild(unionNoticeLabel);

        this._unionNoticeLabel = unionNoticeLabel;

        var updateNoticeItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button4,
            main_scene_image.button4s,
            main_scene_image.icon507,
            this._onClickUpdateNotice,
            this
        );
        updateNoticeItem.setPosition(this._unionLayerFit.updateNoticeItemPoint);

        var normalIcon = cc.Sprite.create(main_scene_image.button92);
        var selectedIcon = cc.Sprite.create(main_scene_image.button92);
        selectedIcon.setScale(1.1);

        var wishTreeItem = cc.MenuItemSprite.create(
            normalIcon,
            selectedIcon,
            this._onClickWishTree,
            this
        );
        wishTreeItem.setPosition(this._unionLayerFit.wishTreeItemPoint);

        normalIcon = cc.Sprite.create(main_scene_image.button93);
        selectedIcon = cc.Sprite.create(main_scene_image.button93);
        selectedIcon.setScale(1.1);
        var unionWarsItem = cc.MenuItemSprite.create(
            normalIcon,
            selectedIcon,
            this._onClickUnionWars,
            this
        );
        unionWarsItem.setPosition(this._unionLayerFit.unionWarsItemPoint);

        normalIcon = cc.Sprite.create(main_scene_image.button94);
        selectedIcon = cc.Sprite.create(main_scene_image.button94);
        selectedIcon.setScale(1.1);
        var unionShopItem = cc.MenuItemSprite.create(
            normalIcon,
            selectedIcon,
            this._onClickUnionShop,
            this
        );
        unionShopItem.setPosition(this._unionLayerFit.unionShopItemPoint);

        normalIcon = cc.Sprite.create(main_scene_image.button95);
        selectedIcon = cc.Sprite.create(main_scene_image.button95);
        selectedIcon.setScale(1.1);
        var unionManageItem = cc.MenuItemSprite.create(
            normalIcon,
            selectedIcon,
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

        gameData.union.unionList(function(unions){
            var requestUnionLayer = RequestUnionLayer.create(unions);
            MainScene.getInstance().switchTo(requestUnionLayer);
        });
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

        gameData.union.getTree(function(tree){
            var wishTreeLayer = WishTreeLayer.create(tree);
            MainScene.getInstance().switchTo(wishTreeLayer);
        });

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
        MainScene.getInstance().switchLayer(UnionManageLayer);
    }
});

UnionLayer.create = function () {
    var ret = new UnionLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};
