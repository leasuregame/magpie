/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-28
 * Time: 下午1:16
 * To change this template use File | Settings | File Templates.
 */


/*
 * battle log
 * */


var BattleLog = Entity.extend({
    _id: 0,
    _type: PVE_BATTLE_LOG,
    _card: {},
    _ownId: 0,
    _ownName: null,
    _enemyId: 0,
    _enemyName: null,
    _winner: "",
    _reward: null,
    _battleStep: null,
    _battleStepLen: 0,
    _index: -1,
    _isPlayback: false,
    _isFirstTournament: false,

    init: function (id, isPlayback) {
        cc.log("BattleLog init");

        var battleLog = BattleLogPool.getInstance().getBattleLogById(id);

        this.set("id", battleLog.id);
        this.set("type", battleLog.type);
        this.set("card", battleLog.cards);
        this.set("ownId", battleLog.ownId);
        this.set("ownName", battleLog.ownName);
        this.set("enemyId", battleLog.enemyId);
        this.set("enemyName", battleLog.enemyName);
        this.set("winner", battleLog.winner);
        this.set("reward", battleLog.rewards);
        this.set("battleStep", battleLog.steps);
        this.set("battleStepLen", battleLog.steps.length);
        this.set("isPlayback", isPlayback);

        for (var key in this._card) {
            this._card[key].index = key;
        }

        if (isPlayback) {
            this._reward = {};
        }

        if (battleLog.isFirstTournament) {
            this.set("isFirstTournament", true);
        }
        
        var player = gameData.player;
        var spirit = gameData.spirit;
        var cardList = gameData.cardList;

        if (this._reward) {
            for (var key in this._reward) {
                if (this._reward[key]) {
                    switch (key) {
                        case "power" :
                            player.add("power", this._reward[key]);
                            break;
                        case "money" :
                            player.add("money", this._reward[key]);
                            break;
                        case "gold" :
                            player.add("gold", this._reward[key]);
                            break;
                        case "elixir" :
                            player.add("elixir", this._reward[key]);
                            break;
                        case "fragment" :
                            player.add("fragment", this._reward[key]);
                            break;
                        case "energy" :
                            player.add("energy", this._reward[key]);
                            break;
                        case "honor" :
                            player.add("honor", this._reward[key]);
                            break;
                        case "superHonor" :
                            player.add("superHonor", this._reward[key]);
                            break;
                        case "skillPoint" :
                            player.add("skillPoint", this._reward[key]);
                            break;
                        case "speaker" :
                            player.add("speaker", this._reward[key]);
                            break;
                        case "totalSpirit" :
                            spirit.add("exp", this._reward[key]);
                            break;
                        case "cards" :
                            var cards = this._reward[key];
                            var len = cards.length;

                            for (var i = 0; i < len; ++i) {
                                var card = Card.create(cards[i]);
                                cardList.push(card);
                            }
                            break;
                    }
                }
            }
        }

        return true;
    },

    isWin: function () {
        return (this._winner === "own");
    },

    getSpirit: function (id) {
        cc.log("BattleLog getSpirit: " + id);

        var i;
        if (id > 6) {
            for (i = 7; i <= 12; ++i) {
                if (this._card[i] != undefined && typeof(this._card[i]) == "number") {
                    return i;
                }
            }
        } else {
            for (i = 1; i <= 6; ++i) {
                if (this._card[i] != undefined && typeof(this._card[i]) == "number") {
                    return i;
                }
            }
        }
    },

    recover: function () {
        this._index = -1;
    },

    hasNextBattleStep: function () {
        this._index += 1;

        cc.log("BattleLog has Next BattleStep " + this._index + "  " + this._battleStepLen + " " + (this._index < this._battleStepLen));

        return (this._index < this._battleStepLen);
    },

    getBattleStep: function () {
        cc.log("BattleLog getBattleStep: " + this._battleStep[this._index]);

        return BattleStep.create(this._battleStep[this._index]);
    },

    getBattleStepIndex: function () {
        return this._index;
    }
});


BattleLog.create = function (id, isPlayback) {
    var ret = new BattleLog();

    if (ret && ret.init(id, isPlayback)) {
        return ret;
    }

    return null;
};
