/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-9-11
 * Time: 上午12:26
 * To change this template use File | Settings | File Templates.
 */

//require('coffee-script');
var battle = require('../../game-server/app/manager/simulateBattle');
var async = require('async');

var report = {
    attack:{
        win:0,
        rate:0,
        cards:[]
    },
    defend:{
        win:0,
        rate:0,
        cards:[]
    }
};


function Battle() {};

Battle.startBattle = function(attack,defend,times,cb) {

     async.series([
        function(cb) {
          //  console.log("step1");
            Battle.init();
            cb(null,null);
        },
        function(cb) {
          //  console.log("step2");
            for(var i = 0;i < times;i++) {
                var attacker = Battle.clone(attack);
                var defender = Battle.clone(defend);
                var battleLog = new battle(attacker,defender);
               // console.log(battleLog);
                Battle.analyzeBattleLog(battleLog);
             }
            cb(null,null);
        },
        function(cb) {
          //  console.log("step3");
            for(var i = 0;i < report.attack.cards.length;i++){
                var card = report.attack.cards[i];
                card.crit_rate = (card.crit * 100/ card.hit).toFixed(4);
                card.dodge_rate = (card.dodge * 100/ card.hurt).toFixed(4);
                card.skill_rate = (card.skill_rate * 100/ card.attack_times).toFixed(4)
            }
            for(var i = 0;i < report.defend.cards.length;i++){
                var card = report.defend.cards[i];
                card.crit_rate = (card.crit * 100/ card.hit).toFixed(4);
                card.dodge_rate = (card.dodge * 100/ card.hurt).toFixed(4);
                card.skill_rate = (card.skill_rate * 100/ card.attack_times).toFixed(4)
            }

            report.attack.rate = (report.attack.win * 100/ times).toFixed(4);
            report.defend.rate = (report.defend.win * 100/ times).toFixed(4);
            cb(null,report);
        }
    ],function(err,results){
       // console.log("err = " + err);
       // console.log(results);
        return cb(err,report);
    });

    //return report;
};

Battle.analyzeBattleLog = function(battleLog) {
    var win = battleLog.result.winner;
   // console.log("win = " + win);
    if(win == 'own') {
        report.attack.win++;
    }else if(win == "enemy"){
        report.defend.win++;
    }

    var steps = battleLog.steps;
    for(var i = 0;i < steps.length;i++) {
        var step = steps[i];
        Battle.count(step.a,step.d,step.e);
    }

};

Battle.init = function() {

    report = {
        attack:{
            win:0,
            rate:0,
            cards:[]
        },
        defend:{
            win:0,
            rate:0,
            cards:[]
        }
    };

    for(var i = 0;i < 5;i++) {
        report.attack.cards[i] = {
            hit:0,
            hurt:0,
            crit:0,
            crit_rate:0,
            dodge:0,
            dodge_rate:0,
            attack_times:0,
            skill_rate:0
        };
        report.defend.cards[i] = {
            hit:0,
            hurt:0,
            crit:0,
            crit_rate:0,
            dodge:0,
            dodge_rate:0,
            attack_times:0,
            skill_rate:0
        };
    }
};

Battle.count = function(a,d,e){

    var isSkill = false;

    if(a < 0) {
        a *= -1;
        isSkill = true;
    }

    if(a < 6) {
        for(var i = 0;i < d.length;i++) {
            if(d[i] < 0) {
                report.attack.cards[a].crit++;
            }
            var id = (d[i] < 0) ? (d[i] * -1 - 6) : (d[i] -6);
            if(e[i] == 0) {
                report.defend.cards[id].dodge++;
            }else if(e[i] < 0) {
                report.defend.cards[id].hurt++;
            }
        }
        report.attack.cards[a].attack_times++;
        if(isSkill)
            report.attack.cards[a].skill_rate++;
        report.attack.cards[a].hit += d.length;
    }

    else {
        for(var i = 0;i < d.length;i++) {
            if(d[i] < 0) {
                report.defend.cards[a - 6].crit++;
            }
            var id = (d[i] < 0) ? (d[i] * -1) : (d[i]);
            if(e[i] == 0) {
                report.attack.cards[id].dodge++;
            }else if(e[i] < 0) {
                report.attack.cards[id].hurt++;
            }
        }
        report.defend.cards[a - 6].attack_times++;
        if(isSkill)
            report.defend.cards[a - 6].skill_rate++;
        report.defend.cards[a - 6].hit += d.length;
    }


};

Battle.clone = function (obj) {
    var newObj = (obj instanceof Array) ? [] : {};
    for (var key in obj) {
        var copy = obj[key];
        if (copy instanceof Array) {
            newObj[key] = Battle.clone(copy);
        } else if (((typeof copy) == "object")) {
            newObj[key] = Battle.clone(copy);
        } else {
            newObj[key] = copy;
        }
    }
    return newObj;
};


module.exports = Battle;
