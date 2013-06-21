/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-17
 * Time: 上午11:23
 * To change this template use File | Settings | File Templates.
 */


/*
 * 角色详细信息
 * */

var RoleInformationLayer = cc.Layer.extend({
    init: function () {
        cc.log("RoleInformationLayer init");

        if (!this._super()) return false;

        return true;
    }
})

RoleInformationLayer.create = function () {
    var ret = new RoleInformationLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
}