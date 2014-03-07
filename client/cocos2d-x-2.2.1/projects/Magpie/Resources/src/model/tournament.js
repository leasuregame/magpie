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
    _canGetReward: [],
    _notCanGetReward: [],
    _rankList: [],
    _rankStats: {},

    init: function (data) {
        cc.log("Tournament init");

        this._ranking = 0;
        this._count = 0;
        this._canGetReward = [];
        this._notCanGetReward = [];
        this._rankList = [];
        this._rankStats = {};

        this.update(data);

        return true;
    },

    update: function (data) {
        cc.log("Tournament update");

        this.set("ranking", data.ranking);
        this.set("count", data.challengeCount);
        this.set("canGetReward", data.canGetReward);
        this.set("notCanGetReward", data.notCanGetReward);
        this.set("rankStats", data.rankStats);

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

    getLastRankReward: function () {
        cc.log("Tournament getLastRankReward");

        var table = outputTables.ranking_reward.rows;
        var ranking = this._canGetReward[0] || this._notCanGetReward[0];
        var canReceive = this._canGetReward[0] || false;

        if (ranking) {
            return {
                ranking: ranking,
                canReceive: canReceive,
                elixir: table[ranking].elixir
            }
        } else {
            return null;
        }
    },

    sync: function (cb) {
        cc.log("Tournament sync");

        var that = this;
        lz.server.request("area.rankHandler.rankingList", {}, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("Tournament sync success");

                var msg = data.msg;

                that.update(msg.rank);
                
                cb();

                lz.um.event("event_rank_list");
            } else {
                cc.log("Tournament updateRankList fail");

                TipLayer.tip(data.msg);

                cb();

                lz.dc.event("event_rank_list");
            } else {
                cc.log("Tournament sync fail");

                TipLayer.tip(data.msg);

                cb();
            }
        });
    },

    defiance: function (cb, targetId, ranking) {
        cc.log("Tournament defiance: " + targetId + " ranking: " + ranking);

        var that = this;
        lz.server.request("area.rankHandler.challenge", {
            targetId: targetId,
            ranking: ranking
        }, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("Tournament defiance success");

                var msg = data.msg;
                var player = gameData.player;
                var cbData = {};
                var upgradeInfo = msg.upgradeInfo;

                player.set("exp", msg.exp);

                if (upgradeInfo) {
                    player.upgrade(upgradeInfo);

                    cbData.upgradeReward = upgradeInfo.rewards;
                }

                if (msg.level9Box) {
                    var box = {
                        money: msg.level9Box.money,
                        skillPoint: msg.level9Box.skillPoint,
                        energy: msg.level9Box.energy,
                        power: msg.level9Box.powerValue
                    };

                    player.adds(box);

                    cbData.level9Box = box;
                }

                cc.log("firstTime: " + msg.firstTime);
                if (msg.firstTime) {
                    cbData.isFirstTournament = msg.firstTime;
                    msg.battleLog.isFirstTournament = msg.firstTime;
                }

                cbData.battleLogId = BattleLogPool.getInstance().pushBattleLog(msg.battleLog, PVP_BATTLE_LOG);

                cb(cbData);

                lz.um.event("event_challenge");
            } else if (code == 505) {
                cc.log("Tournament defiance busy");

                TipLayer.tip(data.msg);
            } else {
                cc.log("Tournament defiance fail");

                TipLayer.tip(data.msg);

                cb();
            }
        });
    },

    receive: function (cb) {
        cc.log("Tournament receive");

        var ranking = this._canGetReward[0];

        if (this._canGetReward.length > 0) {
            var that = this;
            lz.server.request("area.rankHandler.getRankingReward", {
                ranking: ranking
            }, function (data) {
                cc.log(data);

                if (data.code == 200) {
                    cc.log("Tournament receive success");

                    var msg = data.msg;

                    gameData.player.add("elixir", msg.elixir);

                    that._canGetReward.shift();

                    cb({
                        elixir: msg.elixir
                    });

                    lz.um.event("event_ranking_reward", ranking);
                } else {
                    cc.log("Tournament receive fail");

                    TipLayer.tip("领取奖励出错");
                }
            });
        } else {
            TipLayer.tip("领取奖励出错");
        }
    }
});


Tournament.create = function () {
    var ret = new Tournament();

    if (ret) {
        return ret;
    }

    return null;
};
