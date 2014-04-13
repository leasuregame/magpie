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

    $("#btnOk").click(function() {
        submit();
    });

});

function submit() {
    var areaId = parseInt($("#area").val());
    var msg = getMsg();

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
                        url: 'logger4MsgPush?area=所有&msg=' + JSON.stringify(msg),
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
                    url: 'logger4MsgPush?area=' + areaName + '&msg=' + JSON.stringify(msg),
                    type: "post"
                });
            }
        });
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
}

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
                    callback();
                } else {
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