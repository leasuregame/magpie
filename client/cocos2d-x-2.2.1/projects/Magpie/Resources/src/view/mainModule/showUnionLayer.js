/**
 * Created by xiaoyu on 2014/10/19.
 */
var ShowUnionLayer = cc.Layer.extend({
    _showUnionLayerFit: null,
    _playerItem: null,
    _members: null,
    _type: null,

    init: function (members, type) {
        if (!this._super()) return false;

        this._showUnionLayerFit = gameFit.mainScene.showUnionLayer;

        this._members = members;
        this._playerItem = [];
        this._type = type || TYPE_UNION_SHOW_MYSELF;

        var bgSprite = cc.Sprite.create(main_scene_image.bg11);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._showUnionLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        var headIcon = cc.Sprite.create(main_scene_image.icon2);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(this._showUnionLayerFit.headIconPoint);
        this.addChild(headIcon);

        var titleIcon = cc.Sprite.create(main_scene_image.icon16);
        titleIcon.setPosition(this._showUnionLayerFit.titleIconPoint);
        this.addChild(titleIcon);

        var scrollViewLayer = MarkLayer.create(this._showUnionLayerFit.scrollViewLayerRect);

        var menu = LazyMenu.create();
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu, 2);

        var len = this._members.length;
        var scrollViewHeight = len * 150;

        for (var i = 0; i < len; i++) {
            var player = this._members[i];
            var y = scrollViewHeight - 75 - i * 150;

            var playerItem = null;

            if (player.id == gameData.player.get("id")) {
                playerItem = cc.Sprite.create(main_scene_image.button18);
                scrollViewLayer.addChild(playerItem);
            }
            else {
                playerItem = cc.MenuItemImage.create(
                    main_scene_image.button15,
                    main_scene_image.button15s,
                    this._onClickPlayer(i),
                    this
                );
                playerItem.setEnabled(this._type == TYPE_UNION_SHOW_MYSELF);
                menu.addChild(playerItem);
            }
            playerItem.setAnchorPoint(cc.p(0, 0.5));
            playerItem.setPosition(cc.p(20, y));

            this._playerItem[i] = playerItem;

            var roleIcon = null;

            if (player.role == 1)
                roleIcon = "icon501";
            else if (player.role == 2)
                roleIcon = "icon502";

            if (roleIcon) {
                var roleLabel = cc.Sprite.create(main_scene_image[roleIcon]);
                roleLabel.setAnchorPoint(cc.p(0, 0.5));
                roleLabel.setPosition(cc.p(450, 100));
                playerItem.addChild(roleLabel);
            }

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

            var detailMenu = LazyMenu.create();
            detailMenu.setPosition(cc.p(0, 0));
            playerItem.addChild(detailMenu);

            var detailItem = cc.MenuItemImage.createWithIcon(
                main_scene_image.button9,
                main_scene_image.button9s,
                main_scene_image.icon120,
                this._onClickDetail(i),
                this
            );
            detailItem.setPosition(cc.p(490, 60));
            detailItem.setVisible(this._type == TYPE_UNION_SHOW_OTHER);
            detailMenu.addChild(detailItem, 2);
        }

        this._scrollView = cc.ScrollView.create(this._showUnionLayerFit.scrollViewSize, scrollViewLayer);
        this._scrollView.setPosition(this._showUnionLayerFit.scrollViewPoint);
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);

        this._scrollView.setContentSize(cc.size(640, scrollViewHeight));
        this._scrollView.setContentOffset(this._scrollView.minContainerOffset());

        var backItem = cc.MenuItemImage.create(
            main_scene_image.button8,
            main_scene_image.button8s,
            this._onClickBack,
            this
        );
        backItem.setPosition(this._showUnionLayerFit.backItemPoint);

        var menu = cc.Menu.create(backItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        if(this._type == TYPE_UNION_SHOW_MYSELF) {
            this._skyDialog = SkyDialog.create();
            this.addChild(this._skyDialog, 10);

            var skyLabel = cc.Scale9Sprite.create(main_scene_image.bg16);
            skyLabel.setContentSize(this._showUnionLayerFit.labelContentSize);

            var detailItem = cc.MenuItemImage.createWithIcon(
                main_scene_image.button9,
                main_scene_image.button9s,
                main_scene_image.icon120,
                this._onClickDetail(),
                this
            );
            detailItem.setPosition(this._showUnionLayerFit.detailItemPoint);

            var sendMessageItem = cc.MenuItemImage.createWithIcon(
                main_scene_image.button9,
                main_scene_image.button9s,
                main_scene_image.icon119,
                this._onClickSendMessage,
                this
            );
            sendMessageItem.setPosition(this._showUnionLayerFit.sendMessageItemPoint);

            var battleItem = cc.MenuItemImage.createWithIcon(
                main_scene_image.button9,
                main_scene_image.button9s,
                main_scene_image.icon121,
                this._onClickFight,
                this
            );
            battleItem.setPosition(this._showUnionLayerFit.battleItemPoint);

            var skyMenu = cc.Menu.create(detailItem, sendMessageItem, battleItem);
            skyMenu.setPosition(cc.p(0, 0));
            skyLabel.addChild(skyMenu);

            this._skyDialog.setLabel(skyLabel);
            this._skyDialog.setRect(this._showUnionLayerFit.skyDialogRect);
        }

        return true;
    },

    _onClickPlayer: function (index) {
        var that = this;
        return function () {
            cc.log("ShowUnionLayer _onClickPlayer: " + index);

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);
            var point = that._playerItem[index].convertToWorldSpace(cc.p(273, 35));

            that._selectId = index;
            that._skyDialog.show(point);
        }
    },

    _onClickDetail: function (index) {
        var self = this;
        return function () {
            cc.log("ShowUnionLayer _onClickDetail");
            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            index = index || self._selectId;

            var player = self._members[index];

            if (player) {
                gameData.player.playerDetail(function (data) {
                    cc.log(data);

                    LineUpDetail.pop(data);
                }, player.playerId);
            } else {
                TipLayer.tip("找不到该玩家");
            }
        }
    },

    _onClickSendMessage: function () {
        cc.log("ShowUnionLayer _onClickSendMessage: " + this._selectId);

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var player = this._members[this._selectId];

        if (player) {
            SendMessageLayer.pop(player.playerId, player.name);
        } else {
            TipLayer.tip("找不到该玩家");
        }
    },

    _onClickFight: function () {
        cc.log("ShowUnionLayer _onClickFight: " + this._selectId);

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var player = this._members[this._selectId];

        var that = this;
        gameData.player.fight(function (battleLogId) {
            BattlePlayer.getInstance().play({
                id: battleLogId
            });
        }, player.id);
    },

    _onClickBack: function () {
        cc.log("ShowUnionLayer _onClickBack");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this.removeFromParent();
    }
});

ShowUnionLayer.create = function (members, type) {
    var ret = new ShowUnionLayer();

    if (ret && ret.init(members, type)) {
        return ret
    }

    return null;
};

ShowUnionLayer.pop = function(members, type) {
    var showUnionLayer = ShowUnionLayer.create(members, type);
    MainScene.getInstance().getLayer().addChild(showUnionLayer, 10);
};