/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-9-8
 * Time: 下午8:40
 * To change this template use File | Settings | File Templates.
 */


/*
 * lv rank layer
 * */


var LvRankLayer = cc.Layer.extend({
    _lvRankLayerFit: null,

    _skyDialog: null,
    _lvRankList: null,
    _selectId: 0,
    _playerItem: {},

    init: function () {
        cc.log("LvRankLayer init");

        if (!this._super()) return false;

        this._lvRankLayerFit = gameFit.mainScene.lvRankLayer;

        this._lvRankList = gameData.rank.get("lvRankList");
        var len = this._lvRankList.length;

        var scrollViewHeight = len * 120;
        if (scrollViewHeight < 700) {
            scrollViewHeight = 700;
        }

        var scrollViewLayer = MarkLayer.create(this._lvRankLayerFit.scrollViewLayerRect);
        var menu = LazyMenu.create();
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu);

        this._playerItem = {};
        var own = gameData.player.get("id");

        for (var i = 0; i < len; ++i) {
            var y = scrollViewHeight - 120 - 120 * i;
            if (this._lvRankList[i].id == own) {

                var myselfSprite = cc.Sprite.create(main_scene_image.button18);
                myselfSprite.setScaleX(1.04);
                myselfSprite.setScaleY(0.9);
                myselfSprite.setAnchorPoint(cc.p(0, 0));
                myselfSprite.setPosition(cc.p(0, y));
                scrollViewLayer.addChild(myselfSprite);

            } else {
                var playerItem = cc.MenuItemImage.create(
                    main_scene_image.button15,
                    main_scene_image.button15s,
                    this._onClickPlayer(i),
                    this
                );
                playerItem.setScaleX(1.04);
                playerItem.setScaleY(0.9);
                playerItem.setAnchorPoint(cc.p(0, 0));
                playerItem.setPosition(cc.p(0, y));
                menu.addChild(playerItem);

                this._playerItem[i] = playerItem;

            }

            if (i < 3) {
                var rankIcon = cc.Sprite.create(main_scene_image["icon" + (201 + i)]);
                rankIcon.setPosition(cc.p(60, y + 60));
                scrollViewLayer.addChild(rankIcon);
            } else {
                var rankLabel = StrokeLabel.create(i + 1, "Arial", 55);
                rankLabel.setColor(cc.c3b(255, 252, 175));
                rankLabel.setPosition(cc.p(60, y + 62));
                scrollViewLayer.addChild(rankLabel);
            }

            var nameIcon = cc.Scale9Sprite.create(main_scene_image.icon29);
            nameIcon.setContentSize(cc.size(155, 35));
            nameIcon.setAnchorPoint(cc.p(0, 0.5));
            nameIcon.setPosition(cc.p(105, y + 80));
            scrollViewLayer.addChild(nameIcon);

            var nameLabel = cc.LabelTTF.create(this._lvRankList[i].name, "STHeitiTC-Medium", 22);
            nameLabel.setColor(cc.c3b(255, 242, 206));
            nameLabel.setAnchorPoint(cc.p(0, 0.5));
            nameLabel.setPosition(cc.p(115, y + 80));
            scrollViewLayer.addChild(nameLabel);

            var lvIcon = cc.Sprite.create(main_scene_image.icon205);
            lvIcon.setPosition(cc.p(420, y + 60));
            scrollViewLayer.addChild(lvIcon);

            var lvLabel = cc.LabelTTF.create(this._lvRankList[i].lv, "Arial", 35);
            lvLabel.setColor(cc.c3b(56, 3, 5));
            lvLabel.setAnchorPoint(cc.p(0, 0.5));
            lvLabel.setPosition(cc.p(465, y + 55));
            scrollViewLayer.addChild(lvLabel);

            var abilityIcon = cc.Sprite.create(main_scene_image.icon207);
            abilityIcon.setPosition(cc.p(140, y + 40));
            scrollViewLayer.addChild(abilityIcon);

            var abilityLabel = cc.LabelTTF.create(this._lvRankList[i].ability, "Arial", 22);
            abilityLabel.setColor(cc.c3b(56, 3, 5));
            abilityLabel.setAnchorPoint(cc.p(0, 0.5));
            abilityLabel.setPosition(cc.p(175, y + 37));
            scrollViewLayer.addChild(abilityLabel);
        }

        var scrollView = cc.ScrollView.create(this._lvRankLayerFit.scrollViewSize, scrollViewLayer);
        scrollView.setPosition(this._lvRankLayerFit.scrollViewPoint);
        scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        scrollView.updateInset();
        this.addChild(scrollView);

        scrollView.setContentSize(cc.size(609, scrollViewHeight));
        scrollView.setContentOffset(scrollView.minContainerOffset());

        this._skyDialog = SkyDialog.create();
        this.addChild(this._skyDialog, 10);

        var label = cc.Scale9Sprite.create(main_scene_image.bg16);
        label.setContentSize(this._lvRankLayerFit.labelContentSize);

        var detailItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon120,
            this._onClickDetail,
            this
        );
        detailItem.setPosition(this._lvRankLayerFit.detailItemPoint);

        var sendMessageItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon119,
            this._onClickSendMessage,
            this
        );
        sendMessageItem.setPosition(this._lvRankLayerFit.sendMessageItemPoint);

        var addFriendItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon41,
            this._onClickAddFriend,
            this
        );
        addFriendItem.setPosition(this._lvRankLayerFit.addFriendItemPoint);

        var menu = cc.Menu.create(detailItem, sendMessageItem, addFriendItem);
        menu.setPosition(cc.p(0, 0));
        label.addChild(menu);

        this._skyDialog.setLabel(label);
        this._skyDialog.setRect(this._lvRankLayerFit.skyDialogRect);

        return true;
    },

    _onClickPlayer: function (index) {
        return function () {
            cc.log("AbilityRankLayer _onClickPlayer");

            var point = this._playerItem[index].convertToWorldSpace(cc.p(255, 90));

            this._selectId = index;
            this._skyDialog.show(point);
        }
    },

    _onClickDetail: function () {
        cc.log("AbilityRankLayer _onClickDetail: " + this._selectId);

        gameData.player.playerDetail(function (data) {
            cc.log(data);

            LineUpDetail.pop(data);
        }, this._lvRankList[this._selectId].id);
    },

    _onClickSendMessage: function () {
        cc.log("AbilityRankLayer _onClickSendMessage: " + this._selectId);

        var player = this._lvRankList[this._selectId];
        SendMessageLayer.pop(player.id, player.name);
    },

    _onClickAddFriend: function () {
        cc.log("AbilityRankLayer _onClickAddFriend: " + this._selectId);

        gameData.friend.addFriend(this._lvRankList[this._selectId].name);
    }
});


LvRankLayer.create = function () {
    var ret = new LvRankLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};