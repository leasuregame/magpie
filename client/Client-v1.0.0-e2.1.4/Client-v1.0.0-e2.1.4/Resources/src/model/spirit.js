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
    _exp: 0,
    _maxExp: 0,

    init: function (data) {
        cc.log("Spirit init");

        this.update(data);

        cc.log(this);

        return true;
    },

    update: function (data) {
        cc.log("Spirit update");

        this.set("lv", data.lv);
        this.set("exp", data.spirit);
        this.set("maxExp", outputTables.spirit.rows[this._lv].spirit_need);
    }
});


Spirit.create = function () {
    var ret = new Spirit();

    if (ret) {
        return ret;
    }

    return null;
};