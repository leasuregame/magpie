/**
 * Created by xiaoyu on 2014/10/22.
 */

var UnionRequestListLayer = cc.Layer.extend({
    _unionRequestListLayerFit: null,

    _scrollView: null,
    _playerItem: null,
    _list: null,

    init: function (list) {
        if (!this._super()) return false;

        this._unionRequestListLayerFit = gameFit.mainScene.unionRequestListLayer;

        this._list = list || [];
        this._playerItem = [];

        var bgSprite = cc.Sprite.create(main_scene_image.bg11);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._unionRequestListLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        var headIcon = cc.Sprite.create(main_scene_image.icon2);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(this._unionRequestListLayerFit.headIconPoint);
        this.addChild(headIcon);

        var titleIcon = cc.Sprite.create(main_scene_image.icon504);
        titleIcon.setPosition(this._unionRequestListLayerFit.titleIconPoint);
        this.addChild(titleIcon);

        var membersLabel = cc.LabelTTF.create("公会成员：", "STHeitiTC-Medium", 25);
        membersLabel.setPosition(this._unionRequestListLayerFit.membersLabelPoint);
        this.addChild(membersLabel);

        this._countLabel = cc.LabelTTF.create("", "STHeitiTC-Medium", 25);
        this._countLabel.setAnchorPoint(cc.p(0,0.5));
        this._countLabel.setPosition(this._unionRequestListLayerFit.countLabelPoint);
        this.addChild(this._countLabel);

        var backItem = cc.MenuItemImage.create(
            main_scene_image.button8,
            main_scene_image.button8s,
            this._onClickBack,
            this
        );
        backItem.setPosition(this._unionRequestListLayerFit.backItemPoint);

        var menu = cc.Menu.create(backItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        this._skyDialog = SkyDialog.create();
        this.addChild(this._skyDialog, 10);

        var skyLabel = cc.Scale9Sprite.create(main_scene_image.bg16);
        skyLabel.setContentSize(this._unionRequestListLayerFit.labelContentSize);

        var detailItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon120,
            this._onClickDetail,
            this
        );
        detailItem.setPosition(this._unionRequestListLayerFit.detailItemPoint);

        var skyMenu = cc.Menu.create(detailItem);
        skyMenu.setPosition(cc.p(0, 0));
        skyLabel.addChild(skyMenu);

        this._skyDialog.setLabel(skyLabel);
        this._skyDialog.setRect(this._unionRequestListLayerFit.skyDialogRect);

        this.update();

        return true;
    },

    update: function () {
        if (this._scrollView) {
            this._scrollView.removeFromParent();
            this._scrollView = null;
        }

        this._playerItem = [];
        var union = gameData.union;
        this._countLabel.setString(union.get("count") + "/" + union.get("maxCount"));

        var scrollViewLayer = MarkLayer.create(this._unionRequestListLayerFit.scrollViewLayerRect);

        var menu = LazyMenu.create();
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu, 2);

        var len = this._list.length;
        var scrollViewHeight = len * 150;

        for (var i = 0; i < len; i++) {
            var player = this._list[i];
            var y = scrollViewHeight - 75 - i * 150;

            var playerItem = cc.MenuItemImage.create(
                main_scene_image.button15,
                main_scene_image.button15s,
                this._onClickPlayer(i),
                this
            );
            playerItem.setAnchorPoint(cc.p(0, 0.5));
            playerItem.setPosition(cc.p(20, y));
            menu.addChild(playerItem);

            this._playerItem[i] = playerItem;

            var nameBgLabel = cc.Scale9Sprite.create(main_scene_image.icon29);
            nameBgLabel.setContentSize(cc.size(150, 30));
            nameBgLabel.setAnchorPoint(cc.p(0, 0.5));
            nameBgLabel.setPosition(cc.p(25, 100));
            playerItem.addChild(nameBgLabel);

            var nameLabel = cc.LabelTTF.create(player.name, "STHeitiTC-Medium", 25);
            nameLabel.setAnchorPoint(cc.p(0, 0.5));
            nameLabel.setPosition(cc.p(30, 100));
            playerItem.addChild(nameLabel);

            if(player.vip && player.vip > 0) {
                var vipLabel = cc.Sprite.create(main_scene_image["vip" + player.vip]);
                vipLabel.setAnchorPoint(cc.p(0, 0.5));
                vipLabel.setPosition(cc.p(190, 100));
                playerItem.addChild(vipLabel);
            }
            var otherIcon = cc.Sprite.create(main_scene_image.icon30);
            otherIcon.setAnchorPoint(cc.p(0, 0.5));
            otherIcon.setPosition(cc.p(25, 50));
            playerItem.addChild(otherIcon);

            var lvLabel = cc.LabelTTF.create(player.lv, "STHeitiTC-Medium", 20);
            lvLabel.setAnchorPoint(cc.p(0, 0.5));
            lvLabel.setPosition(cc.p(70, 50));
            lvLabel.setColor(cc.c3b(56, 3, 5));
            playerItem.addChild(lvLabel);

            var abilityLabel = cc.LabelTTF.create(player.ability, "STHeitiTC-Medium", 20);
            abilityLabel.setAnchorPoint(cc.p(0, 0.5));
            abilityLabel.setPosition(cc.p(150, 50));
            abilityLabel.setColor(cc.c3b(56, 3, 5));
            playerItem.addChild(abilityLabel);

            var dealMenu = LazyMenu.create();
            dealMenu.setPosition(cc.p(0, 0));
            playerItem.addChild(dealMenu);

            var approveItem = cc.MenuItemImage.createWithIcon(
                main_scene_image.button9,
                main_scene_image.button9s,
                main_scene_image.icon131,
                this._onClickApprove(player.id),
                this
            );
            approveItem.setPosition(cc.p(350, 60));
            dealMenu.addChild(approveItem, 2);

            var refuseItem = cc.MenuItemImage.createWithIcon(
                main_scene_image.button9,
                main_scene_image.button9s,
                main_scene_image.icon133,
                this._onClickRefuse(player.id),
                this
            );
            refuseItem.setPosition(cc.p(500, 60));
            dealMenu.addChild(refuseItem, 2);
        }

        this._scrollView = cc.ScrollView.create(this._unionRequestListLayerFit.scrollViewSize, scrollViewLayer);
        this._scrollView.setPosition(this._unionRequestListLayerFit.scrollViewPoint);
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);

        this._scrollView.setContentSize(cc.size(640, scrollViewHeight));
        this._scrollView.setContentOffset(this._scrollView.minContainerOffset());


    },

    _onClickApprove: function (id) {
        var that = this;
        return function () {
            cc.log("UnionRequestListLayer _onClickApprove: " + id);
            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            gameData.union.unionApprove(function (list) {
                if (list) {
                    that._list = list;
                    that.update();
                }
            }, id);
        }
    },

    _onClickRefuse: function (id) {
        var that = this;
        return function () {
            cc.log("UnionRequestListLayer _onClickRefuse: " + id);
            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            gameData.union.unionRefuse(function (list) {
                if (list) {
                    that._list = list;
                    that.update();
                }
            }, id);
        }
    },

    _onClickPlayer: function (index) {
        var that = this;
        return function () {
            cc.log("UnionRequestListLayer _onClickPlayer: " + index);

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);
            var point = that._playerItem[index].convertToWorldSpace(cc.p(273, 35));

            that._selectId = index;
            that._skyDialog.show(point);
        }
    },

    _onClickDetail: function () {
        cc.log("UnionRequestListLayer _onClickDetail");
        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var player = this._list[this._selectId];

        if (player) {
            gameData.player.playerDetail(function (data) {
                cc.log(data);

                LineUpDetail.pop(data);
            }, player.playerId);
        } else {
            TipLayer.tip("找不到该玩家");
        }

    },

    _onClickBack: function () {
        cc.log("UnionRequestListLayer _onClickBack");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        MainScene.getInstance().switchLayer(UnionManageLayer);
    }
});

UnionRequestListLayer.create = function (list) {
    var ret = new UnionRequestListLayer();

    if (ret && ret.init(list)) {
        return ret;
    }

    return ret;
};