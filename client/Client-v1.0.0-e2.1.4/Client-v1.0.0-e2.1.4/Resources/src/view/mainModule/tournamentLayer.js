/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-20
 * Time: 下午4:54
 * To change this template use File | Settings | File Templates.
 */


/*
 * 竞技
 * */


var TournamentLayer = cc.Layer.extend({
    _rankScrollView: null,
    _nameLabel: null,
    _expProgress: null,
    _lvLabel: null,
    _rankLabel: null,
    _abilityLabel: null,

    onEnter: function () {
        cc.log("TournamentLayer onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("Tournament init");

        if (!this._super()) return false;

        var bgSprite = cc.Sprite.create(main_scene_image.bg12);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(GAME_BG_POINT);
        this.addChild(bgSprite);

        var tournamentMessageLabel = TournamentMessageLabel.create();
        tournamentMessageLabel.setPosition(cc.p(GAME_HORIZONTAL_LACUNA, 1011));
        this.addChild(tournamentMessageLabel);

        var playerLabel = cc.Sprite.create(main_scene_image.bg14);
        playerLabel.setAnchorPoint(cc.p(0, 0));
        playerLabel.setPosition(cc.p(40, 868));
        playerLabel.setPosition(cc.p(40, 868));
        this.addChild(playerLabel);

        this._nameLabel = cc.LabelTTF.create("null", 'Times New Roman', 30);
        this._nameLabel.setAnchorPoint(cc.p(0.5, 0.5));
        this._nameLabel.setPosition(cc.p(200, 988));
        this.addChild(this._nameLabel);

        this._expProgress = Progress.create(main_scene_image.exp_bg, main_scene_image.exp, 0, 0, true);
        this._expProgress.setPosition(cc.p(210, 955));
        this._expProgress.setScale(0.8);
        this.addChild(this._expProgress, 2);

        var lvBg = cc.Sprite.create(main_scene_image.lv_bg);
        lvBg.setPosition(cc.p(100, 968));
        lvBg.setScale(0.8);
        this.addChild(lvBg, 2);

        this._lvLabel = cc.LabelTTF.create("0", 'Times New Roman', 45);
        this._lvLabel.setAnchorPoint(cc.p(0.5, 0.5));
        this._lvLabel.setPosition(cc.p(46, 46));
        this._lvLabel.setScale(0.8);
        lvBg.addChild(this._lvLabel);

        this._rankLabel = cc.LabelTTF.create(0, 'Times New Roman', 25);
        this._rankLabel.setPosition(cc.p(438, 954));
        this.addChild(this._rankLabel);

        this._abilityLabel = cc.LabelTTF.create(0, 'Times New Roman', 25);
        this._abilityLabel.setPosition(cc.p(603, 954));
        this.addChild(this._abilityLabel);

        return true;
    },

    update: function () {
        cc.log("TournamentLayer update");

        var player = gameData.player;
        this._expProgress.setAllValue(player.get("maxPower"), player.get("power"));
        this._nameLabel.setString(player.get("name"));
        this._lvLabel.setString(player.get("lv"));
        this._rankLabel.setString(player.get("rank"));
        this._abilityLabel.setString(player.get("ability"));

        if (this._rankScrollView != null) {
            this.removeChild(this._rankScrollView);
        }

        var that = this;
        gameData.tournament.sync(function () {
            cc.log("TournamentLayer update callback");

            that._addRankScrollView();
        })
    },

    _addRankScrollView: function () {
        cc.log("TournamentLayer _addRankScrollView");

        var rankList = gameData.tournament.get("rankList");
        var len = rankList.length;
        var height = len * 135;

        var scrollViewLayer = MarkLayer.create(cc.rect(40, 198, 612, 670));

        for (var i = 0; i < len; ++i) {
            var tournamentPlayerLabel = TournamentLabel.create(rankList[i]);
            tournamentPlayerLabel.setPosition(cc.p(0, height - 135 * (i + 1)));
            scrollViewLayer.addChild(tournamentPlayerLabel);
        }

        this._rankScrollView = cc.ScrollView.create(cc.size(612, 670), scrollViewLayer);
        this._rankScrollView.setContentSize(cc.size(GAME_WIDTH, height));
        this._rankScrollView.setPosition(cc.p(54, 198));
        this._rankScrollView.setBounceable(false);
        this._rankScrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._rankScrollView.updateInset();

        this.addChild(this._rankScrollView);
    }
})

TournamentLayer.create = function () {
    var res = new TournamentLayer();

    if (res && res.init()) {
        return res;
    }

    return null;
}