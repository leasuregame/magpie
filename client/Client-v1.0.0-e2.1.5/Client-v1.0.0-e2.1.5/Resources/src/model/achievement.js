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

        this._achievement = {};
        this._length = 0;

        var table = outputTables.achievement.rows;

        for (var key in table) {
            this._achievement[key] = {
                id: table[key].id,
                need: table[key].need,
                name: table[key].name,
                description: table[key].desc,
                gold: table[key].gold,
                energy: table[key].energy
            };

            if (data[key]) {
                this._achievement[key].count = data[key].got || 0;
                this._achievement[key].isAchieve = data[key].isAchieve || 0;
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
            } else {
                cc.log("sync fail");

                that.sync();
            }
        });
    }
});


Achievement.create = function () {
    var ret = new Achievement();

    if (ret) {
        return ret;
    }

    return null;
}