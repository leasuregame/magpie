/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-14
 * Time: 下午3:41
 * To change this template use File | Settings | File Templates.
 */


/*
 * lz
 * */


var lz = lz || {};

// 判断平台是否浏览器
lz.TARGET_PLATFORM_IS_BROWSER = !("opengl" in sys.capabilities && "browser" != sys.platform);

/*
 * 模仿 setTimeout 和 clearTimeout 写的函数
 * 与浏览器中调用方式一致
 * */
(function () {
    var _callback = {};
    var _index = 0;

    lz.schedule = function (fn, interval, repeat, delay) {
        interval = interval || 0;
        repeat = (repeat == null) ? cc.REPEAT_FOREVER : repeat;
        delay = delay || 0;

        cc.Director.getInstance().getScheduler().scheduleCallbackForTarget(lz, fn, interval, repeat, delay, false);
    };

    lz.scheduleOnce = function (fn, delay) {
        lz.schedule(fn, 0.0, 0, delay);
    };

    lz.unschedule = function (fn) {
        // explicit nil handling
        cc.Director.getInstance().getScheduler().unscheduleCallbackForTarget(lz, fn);
    };

    lz.setTimeout = function (fn, delay) {
        var _fn = (function (index) {
            return function () {
                fn();
                delete _callback[index];
            }
        })(_index);


        _callback[_index] = _fn;
        _index += 1;

        delay = (delay || 0) / 1000;

        lz.scheduleOnce(_fn, delay);

        return (_index - 1);
    };

    lz.clearTimeout = function (index) {
        if (_callback[index]) {
            lz.unschedule(_callback[index]);
            delete _callback[index];
        }
    };
})();

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
        if (((typeof copy) == "object") && copy && !(copy instanceof cc.Node)) {
            newObj[key] = lz.clone(copy);
        } else {
            newObj[key] = copy;
        }
    }
    return newObj;
};

/*
 * 传入图片生成纹理
 * */
lz.getTexture = function (filename) {
    var texture = cc.TextureCache.getInstance().textureForKey(filename);

    if (!texture) {
        texture = cc.TextureCache.getInstance().addImage(filename);
    }

    return texture;
};

/*
 * 格式化字符串，分隔成段
 * */
lz.format = function (str, length) {
    cc.log("lz format");

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

lz.getStrWidth = function (str, fonName, fontSize) {
    var label = cc.LabelTTF.create(str, fonName, fontSize);
    return label.getContentSize().width;
};

/*
 * 获取两点间距离
 * */
lz.getDistance = function (p1, p2) {
    var x = p1.x - p2.x;
    var y = p1.y - p2.y;

    return Math.sqrt(x * x + y * y);
};

/*
 * 获取两个点之间的偏转角
 * */
lz.getAngle = function (p1, p2) {
    return (90 - Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI);
};

/*
 * 获取两数之间的随机数[a, b)
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

var gameGoodsIcon = {
    "money": "icon149",
    "gold": "icon148",
    "power": "icon150",
    "elixir": "icon151",
    "fragment": "icon243",
    "energy": "icon154",
    "skillPoint": "icon152",
    "spirit": "icon317",
    "exp_card": "icon316",
    "exp": "icon318",
    "speaker": "icon375",
    "honor": "icon405",
    "superHonor": "icon406",
    "pill": "icon459"
};

lz.getGoodsIconByKey = function (key) {
    return gameGoodsIcon[key];
};

var gameGoodsName = {
    "exp": {
        name: "经验",
        color: cc.c3b(255, 239, 131),
        icon: gameGoodsIcon["exp"]
    },
    "money": {
        name: "仙币",
        color: cc.c3b(255, 239, 131),
        icon: gameGoodsIcon["money"]
    },
    "gold": {
        name: "魔石",
        color: cc.c3b(118, 238, 60),
        icon: gameGoodsIcon["gold"]
    },
    "powerValue": {
        name: "体力",
        color: cc.c3b(255, 239, 131),
        icon: gameGoodsIcon["power"]
    },
    "power": {
        name: "体力",
        color: cc.c3b(255, 239, 131),
        icon: gameGoodsIcon["power"]
    },
    "elixir": {
        name: "仙丹",
        color: cc.c3b(255, 239, 131),
        icon: gameGoodsIcon["elixir"]
    },
    "fragment": {
        name: "卡魂",
        color: cc.c3b(255, 239, 131),
        icon: gameGoodsIcon["fragment"]
    },
    "fragments": {
        name: "卡魂",
        color: cc.c3b(255, 239, 131),
        icon: gameGoodsIcon["fragment"]
    },
    "energy": {
        name: "活力点",
        color: cc.c3b(255, 239, 131),
        icon: gameGoodsIcon["energy"]
    },
    "skillPoint": {
        name: "技能点",
        color: cc.c3b(255, 239, 131),
        icon: gameGoodsIcon["skillPoint"]
    },
    "totalSpirit": {
        name: "灵气",
        color: cc.c3b(118, 238, 60),
        icon: gameGoodsIcon["spirit"]
    },
    "spirit": {
        name: "灵气",
        color: cc.c3b(118, 238, 60),
        icon: gameGoodsIcon["spirit"]
    },
    "cards": {
        name: "经验元灵",
        color: cc.c3b(255, 239, 131),
        icon: gameGoodsIcon["exp_card"]
    },
    "exp_card": {
        name: "经验元灵",
        color: cc.c3b(255, 239, 131),
        icon: gameGoodsIcon["exp_card"]
    },
    "freeCount": {
        name: "免费抽奖次数",
        color: cc.c3b(255, 239, 131)
    },
    "lottery_free_count": {
        name: "免费抽奖次数",
        color: cc.c3b(255, 239, 131)
    },
    "challengeCount": {
        name: "有奖竞技次数",
        color: cc.c3b(255, 239, 131)
    },
    "cardsCount": {
        name: "卡库位置",
        color: cc.c3b(255, 239, 131)
    },
    "cardArray": {
        color: cc.c3b(255, 239, 131)
    },
    "speaker": {
        name: "喇叭",
        color: cc.c3b(255, 239, 131),
        icon: gameGoodsIcon["speaker"]
    },
    "honor": {
        name: "荣誉",
        color: cc.c3b(255, 239, 131),
        icon: gameGoodsIcon["honor"]
    },
    "superHonor": {
        name: "精元",
        color: cc.c3b(255, 239, 131),
        icon: gameGoodsIcon["superHonor"]
    },
    "pill": {
        name: "觉醒玉",
        color: cc.c3b(255, 239, 131),
        icon: gameGoodsIcon["pill"]
    }
};

lz.getGoodsNameByKey = function (key) {
    return gameGoodsName[key] || {
        name: key,
        color: cc.c3b(255, 255, 255)
    };
};

lz.getRewardString = function (data) {
    var str = [];

    for (var key in data) {
        if (data[key]) {
            var reward = lz.getGoodsNameByKey(key);

            if (key == "cards") {
                var cards = data[key];
                var count = {};
                var len = cards.length;
                var lv;

                for (var i = 0; i < len; ++i) {
                    if (cards[i]) {
                        lv = cards[i].lv;
                        count[lv] = count[lv] ? count[lv] + 1 : 1;
                    }
                }

                for (lv in count) {
                    if (count[lv]) {
                        str.push({
                            str: lv + "级" + reward.name + " : " + count[lv],
                            color: reward.color,
                            icon: reward.icon
                        });
                    }
                }
            } else {
                if (key != "fragment" && data[key] > 0) {
                    str.push({
                        str: reward.name + " : " + data[key],
                        color: reward.color,
                        icon: reward.icon
                    });
                }
            }
        }
    }

    return str;
};

(function () {
    var TIP_INTERVAL = 0.5 * 1000;
    var lastTimestamp = 0;

    lz.tipReward = function (keyOrObj, count, isDouble) {
        var reward = null;

        if (typeof (keyOrObj) === "string") {
            reward = {};
            reward[keyOrObj] = count || 1;
        } else {
            reward = keyOrObj;
        }

        for (var key in reward) {
            if (!reward[key]) continue;

            if (key == "cardArray") {
                continue;
            }

            var fn = (function (key) {
                return function () {
                    var str = lz.getGoodsNameByKey(key);

                    if (str.icon) {
                        TipLayer.tipWithIcon(str.icon, " +" + reward[key], isDouble || false);
                    } else {
                        TipLayer.tipNoBg(str.name + ": +" + reward[key]);
                    }
                }
            })(key);

            var now = Date.now();
            lastTimestamp += TIP_INTERVAL;
            lastTimestamp = Math.max(lastTimestamp, now);
            var delay = (lastTimestamp - now) / 1000;

            lz.scheduleOnce(fn, delay);
        }

        //卡牌奖励
        if (reward["cardArray"]) {
            var cards = dealCardArray(reward[key]);
            var len = cards.length;
            for (var i = 0; i < len; i++) {
                var fn2 = (function (i) {
                    return function () {
                        TipLayer.tipCard(cards[i].tableId, " +" + cards[i].qty);
                    }
                })(i);

                now = Date.now();
                lastTimestamp += TIP_INTERVAL;
                lastTimestamp = Math.max(lastTimestamp, now);
                delay = (lastTimestamp - now) / 1000;

                lz.scheduleOnce(fn2, delay);
            }
        }

    };

    var dealCardArray = function (cardArray) {

        var len = cardArray.length;
        var cbData = [];
        var cardTable = outputTables.cards.rows;

        for (var i = 0; i < len; i++) {
            var cards = {
                tableId: cardArray[i].tableId,
                name: cardTable[cardArray[i].tableId].name,
                qty: 1
            };
            var j = i + 1;
            while (j < len) {
                if (cardArray[i].tableId == cardArray[j].tableId) {
                    cards.qty++;
                    cardArray.splice(j, 1);
                    len--;
                } else {
                    j++;
                }
            }

            cbData.push(cards);
        }

        return cbData;
    }

})();


/*
 * 设置时间格式
 * time: 时间
 * fmt: 格式
 * */
lz.getTimeStr = function (args) {
    var date = (args && args.time) ? new Date(args.time) : new Date();
    var fmt = (args && args.fmt) ? args.fmt : "hh:mm:ss";

    /*将时间转换成北京时间*/
    var localTime = date.getTime();
    var localOffset = date.getTimezoneOffset() * 60 * 1000;
    var utc = localTime + localOffset;

    date = new Date(utc + 8 * 3600 * 1000);

    var o = {
        "M+": date.getMonth() + 1, //月
        "d+": date.getDate(), //日
        "h+": date.getHours(), //时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds() //秒
    };

    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }

    return fmt;
};

/*
 * 获取倒计时
 * */
lz.getCountdownStr = function (time) {
    var fmt = "hh:mm:ss";
    var o = {
        "h+": parseInt(time / 3600000), //时
        "m+": parseInt((time % 3600000) / 60000), //分
        "s+": parseInt((time % 60000) / 1000) //秒
    };

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }

    return fmt;
};

lz.getNumberStr = function (num) {
    var Numbers = ["十", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    var str = "";

    if (num == 0) {
        str = "零";
    } else {
        var decade = parseInt(num / 10);
        var unit = num % 10;

        if (decade > 0) {
            str += (decade > 1) ? Numbers[decade] : "";
            str += Numbers[0];
        }

        if (unit > 0) {
            str += Numbers[unit];
        }
    }

    return str;
};

var keys2Key = {
    gold: "gold",
    money: "money",
    powerValue: "power",
    power: "power",
    skillPoint: "skillPoint",
    elixir: "elixir",
    energy: "energy",
    fragments: "fragment",
    fragment: "fragment",
    speaker: "speaker",
    speakers: "speaker",
    honor: "honor",
    superHonor: "superHonor"
};

lz.getKeyStr = function (key) {
    return keys2Key[key] ? keys2Key[key] : null;
};

lz.getMoneyStr = function (money) {
    var threshold = 100000;

    if (money < threshold) {
        return ("" + money)
    } else {
        return (Math.floor(money / 10000) + "万");
    }
};

var MAX_LAST_NAME_COUNT = 250;
var MAX_FIRST_NAME_COUNT = 2568;
var MAX_ILLEGAL_STR_COUNT = 780;

lz.getRandomFirstName = function () {
    cc.log("lz getRandomFirstName");

    return (outputTables.first_name.rows[lz.randomInt(1, MAX_FIRST_NAME_COUNT)].first_name);
};

lz.getRandomLastName = function () {
    cc.log("lz getRandomLastName");

    return (outputTables.last_name.rows[lz.randomInt(1, MAX_LAST_NAME_COUNT)].last_name);
};

lz.getRandomName = function () {
    cc.log("lz getRandomName");

    return (lz.getRandomLastName() + lz.getRandomFirstName());
};

lz.eligibleName = function (name) {
    cc.log("lz eligibleName");

    var illegalStr = outputTables.illegal_str.rows;

    for (var i = 1; i < MAX_ILLEGAL_STR_COUNT; ++i) {
        if (name.indexOf(illegalStr[i].illegal_str) != -1) {
            cc.log(illegalStr[i].illegal_str);

            return false;
        }
    }

    return true;
};

lz.replaceStr = function (str) {
    cc.log("lz replaceStr");

    var illegalStr = outputTables.illegal_str.rows;

    for (var i = 1; i < MAX_ILLEGAL_STR_COUNT; ++i) {
        var index = 0;
        var illegalWord = illegalStr[i].illegal_str;
        var len = illegalWord.length;

        while (true) {
            index = str.indexOf(illegalWord, index);

            if (index == -1) {
                break;
            }

            var sStr = str.substring(0, index);
            var eStr = str.substring(index + len);

            str = sStr;

            for (var j = 0; j < len; ++j) {
                str += "*";
            }

            str += eStr;

            index += len;
        }
    }

    return str;
};

lz.checkPoint = function (point) {
    cc.log("lz checkPoint");

    var x = point.x;
    var y = point.y;
    var gameView = gameFit.GAME_VIEW;

    var minX = gameView.x;
    var maxX = minX + gameView.width;

    var minY = gameView.y;
    var maxY = minY + gameView.height;

    x = Math.max(minX, x);
    x = Math.min(maxX, x);

    y = Math.max(minY, y);
    y = Math.min(maxY, y);

    return cc.p(x, y)
};

lz.load = function (key) {
    var str = sys.localStorage.getItem(key);

    if (str) {
        try {
            var item = JSON.parse(str);

            return item.data;
        } catch (e) {
            cc.log(str);
            cc.log(e);

            sys.localStorage.removeItem(key);
        }
    }

    return undefined;
};

lz.save = function (key, data) {
    var type = typeof(data);

    var item = {
        data: data,
        type: type
    };

    var str = JSON.stringify(item);

    if (str) {
        sys.localStorage.setItem(key, str);
    }
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