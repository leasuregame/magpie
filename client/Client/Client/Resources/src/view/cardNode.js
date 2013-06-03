/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-6-3
 * Time: 下午3:10
 * To change this template use File | Settings | File Templates.
 */


/*
* card node
* */


var CardNode = cc.Node.extend({
    init : function(card) {
        if(!this._super()) return false;

        return true;
    }


})


CardNode.create = function(card) {
    var ret = new CardNode();

    if(ret && ret.init(card)) {
        return ret;
    }

    return null;
}
