/**
 * Created by lujunyu on 14-6-12.
 */

var WorldCupHistoryLabel = LazyLayer.extend({

    onEnter: function () {
        cc.log("WorldCupHistoryLabel onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("WorldCupHistoryLabel init");

        if (!this._super()) return false;

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 150), 720, 1136);
        bgLayer.setPosition(cc.p(0, 0));
        this.addChild(bgLayer);

        this._frameLayer = cc.Node.create();
        this._frameLayer.setPosition(gameFit.GAME_MIDPOINT);
        this.addChild(this._frameLayer);

        var bgSprite = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgSprite.setContentSize(cc.size(620, 730));
        bgSprite.setPosition(cc.p(0, 0));
        this._frameLayer.addChild(bgSprite);

        this._titleLabel = cc.LabelTTF.create("", "STHeitiTC-Medium", 40);
        this._titleLabel.setPosition(cc.p(0, 310));
        this._titleLabel.setColor(cc.c3b(251, 250, 183));
        this._frameLayer.addChild(this._titleLabel);

        var historyBgLabel = cc.Scale9Sprite.create(main_scene_image.icon175);
        historyBgLabel.setPosition(cc.p(0, 0));
        historyBgLabel.setContentSize(cc.size(590, 540));
        this._frameLayer.addChild(historyBgLabel);

        var OKItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            main_scene_image.icon21,
            this._onClickClose,
            this
        );
        OKItem.setPosition(cc.p(0, -310));

        var menu = cc.Menu.create(OKItem);
        menu.setPosition(cc.p(0, 0));
        this._frameLayer.addChild(menu);

        return true;
    },

    update: function () {
        cc.log("WorldCupHistoryLabel update");

        var that = this;
        gameData.activity.lastGames(function (data) {
            if (data.gameDate) {
                that._titleLabel.setString(data.gameDate);
            }
            that._showHistory(data.games);
        });
    },

    _showHistory: function (games) {
        cc.log("WorldCupHistoryLabel _showHistory");

        if (this._historyLabel) {
            this._historyLabel.removeFromParent();
            this._historyLabel = null;
        }

        this._historyLabel = cc.Layer.create();
        this._frameLayer.addChild(this._historyLabel);

        if (!games || games.length == 0) {
            var tipLabel = cc.LabelTTF.create("当前没有竞猜历史", "STHeitiTC-Medium", 30);
            tipLabel.setPosition(cc.p(0, 0));
            tipLabel.setColor(cc.c3b(251, 250, 183));
            this._historyLabel.addChild(tipLabel);
            return;
        }

        var result = {
            1: "胜",
            2: "平",
            3: "负"
        };

        var table = outputTables.country_list.rows;

        var len = games.length;
        for (var i = 0; i < len; i++) {
            var y = 180 - i * 120;
            var game = games[i];

            var bgLabel = cc.Sprite.create(main_scene_image.worldCupIcon8);
            bgLabel.setPosition(cc.p(0, y));
            this._historyLabel.addChild(bgLabel);

            var str = game.score || "VS";

            var scoreLabel = cc.LabelTTF.create(str, "STHeitiTC-Medium", 30);
            scoreLabel.setPosition(cc.p(-50, y));
            scoreLabel.setColor(cc.c3b(251, 250, 183));
            this._historyLabel.addChild(scoreLabel);

            var homeTeamIcon = cc.Sprite.create(main_scene_image[table[game.home_team].url]);
            homeTeamIcon.setScale(0.6);
            homeTeamIcon.setPosition(cc.p(-125, y));
            this._historyLabel.addChild(homeTeamIcon);

            var homeTeamName = cc.LabelTTF.create(table[game.home_team].country, "STHeitiTC-Medium", 20);
            homeTeamName.setPosition(cc.p(-220, y));
            homeTeamName.setColor(cc.c3b(251, 250, 183));
            this._historyLabel.addChild(homeTeamName);

            var visitingTeamIcon = cc.Sprite.create(main_scene_image[table[game.visiting_team].url]);
            visitingTeamIcon.setScale(0.6);
            visitingTeamIcon.setPosition(cc.p(25, y));
            this._historyLabel.addChild(visitingTeamIcon);

            var visitingTeamName = cc.LabelTTF.create(table[game.visiting_team].country, "STHeitiTC-Medium", 20);
            visitingTeamName.setPosition(cc.p(120, y));
            visitingTeamName.setColor(cc.c3b(251, 250, 183));
            this._historyLabel.addChild(visitingTeamName);

            var index = ((i + 1) % 3 == 0) ? 3 : (i + 1) % 3;
            var resultLabel = StrokeLabel.create(result[index], "STHeitiTC-Medium", 30);
            resultLabel.setColor(cc.c3b(255, 0, 0));
            resultLabel.setBgColor(cc.c3b(255, 255, 255));
            resultLabel.setPosition(cc.p(220, y));
            this._historyLabel.addChild(resultLabel);

            var bingoIcon = cc.Sprite.create(main_scene_image.worldCupIcon9);
            bingoIcon.setPosition(cc.p(243, y));
            bingoIcon.setVisible(game.bingo);
            this._historyLabel.addChild(bingoIcon);
        }

    },

    _onClickClose: function () {
        cc.log("WorldCupHistoryLabel _onClickClose");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this.removeFromParent();
    }
});

WorldCupHistoryLabel.create = function () {
    cc.log("WorldCupHistoryLabel create");

    var ret = new WorldCupHistoryLabel();
    if (ret && ret.init()) {
        return ret;
    }
    return null;

};

WorldCupHistoryLabel.pop = function () {
    cc.log("WorldCupHistoryLabel pop");

    var worldCupHistoryLabel = WorldCupHistoryLabel.create();
    MainScene.getInstance().getLayer().addChild(worldCupHistoryLabel, 10);
};