/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-9-14
 * Time: 下午2:30
 * To change this template use File | Settings | File Templates.
 */

//var lottery = require('../../../game-server/app/manager/lottery');
var pomelo = window.pomelo;
function Lottery(){};

var result = {
    level:[],
    fragment:[]
};

var rFragments = 0;
var hFragments = 0;
var hCounts = 0;

Lottery.simulate = function(level,type,times,next) {

    async.waterfall([
        function(cb){
            Lottery.init();
            cb();
        },
        function(cb){
            var id = 0;
            connect(1,function(){
                async.whilst(
                    function(){return id < times;},
                    function(callback){

                        pomelo.request('area.gmHandler.simulateLottery',
                            {
                                level:level,
                                type:type,
                                rFragments:rFragments,
                                hFragments:hFragments,
                                hCounts:hCounts
                            }, function (data) {
                                console.log(data);
                                Lottery.analyzeResult(data.msg);
                                if(level == 2) {
                                    hFragments++;
                                    hCounts++;
                                    if(data.msg[0].star == 5) {
                                        hCounts = 0;
                                    }
                                    if(data.msg[2] == 1) {
                                        hFragments = 0;
                                    }
                                }else {
                                    rFragments++;
                                    if(data.msg[2] == 1) {
                                        rFragments = 0;
                                    }
                                }
                                id++;
                                callback();

                            });

                    },
                    function (err) {
                        console.log(err);
                        pomelo.disconnect();
                        cb();
                    }
                )
            })


        },
        function(cb) {
            for(var i = 0;i < 5;i++) {
                result.level[i].rate = (result.level[i].num * 100/ times).toFixed(1);
            }

            result.fragment.rate = (result.fragment.num * 100 / times).toFixed(1);

            next(null,result);
        }
    ]);

};


Lottery.init = function() {

    rFragments = 0;
    hFragments = 0;
    hCounts = 0;

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

