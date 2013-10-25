/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-9-9
 * Time: 下午4:36
 * To change this template use File | Settings | File Templates.
 */


/*
 * achievement
 * */


var Achievement = Entity.extend({
    _achievement: {},
    _length: 0,

    init: function () {
        cc.log("Achievement init");

        this.sync();
    },

    update: function (data) {
        cc.log("Achievement update");
        cc.log(data);

        this._achievement = {};
        this._length = 0;

        var table = outputTables.achievement.rows;

        for (var key in table) {
            this._achievement[key] = {
                id: table[key].id,
                need: table[key].need,
                count: 0,
                name: table[key].name,
                description: table[key].desc,
                gold: table[key].gold,
                energy: table[key].energy
            };

            if (data[key]) {
                this._achievement[key].count = data[key].got || 0;
                this._achievement[key].isReceiver = data[key].isTake || false;
                this._achievement[key].isAchieve = data[key].isAchieve || false;
            }

            this._length += 1;
        }
    },


    sync: function () {
        cc.log("Achievement sync");

        var that = this;
        lzWindow.pomelo.request("area.achieveHandler.achievements", {}, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);

            if (data.code == 200) {
                cc.log("sync success");

                var msg = data.msg;

                that.update(msg);

                lzWindow.pomelo.on("onAchieve", function (data) {
                    cc.log("***** on achieve:");
                    cc.log(data);

                    gameData.achievement.setAchieve(data.msg.achieveId);
                });
            } else {
                cc.log("sync fail");

                that.sync();
            }
        });
    },

    receiver: function (cb, id) {
        cc.log("Achievement receiver");

        var that = this;
        lzWindow.pomelo.request("area.achieveHandler.getReward", {
            id: id
        }, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);

            if (data.code == 200) {
                cc.log("receiver success");

                that._achievement[id].isReceiver = true;

                var reward = {
                    gold: that._achievement[id].gold,
                    energy: that._achievement[id].energy
                };

                gameData.player.adds(reward);

                cb(reward);
            } else {
                cc.log("receiver fail");

                TipLayer.tip(data.msg);
            }
        });
    },

    setAchieve: function (id) {
        cc.log("Achievement setAchieve");

        var achievement = this._achievement[id];
        achievement.isAchieve = true;
        achievement.count = achievement.need;
    }
});


Achievement.create = function () {
    var ret = new Achievement();

    if (ret) {
        return ret;
    }

    return null;
}