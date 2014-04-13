/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-9-8
 * Time: 下午8:41
 * To change this template use File | Settings | File Templates.
 */


/*
 * pass rank layer
 * */


var PassRankLayer = cc.Layer.extend({
    _passRankLayerFit: null,

    _skyDialog: null,
    _passRankList: null,
    _selectId: 0,
    _playerItem: {},

    onEnter: function () {
        cc.log("PassRankLayer onEnter");

        this._super();

        lz.um.beginLogPageView("天道排行榜界面");
    },

    onExit: function () {
        cc.log("PassRankLayer onExit");

        this._super();

        lz.um.endLogPageView("天道排行榜界面");
    },

    init: function () {
        cc.log("PassRankLayer init");

        if (!this._super()) return false;

        this._passRankLayerFit = gameFit.mainScene.passRankLayer;

        this._passRankList = gameData.rank.get("passRankList");
        var len = this._passRankList.length;

        var scrollViewHeight = len * 120;
        if (scrollViewHeight < this._passRankLayerFit.scrollViewHeight) {
            scrollViewHeight = this._passRankLayerFit.scrollViewHeight;
        }

        var slideLabel = [];

        var scrollViewLayer = MarkLayer.create(this._passRankLayerFit.scrollViewLayerRect);

        this._playerItem = {};
        var own = gameData.player.get("id");

        for (var i = 0; i < len; ++i) {
            var y = scrollViewHeight - 120 - 120 * i;

            slideLabel[i] = cc.Node.create();
            slideLabel[i].setPosition(cc.p(0, 0));
            slideLabel[i].setVisible(false);

            var menu = LazyMenu.create();
            menu.setPosition(cc.p(0, 0));
            slideLabel[i].addChild(menu);

            if (this._passRankList[i].id == own) {

                var myselfSprite = cc.Sprite.create(main_scene_image.button18);
                myselfSprite.setScaleX(1.04);
                myselfSprite.setScaleY(0.9);
                myselfSprite.setAnchorPoint(cc.p(0, 0));
                myselfSprite.setPosition(cc.p(0, y));
                slideLabel[i].addChild(myselfSprite);
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
                slideLabel[i].addChild(rankIcon);
            } else {
                var rankLabel = StrokeLabel.create(i + 1, "Arial", 55);
                rankLabel.setColor(cc.c3b(255, 252, 175));
                rankLabel.setPosition(cc.p(60, y + 62));
                slideLabel[i].addChild(rankLabel);
            }

            var nameIcon = cc.Scale9Sprite.create(main_scene_image.icon29);
            nameIcon.setContentSize(cc.size(155, 35));
            nameIcon.setAnchorPoint(cc.p(0, 0.5));
            nameIcon.setPosition(cc.p(105, y + 80));
            slideLabel[i].addChild(nameIcon);

            var nameLabel = cc.LabelTTF.create(this._passRankList[i].name, "STHeitiTC-Medium", 22);
            nameLabel.setColor(cc.c3b(255, 242, 206));
            nameLabel.setAnchorPoint(cc.p(0, 0.5));
            nameLabel.setPosition(cc.p(115, y + 80));
            slideLabel[i].addChild(nameLabel);

            var passIcon = cc.Sprite.create(main_scene_image.icon206);
            passIcon.setPosition(cc.p(420, y + 60));
            slideLabel[i].addChild(passIcon);

            var passLabel = cc.LabelTTF.create(this._passRankList[i].passLayer, "Arial", 35);
            passLabel.setColor(cc.c3b(123, 60, 54));
            passLabel.setAnchorPoint(cc.p(0, 0.5));
            passLabel.setPosition(cc.p(465, y + 55));
            slideLabel[i].addChild(passLabel);

            var abilityIcon = cc.Sprite.create(main_scene_image.icon207);
            abilityIcon.setPosition(cc.p(140, y + 40));
            slideLabel[i].addChild(abilityIcon);

            var abilityLabel = cc.LabelTTF.create(this._passRankList[i].ability, "Arial", 22);
            abilityLabel.setColor(cc.c3b(56, 3, 5));
            abilityLabel.setAnchorPoint(cc.p(0, 0.5));
            abilityLabel.setPosition(cc.p(175, y + 37));
            slideLabel[i].addChild(abilityLabel);

            scrollViewLayer.addChild(slideLabel[i]);
        }

        var scrollView = cc.ScrollView.create(this._passRankLayerFit.scrollViewSize, scrollViewLayer);
        scrollView.setPosition(this._passRankLayerFit.scrollViewPoint);
        scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        scrollView.updateInset();
        this.addChild(scrollView);

        scrollView.setContentSize(cc.size(609, scrollViewHeight));
        scrollView.setContentOffset(scrollView.minContainerOffset());

        this._skyDialog = SkyDialog.create();
        this.addChild(this._skyDialog, 10);

        var label = cc.Scale9Sprite.create(main_scene_image.bg16);
        label.setContentSize(this._passRankLayerFit.labelContentSize);

        var detailItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon120,
            this._onClickDetail,
            this
        );
        detailItem.setPosition(this._passRankLayerFit.detailItemPoint);

        var sendMessageItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon119,
            this._onClickSendMessage,
            this
        );
        sendMessageItem.setPosition(this._passRankLayerFit.sendMessageItemPoint);

        var addFriendItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon41,
            this._onClickAddFriend,
            this
        );
        addFriendItem.setPosition(this._passRankLayerFit.addFriendItemPoint);

        var menu = cc.Menu.create(detailItem, sendMessageItem, addFriendItem);
        menu.setPosition(cc.p(0, 0));
        label.addChild(menu);

        this._skyDialog.setLabel(label);
        this._skyDialog.setRect(this._passRankLayerFit.skyDialogRect);


        var slideLayer = SlideLayer.create(
            {
                labels: slideLabel,
                slideTime: 0.4,
                timeTick: 0.05
            }
        );

        slideLayer.showSlide();


        return true;
    },

    _onClickPlayer: function (index) {
        return function () {
            cc.log("AbilityRankLayer _onClickPlayer");

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            var point = this._playerItem[index].convertToWorldSpace(cc.p(255, 90));

            this._selectId = index;
            this._skyDialog.show(point);
        }
    },

    _onClickDetail: function () {
        cc.log("AbilityRankLayer _onClickDetail: " + this._selectId);

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        gameData.player.playerDetail(function (data) {
            cc.log(data);

            LineUpDetail.pop(data);
        }, this._passRankList[this._selectId].id);
    },

    _onClickSendMessage: function () {
        cc.log("AbilityRankLayer _onClickSendMessage: " + this._selectId);

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var player = this._passRankList[this._selectId];
        SendMessageLayer.pop(player.id, player.name);
    },

    _onClickAddFriend: function () {
        cc.log("AbilityRankLayer _onClickAddFriend: " + this._selectId);

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        gameData.friend.addFriend(this._passRankList[this._selectId].name);
    }
});


PassRankLayer.create = function () {
    var ret = new PassRankLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};