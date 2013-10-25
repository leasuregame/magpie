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
    _skyDialog: null,
    _lvRankList: null,
    _selectId: 0,
    _playerItem: {},

    init: function () {
        cc.log("LvRankLayer init");

        if (!this._super()) return false;

        this._lvRankList = gameData.rank.get("lvRankList");
        var len = this._lvRankList.length;

        var scrollViewHeight = len * 100;
        if (scrollViewHeight < 700) {
            scrollViewHeight = 700;
        }

        var scrollViewLayer = MarkLayer.create(cc.rect(54, 228, 609, 700));
        var menu = LazyMenu.create();
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu);

        this._playerItem = {};
        var own = gameData.player.get("id");

        for (var i = 0; i < len; ++i) {
            var y = scrollViewHeight - 100 - 100 * i;

            var playerItem = cc.MenuItemImage.create(
                main_scene_image.button15,
                main_scene_image.button15s,
                this._onClickPlayer(i),
                this
            );
            playerItem.setScale(1.04, 0.75);
            playerItem.setAnchorPoint(cc.p(0, 0));
            playerItem.setPosition(cc.p(0, y));
            menu.addChild(playerItem);

            this._playerItem[i] = playerItem;

            if (this._lvRankList[i].id == own) {
                playerItem.setEnabled(false);

                var myselfSprite = cc.Sprite.create(main_scene_image.icon257);
                myselfSprite.setScale(1.04, 0.75);
                myselfSprite.setAnchorPoint(cc.p(0, 0));
                myselfSprite.setPosition(cc.p(0, y));
                scrollViewLayer.addChild(myselfSprite);
            }

            if (i < 3) {
                var rankIcon = cc.Sprite.create(main_scene_image["icon" + (201 + i)]);
                rankIcon.setPosition(cc.p(60, y + 53));
                scrollViewLayer.addChild(rankIcon);
            }

            var rankLabel = cc.LabelTTF.create(i + 1, "Arial", 55);
            rankLabel.setColor(cc.c3b(255, 252, 175));
            rankLabel.setPosition(cc.p(60, y + 55));
            scrollViewLayer.addChild(rankLabel);

            var nameIcon = cc.Scale9Sprite.create(main_scene_image.icon29);
            nameIcon.setContentSize(cc.size(155, 35));
            nameIcon.setAnchorPoint(cc.p(0, 0.5));
            nameIcon.setPosition(cc.p(105, y + 70));
            scrollViewLayer.addChild(nameIcon);

            var nameLabel = cc.LabelTTF.create(this._lvRankList[i].name, "STHeitiTC-Medium", 22);
            nameLabel.setColor(cc.c3b(255, 242, 206));
            nameLabel.setAnchorPoint(cc.p(0, 0.5));
            nameLabel.setPosition(cc.p(115, y + 70));
            scrollViewLayer.addChild(nameLabel);

            var lvIcon = cc.Sprite.create(main_scene_image.icon205);
            lvIcon.setPosition(cc.p(420, y + 50));
            scrollViewLayer.addChild(lvIcon);

            var lvLabel = cc.LabelTTF.create(this._lvRankList[i].lv, "Arial", 35);
            lvLabel.setColor(cc.c3b(56, 3, 5));
            lvLabel.setAnchorPoint(cc.p(0, 0.5));
            lvLabel.setPosition(cc.p(465, y + 45));
            scrollViewLayer.addChild(lvLabel);

            var abilityIcon = cc.Sprite.create(main_scene_image.icon207);
            abilityIcon.setPosition(cc.p(140, y + 30));
            scrollViewLayer.addChild(abilityIcon);

            var abilityLabel = cc.LabelTTF.create(this._lvRankList[i].ability, "Arial", 22);
            abilityLabel.setColor(cc.c3b(56, 3, 5));
            abilityLabel.setAnchorPoint(cc.p(0, 0.5));
            abilityLabel.setPosition(cc.p(175, y + 27));
            scrollViewLayer.addChild(abilityLabel);
        }

        var scrollView = cc.ScrollView.create(cc.size(609, 700), scrollViewLayer);
        scrollView.setPosition(cc.p(54, 228));
        scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        scrollView.updateInset();
        this.addChild(scrollView);

        scrollView.setContentSize(cc.size(609, scrollViewHeight));
        scrollView.setContentOffset(scrollView.minContainerOffset());

        this._skyDialog = SkyDialog.create();
        this.addChild(this._skyDialog, 10);

        var label = cc.Scale9Sprite.create(main_scene_image.bg16);
        label.setContentSize(cc.size(216, 300));

        var detailItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon120,
            this._onClickDetail,
            this
        );
        detailItem.setPosition(cc.p(108, 240));

        var sendMessageItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon119,
            this._onClickSendMessage,
            this
        );
        sendMessageItem.setPosition(cc.p(108, 150));

        var addFriendItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon41,
            this._onClickAddFriend,
            this
        );
        addFriendItem.setPosition(cc.p(108, 60));

        var menu = cc.Menu.create(detailItem, sendMessageItem, addFriendItem);
        menu.setPosition(cc.p(0, 0));
        label.addChild(menu);

        this._skyDialog.setLabel(label);
        this._skyDialog.setRect(cc.rect(40, 198, 640, 768));

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