var pomelo = window.pomelo;
var ALL = -1;
var types = ['普通', '系统', '加急'];

function setAreas(a) {
    areas = a;
    initList();
};

function initList() {
    var inner = "";
    inner += '<option value = "-1">所有</option>';
    servers.forEach(function(area) {
        inner += '<option value =' + area.id + '>' + area.name + '</option>';
    });
    $("#area").append(inner);

    inner = "";

    for (var i = 0; i < types.length; i++) {
        inner += "<option value = " + i + ">" + types[i] + "</option>";
    }
    $("#type").append(inner);
};

$(document).ready(function() {

    initServer(function() {
        initList();
    });

    $("#btnOk").click(function(e) {
        e.preventDefault();
        submit();
    });

});

function submit() {
    var areaId = parseInt($("#area").val());
    var msg = getMsg();

    if (msg.msg == '') {
        return alert('消息内容不能为空');
    }

    if (confirm('确定要发送此消息吗?')) {


        if (areaId == ALL) { //全部服务器
            var len = servers.length;
            var id = 0;

            async.whilst(
                function() {
                    return id < len;
                },
                function(cb) {
                    dealAll(servers[id].id, msg, function(err) {
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
                            url: '/admin/logger4MsgPush?area=所有&msg=' + JSON.stringify(msg),
                            type: "post"
                        });
                    }
                }
            );
        } else {
            dealAll(areaId, msg, function(err) {
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
                        url: '/admin/logger4MsgPush?area=' + areaName + '&msg=' + JSON.stringify(msg),
                        type: "post"
                    });
                }
            });
        }
    }

};

function getMsg() {
    var msg = {};
    msg.msg = $("#content").val();
    msg.type = parseInt($("#type").val());
    var validDuration = $("#validDuration").val();
    if (validDuration != '') {
        msg.lastTime4send = 0;
        msg.validDuration = parseFloat(parseFloat(validDuration).toFixed(2));
        msg.tick = parseInt($("#tick").val());
    }
    console.log(msg);
    return msg;
};

function showInfo(text, type) {
    var rc = 'hidden alert-' + (type == 'success' ? type : 'danger');
    var ac = 'show alert-' + type;

    $('.alert').removeClass(rc);
    $('.alert').addClass(ac);
    $('.alert').text(text);

    setTimeout(function() {
        $('.alert').hide();
    }, 5000);
};

function dealAll(id, msg, cb) {
    async.waterfall([

        function(callback) {
            connect(id, function() {
                callback();
            });
        },
        function(callback) {
            sendMsg(msg, function(code) {
                if (code == 200) {
                    $('.alert').removeClass('hidden alert-danger');
                    $('.alert').addClass('show alert-success');
                    $('.alert').text('恭喜！消息发送成功!')
                    callback();
                } else {

                    showInfo('消息发送失败!', 'danger');
                    cb('error');
                }
            })
        },
        function(callback) {
            disconnect();
            callback();
        },
    ], function(err) {
        if (err) {
            cb(err);
        }
        cb(null);
    });
};


function sendMsg(msg, cb) {

    //var dfd = $.Deferred();
    console.log(msg);

    pomelo.request('area.gmHandler.sendSysMessage', msg, function(data) {
        console.log(data);
        // alert("sendMail");
        cb(data.code);
    });
    //return dfd.promise();
};

function disconnect() {
    pomelo.disconnect();
    console.log("disconnect success");
};