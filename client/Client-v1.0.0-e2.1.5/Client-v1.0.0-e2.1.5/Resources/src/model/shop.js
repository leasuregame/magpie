/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-9-4
 * Time: 下午4:57
 * To change this template use File | Settings | File Templates.
 */


/*
 * shop
 * */


var MAX_VIP_LEVEL = 12;

var Shop = Entity.extend({
    init: function () {

    },

    getPaymentTypeList: function () {
        cc.log("Shop getPaymentTypeList");

        var table = outputTables.recharge.rows;
        var paymentTypeList = [];

        for (var key in table) {
            paymentTypeList.push(table[key]);
        }

        paymentTypeList.sort(this._cmp);

        return paymentTypeList;
    },

    getVipBoxList: function () {
        cc.log("Shop getVipBoxList");

        var table = outputTables.vip_box.rows;
        var vipBoxList = [];

        for (var key in table) {
            vipBoxList.push(table[key]);
        }

        vipBoxList.sort(this._cmp);

        return vipBoxList;
    },

    getVipPrivilegeList: function () {
        cc.log("Shop getVipPrivilege");

        var table = outputTables.vip_privilege.rows;
        var vipPrivilegeList = [];

        for (var key in table) {
            vipPrivilegeList.push(table[key]);
        }

        vipPrivilegeList.sort(this._cmp);

        return vipPrivilegeList;
    },

    getNextVipCash: function () {
        var player = gameData.player;
        var vip = player.get("vip");

        if (vip == 12) return 0;

        return outputTables.vip.rows[vip + 1].total_cash - player.get("cash");
    },

    payment: function () {
        cc.log("Shop payment");
    },

    buyVipBox: function () {
        cc.log("shop bugVipBox");
    },

    bugExpCard: function () {
        cc.log("Shop bugExpCard");
    },

    _cmp: function (a, b) {
        return (a.id - b.id);
    }
});


Shop.create = function () {
    var ret = new Shop();

    if (ret) {
        return ret;
    }

    return null;
}