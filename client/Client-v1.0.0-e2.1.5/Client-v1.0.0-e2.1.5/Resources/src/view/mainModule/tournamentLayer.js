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
    _scrollView: null,
    _rankRewardItem: null,
    _expProgress: null,
    _lvLabel: null,
    _rankingLabel: null,
    _countLabel: null,
    _abilityLabel: null,

    onEnter: function () {
        cc.log("TournamentLayer onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("Tournament init");

        if (!this._super()) return false;

        var bgSprite = cc.Sprite.create(main_scene_image.bg11);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(GAME_BG_POINT);
        this.addChild(bgSprite);

        var playerLabel = cc.Sprite.create(main_scene_image.icon31);
        playerLabel.setAnchorPoint(cc.p(0, 0));
        playerLabel.setPosition(cc.p(40, 916));
        this.addChild(playerLabel);

        var nameLabel = StrokeLabel.create(gameData.player.get("name"), "STHeitiTC-Medium", 30);
        nameLabel.setColor(cc.c3b(255, 239, 131));
        nameLabel.setAnchorPoint(cc.p(0, 0.5));
        nameLabel.setPosition(cc.p(160, 1013));
        this.addChild(nameLabel);

        var expBg = cc.Sprite.create(main_scene_image.exp_bg);
        expBg.setPosition(cc.p(210, 975));
        this.addChild(expBg);
        expBg.setScale(0.8);

        this._expProgress = Progress.create(null, main_scene_image.exp, 0, 0, true);
        this._expProgress.setPosition(cc.p(214, 975));
        this.addChild(this._expProgress);
        this._expProgress.setFontColor(cc.c3b(255, 239, 131));
        this._expProgress.setScale(0.8);

        var lvBg = cc.Sprite.create(main_scene_image.lv_bg);
        lvBg.setPosition(cc.p(90, 995));
        this.addChild(lvBg);
        lvBg.setScale(0.8);

        this._lvLabel = cc.LabelTTF.create(0, "STHeitiTC-Medium", 38);
        this._lvLabel.setColor(cc.c3b(255, 239, 131));
        this._lvLabel.setPosition(cc.p(87, 993));
        this.addChild(this._lvLabel);

        this._countLabel = cc.LabelTTF.create(0, "STHeitiTC-Medium", 22);
        this._countLabel.setColor(cc.c3b(255, 239, 131));
        this._countLabel.setPosition(cc.p(555, 1013));
        this.addChild(this._countLabel);

        this._rankingLabel = cc.LabelTTF.create(0, "STHeitiTC-Medium", 22);
        this._rankingLabel.setColor(cc.c3b(255, 239, 131));
        this._rankingLabel.setPosition(cc.p(430, 975));
        this.addChild(this._rankingLabel);

        this._abilityLabel = cc.LabelTTF.create(0, "STHeitiTC-Medium", 22);
        this._abilityLabel.setColor(cc.c3b(255, 239, 131));
        this._abilityLabel.setPosition(cc.p(605, 975));
        this.addChild(this._abilityLabel);

        this._rankRewardLabel = cc.LabelTTF.create("", "STHeitiTC-Medium", 22);
        this._rankRewardLabel.setColor(cc.c3b(255, 239, 131));

        this._rankRewardItem = cc.MenuItemLabel.create(this._rankRewardLabel, this._onClickRankReward, this);
        this._rankRewardItem.setPosition(cc.p(360, 960));
        this._rankRewardItem.setVisible(false);

        var menu = cc.Menu.create(this._rankRewardItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        return true;
    },

    update: function () {
        cc.log("TournamentLayer update");

        var player = gameData.player;

        this._expProgress.setAllValue(player.get("power"), player.get("maxPower"));
        this._lvLabel.setString(player.get("lv"));
        this._abilityLabel.setString(player.get("ability"));

        if (this._scrollView != null) {
            this.removeChild(this._scrollView);
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

        var rewardRanking = gameData.tournament.getLastRankReward();

        cc.log(rewardRanking);

        if (rewardRanking) {
            this._rankRewardLabel.setString("领取 " + rewardRanking + " 排名奖励");
            this._rankRewardItem.setVisible(true);
        } else {
            this._rankRewardLabel.setString("");
            this._rankRewardItem.setVisible(false);
        }
    },

    _addRankScrollView: function () {
        cc.log("TournamentLayer _addRankScrollView");

        var tournament = gameData.tournament;

        this._rankingLabel.setString(tournament.get("ranking"));
        this._countLabel.setString(tournament.get("count"));

        var rankList = tournament.get("rankList");
        var len = rankList.length;
        var height = len * 135;

        var scrollViewLayer = MarkLayer.create(cc.rect(40, 198, 612, 670));

        for (var i = 0; i < len; ++i) {
            var tournamentPlayerLabel = TournamentLabel.create(rankList[i]);
            tournamentPlayerLabel.setPosition(cc.p(0, height - 135 * (i + 1)));
            scrollViewLayer.addChild(tournamentPlayerLabel);
        }

        this._scrollView = cc.ScrollView.create(cc.size(612, 670), scrollViewLayer);
        this._scrollView.setContentSize(cc.size(GAME_WIDTH, height));
        this._scrollView.setPosition(cc.p(54, 198));
        this._scrollView.setBounceable(false);
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._scrollView.updateInset();

        this.addChild(this._scrollView);
    },

    _onClickRankReward: function () {
        cc.log("TournamentLayer _onClickRankReward");

        var that = this;
        gameData.tournament.receive(function () {
            that._updateRankRewardItem();
        });
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
};