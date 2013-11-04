/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-20
 * Time: 下午4:54
 * To change this template use File | Settings | File Templates.
 */


/*
 * tournament layer
 * */


var TournamentLayer = cc.Layer.extend({
    _rankList: [],
    _selectId: 0,
    _scrollView: null,
    _rewardLabel: null,
    _rewardItem: null,
    _menu: null,
    _expProgress: null,
    _lvLabel: null,
    _rankingLabel: null,
    _countLabel: null,
    _abilityLabel: null,
    _upgradeReward: null,

    onEnter: function () {
        cc.log("TournamentLayer onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("Tournament init");

        if (!this._super()) return false;

        this._rankList = [];

        var bgSprite = cc.Sprite.create(main_scene_image.bg11);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(GAME_BG_POINT);
        this.addChild(bgSprite);

        var playerLabel = cc.Sprite.create(main_scene_image.icon31);
        playerLabel.setAnchorPoint(cc.p(0, 0));
        playerLabel.setPosition(cc.p(40, 916));
        this.addChild(playerLabel);

        var nameLabel = StrokeLabel.create(gameData.player.get("name"), "STHeitiTC-Medium", 28);
        nameLabel.setColor(cc.c3b(255, 239, 131));
        nameLabel.setAnchorPoint(cc.p(0, 0.5));
        nameLabel.setPosition(cc.p(150, 1013));
        this.addChild(nameLabel);

        var expBg = cc.Sprite.create(main_scene_image.exp_bg);
        expBg.setPosition(cc.p(210, 975));
        this.addChild(expBg);
        expBg.setScale(0.8);

        this._expProgress = Progress.create(null, main_scene_image.exp, 0, 0, true);
        this._expProgress.setPosition(cc.p(214, 975));
        this.addChild(this._expProgress);
        this._expProgress.setScale(0.8);

        var lvBg = cc.Sprite.create(main_scene_image.lv_bg);
        lvBg.setPosition(cc.p(90, 995));
        this.addChild(lvBg);
        lvBg.setScale(0.8);

        this._lvLabel = cc.LabelTTF.create(0, "STHeitiTC-Medium", 36);
        this._lvLabel.setPosition(cc.p(87, 993));
        this.addChild(this._lvLabel);

        this._countLabel = cc.LabelTTF.create(0, "STHeitiTC-Medium", 22);
        this._countLabel.setPosition(cc.p(530, 1013));
        this.addChild(this._countLabel);

        this._rankingLabel = cc.LabelTTF.create(0, "STHeitiTC-Medium", 22);
        this._rankingLabel.setPosition(cc.p(430, 973));
        this.addChild(this._rankingLabel);

        this._elixirLabel = cc.LabelTTF.create(0, "STHeitiTC-Medium", 22);
        this._elixirLabel.setPosition(cc.p(605, 973));
        this.addChild(this._elixirLabel);

        var rewardIcon = cc.Sprite.create(main_scene_image.icon35);
        rewardIcon.setPosition(cc.p(360, 900));
        this.addChild(rewardIcon);
        rewardIcon.setScaleX(2.5);

        this._rewardLabel = cc.LabelTTF.create("", "STHeitiTC-Medium", 22);
        this._rewardLabel.setPosition(cc.p(360, 900));
        this.addChild(this._rewardLabel);

        var buyCountItem = cc.MenuItemImage.create(
            main_scene_image.button16,
            main_scene_image.button16s,
            this._onClickBuyCount,
            this
        );
        buyCountItem.setPosition(cc.p(575, 1015));

        this._rewardItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button17,
            main_scene_image.button17s,
            this._onClickRankReward,
            this
        );
        this._rewardItem.setPosition(cc.p(160, 900));

        var menu = cc.Menu.create(buyCountItem, this._rewardItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

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
        this._skyDialog.setRect(cc.rect(40, 198, 640, 700));

        return true;
    },

    update: function () {
        cc.log("TournamentLayer update");

        if (this._upgradeReward) {
            PlayerUpgradeLayer.pop(this._upgradeReward);
            this._upgradeReward = null;
        }

        var player = gameData.player;

        this._expProgress.setAllValue(player.get("exp"), player.get("maxExp"));
        this._lvLabel.setString(player.get("lv"));

        if (this._scrollView != null) {
            this._scrollView.removeFromParent();
        }

        var that = this;
        gameData.tournament.sync(function () {
            cc.log("TournamentLayer update callback");

            that._addRankScrollView();
            that._updateRankRewardItem();
        })
    },

    _updateRankRewardItem: function () {
        cc.log("TournamentLayer _updateRankRewardItem");

        this._elixirLabel.setString(gameData.player.get("elixir"));

        var reward = gameData.tournament.getLastRankReward();

        if (reward) {
            this._rewardLabel.setString("首次达到 " + reward.ranking + " 名  奖励 " + reward.elixir + " 仙丹");
            this._rewardLabel.setVisible(true);
            this._rewardItem.setVisible(reward.canReceive);
        } else {
            this._rewardLabel.setVisible(false);
            this._rewardItem.setVisible(false);
        }
    },

    _addRankScrollView: function () {
        cc.log("TournamentLayer _addRankScrollView");

        var tournament = gameData.tournament;

        this._rankingLabel.setString(tournament.get("ranking"));
        this._countLabel.setString(tournament.get("count"));

        this._rankList = tournament.get("rankList");
        var len = this._rankList.length;
        var height = len * 135;
        var playerId = gameData.player.get("id");
        var own = len;

        var scrollViewLayer = MarkLayer.create(cc.rect(40, 198, 621, 670));

        for (var i = 0; i < len; ++i) {
            if (playerId == this._rankList[i].playerId) {
                own = i;
            }

            var tournamentPlayerLabel = TournamentLabel.create(this, this._rankList[i]);
            tournamentPlayerLabel.setPosition(cc.p(0, height - 135 * (i + 1)));
            scrollViewLayer.addChild(tournamentPlayerLabel);
        }

        this._scrollView = cc.ScrollView.create(cc.size(621, 670), scrollViewLayer);
        this._scrollView.setContentSize(cc.size(GAME_WIDTH, height));
        this._scrollView.setPosition(cc.p(50, 198));
        this._scrollView.setBounceable(false);
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._scrollView.updateInset();

        this.addChild(this._scrollView);

        var offsetY = this._scrollView.minContainerOffset().y;
        offsetY = Math.min(offsetY + own * 135, 0);
        this._scrollView.setContentOffset(cc.p(0, offsetY));
    },

    _getPlayer: function (id) {
        var len = this._rankList.length;

        for (var i = 0; i < len; ++i) {
            if (this._rankList[i].playerId == id) {
                return this._rankList[i];
            }
        }

        return null;
    },

    _setPlayerUpgradeReward: function (upgradeReward) {
        cc.log("TournamentLayer _setPlayerUpgradeReward");

        this._upgradeReward = upgradeReward || null;
    },

    _onClickPlayer: function (id, point) {
        cc.log("TournamentLayer _onClickPlayer");

        this._selectId = id;
        this._skyDialog.show(point);
    },

    _onClickRankReward: function () {
        cc.log("TournamentLayer _onClickRankReward");

        var that = this;
        gameData.tournament.receive(function (reward) {
            lz.tipReward(reward);
            that._updateRankRewardItem();
        });
    },

    _onClickDetail: function () {
        cc.log("TournamentLayer _onClickDetail: " + this._selectId);

        var player = this._getPlayer(this._selectId);

        if (player) {
            gameData.player.playerDetail(function (data) {
                cc.log(data);

                LineUpDetail.pop(data);
            }, this._selectId);
        } else {
            TipLayer.tip("找不到该玩家");
        }
    },

    _onClickSendMessage: function () {
        cc.log("TournamentLayer _onClickSendMessage: " + this._selectId);

        var player = this._getPlayer(this._selectId);

        if (player) {
            SendMessageLayer.pop(player.playerId, player.name);
        } else {
            TipLayer.tip("找不到该玩家");
        }
    },

    _onClickAddFriend: function () {
        cc.log("TournamentLayer _onClickAddFriend: " + this._selectId);

        var player = this._getPlayer(this._selectId);

        if (player) {
            gameData.friend.addFriend(player.name);
        } else {
            TipLayer.tip("找不到该玩家");
        }
    },

    _onClickBuyCount: function () {
        cc.log("TournamentLayer _onClickBuyCount");

        var id = 6;
        var product = gameData.shop.getProduct(id);

        cc.log(product);

        if (product.count <= 0) {
            TipLayer.tip(product.tip);
            return;
        }

        var that = this;
        AmountLayer.pop(
            function (count) {
                that._buyCount(id, count);
            },
            product
        );
    },

    _buyCount: function (id, count) {
        cc.log("TournamentLayer _buyCount");

        if (count > 0) {
            var that = this;
            gameData.shop.buyProduct(function (data) {
                that.update();

                lz.tipReward(data);
            }, id, count);
        }
    }
});

TournamentLayer.create = function () {
    var res = new TournamentLayer();

    if (res && res.init()) {
        return res;
    }

    return null;
};

TournamentLayer.canEnter = function () {
    var limitLv = outputTables.function_limit.rows[1].rank;
    var lv = gameData.player.get("lv");

    if (lv >= limitLv) {
        return true;
    }

    TipLayer.tip("竞技场" + limitLv + "级开放");

    return false;
};