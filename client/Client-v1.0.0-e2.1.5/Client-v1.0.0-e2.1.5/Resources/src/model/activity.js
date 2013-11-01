/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-10-30
 * Time: 上午11:33
 * To change this template use File | Settings | File Templates.
 */

var GOLD_RECEIVE = 1;
var GOLD_NO_RECEIVE = 0;

var Activity = Entity.extend({

    _type: {},

    init: function () {
        cc.log("Activity init");

        this._type = {};

        this.sync();

        return true;
    },

    sync: function () {
        cc.log("Activity sync");
        var that = this;
        lzWindow.pomelo.request('area.playerHandler.getActivityInfo', {}, function (data) {
            cc.log(data);
            if (data.code == 200) {
                cc.log("sync success");
                that.update(data.msg.levelReward);
            } else {
                cc.log("sync fail");

                that.sync();
            }
        });
    },

    update: function (mark) {
        cc.log("Activity update");
        for(var i = 1;i <= 10;i++) {
            var offset = (i - 1) % EACH_NUM_BIT;
            index = Math.floor((i - 1) / EACH_NUM_BIT);
            if (mark[index]) {
                if ((mark[index] >> offset & 1) == 1) {
                    this._changeTypeById(i, GOLD_RECEIVE);
                } else {
                    this._changeTypeById(i, GOLD_NO_RECEIVE)
                }
            }
        }
    },

    getPowerReward: function () {
        cc.log("Activity getPowerReward");
        lzWindow.pomelo.request('area.playerHandler.givePower', {}, function (data) {
            cc.log(data);
            if (data.code == 200) {
                TipLayer.tip('体力: ' + data.msg.powerValue);
                gameData.player.add('power', data.msg.powerValue);
            } else {
                TipLayer.tip(data.msg);
            }
        });
    },

    getGoldReward: function (id,cb) {
        cc.log("Activity getGoldReward");
        var that = this;
        lzWindow.pomelo.request('area.playerHandler.getLevelReward', {id: id}, function (data) {
            cc.log(data);
            if (data.code == 200) {
                TipLayer.tip('元宝: ' + data.msg.gold);
                gameData.player.add('gold', data.msg.gold);
                that._changeTypeById(id,GOLD_RECEIVE);
                cb(true);
            } else {
                TipLayer.tip(data.msg);
                cb(false)
            }
        });
    },

    _changeTypeById:function (id , type) {
       this._type[id] = type;
    },

    getTypeById: function (id) {
        return this._type[id];
    }

});

Activity.create = function () {
    var ret = new Activity();

    if (ret) {
        return ret;
    }

    return null;
};