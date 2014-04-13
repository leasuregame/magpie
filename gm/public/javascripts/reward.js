/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-9-27
 * Time: 上午11:20
 * To change this template use File | Settings | File Templates.
 */

var pomelo = window.pomelo;
var areas;
var ALL = -1;


function setAreas(a) {
    areas = a;
    initAreasList();
};

function initAreasList() {
    var inner = "";
    inner += '<option value = "-1">所有</option>';
    servers.forEach(function(area) {
        inner += '<option value =' + area.id + '>' + area.name + '</option>';
    });
    $("#area").append(inner);
};


$(document).ready(function() {
    initServer(function() {
        initAreasList();
    });
    $("#btnOk").click(function() {
        submit();
    });
});

function submit() {
    var options = getData();
    var areaId = parseInt($("#area").val());
    var playerName = $("#playerName").val();
    var content = $("#content").val();
    var mail = {};

    mail['content'] = content;
    mail['options'] = options;

    if (areaId == ALL) { //全部服务器
        var len = servers.length;
        var id = 0;

        async.whilst(
            function() {
                return id < len;
            },
            function(cb) {
                dealAll(servers[id].id, mail, function(err) {
                    if (err)
                        cb(err);
                    id++;
                    cb();
                });
            },
            function(err) {
                if (err) {
                    console.log("err = ", err);
                } else {
                    $.ajax({
                        url: 'logger4Reward?area=所有&data=' + JSON.stringify(mail),
                        type: "post"
                    });
                }
            }
        );

    } else { //指定服务器
        if (playerName == '') {
            dealAll(areaId, mail, function(err) {
                if (err) {
                    console.log("err = ", err);
                } else {
                    var areaName = null;
                    for (key in servers) {
                        var area = servers[key];
                        if (area.id = areaId) {
                            areaName = area.name;
                            break;
                        }
                    }
                    $.ajax({
                        url: 'logger4Reward?area=' + areaName + '&data=' + JSON.stringify(mail),
                        type: "post"
                    });
                }
            });
        } else { //指定玩家
            var url = "/playerId?name=" + playerName + "&areaId=" + areaId;
            $.ajax({
                url: url,
                type: "get",
                success: function(data) {
                    console.log(data);
                    if (data.type == 'success') {
                        mail['playerId'] = data.info;
                        dealAll(areaId, mail, function(err) {
                            if (err) {
                                console.log("err = ", err);
                            } else {
                                var areaName = null;
                                for (key in servers) {
                                    var area = servers[key];
                                    if (area.id = areaId) {
                                        areaName = area.name;
                                        break;
                                    }
                                }
                                $.ajax({
                                    url: 'logger4Reward?area=' + areaName + '&player=' + playerName + '&data=' + JSON.stringify(mail),
                                    type: "post"
                                });
                            }
                        });
                    }
                }
            });
        }
    }

};


function dealAll(id, mail, cb) {
    async.waterfall([

        function(callback) {
            connect(id, function() {
                callback();
            });
        },
        function(callback) {
            sendMail(mail, function(code) {
                if (code == 200) {
                    callback();
                } else {
                    cb('error');
                }
            })
        },
        function(callback) {
            disconnect();
            callback();
        }
    ], function(err) {
        if (err) {
            cb(err);
        }
        cb(null);
    });
};

function getData() {
    var data = {};

    if ($("#gold").val() != '') {
        data['gold'] = parseInt($("#gold").val());
    }

    if ($("#money").val() != '') {
        data['money'] = parseInt($("#money").val());
    }

    if ($("#power").val() != '') {
        data['powerValue'] = parseInt($("#power").val());
    }

    if ($("#spirit").val() != '') {
        data['spirit'] = parseInt($("#spirit").val());
    }

    if ($("#skillPoint").val() != '') {
        data['skillPoint'] = parseInt($("#skillPoint").val());
    }

    if ($("#elixir").val() != '') {
        data['elixir'] = parseInt($("#elixir").val());
    }

    return data;

};


function sendMail(mail, cb) {

    console.log(mail);

    pomelo.request('area.messageHandler.sysMsg', mail, function(data) {
        console.log(data);
        cb(data.code);
    });
};

function disconnect() {
    pomelo.disconnect();
    console.log("disconnect success");
};