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
    _ranking: 0,
    _count: 0,
    _rankReward: [],
    _rankList: [],

    init: function (data) {
        cc.log("Tournament init");

        this._ranking = 0;
        this._count = 0;
        this._rankReward = [];
        this._rankList = [];

        this.update(data);

        return true;
    },

    update: function (data) {
        cc.log("Tournament update");

        this.set("ranking", data.ranking);
        this.set("count", data.challengeCount);
        this.set("rankReward", data.rankReward);

        if (data.rankList) {
            this._rankList = [];

            var rankList = data.rankList;
            var len = rankList.length;

            for (var i = 0; i < len; ++i) {
                var player = rankList[i];

                var cards = player.cards;
                var cardsLen = cards.length;
                var cardList = [];

                for (var j = 0; j < cardsLen; ++j) {
                    cardList[j] = Card.create({
                        tableId: cards[j],
                        lv: 1,
                        skillLv: 0
                    });
                }

                this._rankList[i] = {
                    playerId: player.playerId,
                    name: player.name,
                    lv: player.lv,
                    ability: player.ability,
                    ranking: player.ranking,
                    cardList: cardList,
                    type: player.type
                }
            }
        }
    },

    sync: function (cb) {
        cc.log("Tournament sync");

        var that = this;
        lzWindow.pomelo.request("area.rankHandler.rankingList", {}, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("Tournament sync success");

                var msg = data.msg;

                that.update(msg.rank);

                cb();
            } else {
                cc.log("Tournament sync fail");

                TipLayer.tip("刷新榜单失败");

                cb();
            }
        });
    },

    defiance: function (cb, targetId) {
        cc.log("Tournament defiance " + targetId);

        var that = this;
        lzWindow.pomelo.request("area.rankHandler.challenge", {
            targetId: targetId
        }, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("Tournament defiance success");

                var msg = data.msg;

                gameData.player.sets({
                    lv: msg.lv,
                    exp: msg.exp
                });

                var battleLogId = BattleLogPool.getInstance().pushBattleLog(msg.battleLog, PVP_BATTLE_LOG);

                cb(battleLogId);
            } else {
                cc.log("Tournament defiance fail");
            }
        });
    }
});


Tournament.create = function () {
    var ret = new Tournament();

    if (ret) {
        return ret;
    }

    return null;
};