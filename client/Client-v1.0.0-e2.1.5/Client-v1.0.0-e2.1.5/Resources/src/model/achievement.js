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

    update: function () {
        cc.log("Achievement update");

        this._achievement = {};
        this._length = 0;

        var table = outputTables.achievement.rows;

        for (var key in table) {
            this._achievement[key] = {
                id: table[key].id,
                count: 0,
                need: table[key].need,
                name: table[key].name,
                description: table[key].desc,
                gold: table[key].gold,
                energy: table[key].energy
            };

            this._length += 1;
        }
    },

    sync: function () {
        cc.log("Achievement sync");

        this.update();
    }
});


Achievement.create = function () {
    var ret = new Achievement();

    if (ret) {
        return ret;
    }

    return null;
}