/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-24
 * Time: 上午11:33
 * To change this template use File | Settings | File Templates.
 */


/*
* pass label
* */


var PassLabel = cc.Node.extend({
    onEnter: function() {
        cc.log("PassLabel onEnter");
    },

    init : function() {
        cc.log("PassLabel init");
    },

    update: function() {
        cc.log("PassLabel update");
    }

})


PassLabel.create = function() {
    var ret = new PassLabel();

    if(ret && ret.init()) {
        return ret;
    }

    return null;
}