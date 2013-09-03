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

        this._count = data.count;
        this._freeCount = data.freeCount;
    },

    treasureHunt: function (cb) {
        cc.log("TreasureHunt treasureHunt");

        var that = this;
        lzWindow.pomelo.request("area.dailyHandler.lottery", {}, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);

            if (data.code == 200) {
                cc.log("treasureHunt success");

                var msg = data.msg;

                var table = outputTables.treasure_hunt.rows[msg.resourceId];

                that._count = msg.lotteryCount;
                that._freeCount = msg.lotteryFreeCount;

                var playerData = {};
                playerData[table.type] = table.value;
                gameData.player.update(playerData);
                gameData.player.add("gold", -10);

                cb(msg.resourceId);
            } else {
                cc.log("treasureHunt fail");

                cb(-1);
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