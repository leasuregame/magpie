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
    _maxLv: 0,
    _exp: 0,
    _maxExp: 0,
    _collectCount: 0,
    _maxCollectCount: 0,
    _perObtain: 0,

    init: function (data) {
        cc.log("SpiritPool init");

        this.off();
        this.on("lvChange", this._lvChangeEvent);

        this._maxLv = outputTables.lv_limit.rows[1].spirit_lv_limit;
        var vip = gameData.player.get("vip");
        this._maxCollectCount = outputTables.daily_gift.rows[1].collect_count + outputTables.vip_privilege.rows[vip].spirit_collect_count;
        this.update(data);

        cc.log(this);

        return true;
    },

    update: function (data) {
        cc.log("SpiritPool update");

        this.set("lv", data.lv);
        this.set("exp", data.exp);
        this.set("collectCount", data.collectCount);
    },

    _lvChangeEvent: function () {
        cc.log("SpiritPool _lvChangeEvent");

        var table = outputTables.spirit_pool.rows[this._lv];

        this._maxExp = table.exp_need;
        this._perObtain = table.spirit_obtain;
    },

    canCollect: function (useGold) {
        cc.log("SpiritPool canCollect");

        if (this._collectCount <= 0) {
            GoPaymentLayer.pop(TYPE_SPIRIT_COLLECT_COUNT_USE_UP_TIPS);
            return false;
        }

        if (useGold && gameData.player.get("gold") < 20) {
            TipLayer.tip("魔石不足");
            return false;
        }

        return true;
    },

    collect: function (cb, useGold) {
        cc.log("SpiritPool collect");

        var that = this;
        lz.server.request("area.spiritHandler.collect", {
            isGold: useGold
        }, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("upgrade success");

                var msg = data.msg;

                gameData.spirit.add("exp", msg.spirit_obtain);

                if (useGold) {
                    gameData.player.add("gold", -20);
                }

                that.update(msg.spiritPool);

                cb(msg);

                lz.um.event("event_collect", useGold ? "useGold" : "none");
            } else {
                cc.log("upgrade fail");

                cb();
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