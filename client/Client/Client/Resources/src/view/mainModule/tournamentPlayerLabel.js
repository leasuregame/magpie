/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-18
 * Time: 上午10:46
 * To change this template use File | Settings | File Templates.
 */


/*
 * tournament player label
 * */


var CAN_ADD_FRIEND = 0;
var CAN_DEFIANCE = 1;
var CAN_COUNTER_ATTACK = 2;

var TournamentPlayerLabel = cc.Layer.extend({
    _tournamentPlayer: null,

    onEnter: function () {
        cc.log("TournamentPlayerLabel onEnter");

        this._super();
        this.update();
    },

    init: function (data) {
        cc.log("TournamentPlayerLabel init");

        if(!this._super()) return false;

        this._tournamentPlayer = data;

        var bg = cc.LayerColor.create(cc.c4b(100, 0, 100, 100), GAME_WIDTH, 100);
        bg.setAnchorPoint(cc.p(0, 0));
        bg.setPosition(cc.p(0, 0));
        this.addChild(bg);

        var playerLabel = cc.LayerColor.create(cc.c4b(100, 0, 100, 100), 100, 100);
        playerLabel.setAnchorPoint(cc.p(0, 0));
        playerLabel.setPosition(cc.p(0, 0));

        var playerNameLabel = cc.LabelTTF.create(data.name, 'Times New Roman', 30);
        playerNameLabel.setPosition(cc.p(50, 25));
        playerLabel.addChild(playerNameLabel);

        var playerRankLabel = cc.LabelTTF.create(data.rank, 'Times New Roman', 30);
        playerRankLabel.setPosition(cc.p(50, 75));
        playerLabel.addChild(playerRankLabel);

        var playerItem = cc.MenuItemLabel.create(playerLabel, this._onClickPlayer, this);
        playerItem.setPosition(cc.p(100, 50));

        var str = "自己你还想点";
        if(data.playerId != gameData.player.get("id")) {
            if(data.type == CAN_ADD_FRIEND) {
                str = "加为好友";
            } else if(data.type == CAN_DEFIANCE) {
                str = "挑战";
            } else if(data.type == CAN_COUNTER_ATTACK) {
                str = "反击";
            }
        }

        var functionLabel = cc.LabelTTF.create(str, 'Times New Roman', 30);
        var functionItem = cc.MenuItemLabel.create(functionLabel, this._onClickFunction, this);
        functionItem.setPosition(cc.p(550, 50));

        var menu = cc.Menu.create(playerItem, functionItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        var lineUpCardList = data.cardList;
        var len = lineUpCardList.length;
        len = 5;
        var width = len * (100 + 10) - 10;

        var scrollViewLayer = cc.Layer.create();

        for(var i = 0; i < len; ++i) {
            var cardLabel = cc.LayerColor.create(cc.c4b(100, 0, 100, 100), 100, 100);
            cardLabel.setPosition(cc.p((100 + 10) * i, 0));
            scrollViewLayer.addChild(cardLabel);
        }

        var view = cc.ScrollView.create(cc.size(320, 100), scrollViewLayer);
        view.setContentSize(cc.size(width, 100));
        view.setPosition(cc.p(180, 0));
        view.setBounceable(false);
        view.setDirection(cc.SCROLLVIEW_DIRECTION_HORIZONTAL);
        view.updateInset();

        this.addChild(view);

        return true;
    },

    update: function () {
        cc.log("TournamentPlayerLabel update");

    },

    _onClickPlayer: function () {
        cc.log("TournamentPlayerLabel _onClickPlayer");


    },

    _onClickFunction: function () {
        cc.log("TournamentPlayerLabel _onClickFunction " + this._tournamentPlayer.type);

        if(this._tournamentPlayer.playerId != gameData.player.get("id")) {
            if(this._tournamentPlayer.type == CAN_ADD_FRIEND) {
                gameData.tournament.addFriend(this._tournamentPlayer.playerId);
            } else {
                gameData.tournament.defiance(function(id){
                    var scene = BattleScene.create(BattleLogNote.getInstance().getBattleByBattleLogId(id));
                    cc.Director.getInstance().replaceScene(scene);
//                    cc.Director.getInstance().replaceScene(cc.TransitionPageTurn.create(1, scene, true));
                }, this._tournamentPlayer.playerId);

            }
        }
    }
})


TournamentPlayerLabel.create = function (data) {
    var ret = new TournamentPlayerLabel();

    if (ret && ret.init(data)) {
        return ret;
    }

    return null;
}