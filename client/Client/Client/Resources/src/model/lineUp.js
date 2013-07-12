/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-11
 * Time: 下午4:53
 * To change this template use File | Settings | File Templates.
 */


/*
* line up
* */


var LineUp = Entity.extend({
    init : function() {
        return true;
    }
})


LineUp.create = function() {
    var ret = new LineUp();

    if(ret && ret.init()) {
        return ret;
    }

    return null;
}