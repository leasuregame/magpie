/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-8-22
 * Time: 下午12:02
 * To change this template use File | Settings | File Templates.
 */


/*
 * spirit
 * */


var Spirit = Entity.extend({
    _lv: 0,
    _maxLv: 0,
    _exp: 0,
    _maxExp: 0,
    _rate: 0,
    _passiveHarm: 0,
    _skillHarm: 0,

    init: function (data) {
        cc.log("Spirit init");

        this.off();
        this.on("lvChange", this._lvChangeEven);

        this.set("maxLv", outputTables.lv_limit.rows[1].spirit_lv_limit);

        this.update(data);

        this.on("lvChange", this._abilityChangeEven);

        return true;
    },

    update: function (data) {
        cc.log("Spirit update");

        if (!data) return;

        this.set("lv", data.lv);
        this.set("exp", data.spirit);
    },

    _lvChangeEven: function () {
        cc.log("Spirit _lvChangeEven");

        var table = outputTables.spirit.rows[this._lv];

        this._maxExp = table.spirit_need;
        this._passiveHarm = table.hp_inc;
        this._skillHarm = table.spirit_atk_pct;
        this._rate = table.rate;
    },

    _abilityChangeEven: function () {
        cc.log("Spirit _abilityChangeEven");

        gameData.player.checkAbility();
    },

    getSpiritUrl: function () {
        return main_scene_image["spirit_1_" + Math.ceil(this._lv / 2)];
    },

    canUpgrade: function () {
        cc.log("Spirit canUpgrade");

        return (this._lv < this._maxLv && this._exp >= this._maxExp);
    },

    upgrade: function (cb) {
        cc.log("Spirit upgrade");

        var that = this;
        lz.server.request("area.spiritHandler.spiritorUpgrade", {}, function (data) {
            cc.log(data);

            if (data.code == 200) {
                cc.log("upgrade success");

                var msg = data.msg;

                that.update(msg.spiritor);

                cb(true);

                lz.um.event("event_spirit_upgrade", that._lv);
            } else {
                cc.log("upgrade fail");

                cb(false);
            }
        });
    }
});


Spirit.create = function () {
    var ret = new Spirit();

    if (ret) {
        return ret;
    }

    return null;
};