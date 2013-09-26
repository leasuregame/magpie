/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-9-14
 * Time: 下午2:30
 * To change this template use File | Settings | File Templates.
 */

var lottery = require('../../game-server/app/manager/lottery');

function Lottery(){};

var result = {
    level:[],
    fragment:[]
};

Lottery.simulate = function(level,type,times,cb) {

    Lottery.init();

    for(var i = 0;i < times;i++) {
        var res = lottery(level,type);
      //  console.log(res);
        Lottery.analyzeResult(res);
    }

    for(var i = 0;i < 5;i++) {
        result.level[i].rate = (result.level[i].num * 100/ times);
    }

    result.fragment.rate = result.fragment.num * 100 / times;

    cb(null,result);
};

Lottery.init = function() {

    for(var i = 0;i < 5;i++) {
        result.level[i] = {
            num:0,
            rate:0
        }
    }
    result.fragment = {
        num : 0,
        rate : 0
    }
};

Lottery.analyzeResult = function(res) {
    var card = res[0];
    var fragment = res[2];
    result.level[card.star - 1].num++;
    result.fragment.num += fragment;
};


module.exports = Lottery;