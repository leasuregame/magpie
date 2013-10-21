/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-4-25
 * Time: 下午3:22
 * To change this template use File | Settings | File Templates.
 */


/*
 * 单例模式产生器
 * */


var singleton = function (cls) {
    var result;

    return function () {
        if (result) return result;

        result = new cls();
        if (result.init != undefined) result.init();

        return result;
    }
};