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
    _canGetReward: null,
    _notCanGetReward: null,
    _rankList: null,
    _rankStats: null,
    _thisWeekElixirRank: null,
    _lastWeekElixirRank: null,
    _thisWeek: null,
    _lastWeek: null,
    _isGetElixirReward: false,

    init: function (data) {
        cc.log("Tournament init");

        this._ranking = 0;
        this._count = 0;
        this._canGetReward = [];
        this._notCanGetReward = [];
        this._rankList = [];
        this._rankStats = {};
        this._thisWeekElixirRank = [];
        this._lastWeekElixirRank = [];
        this._isGetElixirReward = true;

        this.update(data);
        this.sync();

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

    sync: function () {
        cc.log("Tournament sync");

        var that = this;
        lz.server.request("area.rankHandler.lastWeek", {}, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("Tournament sync success");

                var msg = data.msg;
                that.set("lastWeekElixirRank", msg.elixirs);

                if (msg.lastWeek) {
                    that.set("lastWeek", msg.lastWeek);
                }

                that.set("isGetElixirReward", msg.isGet);
            } else {
                cc.log("Tournament sync fail");

                that.sync();
            }
        }, true);
    },

    updateRankList: function (cb) {
        cc.log("Tournament updateRankList");

        var that = this;
        lz.server.request("area.rankHandler.rankingList", {}, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("Tournament updateRankList success");

                var msg = data.msg;

                that.update(msg.rank);
                cb();

                lz.um.event("event_rank_list");
            } else {
                cc.log("Tournament updateRankList fail");

                TipLayer.tip(data.msg);

                cb();
            }
        });
    },

    updateElixirRank: function (cb) {
        cc.log("Tournament updateElixirRank");

        var that = this;
        lz.server.request("area.rankHandler.thisWeek", {}, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("Tournament updateElixirRank success");

                var msg = data.msg;

                that.set("thisWeekElixirRank", msg.elixirs);
                if (msg.thisWeek) {
                    that.set("thisWeek", msg.thisWeek);
                }

                cb(msg);
            } else {
                cc.log("Tournament updateElixirRank fail");

                TipLayer.tip(data.msg);

                cb();
            }
        });
    },

    getElixirRankReward: function (cb) {
        cc.log("Tournament getElixirReward");

        var that = this;
        lz.server.request("area.rankHandler.getElixirRankReward", {}, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("Tournament getElixirReward success");

                var msg = data.msg;
                var reward = {};

                if (msg.cardIds && msg.cardIds.length > 0) {
                    var cardIdList = msg.cardIds;
                    var len = cardIdList.length;
                    var cardData = msg.card;

                    reward["exp_card"] = len;

                    for (var i = 0; i < len; ++i) {
                        cardData.id = cardIdList[i];
                        var card = Card.create(cardData);
                        gameData.cardList.push(card);
                    }
                }

                for (var key in msg) {
                    if (key != "card" && key != "cardIds") {
                        if (msg[key] > 0) {
                            gameData.player.add(key, msg[key]);
                            reward[key] = msg[key];
                        }
                    }
                }

                that.set("isGetElixirReward", true);
                cb(reward);
            } else {
                cc.log("Tournament getElixirReward fail");

                TipLayer.tip(data.msg);
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

            var code = data.code;

            if (code == 200) {
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

                cbData.battleLogId = BattleLogPool.getInstance().pushBattleLog(msg.battleLog);

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
    },

    getThisWeekReward: function () {
        cc.log("Tournament getThisWeekReward");

        if (!this._thisWeek) {
            return null;
        }

        var rank = this._thisWeek.rank;
        if (rank <= 50) {
            return outputTables.elixir_ranking_reward.rows[rank];
        } else {
            var money = outputTables.elixir_ranking_reward.rows[50].money;
            money -= parseInt(Math.ceil((rank - 50) / 20) * 0.003 * money);
            money = Math.max(50000, money);
            return {money: money}
        }
    },

    isCanGetReward: function () {
        cc.log("Tournament isCanGetReward");

        return !(this._isGetElixirReward || !this._lastWeek);
    }
});


Tournament.create = function () {
    var ret = new Tournament();

    if (ret) {
        return ret;
    }

    return null;
};
