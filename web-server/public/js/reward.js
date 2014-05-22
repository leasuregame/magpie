/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-9-27
 * Time: 上午11:20
 * To change this template use File | Settings | File Templates.
 */

var pomelo = window.pomelo;
var areas;
var AREAID_ALL = -1;
var cardTmp = '';
var cards = {};
var CARD_OPT_REPLACE_MARK = '<option>replace</option>';
var cardOptDom = '';
var cardLvLimit = {};
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
 * 提示框ID
 * @type {{baseRW: string, cardRW: string}}
 */
var formTipAlertId = {
    baseRW : '#baseRewardAlert',
    cardRW : '#cardRewardAlert'
}
var baseRewardNames = {
    gold : '魔石',
    money : '仙币',
    powerValue : '体力点',
    spirit : '灵气',
    skillPoint : '技能点',
    elixir : '仙丹',
    energy : '活力点',
    fragments : '卡魂',
    superHonor : '精元',
    speaker : '喇叭',
    honor : '荣誉点'
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
}

/**
 * 初始化选卡选项
 */
function initCardOpt() {
    window.webAPI.getActorCards(function (data){
        cards = data;
        var tableIds = [];
        var names = [];
        for(var key in cards) {
            var tmpCard = cards[key];
            tableIds.push(key);
            names.push(key + '__' + tmpCard.star  + '☆__' + tmpCard.name);
        }
        cardOptDom = window.wsUtil.buildSelOpts(names, tableIds);
        // 加入到初始卡牌选项中
        $('.cardReward.cName').html(cardOptDom);
        // 加入到模板中
        cardTmp = $('#cardOptTemp').text().replace(CARD_OPT_REPLACE_MARK, cardOptDom);
    });
}

/**
 * 初始化各奖励上限提示
 */
function initRewardLimit() {
    var txtTemp = "上限：";

    $('.rewardTag .limitTag').each(function (){
        var $this = $(this);
        $this.text(txtTemp + $this.attr('limit'));
    });

    // card lv reward
    window.webAPI.getCardLvLimit(function(data){
        cardLvLimit = data;
    })
}

// UI actions
/**
 * 移除所有错误提示与效果
 */
function removeErrors() {
    $('.has-error').removeClass('has-error');
    $('.help-block').remove();
    $('.alert-danger').addClass('hide');
    $('.limitTag').removeAttr('style');
}

/**
 * 弹出奖励选项错误提示
 * @param id 提示框ID
 * @param tips 需显示提示
 */
function showErrorAlert(id, tips) {
    $(id).text(tips).removeClass('hide');
}

/**
 * 新增一行卡牌选项
 */
function addCardOpt() {
    $('#cardGroup').append(cardTmp);
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
 * @param msg @returns {{areaId: Number, playerId: string, content: string, validDate: string, options: {title: string, sender: string, rewards: {}}}} 包含页面所有信息
 */
function showModal(msg) {

    // todo
    var modalForm = $('#actionConfirm');
    var contentArea = modalForm.find('.modal-content');
    contentArea.find('.area .text').text($('#area').find('option:selected').text());
    contentArea.find('.receiver .text').text(msg.playerId);
    contentArea.find('.author .text').text(msg.options.sender);
    contentArea.find('.title .text').text(msg.options.title);
    contentArea.find('.content .text').text(msg.content);
    contentArea.find('.expDate .text').text(msg.validDate);

    // 生成奖励文本
    var rewardDom = '';
    $.each(msg.options.rewards, function (key, val) {
        if(key == 'cardArray') {
            rewardDom += '<br>卡牌 : <br>';
            $.each(val, function (idx, val) {
                var card = cards[val.tableId + ""];
                rewardDom += val.lv + '级  ' + card.star + '☆  ' + card.name + '  x ' + val.qty + '<br>';
            })
        } else {
            rewardDom += baseRewardNames[key] + ' x ' + val + ' <br>';
        }
    });


    contentArea.find('.reward .text').html(rewardDom);

    modalForm.modal();
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
                tableId : $this.find('.cName').val() * 1,
                qty : $this.find('.cQty').val() * 1,
                lv : $this.find('.cLv').val() * 1
            };
            cards.push(card);
        }
    });
    if(cards.length > 0) {
        data['cardArray'] = cards;
    }

    return data;

}

/**
 * 校验输入合法性,弹出确认弹窗
 */
function submit() {

    /**
     * 对必填text选项的校验
     * @param $input
     * @returns {boolean}
     */
    function validateText ($input) {
        var rst = true;
        if ($input.val() == '') {
            $input.closest('.form-group').addClass('has-error');
            var txt = $input.closest('.form-group').find('.control-label').text();
            $input.parent().append('<span class="help-block">请填入' + txt + '</span>');
            $input.focus();
            rst = false;
        }
        return rst;
    }

    removeErrors();

    var areaId = parseInt($("#area").val());
    var playerName = $("#playerName").val();
    var $title = $('#title');
    var $content = $("#content");
    var $author = $("#author");
    var $expDate = $('#expDate');


    // 校验输入合法性
    if (isNaN(areaId)) {
        $('#area').closest('.form-group').addClass('has-error');
        $('#area').parent().append('<span class="help-block">请选择服务器</span>');
        return;
    }
    if ((isNaN(areaId) || areaId == AREAID_ALL) && playerName != '') {
        $('#area').closest('.form-group').addClass('has-error');
        $('#area').parent().append('<span class="help-block">必须指定玩家所在的具体服务器</span>');
        return;
    }
    if (!validateText($expDate) || !validateText($author) || !validateText($title) || !validateText($content)) {
        return;
    }
    // 校验奖励输入合法性
    var options = getRewardOptData();
    if (Object.keys(options).length == 0) {
        $('#rewardBox').addClass('has-error');
        showErrorAlert(formTipAlertId.baseRW, formErrTips.RW_EMPTY);
        return;
    }

    var reqData = {
        areaId : areaId,
        playerId : playerName,
        content : $content.val(),
        validDate  : $expDate.val(),
        options : {
            title : $title.val(),
            sender : $author.val(),
            rewards : options
        }
    }

    showModal(reqData);
    // 注册"确认弹窗"中的提交按钮的事件
    $('#btnSendMsg').click(function() {
        hideModal();
        doSubmit(areaId, playerName, reqData);
    });

}

/**
 * 根据不同选项发送对应请求
 * @param areaId
 * @param playerName
 * @param mail
 */
function doSubmit(areaId, playerName, mail) {
    if (areaId == AREAID_ALL) { //全部服务器
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
}

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
}

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
}

function disconnect() {
    pomelo.disconnect();
    console.log("disconnect success");
}

// events

/**
 * 选项改变后应触发的事件
 */
var evtAfterChanged = function () {

    /**
     * 使数值合理化
     * @param val 当前输入
     * @param limitVal 上限值
     * @param $limitTag 应高亮的控件
     * @returns {num} 合理化后的输入
     */
    function makeValAdaptLimit(val, limitVal, $limitTag) {
        if(val < 0) {
            val = 0;
            showErrorAlert(formErrTips.RW_NEGATIVE);
        } else if(val > limitVal * 1) {
            val = limitVal * 1;
            highLightLimit($limitTag);
        }
        return val;
    }

    /**
     * 对只输入数字类型的input进行处理
     * @param $input $(input)
     * @param alertId input对应提示框ID
     * @param getLimitTag 获得记录input对应上限值的控件的函数,以$input为参数
     */
    function handleNumInput ($input, alertId, getLimitTag) {
        var inputVal = $input.val();

        // 限制只可输入数字
        if (inputVal.length > 0 && !(inputVal * 1)) {
            inputVal = "";
            showErrorAlert(alertId, formErrTips.RW_WRONG_TYPE);
        } else {
            removeErrors();
        }

        var $limitTag = getLimitTag($input);
        inputVal = makeValAdaptLimit(inputVal, $limitTag.attr('limit'), $limitTag);
        $input.val(inputVal);
    }

    var ret = {
        baseReward : function () {
            handleNumInput($(this), formTipAlertId.baseRW, function($input){
                return $input.parent().prev().prev();
            });
        },

        cardReward : function () {
            var $input = $(this);

            // 不同类型input使用不同规则
            if($input.is('select')) {
                switch ($input.attr('name')) {
                    case 'tableId':
                        // 更改等级上限
                        var val = $input.val();
                        var card = cards[val + ''];
                        var lvLimit = cardLvLimit[card.star + ''].max_lv;
                        $input.closest('.cardTag').find('.cardLimit').attr('limit', lvLimit);
                        $input.closest('.cardTag').find('input').change();
                        break;
                    default:
                        break;
                }
            } else if ($input.is('input')) {
                handleNumInput($input, formTipAlertId.cardRW, function($input){
                    return $input.prev();
                });
            }
        }
    };

    return ret;
}();

$(document).ready(function() {
    initServer(initAreasList);
    initCardOpt();
    initRewardLimit();

    $('.baseReward').change(evtAfterChanged.baseReward);
    $("#btnResetReward").click(function(e) {
        e.preventDefault();
        removeErrors();
        $('.baseReward').val('').attr('disabled', false);
        $('#cardGroup .cardTag').remove();
        addCardOpt();
    });
    $("#btnOk").click(function(e) {
        e.preventDefault();
        submit();
    });

    //** 卡牌奖励相关控件事件绑定 ************************************
    $('#cardGroup').delegate('.btn', 'click', function () {
        removeErrors();
    }).delegate('.btnRemoveCard','click', function(){
        $(this).closest('.cardTag').remove();
    }).delegate('.cardReward', 'change', evtAfterChanged.cardReward);

    $("#btnAddCard").click(function (e) {
        e.preventDefault();
        addCardOpt();
    });
    //********************************************************************
});