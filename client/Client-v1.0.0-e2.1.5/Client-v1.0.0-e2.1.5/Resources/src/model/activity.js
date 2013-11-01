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
        _type = {};
        this.sync();
        return true;
    },

    sync: function () {
        cc.log("Activity sync");
        var that = this;
        lzWindow.pomelo.request('area.playerHandler.getActivityInfo', {}, function (data) {
            cc.log(data);
            if (data.code == 200) {
                that.update(data.msg.levelReward);
            } else {
                TipLayer.tip(data.msg);
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

    getPowerReward: function (cb) {
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

    getGoldReward: function (id) {
        var that = this;
        lzWindow.pomelo.request('area.playerHandler.getLevelReward', {id: id}, function (data) {
            cc.log(data);
            if (data.code == 200) {
                TipLayer.tip('元宝: ' + data.msg.gold);
                gameData.player.add('gold', data.msg.gold);
                that._changeTypeById(id,GOLD_RECEIVE);
            } else {
                TipLayer.tip(data.msg);
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