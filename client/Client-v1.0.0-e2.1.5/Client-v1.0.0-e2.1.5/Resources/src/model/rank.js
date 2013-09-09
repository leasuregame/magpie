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
    _abilityRank: null,
    _lvRank: null,
    _tournamentRank: null,
    _passRank: null,

    init: function () {
        cc.log("Rank init");

        return true;
    },

    update: function () {
        cc.log("Rank update");
    },

    sync: function () {
        cc.log("Rank init");


    }
});


Rank.create = function () {
    var ret = new Rank();

    if (ret) {
        return ret;
    }

    return null;
};