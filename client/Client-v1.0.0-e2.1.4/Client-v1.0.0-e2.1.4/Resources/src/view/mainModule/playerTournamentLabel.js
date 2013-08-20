/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-17
 * Time: 下午9:57
 * To change this template use File | Settings | File Templates.
 */


/*
 * player tournament label
 * */


var PlayerTournamentLabel = cc.Layer.extend({
    _player: null,
    _selectRect: cc.rect(40, 878, GAME_WIDTH, 120),

    onEnter: function () {
        cc.log("PlayerTournamentLabel onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("PlayerTournamentLabel init");

        if (!this._super()) return false;

        this._player = gameData.player;

        this.setTouchEnabled(true);

        bg = cc.LayerColor.create(cc.c4b(100, 0, 100, 100), GAME_WIDTH, 120);
        bg.ignoreAnchorPointForPosition(false);
        bg.setAnchorPoint(cc.p(0, 0));
        this.addChild(bg);

        this._nameLabel = cc.LabelTTF.create("名字：", "黑体", 30);
        this._nameLabel.setFontSize(25);
        this._nameLabel.setAnchorPoint(cc.p(0, 0.5));
        this._nameLabel.setPosition(100, 90);
        this.addChild(this._nameLabel);

        this._expLabel = cc.LabelTTF.create("经验：", "黑体", 30);
        this._expLabel.setFontSize(25);
        this._expLabel.setAnchorPoint(cc.p(0.5, 0.5));
        this._expLabel.setPosition(90, 30);
        this.addChild(this._expLabel);

        this._tournamentCountLabel = cc.LabelTTF.create("每天有奖挑战次数：战到你爽", "黑体", 30);
        this._tournamentCountLabel.setFontSize(25);
        this._tournamentCountLabel.setAnchorPoint(cc.p(0.5, 0.5));
        this._tournamentCountLabel.setPosition(cc.p(420, 90));
        this.addChild(this._tournamentCountLabel);

        this._rankLabel = cc.LabelTTF.create("排名：", "黑体", 30);
        this._rankLabel.setFontSize(25);
        this._rankLabel.setAnchorPoint(cc.p(0.5, 0.5));
        this._rankLabel.setPosition(305, 30);
        this.addChild(this._rankLabel);

        this._abilityLabel = cc.LabelTTF.create("战斗力：", "黑体", 30);
        this._abilityLabel.setFontSize(25);
        this._abilityLabel.setAnchorPoint(cc.p(0.5, 0.5));
        this._abilityLabel.setPosition(535, 30);
        this.addChild(this._abilityLabel);

        return true;
    },

    update: function () {
        this._nameLabel.setString("名字：" + this._player.get("name"));
        this._expLabel.setString("经验：" + this._player.get("exp"));
        this._tournamentCountLabel.setString("每天有奖挑战次数：" + this._player.get("tournamentCount"));
        this._rankLabel.setString("排名：" + this._player.get("rank"));
        this._abilityLabel.setString("战斗力：" + this._player.get("ability"));
    },

    onTouchesBegan: function (touches, event) {
        var point = touches[0].getLocation();
        if (cc.rectContainsPoint(this._selectRect, point)) {
            this._isMouseDown = true;
        }
    },

    onTouchesMoved: function (touches, event) {
    },

    onTouchesEnded: function (touches, event) {
        if (this._isMouseDown) {
            var point = touches[0].getLocation();

            if (cc.rectContainsPoint(this._selectRect, point)) {
                cc.log("click PlayerTournamentLabel");
            }
        }
    },

    onTouchesCancelled: function (touches, event) {
        this._isMouseDown = false;
    }
});


PlayerTournamentLabel.create = function () {
    var ret = new PlayerTournamentLabel();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};

