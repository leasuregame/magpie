/**
 * Created by xiaoyu on 2014/10/19.
 */
var ShowUnionLayer = LazyLayer.extend({
    _showUnionLayerFit: null,
    _playerItem: null,
    _members: null,
    _type: null,
    _addElderItem: null,
    _removeElderItem: null,
    _kickoutItem: null,
    _elderIcons: [],
    _role: null,
    _countLabel: null,

    init: function (members, type) {
        if (!this._super()) return false;
        this._members = members;
        this._playerItem = [];
        this._elderIcons = [];
        this._type = type || TYPE_UNION_SHOW_MYSELF;
        return this.update();
    },

    update: function() {
        this._showUnionLayerFit = gameFit.mainScene.showUnionLayer;
        this._role = gameData.union.get("role");

        var bgSprite = cc.Sprite.create(main_scene_image.bg11);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._showUnionLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        var headIcon = cc.Sprite.create(main_scene_image.icon2);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(this._showUnionLayerFit.headIconPoint);
        this.addChild(headIcon);

        var titleIcon = cc.Sprite.create(main_scene_image.icon504);
        titleIcon.setPosition(this._showUnionLayerFit.titleIconPoint);
        this.addChild(titleIcon);

        var scrollViewLayer = MarkLayer.create(this._showUnionLayerFit.scrollViewLayerRect);

        var menu = LazyMenu.create();
        menu.setTouchPriority(LAZY_LAYER_HANDLER_PRIORITY);
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu, 2);

        var len = this._members.length;
        var scrollViewHeight = len * 150;

        for (var i = 0; i < len; i++) {
            var player = this._members[i];
            var y = scrollViewHeight - 75 - i * 150;

            var playerItem = null;

            if (player.playerId == gameData.player.get("id")) {
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

            var elderLabel = cc.Sprite.create(main_scene_image.icon502);
            elderLabel.setAnchorPoint(cc.p(0, 0.5));
            elderLabel.setPosition(cc.p(450, 100));
            elderLabel.setVisible(player.role == TYPE_UNION_ELDERS);
            playerItem.addChild(elderLabel);

            this._elderIcons[i] = elderLabel;

            if (player.role == TYPE_UNION_DISMISS) {
                var dismissLabel = cc.Sprite.create(main_scene_image.icon501);
                dismissLabel.setAnchorPoint(cc.p(0, 0.5));
                dismissLabel.setPosition(cc.p(450, 100));
                playerItem.addChild(dismissLabel);
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

            if (player.vip && player.vip > 0) {
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
            detailMenu.setTouchPriority(LAZY_LAYER_HANDLER_PRIORITY);
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
        this._scrollView.setTouchPriority(LAZY_LAYER_HANDLER_PRIORITY - 1);
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

        var backMenu = cc.Menu.create(backItem);
        backMenu.setPosition(cc.p(0, 0));
        this.addChild(backMenu);

        if (this._type == TYPE_UNION_SHOW_MYSELF) {
            this._addSkyDialog();
        }

        var membersLabel = cc.LabelTTF.create("公会成员：", "STHeitiTC-Medium", 25);
        membersLabel.setPosition(this._showUnionLayerFit.membersLabelPoint);
        this.addChild(membersLabel);

        this._countLabel = cc.LabelTTF.create("", "STHeitiTC-Medium", 25);
        this._countLabel.setAnchorPoint(cc.p(0,0.5));
        this._countLabel.setPosition(this._showUnionLayerFit.countLabelPoint);
        this.addChild(this._countLabel);

        var union = gameData.union;
        this._countLabel.setString(union.get("count") + "/" + union.get("maxCount"));

        return true;
    },

    _addSkyDialog: function () {
        this._skyDialog = SkyDialog.create();
        this.addChild(this._skyDialog, 10);

        var skyLabel = cc.Scale9Sprite.create(main_scene_image.bg16);
        var size = (this._role == TYPE_UNION_DISMISS) ? cc.size(216, 480) : cc.size(216, 300);
        skyLabel.setContentSize(size);

        var y = size.height;

        var detailItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon120,
            this._onClickDetail(),
            this
        );
        detailItem.setPosition(cc.p(108, y - 60));

        var sendMessageItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon119,
            this._onClickSendMessage,
            this
        );
        sendMessageItem.setPosition(cc.p(108, y - 150));

        var battleItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon121,
            this._onClickFight,
            this
        );
        battleItem.setPosition(cc.p(108, y - 240));

        this._addElderItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon508,
            this._onClickAddElder,
            this
        );
        this._addElderItem.setPosition(cc.p(108, y - 330));
        this._addElderItem.setVisible(false);

        this._removeElderItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon509,
            this._onClickRemoveElder,
            this
        );
        this._removeElderItem.setPosition(cc.p(108, y - 330));
        this._removeElderItem.setVisible(false);

        this._kickoutItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon512,
            this._onClickKickoutMember,
            this
        );
        this._kickoutItem.setPosition(cc.p(108, y - 420));
        this._kickoutItem.setVisible(false);

        var skyMenu = cc.Menu.create(
            detailItem,
            sendMessageItem,
            battleItem,
            this._addElderItem,
            this._removeElderItem,
            this._kickoutItem
        );
        skyMenu.setPosition(cc.p(0, 0));
        skyLabel.addChild(skyMenu);

        this._skyDialog.setLabel(skyLabel);
        this._skyDialog.setRect(this._showUnionLayerFit.skyDialogRect);
    },

    _onClickPlayer: function (index) {
        var that = this;
        return function () {
            cc.log("ShowUnionLayer _onClickPlayer: " + index);

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);
            var point = that._playerItem[index].convertToWorldSpace(cc.p(273, 35));

            that._selectId = index;

            if (that._role == TYPE_UNION_DISMISS) {
                var playerRole = that._members[index].role;
                that._addElderItem.setVisible(playerRole != TYPE_UNION_ELDERS);
                that._removeElderItem.setVisible(playerRole == TYPE_UNION_ELDERS);
                that._kickoutItem.setVisible(playerRole == TYPE_UNION_MEMBER);
            }

            that._skyDialog.show(point);
        }
    },

    _onClickDetail: function (index) {
        var self = this;
        return function () {
            cc.log("ShowUnionLayer _onClickDetail: " + index);
            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            if (index == null) {
                index = self._selectId;
            }

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
        }, player.playerId);
    },

    _onClickAddElder: function () {
        cc.log("ShowUnionLayer _onClickAddElder: " + this._selectId);

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var player = this._members[this._selectId];

        var that = this;
        gameData.union.addElder(function () {
            that._members = gameData.union.get("memberList");
            that._elderIcons[that._selectId].setVisible(true);
        }, player.playerId);
    },

    _onClickRemoveElder: function () {
        cc.log("ShowUnionLayer _onClickRemoveElder: " + this._selectId);

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var player = this._members[this._selectId];

        var that = this;
        gameData.union.removeElder(function () {
            that._members = gameData.union.get("memberList");
            that._elderIcons[that._selectId].setVisible(false);
        }, player.playerId);

    },

    _onClickKickoutMember: function (){
        cc.log("ShowUnionLayer _onClickKickoutMember: " + this._selectId);

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var player = this._members[this._selectId];

        var that = this;

        UnionTipsLabel.pop(TYPE_UNION_KICK, function () {
            gameData.union.kickoutMember(function () {
                that._members = gameData.union.get("memberList").filter(function(m) {
                    return m.playerId != player.playerId;
                });
                that.update();
            }, player.playerId);
        });
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

ShowUnionLayer.pop = function (members, type) {
    var showUnionLayer = ShowUnionLayer.create(members, type);
    MainScene.getInstance().getLayer().addChild(showUnionLayer, 10);
};