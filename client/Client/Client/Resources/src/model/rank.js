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
    _rankList: null,


    init : function() {

        return true;
    }
})


Rank.create = function(data) {
    var ret = new Rank();

    if(ret && ret.init(data)) {
        return ret;
    }

    return null;
}