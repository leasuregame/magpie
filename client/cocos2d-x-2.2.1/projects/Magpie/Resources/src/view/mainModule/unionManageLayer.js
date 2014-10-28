/**
 * Created by xiaoyu on 2014/10/20.
 */

var UnionManageLayer = cc.Layer.extend({
    _unionManageLayerFit: null,

    init: function () {
        if (!this._super()) return false;

        this._unionManageLayerFit = gameFit.mainScene.unionManageLayer;

        var bgSprite = cc.Sprite.create(main_scene_image.bg11);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._unionManageLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        var headIcon = cc.Sprite.create(main_scene_image.icon2);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(this._unionManageLayerFit.headIconPoint);
        this.addChild(headIcon);

        var titleIcon = cc.Sprite.create(main_scene_image.icon504);
        titleIcon.setPosition(this._unionManageLayerFit.titleIconPoint);
        this.addChild(titleIcon);

        var role = gameData.union.get("role");

        var bgLayer = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgLayer.setPosition(gameFit.GAME_MIDPOINT);
        this.addChild(bgLayer);

        var titleBgIcon = cc.Sprite.create(main_scene_image.icon371);
        bgLayer.addChild(titleBgIcon);

        var titleIcon2 = cc.Sprite.create(main_scene_image.icon495);
        bgLayer.addChild(titleIcon2);

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

        var unionDismissItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button91,
            main_scene_image.button91s,
            main_scene_image.button1d,
            main_scene_image.icon499,
            this._onClickUnionDismissItem,
            this
        );

        var unionQuitItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button91,
            main_scene_image.button91s,
            main_scene_image.button1d,
            main_scene_image.icon500,
            this._onClickUnionQuitItem,
            this
        );

        var menu = cc.Menu.create();
        menu.setPosition(cc.p(0, 0));
        bgLayer.addChild(menu);

        var items = [];
        var y = 0;

        if (role == TYPE_UNION_PRESIDENT) {
            bgLayer.setContentSize(cc.size(460, 640));
            titleBgIcon.setPosition(cc.p(230, 640));
            titleIcon2.setPosition(cc.p(230, 645));
            bgLabel.setPosition(cc.p(230, 340));
            bgLabel.setContentSize(cc.size(350, 500));
            items.push(unionMembersItem, unionApplyForItem, unionQuitItem, unionDismissItem);
            y = 640;
        } else if (role == TYPE_UNION_ELDERS) {
            bgLayer.setContentSize(cc.size(460, 520));
            titleBgIcon.setPosition(cc.p(230, 520));
            titleIcon2.setPosition(cc.p(230, 525));
            bgLabel.setPosition(cc.p(230, 280));
            bgLabel.setContentSize(cc.size(350, 380));
            items.push(unionMembersItem, unionApplyForItem, unionQuitItem);
            y = 520;
        } else {
            bgLayer.setContentSize(cc.size(460, 400));
            titleBgIcon.setPosition(cc.p(230, 400));
            titleIcon2.setPosition(cc.p(230, 405));
            bgLabel.setPosition(cc.p(230, 220));
            bgLabel.setContentSize(cc.size(350, 260));
            items.push(unionMembersItem, unionQuitItem);
            y = 400;
        }

        var len = items.length;
        for (var i = 0; i < len; i++) {
            items[i].setPosition(cc.p(230, y - 110 - 120 * i));
            menu.addChild(items[i]);
        }

        var backItem = cc.MenuItemImage.create(
            main_scene_image.button8,
            main_scene_image.button8s,
            this._onClickBack,
            this
        );
        backItem.setPosition(this._unionManageLayerFit.backItemPoint);

        var backMenu = cc.Menu.create(backItem);
        backMenu.setPosition(cc.p(0, 0));
        this.addChild(backMenu);

        return true;
    },

    _onClickUnionMembers: function () {
        cc.log("UnionManageLayer _onClickUnionMembers");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        ShowUnionLayer.pop(gameData.union.get("memberList"), TYPE_UNION_SHOW_MYSELF);
    },

    _onClickUnionApplyFor: function () {
        cc.log("UnionManageLayer _onClickUnionApplyFor");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        gameData.union.requestList(function(list) {
            if(list) {
                var unionRequestListLayer = UnionRequestListLayer.create(list);
                MainScene.getInstance().switchTo(unionRequestListLayer);
            }
        });
    },

    _onClickUnionQuitItem: function () {
        cc.log("UnionManageLayer _onClickUnionQuitItem");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        gameData.union.unionQuit(function (isSuccess) {
            if(isSuccess) {
                MainScene.getInstance().switchLayer(UnionLayer);
            }
        });
    },

    _onClickUnionDismissItem: function () {
        cc.log("UnionManageLayer _onClickUnionDismissItem");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        gameData.union.unionDismiss(function (isSuccess) {
            if(isSuccess) {
                MainScene.getInstance().switchLayer(UnionLayer);
            }
        });
    },

    _onClickBack: function () {
        cc.log("UnionManageLayer _onClickBack");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);
        MainScene.getInstance().switchLayer(UnionLayer);
    }
});

UnionManageLayer.create = function () {
    var ret = new UnionManageLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};