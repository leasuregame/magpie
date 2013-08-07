/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-18
 * Time: 下午3:12
 * To change this template use File | Settings | File Templates.
 */


/*
 * tournament
 * */


var Tournament = Entity.extend({
    _rankList: [],
    _length: 0,


    init: function () {
        cc.log("Tournament init");

        return true;
    },

    update: function (data) {
        cc.log("Tournament update");

        var len = data.length;

        for (var i = 0; i < len; ++i) {
            player = data[i];

            var cards = player.cards;
            var cardsLen = cards.length;
            var cardList = [];

            for (var j = 0; j < cardsLen; ++j) {
                cardList[j] = Card.create(cards[j]);
            }

            this._rankList[i] = {
                playerId: player.playerId,
                name: player.name,
                lv: player.lv,
                ability: player.ability,
                rank: player.ranking,
                cardList: cardList,
                type: player.type
            }
        }
    },

    sync: function (cb) {
        cc.log("Tournament sync");

        var that = this;
        lzWindow.pomelo.request("logic.rankHandler.rankingList", {playerId: gameData.player.get("id")}, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("Tournament sync success");

                var msg = data.msg;
                that.update(msg);

                cb();
            } else {
                cc.log("Tournament sync fail");

                cb();
            }
        });
    },

    defiance: function (cb, targetId) {
        cc.log("Tournament defiance " + targetId);

        var that = this;
        lzWindow.pomelo.request("logic.rankHandler.challenge", {playerId: gameData.player.get("id"), targetId: targetId}, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("Tournament defiance success");

                var msg = data.msg;

                var battleLog = BattleLog.create(msg.battleLog);
                BattleLogNote.getInstance().pushBattleLog(battleLog);
                cc.log(battleLog);
                cb(battleLog.get("id"));
            } else {
                cc.log("Tournament defiance fail");
            }
        });
    },

    addFriend: function () {
        cc.log("Tournament addFriend");

    }
})


Tournament.create = function () {
    var ret = new Tournament();

    if (ret) {
        return ret;
    }

    return null;
}