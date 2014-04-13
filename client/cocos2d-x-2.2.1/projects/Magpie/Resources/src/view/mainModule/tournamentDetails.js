/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 14-1-7
 * Time: 下午2:37
 * To change this template use File | Settings | File Templates.
 */


var rankDetails = ["历史最高排名", "历史最高连胜", "当前连胜", "累计挑战次数", "累计被挑战次数", "累计胜利次数", "累计战败次数", "平均胜率"];


var TournamentDetails = LazyLayer.extend({
    _tournamentDetailsFit: null,

    _menu: null,


    init: function (arg) {
        cc.log("TournamentDetails init");

        if (!this._super()) return false;

        this._tournamentDetailsFit = gameFit.mainScene.tournamentDetails;

        var rankStats = arg || gameData.tournament.get("rankStats");

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 150), 720, 1136);
        bgLayer.setPosition(cc.p(0, 0));
        this.addChild(bgLayer);

        var bgSprite = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgSprite.setContentSize(cc.size(600, 720));
        bgSprite.setPosition(this._tournamentDetailsFit.bgSpritePoint);
        this.addChild(bgSprite);

        var point = this._tournamentDetailsFit.labelSpritePoint;
        var len = rankDetails.length;
        for (var i = 0; i < len; i++) {
            var labelSprite = cc.Scale9Sprite.create(main_scene_image.icon155);
            labelSprite.setContentSize(cc.size(550, 60));
            labelSprite.setPosition(cc.p(point.x, point.y - 70 * i));
            this.addChild(labelSprite);

            var label = cc.LabelTTF.create(rankDetails[i] + "：", "STHeitiTC-Medium", 25);
            label.setAnchorPoint(cc.p(0, 0.5));
            label.setPosition(cc.p(point.x - 160, point.y - 70 * i));
            this.addChild(label);
        }

        var historyRanking = cc.LabelTTF.create(rankStats["historyRanking"] || "0", "STHeitiTC-Medium", 25);
        historyRanking.setAnchorPoint(cc.p(0, 0.5));
        historyRanking.setPosition(cc.p(point.x + 100, point.y));
        this.addChild(historyRanking);

        var winStreakCount = cc.LabelTTF.create(rankStats["winStreakCount"] || "0", "STHeitiTC-Medium", 25);
        winStreakCount.setAnchorPoint(cc.p(0, 0.5));
        winStreakCount.setPosition(cc.p(point.x + 100, point.y - 70));
        this.addChild(winStreakCount);

        var winningStreak = cc.LabelTTF.create(rankStats["winningStreak"] || "0", "STHeitiTC-Medium", 25);
        winningStreak.setAnchorPoint(cc.p(0, 0.5));
        winningStreak.setPosition(cc.p(point.x + 100, point.y - 140));
        this.addChild(winningStreak);

        var challengeCount = cc.LabelTTF.create(rankStats["challengeCount"] || "0", "STHeitiTC-Medium", 25);
        challengeCount.setAnchorPoint(cc.p(0, 0.5));
        challengeCount.setPosition(cc.p(point.x + 100, point.y - 210));
        this.addChild(challengeCount);

        var beChallengeCount = cc.LabelTTF.create(rankStats["beChallengeCount"] || "0", "STHeitiTC-Medium", 25);
        beChallengeCount.setAnchorPoint(cc.p(0, 0.5));
        beChallengeCount.setPosition(cc.p(point.x + 100, point.y - 280));
        this.addChild(beChallengeCount);

        var winCount = cc.LabelTTF.create(rankStats["winCount"] || "0", "STHeitiTC-Medium", 25);
        winCount.setAnchorPoint(cc.p(0, 0.5));
        winCount.setPosition(cc.p(point.x + 100, point.y - 350));
        this.addChild(winCount);

        var loseCount = cc.LabelTTF.create(rankStats["loseCount"] || "0", "STHeitiTC-Medium", 25);
        loseCount.setAnchorPoint(cc.p(0, 0.5));
        loseCount.setPosition(cc.p(point.x + 100, point.y - 420));
        this.addChild(loseCount);

        var avgWinRate = cc.LabelTTF.create(rankStats["avgWinRate"] || "0", "STHeitiTC-Medium", 25);
        avgWinRate.setAnchorPoint(cc.p(0, 0.5));
        avgWinRate.setPosition(cc.p(point.x + 100, point.y - 490));
        this.addChild(avgWinRate);

        var titleLabel = StrokeLabel.create("竞  技  信  息", "STHeitiTC-Medium", 30);
        titleLabel.setColor(cc.c3b(255, 239, 131));
        titleLabel.setPosition(this._tournamentDetailsFit.titleLabelPoint);
        this.addChild(titleLabel);


        var okItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon21,
            this._onClickClose,
            this
        );
        okItem.setPosition(this._tournamentDetailsFit.okItemPoint);

        var closeItem = cc.MenuItemImage.create(
            main_scene_image.button37,
            main_scene_image.button37s,
            this._onClickClose,
            this
        );
        closeItem.setPosition(this._tournamentDetailsFit.closeItemPoint);

        this._menu = cc.Menu.create(okItem, closeItem);
        this._menu.setPosition(cc.p(0, 0));
        this.addChild(this._menu);

        return true;
    },

    _onClickClose: function () {
        cc.log("TournamentDetails _onClickClose");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._menu.setEnabled(false);

        this.removeFromParent();
    }

});

TournamentDetails.create = function (arg) {
    cc.log("TournamentDetails create");

    var ret = new TournamentDetails();

    if (ret && ret.init(arg)) {
        return ret;
    }

    return null;
};

TournamentDetails.pop = function (arg) {
    var tournamentDetails = TournamentDetails.create(arg);

    MainScene.getInstance().getLayer().addChild(tournamentDetails, 10);

    return tournamentDetails;
};