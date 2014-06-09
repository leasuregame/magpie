/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-8-29
 * Time: 下午2:19
 * To change this template use File | Settings | File Templates.
 */


/*
 * treasure hunt
 * */


var TreasureHunt = Entity.extend({
    _count: 0,
    _freeCount: 0,

    init: function (data) {
        cc.log("TreasureHunt init");

        this.update(data);
    },

    update: function (data) {
        cc.log("TreasureHunt update");

        this.set("count", data.count);
        this.set("freeCount", data.freeCount);
    },

    canTreasureHunt: function () {
        if (this._count <= 0 && this._freeCount <= 0) {
            TipLayer.tip("今天寻宝次数已用完");
            return false;
        }

        if (this._freeCount <= 0 && gameData.player.get("gold") < 20) {
            TipLayer.tip("魔石不足");
            return false;
        }

        return true;
    },

    treasureHunt: function (cb) {
        cc.log("TreasureHunt treasureHunt");

        var that = this;
        lz.server.request("area.dailyHandler.lottery", {}, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);

            if (data.code == 200) {
                cc.log("treasureHunt success");

                var msg = data.msg;

                var id = msg.resourceId;
                var table = outputTables.treasure_hunt.rows[id];

                var goldResume = data.msg.goldResume;

                var times = msg.times;

                if (table.type == "spirit") {
                    gameData.spirit.add("exp", table.value * times);
                } else {
                    gameData.player.add(table.type, table.value * times);
                }

                if (that._freeCount <= 0) {
                    gameData.player.add("gold", -goldResume);
                }

                that._count = msg.lotteryCount;
                that._freeCount = msg.lotteryFreeCount;

                gameMark.updateTreasureHuntMark(false);

                var str = {};
                str[table.type] = table.value * times;

                cb({
                    id: id,
                    str: str
                });

                lz.um.event("event_treasure_hunt", id);
            } else {
                cc.log("treasureHunt fail");

                TipLayer.tip(data.msg);

                cb();
            }
        });
    }
});


TreasureHunt.create = function () {
    var ret = new TreasureHunt();

    if (ret) {
        return ret;
    }

    return null;
};