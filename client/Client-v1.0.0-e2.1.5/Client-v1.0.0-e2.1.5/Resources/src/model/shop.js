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
    _useVipBoxList: [],

    init: function (data) {
        cc.log("Shop init");

        this._useVipBoxList = data.useVipBoxList;
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

        var len = this._useVipBoxList.length;
        for (var i = 0; i < len; ++i) {
            vipBoxList.splice(this._useVipBoxList[i] - 1, 1);
        }

        cc.log(vipBoxList);

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

        if (vip == MAX_VIP_LEVEL) return 0;

        return outputTables.vip.rows[vip + 1].total_cash - player.get("cash");
    },

    payment: function (id) {
        cc.log("Shop payment: " + id);

        var that = this;
        lzWindow.pomelo.request("area.messageHandler.reject", {
            msgId: msgId
        }, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);

            if (data.code == 200) {
                cc.log("accept success");

                var len = that._friendMessage.length;
                for (var i = 0; i < len; ++i) {
                    if (that._friendMessage[i].id == msgId) {
                        that._friendMessage[i].status = REJECT_STATUS;
                        break;
                    }
                }
            } else {
                cc.log("accept fail");
            }
        });
    },

    buyVipBox: function () {
        cc.log("shop bugVipBox");
    },

    bugExpCard: function () {
        cc.log("Shop bugExpCard");
    },

    _cmp: function (a, b) {
        return (b.id - a.id);
    }
});


Shop.create = function () {
    var ret = new Shop();

    if (ret) {
        return ret;
    }

    return null;
}