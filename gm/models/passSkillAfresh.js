/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-9-14
 * Time: 下午5:56
 * To change this template use File | Settings | File Templates.
 */

var passSkill = require('./domain/entity/passiveSkill');
var PassSkillAfresh = function () {
};

var result = [];

var DEFAULT = {
    1: [
        "1~4.9",
        "5~7.9",
        "8~10"
    ],
    2: [
        "1~4.9",
        "5~7.9",
        "8~8.2",
        "8.3~10"
    ]
}

PassSkillAfresh.simulate = function (type, times, cb) {
    PassSkillAfresh.init(type);
    for (var i = 0; i < times; i++) {
        var pss = new passSkill();
        pss.afresh(type);
        PassSkillAfresh.analyzeResult(pss.value,type);
    }

    for(var i = 0;i < result.length;i++) {
        result[i].rate = result[i].num * 100 / times;
    }
    //console.log(result);
    cb(null,result);
};

PassSkillAfresh.init = function (type) {
    result = [];
    var d = DEFAULT[type];
    for (var i = 0; i < d.length; i++) {
        result[i] = {
            value:d[i],
            num:0,
            rate:0
        }
    }
};

PassSkillAfresh.analyzeResult = function (value,type) {
    var d = DEFAULT[type];
    for(var i = 0;i < d.length;i++) {
        var _ref = d[i].split('~'),
        start = _ref[0],
        end = _ref[1];
       // console.log(value);
        if(value >= start && value <= end) {
            result[i].num++;
        }
    }
};

module.exports = PassSkillAfresh;
