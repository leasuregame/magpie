/**
 * Created by xiaoyu on 2014/10/16.
 */

var UnionLayer = cc.Layer.extend({
    _unionLayerFit: null,

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
        var role = TYPE_UNION_PRESIDENT;

        var bgLayer = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgLayer.setPosition(gameFit.GAME_MIDPOINT);
        this.addChild(bgLayer);

        var titleBgIcon = cc.Sprite.create(main_scene_image.icon371);
        bgLayer.addChild(titleBgIcon);

        var titleIcon = cc.Sprite.create(main_scene_image.icon495);
        bgLayer.addChild(titleIcon);

        var bgLabel = cc.Scale9Sprite.create(main_scene_image.icon169);
        bgLayer.addChild(bgLabel);

        var unionMembersItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button1,
            main_scene_image.button1s,
            main_scene_image.button1d,
            main_scene_image.icon497,
            this._onClickUnionMembers,
            this
        );

        var unionApplyForItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button1,
            main_scene_image.button1s,
            main_scene_image.button1d,
            main_scene_image.icon498,
            this._onClickUnionApplyFor,
            this
        );

        var unionQuitItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button91,
            main_scene_image.button91s,
            main_scene_image.button1d,
            main_scene_image.icon499,
            this._onClickUnionQuitItem,
            this
        );

        var unionDismissItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button91,
            main_scene_image.button91s,
            main_scene_image.button1d,
            main_scene_image.icon500,
            this._onClickUnionDismissItem,
            this
        );

        var menu = cc.Menu.create();
        menu.setPosition(cc.p(0, 0));
        bgLayer.addChild(menu);

        var items = [];
        var y = 0;

        if(role == TYPE_UNION_PRESIDENT) {
            bgLayer.setContentSize(cc.size(460, 640));
            titleBgIcon.setPosition(cc.p(230, 640));
            titleIcon.setPosition(cc.p(230, 645));
            bgLabel.setPosition(cc.p(230, 340));
            bgLabel.setContentSize(cc.size(350, 500));
            items.push(unionMembersItem, unionApplyForItem, unionQuitItem, unionDismissItem);
            y = 640;
        } else if(role == TYPE_UNION_ELDERS){
            bgLayer.setContentSize(cc.size(460, 520));
            titleBgIcon.setPosition(cc.p(230, 520));
            titleIcon.setPosition(cc.p(230, 525));
            bgLabel.setPosition(cc.p(230, 280));
            bgLabel.setContentSize(cc.size(350, 380));
            items.push(unionMembersItem, unionApplyForItem, unionQuitItem);
            y = 520;
        } else {
            bgLayer.setContentSize(cc.size(460, 400));
            titleBgIcon.setPosition(cc.p(230, 400));
            titleIcon.setPosition(cc.p(230, 405));
            bgLabel.setPosition(cc.p(230, 220));
            bgLabel.setContentSize(cc.size(350, 260));
            items.push(unionMembersItem, unionApplyForItem);
            y = 400;
        }

        var len = items.length;
        for(var i = 0;i < len;i++) {
            items[i].setPosition(cc.p(230, y - 110 - 120 * i));
            menu.addChild(items[i]);
        }

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

    _onClickUnionMembers: function() {
        cc.log("UnionLayer _onClickUnionMembers");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);
//        var searchUnionLayer = SearchUnionLayer.create();
//        MainScene.getInstance().switchTo(searchUnionLayer);
    },

    _onClickUnionApplyFor: function() {
        cc.log("UnionLayer _onClickUnionApplyFor");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);
//        var searchUnionLayer = SearchUnionLayer.create();
//        MainScene.getInstance().switchTo(searchUnionLayer);
    },

    _onClickUnionQuitItem: function() {
        cc.log("UnionLayer _onClickUnionQuitItem");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);
//        var searchUnionLayer = SearchUnionLayer.create();
//        MainScene.getInstance().switchTo(searchUnionLayer);
    },

    _onClickUnionDismissItem: function() {
        cc.log("UnionLayer _onClickUnionDismissItem");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);
//        var searchUnionLayer = SearchUnionLayer.create();
//        MainScene.getInstance().switchTo(searchUnionLayer);
    }
});

UnionLayer.create = function () {
    var ret = new UnionLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};
