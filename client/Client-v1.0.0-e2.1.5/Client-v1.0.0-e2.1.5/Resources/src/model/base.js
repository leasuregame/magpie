/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-14
 * Time: 下午3:41
 * To change this template use File | Settings | File Templates.
 */


/*
 * 基础功能
 * */


// 命名空间
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

lz.getColor = function (colorType) {
    var color = cc.c3b(255, 255, 255);

    switch (colorType) {
        case "green" :
            color = cc.c3b(118, 238, 60);
            break;
        case "blue" :
            color = cc.c3b(105, 218, 255);
            break;
        case "yellow" :
            color = cc.c3b(255, 248, 69);
            break;
    }

    return color;
};


/*
 * 数组去重
 * */
Array.prototype.distinct = function () {
    var arr = [],
        obj = {},
        i = 0,
        len = this.length,
        result;

    for (; i < len; i++) {
        result = this[i];
        if (obj[result] !== result) {
            arr.push(result);
            obj[result] = result;
        }
    }

    return arr;
};


// 获取不大于原数的随机数
Number.prototype.getRandom = function () {
    return Math.floor(Math.random() * this);
}
