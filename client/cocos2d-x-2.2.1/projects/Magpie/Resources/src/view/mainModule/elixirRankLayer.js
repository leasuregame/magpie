/**
 * Created by lujunyu on 14-2-21.
 */

var ElixirRankLayer = cc.Layer.extend({
    _elixirRankLayerFit: null,

    _scrollView: null,
    _thisWeekItem: null,
    _lastWeekItem: null,
    _selectType: TYPE_THIS_WEEK,
    _thisWeekRank: null,
    _thisWeekElixir: null,
    _lastWeekRank: null,
    _lastWeekElixir: null,
    _rankList: [],

    onEnter: function () {
        cc.log("ElixirRankLayer onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("ElixirRankLayer init");

        if (!this._super()) return false;

        this._elixirRankLayerFit = gameFit.mainScene.elixirRankLayer;

        this._selectType = TYPE_THIS_WEEK;
        this._rankList = [];

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 150), 720, 1136);
        bgLayer.setPosition(cc.p(0, 0));
        this.addChild(bgLayer);

        var headIcon = cc.Sprite.create(main_scene_image.icon381);
        headIcon.setPosition(this._elixirRankLayerFit.headIconPoint);
        this.addChild(headIcon);

        var bgSprite = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgSprite.setContentSize(this._elixirRankLayerFit.bgSpriteSize);
        bgSprite.setAnchorPoint(cc.p(0.5, 0));
        bgSprite.setPosition(this._elixirRankLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        var titleBgIcon = cc.Sprite.create(main_scene_image.icon371);
        titleBgIcon.setPosition(this._elixirRankLayerFit.titleBgIconPoint);
        this.addChild(titleBgIcon);

        var titleIcon = cc.Sprite.create(main_scene_image.icon378);
        titleIcon.setPosition(this._elixirRankLayerFit.titleIconPoint);
        this.addChild(titleIcon);

        this._thisWeekItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button29,
            main_scene_image.button29s,
            main_scene_image.button9,
            main_scene_image.icon379,
            this._onClickThisWeek,
            this
        );

        this._thisWeekItem.setPosition(this._elixirRankLayerFit.thisWeekItemPoint);

        this._lastWeekItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button29,
            main_scene_image.button29s,
            main_scene_image.button9,
            main_scene_image.icon380,
            this._onClickLastWeek,
            this
        );
        this._lastWeekItem.setPosition(this._elixirRankLayerFit.lastWeekItemPoint);

        this._showRewardItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button28,
            main_scene_image.button28s,
            main_scene_image.icon387,
            this._onClickShowReward,
            this
        );
        this._showRewardItem.setAnchorPoint(cc.p(0, 0));
        this._showRewardItem.setPosition(this._elixirRankLayerFit.showRewardItemPoint);

        var closeItem = cc.MenuItemImage.create(
            main_scene_image.button37,
            main_scene_image.button37s,
            this._onClickClose,
            this
        );
        closeItem.setPosition(this._elixirRankLayerFit.closeItemPoint);

        var helpItem = cc.MenuItemImage.create(
            main_scene_image.button41,
            main_scene_image.button41s,
            this._onClickHelp,
            this
        );

        helpItem.setPosition(this._elixirRankLayerFit.helpItemPoint);

        var menu = cc.Menu.create(this._thisWeekItem, this._lastWeekItem, this._showRewardItem, closeItem, helpItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        this._rewardNode = cc.Node.create();
        this._rewardNode.setPosition(cc.p(0, 0));
        this._rewardNode.setVisible(false);
        this.addChild(this._rewardNode, 2);

        var effect = cc.BuilderReader.load(main_scene_image.uiEffect77, this);
        effect.setScale(0.7);
        effect.setPosition(this._elixirRankLayerFit.effectPoint);
        this._rewardNode.addChild(effect);

        var rewardMenu = cc.Menu.create();
        rewardMenu.setPosition(cc.p(0, 0));
        this._rewardNode.addChild(rewardMenu);

        var sprite = cc.Sprite.create(main_scene_image.icon281);
        var getRewardItem = cc.MenuItemLabel.create(
            sprite,
            this._onClickGetReward,
            this
        );

        getRewardItem.setScale(0.88);
        getRewardItem.setAnchorPoint(cc.p(0, 0));
        getRewardItem.setPosition(this._elixirRankLayerFit.getRewardItemPoint);
        rewardMenu.addChild(getRewardItem);

        var rankBgIcon = cc.Scale9Sprite.create(main_scene_image.icon169);
        rankBgIcon.setPosition(this._elixirRankLayerFit.rankBgIconPoint);
        rankBgIcon.setContentSize(this._elixirRankLayerFit.rankBgIconSize);
        this.addChild(rankBgIcon);

        var thisWeekIcon = cc.Sprite.create(main_scene_image.icon385);
        thisWeekIcon.setAnchorPoint(cc.p(0, 0));
        thisWeekIcon.setPosition(this._elixirRankLayerFit.thisWeekIconPoint);
        this.addChild(thisWeekIcon);

        var lastWeekIcon = cc.Sprite.create(main_scene_image.icon386);
        lastWeekIcon.setAnchorPoint(cc.p(0, 0));
        lastWeekIcon.setPosition(this._elixirRankLayerFit.lastWeekIconPoint);
        this.addChild(lastWeekIcon);

        var text = ["排名: ", "仙丹: "];
        this._thisWeekRank = cc.LabelTTF.create("--", "STHeitiTC-Medium", 26);
        this._thisWeekElixir = cc.LabelTTF.create("0", "STHeitiTC-Medium", 26);
        this._lastWeekRank = cc.LabelTTF.create("--", "STHeitiTC-Medium", 26);
        this._lastWeekElixir = cc.LabelTTF.create("0", "STHeitiTC-Medium", 26);

        var label = [this._thisWeekRank, this._thisWeekElixir, this._lastWeekRank, this._lastWeekElixir];
        var point = this._elixirRankLayerFit.labelBasePoint;
        for (var i = 0; i < 4; i++) {
            var x = point.x + 240 * (i % 2);
            var y = point.y - 85 * parseInt(i / 2);
            var bgLabel = cc.Sprite.create(main_scene_image.icon175);
            bgLabel.setScaleX(0.4);
            bgLabel.setScaleY(0.4);
            bgLabel.setAnchorPoint(cc.p(0, 0));
            bgLabel.setPosition(cc.p(x, y));
            this.addChild(bgLabel);

            var textLabel = cc.LabelTTF.create("", "STHeitiTC-Medium", 26);
            textLabel.setAnchorPoint(cc.p(0, 0));
            textLabel.setColor(cc.c3b(219, 166, 103));
            textLabel.setString(text[i % 2]);
            textLabel.setPosition(cc.p(x + 5, y + 5));
            this.addChild(textLabel);

            label[i].setAnchorPoint(cc.p(0, 0));
            label[i].setPosition(cc.p(x + 70, y + 4));
            this.addChild(label[i]);
        }

        this._skyDialog = SkyDialog.create();
        this.addChild(this._skyDialog, 10);

        var skyLabel = cc.Scale9Sprite.create(main_scene_image.bg16);
        skyLabel.setContentSize(this._elixirRankLayerFit.labelContentSize);

        var detailItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon120,
            this._onClickDetail,
            this
        );
        detailItem.setPosition(this._elixirRankLayerFit.detailItemPoint);

        var sendMessageItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon119,
            this._onClickSendMessage,
            this
        );
        sendMessageItem.setPosition(this._elixirRankLayerFit.sendMessageItemPoint);

        var addFriendItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon41,
            this._onClickAddFriend,
            this
        );
        addFriendItem.setPosition(this._elixirRankLayerFit.addFriendItemPoint);

        var skyMenu = cc.Menu.create(detailItem, sendMessageItem, addFriendItem);
        skyMenu.setPosition(cc.p(0, 0));
        skyLabel.addChild(skyMenu);

        this._skyDialog.setLabel(skyLabel);
        this._skyDialog.setRect(this._elixirRankLayerFit.skyDialogRect);

        this._tipLabel = StrokeLabel.create("当前没有排名信息","STHeitiTC-Medium", 25);
        this._tipLabel.setColor(cc.c3b(255, 243, 163));
        this._tipLabel.setBgColor(cc.c3b(120, 12, 42));
        this._tipLabel.setPosition(this._elixirRankLayerFit.tipLabelPoint);
        this._tipLabel.setVisible(false);
        this.addChild(this._tipLabel);

        return true;
    },

    update: function () {
        cc.log("ElixirRankLayer update");

        var lastWeek = gameData.tournament.get("lastWeek");
        var isGet = gameData.tournament.isCanGetReward();
        this._showRewardItem.setEnabled(!isGet);
        this._rewardNode.setVisible(isGet);

        this._rankList = [];

        if (lastWeek) {
            this._lastWeekRank.setString(lastWeek["rank"]);
            this._lastWeekElixir.setString(lastWeek["elixir"]);
        }

        var point = this._elixirRankLayerFit.thisWeekItemPoint;
        var point1 = this._elixirRankLayerFit.lastWeekItemPoint;

        if (this._selectType == TYPE_THIS_WEEK) {
            this._thisWeekItem.setPosition(cc.p(point.x, point.y + 3));
            this._lastWeekItem.setPosition(point1);
            this._thisWeekItem.setEnabled(false);
            this._lastWeekItem.setEnabled(true);

            var that = this;
            gameData.tournament.updateElixirRank(function (data) {
                if (data.thisWeek) {
                    that._thisWeekRank.setString(data.thisWeek["rank"]);
                    that._thisWeekElixir.setString(data.thisWeek["elixir"]);
                }
                if (data.elixirs) {
                    that._rankList = data.elixirs;
                }
                that._addRankScrollView();
            });
        } else {
            this._thisWeekItem.setPosition(point);
            this._lastWeekItem.setPosition(cc.p(point1.x, point1.y + 3));
            this._thisWeekItem.setEnabled(true);
            this._lastWeekItem.setEnabled(false);
            this._rankList = gameData.tournament.get("lastWeekElixirRank");
            this._addRankScrollView();
        }

    },

    _addRankScrollView: function () {
        cc.log("ElixirRankLayer _addRankScrollView");

        if (this._scrollView) {
            this._scrollView.removeFromParent();
            this._scrollView = null;
        }

        var scrollViewLayer = MarkLayer.create(this._elixirRankLayerFit.scrollViewLayerRect);
        var menu = LazyMenu.create();
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu);

        this._playerItem = [];

        var len = this._rankList.length;
        var scrollViewHeight = len * 75;
        if (scrollViewHeight < this._elixirRankLayerFit.scrollViewHeight) {
            scrollViewHeight = this._elixirRankLayerFit.scrollViewHeight;
        }

        this._tipLabel.setVisible(len == 0);

        for (var i = 0; i < len; i++) {
            var y = scrollViewHeight - 65 - 75 * i;
            var player = this._rankList[i];

            if (player.playerId == gameData.player.get("id")) {
                var bgIcon = cc.Sprite.create(main_scene_image.icon382);
                bgIcon.setAnchorPoint(cc.p(0, 0));
                bgIcon.setPosition(cc.p(5, y));
                scrollViewLayer.addChild(bgIcon);
                this._playerItem[i] = bgIcon;
            } else {
                var playerItem = cc.MenuItemImage.create(
                    main_scene_image.button6,
                    main_scene_image.button6s,
                    this._onClickPlayer(i),
                    this
                );
                playerItem.setAnchorPoint(cc.p(0, 0));
                playerItem.setPosition(cc.p(5, y));
                menu.addChild(playerItem);

                this._playerItem[i] = playerItem;
            }

            if (i < 3) {
                var rankIcon = cc.Sprite.create(main_scene_image["icon" + (201 + i)]);
                rankIcon.setPosition(cc.p(42, y + 30));
                scrollViewLayer.addChild(rankIcon);
            } else {
                var rankLabel = StrokeLabel.create(i + 1, "Arial", 55);
                rankLabel.setColor(cc.c3b(255, 252, 175));
                rankLabel.setPosition(cc.p(42, y + 32));
                scrollViewLayer.addChild(rankLabel);
            }

            var nameIcon = cc.Sprite.create(main_scene_image.icon383);
            nameIcon.setAnchorPoint(cc.p(0, 0.5));
            nameIcon.setPosition(cc.p(105, y + 30));
            scrollViewLayer.addChild(nameIcon);

            var nameLabel = cc.LabelTTF.create(player.name, "STHeitiTC-Medium", 22);
            nameLabel.setAnchorPoint(cc.p(0, 0.5));
            nameLabel.setPosition(cc.p(115, y + 28));
            scrollViewLayer.addChild(nameLabel);

            var elixirIcon = cc.Sprite.create(main_scene_image.icon151);
            elixirIcon.setAnchorPoint(cc.p(0, 0.5));
            elixirIcon.setPosition(cc.p(410, y + 30));
            scrollViewLayer.addChild(elixirIcon);

            var elixirLabel = cc.LabelTTF.create(player.elixir, "STHeitiTC-Medium", 22);
            elixirLabel.setColor(cc.c3b(108, 41, 41));
            elixirLabel.setAnchorPoint(cc.p(0, 0.5));
            elixirLabel.setPosition(cc.p(450, y + 25));
            scrollViewLayer.addChild(elixirLabel);
        }

        this._scrollView = cc.ScrollView.create(this._elixirRankLayerFit.scrollViewSize, scrollViewLayer);
        this._scrollView.setPosition(this._elixirRankLayerFit.scrollViewPoint);
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);

        this._scrollView.setContentSize(cc.size(600, scrollViewHeight));
        this._scrollView.setContentOffset(this._scrollView.minContainerOffset());
    },

    _onClickThisWeek: function () {
        cc.log("ElixirRankLayer _onClickThisWeek");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);
        this._selectType = TYPE_THIS_WEEK;
        this.update();
    },

    _onClickLastWeek: function () {
        cc.log("ElixirRankLayer _onClickLastWeek");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);
        this._selectType = TYPE_LAST_WEEK;
        this.update();
    },

    _onClickPlayer: function (index) {
        var that = this;
        return function () {
            cc.log("ElixirRankLayer _onClickPlayer: " + index);

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);
            var point = that._playerItem[index].convertToWorldSpace(cc.p(273, 35));

            that._selectId = index;
            that._skyDialog.show(point);
        }
    },

    _onClickShowReward: function () {
        cc.log("ElixirRankLayer _onClickShowReward");
        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var reward = gameData.tournament.getThisWeekReward();

        GiftBagLayer.pop({
            reward: reward,
            titleType: TYPE_LOOK_REWARD,
            tip: "亲，你本周的竞技仙丹数量为0，无法获得奖励哟。"
        });

    },

    _onClickGetReward: function () {
        cc.log("ElixirRankLayer _onClickGetReward");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        if (!gameData.tournament.isCanGetReward()) {
            TipLayer.tip("当前没有可领奖励");
            return;
        }

        if (gameData.cardList.isFull()) {
            CardListFullTipLayer.pop();
            return;
        }

        var that = this;
        gameData.tournament.getElixirRankReward(function (data) {
            cc.log(data);
            GiftBagLayer.pop({
                reward: data,
                type: GET_GIFT_BAG_NO_CLOSE,
                titleType: TYPE_LOOK_REWARD,
                cb: function () {
                    lz.tipReward(data);
                    that.update()
                }
            });
        });
    },

    _onClickClose: function () {
        cc.log("ElixirRankLayer _onClickClose");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        MainScene.getInstance().switchLayer(TournamentLayer);
    },

    _onClickHelp: function () {
        cc.log("ElixirRankLayer _onClickHelp");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        MainScene.getInstance().switchLayer(ElixirRankHelpLabel);
    },

    _onClickDetail: function () {
        cc.log("ElixirRankLayer _onClickDetail: " + this._selectId);

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var player = this._rankList[this._selectId];

        if (player) {
            gameData.player.playerDetail(function (data) {
                cc.log(data);

                LineUpDetail.pop(data);
            }, player.playerId);
        } else {
            TipLayer.tip("找不到该玩家");
        }
    },

    _onClickSendMessage: function () {
        cc.log("ElixirRankLayer _onClickSendMessage: " + this._selectId);

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var player = this._rankList[this._selectId];

        if (player) {
            SendMessageLayer.pop(player.playerId, player.name);
        } else {
            TipLayer.tip("找不到该玩家");
        }
    },

    _onClickAddFriend: function () {
        cc.log("ElixirRankLayer _onClickAddFriend: " + this._selectId);

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var player = this._rankList[this._selectId];

        if (player) {
            gameData.friend.addFriend(player.name);
        } else {
            TipLayer.tip("找不到该玩家");
        }
    }
});

ElixirRankLayer.create = function () {
    cc.log("ElixirRankLayer create");

    var ret = new ElixirRankLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};