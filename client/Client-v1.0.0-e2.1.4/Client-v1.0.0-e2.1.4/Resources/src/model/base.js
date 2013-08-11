/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-14
 * Time: 下午3:41
 * To change this template use File | Settings | File Templates.
 */


/*
 *
 * */


var lz = {};

/**
 * copy an new object
 * @function
 * @param {object|Array} obj source object
 * @return {Array|object}
 */
lz.clone = function (obj) {
    var newObj = (obj instanceof Array) ? [] : {};
    for (var key in obj) {
        var copy = obj[key];
        if (copy instanceof Array) {
            newObj[key] = lz.clone(copy);
        } else if (((typeof copy) == "object")) {
            newObj[key] = lz.clone(copy);
        } else {
            newObj[key] = copy;
        }
    }
    return newObj;
};

// 获取不大于原数的随机数
Number.prototype.getRandom = function () {
    return Math.floor(Math.random() * this);
}
