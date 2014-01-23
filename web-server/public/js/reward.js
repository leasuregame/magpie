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
    $("#area").append(inner).prop("selectedIndex", -1);
};


$(document).ready(function() {
    initServer(function() {
        initAreasList();
    });
    $("#btnOk").click(function(e) {
        e.preventDefault();
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

    if (Number.isNaN(areaId)) {
        return alert('请选址服务器');
    }

    if ((Number.isNaN(areaId) || areaId == ALL) && playerName != '') {
        return alert('请指定玩家所在的具体服务器');
    }

    if (content == '') {
        return alert('奖励消息内容不能为空');
    }

    if (Object.keys(options).length == 0) {
        return alert('至少添一个奖励选项')
    }

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
                        url: '/admin/logger4Reward?area=所有&data=' + JSON.stringify(mail),
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
                        url: '/admin/logger4Reward?area=' + areaName + '&data=' + JSON.stringify(mail),
                        type: "post"
                    });
                }
            });
        } else { //指定玩家
            var url = "/admin/playerId?name=" + playerName + "&areaId=" + areaId;
            $.ajax({
                url: url,
                type: "get",
                success: function(data) {
                    console.log(data);
                    if (data.id) {
                        mail['playerId'] = data.id;
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
                                    url: '/admin/logger4Reward?area=' + areaName + '&player=' + playerName + '&data=' + JSON.stringify(mail),
                                    type: "post"
                                });
                            }
                        });
                    }
                },
                error: function(data) {
                    if (data.status == 404) {
                        alert('找不到指定的玩家');
                    } else {
                        console.log(data.responseText);
                        alert(data.responseText);
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
                    $('.alert').removeClass('hidden alert-danger');
                    $('.alert').addClass('show alert-success');
                    $('.alert').text('恭喜！消息发送成功!')
                    callback();
                } else {
                    $('.alert').removeClass('hidden alert-success');
                    $('.alert').addClass('show alert-danger');
                    $('.alert').text('消息发送失败!');
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

    if ($("#energy").val() != '') {
        data['energy'] = parseInt($("#energy").val());
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