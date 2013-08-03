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
    _tournament : null,
    _rankScrollView : null,

    onEnter: function() {
        cc.log("TournamentLayer onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("Tournament init");

        if (!this._super()) return false;

        this._tournament = gameData.tournament;

        var playerTournamentLabel = PlayerTournamentLabel.create();
        playerTournamentLabel.setPosition(cc.p(GAME_HORIZONTAL_LACUNA, 878));
        this.addChild(playerTournamentLabel);

        return true;
    },

    update: function() {
        cc.log("TournamentLayer update");
        cc.log(this._tournament);

        if(this._rankScrollView != null) {
            this.removeChild(this._rankScrollView);
        }

        var that = this;
        this._tournament.sync(function() {
            cc.log("TournamentLayer update callback");

            that._addRankScrollView();
        })
    },

    _addRankScrollView: function() {
        cc.log("TournamentLayer _addRankScrollView");

        var rankList = this._tournament.get("rankList");
        var len = rankList.length;
        var height = len * (100 + 10) - 10;

        var scrollViewLayer = cc.Layer.create();

        for(var i = 0; i < len; ++i) {
            var tournamentPlayerLabel = TournamentPlayerLabel.create(rankList[i]);
            tournamentPlayerLabel.setPosition(cc.p(0, height - 100 * (i + 1) - 10 * i));
            scrollViewLayer.addChild(tournamentPlayerLabel);
        }

        this._rankScrollView = cc.ScrollView.create(cc.size(GAME_WIDTH, 650), scrollViewLayer);
        this._rankScrollView.setContentSize(cc.size(GAME_WIDTH, height));
        this._rankScrollView.setPosition(GAME_BG_POINT);
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