/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-6-3
 * Time: 下午3:06
 * To change this template use File | Settings | File Templates.
 */


/*
* 卡牌 详细信息面板
* */


var CardDetails = cc.Layer.extend({
    init : function(card) {
        if(!this._super()) return false;

        return true;
    }
})


CardDetails.create = function(card) {
    var ret = new CardDetails();

    if(ret && ret.init(card)) {
        return ret;
    }

    return null;
}

