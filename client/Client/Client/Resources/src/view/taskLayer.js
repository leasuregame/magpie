/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-20
 * Time: 下午4:17
 * To change this template use File | Settings | File Templates.
 */


/*
* task layer
* */


var TaskLayer = cc.Layer.extend({
    init : function() {
        cc.log("TaskLayer init");

        if(!this._super()) return false;

        return true;
    }
})


TaskLayer.create = function() {
    var ret = new TaskLayer();

    if(ret && ret.init()) {
        return ret;
    }

    return null;
}