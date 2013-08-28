/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-8-22
 * Time: 下午12:02
 * To change this template use File | Settings | File Templates.
 */


/*
 * spirit pool
 * */


var SpiritPool = Entity.extend({
    _lv: 0,
    _exp: 0,
    _maxExp: 0,
    _collectCount: 0,

    init: function (data) {
        cc.log("SpiritPool init");

        this.update(data);

        cc.log(this);

        return true;
    },

    update: function (data) {
        cc.log("SpiritPool update");

        this.set("lv", data.lv);
        this.set("exp", data.exp);
        this.set("collectCount", data.collectCount);

        this._loadTable();
    },

    _loadTable: function () {
        cc.log("SpiritPool _loadTable");

        var table = outputTables.spirit_pool.rows[this._lv];

        this._maxExp = table.exp_need;
    },

    collect: function (cb, useGold) {
        cc.log("SpiritPool collect");

        var that = this;
        lzWindow.pomelo.request("area.spiritHandler.collect", {
            isGold: useGold
        }, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("upgrade success");

                var msg = data.msg;

                gameData.spirit.update(msg.spiritor);
                that.update(msg.spiritPool);

                cb(msg.rewardSpirit);
            } else {
                cc.log("upgrade fail");

                cb(null);
            }
        });
    }
});


SpiritPool.create = function () {
    var ret = new SpiritPool();

    if (ret) {
        return ret;
    }

    return null;
};