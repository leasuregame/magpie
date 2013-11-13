/**
 * Created with JetBrains WebStorm.
 * User: lcc
 * Date: 13-7-10
 * Time: 下午3:19
 * To change this template use File | Settings | File Templates.
 */


/*
 * rank
 * */


var Rank = Entity.extend({
    _abilityRankList: [],
    _lvRankList: [],
    _passRankList: [],
    _tournamentRankList: [],

    init: function () {
        cc.log("Rank init");

        this.sync();

        return true;
    },

    update: function (data) {
        cc.log("Rank update");

        this._abilityRankList = data.ability || [];
        this._lvRankList = data.level || [];
        this._passRankList = data.pass || [];
        this._tournamentRankList = data.ranking || [];
    },

    sync: function () {
        cc.log("Rank sync");

        var that = this;
        lz.server.request(
            "area.topHandler.orderList",
            {},
            function (data) {
                cc.log("pomelo websocket callback data:");
                cc.log(data);

                if (data.code == 200) {
                    cc.log("rank sync success");

                    var msg = data.msg;

                    that.update(msg);
                } else {
                    cc.log("rank sync fail");

                    that.sync();
                }
            },
            true
        );
    }
});


Rank.create = function () {
    var ret = new Rank();

    if (ret) {
        return ret;
    }

    return null;
};