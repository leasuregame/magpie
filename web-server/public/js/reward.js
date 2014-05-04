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

    function handlerRewardChange() {
        var title = $('#title').val();

        var items = $.map($('.reward'), function(el, i){
            if ($(el).val() !== '')
                return $(el).parent().prev().text() + ':' + $(el).val();
            else
                return '';
        });
        var textArr = items.filter(function(i) {return i != '';});
        $('#content').val(title + ', ' + textArr.join(', '));
    }

    $('#title').change(handlerRewardChange);
    $('.reward').change(handlerRewardChange);
});

function removeErrors() {
    $('.has-error').removeClass('has-error');
    $('.help-block').remove();
}

function submit() {
    removeErrors();

    var options = getData();
    var areaId = parseInt($("#area").val());
    var playerName = $("#playerName").val();
    var title = $('#title').val();
    var content = $("#content").val();
    

    //$('#actionConfirm').modal();
    if (Number.isNaN(areaId)) {
        $('#area').closest('.form-group').addClass('has-error');
        $('#area').parent().append('<span class="help-block">请选择服务器</span>');
        return;
    }

    if ((Number.isNaN(areaId) || areaId == ALL) && playerName != '') {
        $('#area').closest('.form-group').addClass('has-error');
        $('#area').parent().append('<span class="help-block">必须指定玩家所在的具体服务器</span>');
        return;
    }

    if (title == '') {
        $('#title').closest('.form-group').addClass('has-error');
        $('#title').parent().append('<span class="help-block">title is required</span>');
        return;
    }

    if (Object.keys(options).length == 0) {
        $('#energy').closest('fieldset').addClass('has-error');
        $('#energy').parent().append('<span class="help-block">至少添一个奖励选项</span>');
        return;
    }

    if (content == '') {
        $('#content').closest('.form-group').addClass('has-error');
        $('#content').parent().append('<span class="help-block">奖励消息内容不能为空</span>');
        return;
    }

    function showModal() {
        var cnt = '<p><strong>服务器：</strong>' + $('#area').find('option:selected').text() + '</p>'
        cnt += '<p><strong>消息内容：</strong>'+content+'</p>';

        $('#modalContent').html(cnt);
        $('#actionConfirm').modal();
    }

    function hideModal() {
        $('#actionConfirm').modal('hide');
    }

    showModal();
    $('#btnSendMsg').click(function() {
        options = getData();
        var mail = {};
        var content = $("#content").val();
        mail['content'] = content;
        mail['options'] = options;
        hideModal();
        doSubmit(options, areaId, playerName, mail);
    });
};

function doSubmit(options, areaId, playerName, mail) {
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
                    $('.alert #alertContent').text('恭喜！消息发送成功!')
                    
                    setTimeout(function(){
                        $('.alert').removeClass('show');
                        $('.alert').addClass('hidden');
                    }, 5000);

                    callback();
                } else {
                    $('.alert').removeClass('hidden alert-success');
                    $('.alert').addClass('show alert-danger');
                    $('.alert #alertContent').text('消息发送失败!');

                    setTimeout(function(){
                        $('.alert').removeClass('show');
                        $('.alert').addClass('hidden');
                    }, 5000);

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

    if ($("#fragments").val() != '') {
        data['fragments'] = parseInt($("#fragments").val());
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