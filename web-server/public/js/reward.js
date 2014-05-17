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
var cardTmp = '';
/**
 * 奖励选项输入错误提示
 * @type {{RW_WRONG_TYPE: string, RW_EMPTY: string}}
 */
var formErrTips = {
    RW_WRONG_TYPE : "请输入数字",
    RW_EMPTY : "请选填一项奖励",
    RW_NEGATIVE : "请勿输入负数"
}

/**
 * 奖励类型,记录在input 的 reType 属性中,无此属性表示该奖励属于player自带属性
 * @type {{CARD: string}}
 */
var rewardType = {
    CARD : "card"
}

// init
/**
 * 初始化服务器列表
 */
function initAreasList() {
    var inner = "";
    inner += '<option value = "-1">所有</option>';
    servers.forEach(function(area) {
        inner += '<option value =' + area.id + '>' + area.name + '</option>';
    });
    $("#area").append(inner).prop("selectedIndex", 0);
};

/**
 * 初始化各奖励上限提示
 */
function initRewardLimit() {
    var txtTemp = "上限：";

    $('.rewardTag .limitTag').each(function (){
        var $this = $(this);
        $this.text(txtTemp + $this.attr('limit'));
    });
};

// UI actions
/**
 * 移除所有错误提示与效果
 */
function removeErrors() {
    $('.has-error').removeClass('has-error');
    $('.help-block').remove();
    $('#rewardAlert').addClass('hide');
    $('.limitTag').removeAttr('style');
}

/**
 * 弹出奖励选项错误提示
 * @param tips 需显示提示
 */
function showRewardAlert(tips) {
    $('#rewardAlert').text(tips).removeClass('hide');
}

/**
 * 新增一行卡牌选项
 */
function addCardOpt() {
    $('#cardGroup').append(cardTmp);
}

function rmCardOpt($cardOpt) {
    $cardOpt.remove();
}

/**
 * 高亮传入奖励上限提示
 * @param $limitTag
 */
function highLightLimit($limitTag) {
    $limitTag.css('color', '#a94442');
}

/**
 * 弹出确认提交弹窗
 * @param content 消息内容
 */
function showModal(content) {
    var cnt = '<p><strong>服务器：</strong>' + $('#area').find('option:selected').text() + '</p>'
    cnt += '<p><strong>消息内容：</strong>' + content + '</p>';

    $('#modalContent').html(cnt);
    $('#actionConfirm').modal();
}

/**
 * 隐藏确认提交弹窗
 */
function hideModal() {
    $('#actionConfirm').modal('hide');
}

// build request
/**
 * 获取奖励选项中的数据
 * @returns {{}}
 */
function getRewardOptData() {
    var data = {};

    // 处理player自带属性奖励
    $('.baseReward').each(function() {
        var $this = $(this);
        if($this.val().length > 0) {

            data[$this.attr('name')] = $this.val() * 1;
        }
    });

    // 处理卡牌奖励
    var cards = []
    $('.cardTag').each(function() {
        var $this = $(this);
        var qty = $this.find('.cQty').val();

        if(qty > 0) {
            var card = {
                tableId : $this.find('.cName').val() * 1 + $this.find('.cStar').val() * 1,
                qty : $this.find('.cQty').val() * 1,
                lv : $this.find('.cLv').val() * 1
            };
            cards.push(card);
        }
    });
    if(cards.length > 0) {
        data['cards'] = cards;
    }

//    console.log("Base Reward OptData", data);

    return data;

};

/**
 * 校验输入合法性,弹出确认弹窗
 */
function submit() {
    removeErrors();

    var options = getRewardOptData();
    var areaId = parseInt($("#area").val());
    var playerName = $("#playerName").val();
    var title = $('#title').val();
    var content = $("#content").val();

    // 校验输入合法性
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
        $('#title').parent().append('<span class="help-block">请输入标题</span>');
        return;
    }
    if (Object.keys(options).length == 0) {
        $('#rewardBox').addClass('has-error');
        showRewardAlert(formErrTips.RW_EMPTY);
        return;
    }
    if (content == '') {
        $('#content').closest('.form-group').addClass('has-error');
        $('#content').parent().append('<span class="help-block">奖励消息内容不能为空</span>');
        return;
    }

    showModal(content);
    // 注册"确认弹窗"中的提交按钮的事件
    $('#btnSendMsg').click(function() {
        var mail = {
            content : content,
            options : options
        }
        hideModal();
        doSubmit(options, areaId, playerName, mail);
    });
};

/**
 * 根据不同选项发送对应请求
 * @param options
 * @param areaId
 * @param playerName
 * @param mail
 */
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

// handle request
/**
 * 按序执行 连接服务器,发送请求,断开连接
 * @param id
 * @param mail
 * @param cb
 */
function dealAll(id, mail, cb) {
    async.waterfall([
        /**
         * 连接服务器
         * @param callback
         */
        function(callback) {
            connect(id, function() {
                callback();
            });
        },
        /**
         * 发送请求
         * @param callback
         */
        function(callback) {
            sendMail(mail, function(code) {
                if (code == 200) {
                    $('#resAlert').removeClass('hidden alert-danger');
                    $('#resAlert').addClass('show alert-success');
                    $('#resAlert span').text('恭喜！消息发送成功!')
                    
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
        /**
         * 断开连接
         * @param callback
         */
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

/**
 * 向游戏服务器发送发放奖励的请求
 * @param mail
 * @param cb
 */
function sendMail(mail, cb) {
    console.log("mail", mail);
//    return;
    pomelo.request('area.messageHandler.sysMsg', mail, function(data) {
        console.log(data);
        cb(data.code);
    });
};

/**
 * 断开与pomelo服务器的连接
 */
function disconnect() {
    pomelo.disconnect();
    console.log("disconnect success");
};

// events

/**
 * 将生成最后选择结果展示
 */
function updateFinalMsg() {
    var title = $('#title').val();

    var items = $.map($('.baseReward'), function(el, i){
        if ($(el).val() !== '')
            return $(el).parent().prev().text() + ':' + $(el).val();
        else
            return '';
    });

    // todo

    var textArr = items.filter(function(i) {return i != '';});
    $('#content').val(title + ', ' + textArr.join(', '));
}

/**
 * 输入奖励后的校验与处理
 */
function eventAfterRewardChanged() {

    var $this = $(this);
    var thisVal = $this.val();

    /**
     * 使数值合理化
     * @param $inputObj $(.reward)
     * @param val 当前输入
     * @returns {num} 合理化后的输入
     */
    function makeValAdaptLimit($inputObj, val) {

        var $lTag = $inputObj.parent().prev().prev();
        var limit = $lTag.attr('limit');
        if(val < 0) {
            val = 0;
            showRewardAlert(formErrTips.RW_NEGATIVE);
        } else if(val > limit * 1) {
            val = limit * 1;
            highLightLimit($lTag);
        }
        return val;
    }

    // 限制只可输入数字
    if (thisVal.length > 0 && !(thisVal * 1)) {
        thisVal = "";
        showRewardAlert(formErrTips.RW_WRONG_TYPE);
    } else {
        removeErrors();
    }

    // 限制只可输入一个
    if (thisVal.length == 0) {
        $('.baseReward').attr('disabled', false);
    } else {
        $('.baseReward').not($this).attr('disabled', true).val('');
    }

    thisVal = makeValAdaptLimit($this, thisVal);
    $this.val(thisVal);
}

$(document).ready(function() {
    initServer(initAreasList);
    initRewardLimit();

    // todo unlock options
    $('#cardGroup').find('select,input,button').attr('disabled', true);
    $('.baseReward--').attr('disabled', true);

    // todo init Card Type Options

    cardTmp = $('#cardOptTemp').text();

    $("#btnOk").click(function(e) {
        e.preventDefault();
        submit();
    });
    $("#btnAddCard").click(function (e) {
        e.preventDefault();
//        addCardOpt();
    });

    $('#rewardBox').delegate('.btnRemoveCard','click', function(e){
        rmCardOpt($(this).closest('cardTag'));
        e.preventDefault();
    })

    $("#btnResetReward").click(function(e) {
        e.preventDefault();
        removeErrors();
        $('.reward').val('').attr('disabled', false);
    })

    $('#title').change(updateFinalMsg);
    $('.baseReward,.cardReward').change(eventAfterRewardChanged).change(updateFinalMsg);
});