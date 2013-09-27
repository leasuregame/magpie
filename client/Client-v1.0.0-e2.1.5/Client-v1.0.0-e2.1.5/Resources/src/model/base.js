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


/*
 * 命名空间
 * */
var lz = {};


/**
 * copy an new object
 * @function
 * @param {object|Array} obj source object
 * @return {Array|object}
 */
lz.clone = function (obj) {
    // Cloning is better if the new object is having the same prototype chain
    // as the copied obj (or otherwise, the cloned object is certainly going to
    // have a different hidden class). Play with C1/C2 of the
    // PerformanceVirtualMachineTests suite to see how this makes an impact
    // under extreme conditions.
    //
    // Object.create(Object.getPrototypeOf(obj)) doesn't work well because the
    // prototype lacks a link to the constructor (Carakan, V8) so the new
    // object wouldn't have the hidden class that's associated with the
    // constructor (also, for whatever reasons, utilizing
    // Object.create(Object.getPrototypeOf(obj)) + Object.defineProperty is even
    // slower than the original in V8). Therefore, we call the constructor, but
    // there is a big caveat - it is possible that the this.init() in the
    // constructor would throw with no argument. It is also possible that a
    // derived class forgets to set "constructor" on the prototype. We ignore
    // these possibities for and the ultimate solution is a standardized
    // Object.clone(<object>).
    var newObj = new obj.constructor;

    // Assuming that the constuctor above initialized all properies on obj, the
    // following keyed assignments won't turn newObj into dictionary mode
    // becasue they're not *appending new properties* but *assigning existing
    // ones* (note that appending indexed properties is another story). See
    // CCClass.js for a link to the devils when the assumption fails.
    for (var key in obj) {
        var copy = obj[key];
        // Beware that typeof null == "object" !
        if (((typeof copy) == "object") && copy && !(copy instanceof cc.Node) && !(copy instanceof HTMLElement)) {
            newObj[key] = lz.clone(copy);
        } else {
            newObj[key] = copy;
        }
    }
    return newObj;
};


/*
 * 格式化字符串，分隔成段
 * */
lz.format = function (str, length) {
    cc.log("CardDetails _getDescription");

    if (!length || length <= 0) return [];

    var strList = [];
    var len = str.length;

    for (var i = 0; len > 0; ++i) {
        var index = i * length;

        if (len < length) {
            strList[i] = str.substring(index);
        } else {
            strList[i] = str.substring(index, index + length);
        }

        len -= length;
    }

    return strList;
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

lz.getAngle = function (p1, p2) {
    return (90 - Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI);
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


/*
 * 获取介于两数之间的随机数[a, b)
 * */
lz.random = function (a, b) {
    if (b == undefined) {
        b = a;
        a = 0;
    }

    return (Math.random() * (b - a) + a);
};

/*
 * 获取整形随机数[a, b - 1]
 * */
lz.randomInt = function (a, b) {
    var randNum = lz.random(a, b);

    return Math.floor(randNum);
};

var gameGoodsName = {
    "exp": "经验",
    "money": "铜板",
    "gold": "黄金",
    "power": "体力",
    "elixir": "仙丹",
    "fragment": "卡魂",
    "energy": "活力",
    "skillPoint": "技能点",
    "spirit": "灵气"
};


lz.getNameWithKey = function (key) {
    return gameGoodsName[key] || key;
};

// 获取不大于原数的随机数
Number.prototype.getRandom = function () {
    return Math.floor(Math.random() * this);
};
