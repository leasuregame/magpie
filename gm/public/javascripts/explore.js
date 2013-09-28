/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-9-16
 * Time: 下午3:00
 * To change this template use File | Settings | File Templates.
 */

//var areas = [];
var pomelo = window.pomelo;
var playerId = null;
var areaId = null;
var maxId = 500;
var times = 0;
var tid = 0;
var user;

var TYPE = {
    ONEPASS: 0,
    START: 1,
    GOON: 2
}

function setUser(u) {
    user = u;
};

function setData(player) {
    playerId = parseInt(player.id);
    areaId = parseInt(player.areaId);
    var task = JSON.parse(player.task);
    // console.log(task);
    $("#taskId").val(task.id);
    $("#progress").val(task.progress);
    $("#exploreNum").val(0);
};


$(document).ready(function () {
    $("#tip").hide();
    $("#btnStart").click(function () {
        submitStart(TYPE.START);
    });
    $("#btnOnePass").click(function () {
        submitStart(TYPE.ONEPASS);
    });
    $("#btnGoOn").click(function () {
        times = 0;
        submitStart(TYPE.GOON);
        // submitExplore(user.account, user.password, areaId);
    });
    $("#btnStop").click(function() {
        maxId = 0;
    });
});

function submitStart(type) {

    var task;

    if (type == TYPE.START) {
        task = {
            id: 1,
            progress: 0,
            hasWin: false,
            mark: []
        }
    } else {
        task = {
            id: parseInt($("#taskId").val()),
            progress: parseInt($("#progress").val()),
            hasWin: false,
            mark: []
        }
    }

    var url = "/explore?areaId=" + areaId + "&playerId=" + playerId + "&task=" + JSON.stringify(task);
    console.log(url);
    $.ajax({
        url: url,
        type: "post",
        success: function (msg) {
            // console.log(msg);
            if (msg.type != "success") {
                setShowMsg(msg);
            } else {
                //  var user = msg.info;
                times = 0;

                login(user.account, user.password, areaId, function (err, taskId, pid) {

                    if (err) {
                        console.log(err);
                    }
                    else {
                        initResult();
                        playerId = pid;
                        if (type == TYPE.ONEPASS)
                            maxId = taskId;
                        else
                            maxId = 500;
                        explore(taskId);
                    }
                });

                // submitExplore(user.account, user.password, areaId);
            }
        }
    });
};


//
//function submitExplore(account, password, areaId) {
//    login(account, password, areaId, function (err, taskId, pid) {
//
//        if (err) {
//            console.log(err);
//        }
//        else {
//            initResult();
//            playerId = pid;
//            explore(taskId);
//        }
//    });
//};

var result = {};

function initResult() {
    result = {
        fight: {
            times: 0,
            rate: 0,
            cards_num: 0,
            cards_ave: 0,
            cards: [],
            fragment_num:0,
            fragment_rate:0
        },
        box: {
            times: 0,
            rate: 0,
            cards_num: 0,
            cards: []
        },
        none: {
            times: 0,
            rate: 0
        }
    };

    for (var i = 0; i <= 6; i++) {
        result.fight.cards[i] = {
            num: 0,
            rate: 0
        }
    }

    for (var i = 0; i <= 4; i++) {
        result.box.cards[i] = {
            num: 0,
            rate: 0
        }
    }
}

//分析
function analyze(data) {
    if (data.result == "fight" && data.battle_log.winner != "own")
        return;
    result[data.result].times++;
    if (data.result == "fight") {
        var rewards = data.battle_log.rewards;
        result['fight'].cards_num += rewards.cards.length;
        for (var i = 0; i < rewards.cards.length; i++) {
            var card = rewards.cards[i];
            if (card.lv > 5)
                result['fight'].cards[6].num++;
            else
                result['fight'].cards[card.lv].num++; //级别
        }
        result['fight'].fragment_num += rewards.fragment;
    } else if (data.result == "box") {
        var star = data.open_box_card.tableId % 5;
        if (star == 0) star = 5;
        result['box'].cards[star].num++;
    }
    var task = data.task;
    $("#taskId").val(task.id);
    $("#progress").val(task.progress);
    $("#exploreNum").val(times);

};

//计算结果
function countResult() {

    var fight = result['fight'];
    fight.rate = times ? (fight.times * 100 / times).toFixed(4) : 0;
    fight.cards_ave = fight.times ? (fight.cards_num / fight.times).toFixed(4) : 0;
    for (var lv = 1; lv <= 6; lv++) {
        fight.cards[lv].rate = fight.cards_num? (fight.cards[lv].num * 100 / fight.cards_num).toFixed(4) : 0;
    }
    fight.fragment_rate = fight.times ? (fight.fragment_num * 100/fight.times).toFixed(4) : 0;

    var box = result['box'];
    box.rate = times ? (box.times * 100 / times).toFixed(4) : 0;
    for (var star = 1; star <= 4; star++) {
        box.cards[star].rate = box.times ? (box.cards[star].num * 100 / box.times).toFixed(4) : 0;
    }

    var none = result['none'];
    none.rate = times ? (none.times * 100 / times).toFixed(4) : 0;

    console.log(result);

}

function showResult(task) {

    $("#fightResult tbody tr").remove();
    $("#boxResult tbody tr").remove();
    $("#noneResult tbody tr").remove();

    //战斗表
    var fight = result['fight'];
    var inner = "<tr><td>" + fight.times + "</td><td>" + fight.rate + "</td><td>" + fight.cards_ave + "</td>";
    for (var lv = 1; lv <= 6; lv++) {
        inner += "<td>" + fight.cards[lv].num + "</td><td>" + fight.cards[lv].rate + "</td>";
    }

    inner += "<td>" + fight.fragment_num + "</td><td>" + fight.fragment_rate + "</td>";

    inner += "</tr>";
    $("#fightResult").append(inner);

    var box = result['box'];
    //宝箱表
    inner = "<tr><td>" + box.times + "</td><td>" + box.rate + "</td>"
    for (var star = 1; star <= 4; star++) {
        inner += "<td>" + box.cards[star].num + "</td><td>" + box.cards[star].rate + "</td>";
    }
    inner += "</tr>";
    $("#boxResult").append(inner);

    var none = result['none'];
    inner = "<tr><td>" + none.times + "</td><td>" + none.rate + "</td></tr>"
    $("#noneResult").append(inner);

};


function explore(id) {
    // console.log(taskId);

    var route = "area.taskHandler.explore";
    pomelo.request(route, {
        taskId: id
    }, function (data) {
        if (data.code === 200) {
            id = data.msg.task.id;
            console.log(data.msg);
            times++;

            analyze(data.msg);

            if (isStop(data.msg, id)) {
                console.log("stop");
                countResult();
                deleteCards(function () {
                });
                showResult(data.msg.task);
                return;
            }

            tid = id;

            if (times % 100 == 0) {   //每100次探索清理一次获得的卡牌
                deleteCards(function () {
                    explore(id);
                });
            } else {
                explore(id);
            }

        } else {
            console.log(data.msg);
        }
    });
};

function deleteCards(cb) {
    var url = "/exploreDelCards?playerId=" + playerId;
    $.ajax({
        url: url,
        type: "post",
        success: function (msg) {
            if (msg == "success") {
                cb();
            }
        }
    });
};

function isStop(data, id) {
    if (data.result == 'fight' && data.battle_log.winner != 'own' || id > maxId) {
        return true;
    }
    return false;
};


function login(account, password, areaId, cb) {
    // queryEntry(function(host,port){
    //var host = "127.0.0.1";
    var host = "124.238.236.33";
    var port = 3010;
    pomelo.init({
        host: host,
        port: port,
        log: true
    }, function () {
        var route = "connector.userHandler.login";
        pomelo.request(route, {
            account: account,
            password: password,
            areaId: areaId
        }, function (data) {
            if (data.code === 200) {
                console.log(data);
                return cb(null, data.msg.player.task.id, data.msg.player.id);
            } else {
                return cb(data.msg, null, null);
            }
        });
    });
    // });
};

/*
 function queryEntry(cb) {
 var route = 'gate.gateHandler.queryEntry';
 pomelo.init({
 host: "127.0.0.1",
 port: 3009,
 log: true
 }, function() {
 pomelo.request(route,function(data) {
 pomelo.disconnect();
 if(data.code === 500) {
 //    showError(LOGIN_ERROR);
 return;
 }
 //   console.log(data);
 cb(data.host, data.port);
 });
 });
 };
 */

//信息提示
function setShowMsg(msg) {
    // console.log(msg);
    $("#tip").show();
    if (msg.type == "success") {
        $("#tip").css("background-color", "#dff0d8");
    } else {
        $("#tip").css("background-color", "#f2dede");
    }
    $("#tip").html(msg.info);
};


