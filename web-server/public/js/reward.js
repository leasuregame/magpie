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
var OPTIONS_MAX_LENGTH = 1024;
var PLAYER_NAME_SEPARATOR = ';';
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
    RW_NEGATIVE : "请勿输入负数",
    RW_OVERFLOW : "输入超出上限,已转为最大值",
    RW_CARDS_TOO_MANY : "输入超出上限,已转为最大值"
};
/**
 * 提示框ID
 * @type {{baseRW: string, cardRW: string}}
 */
var formTipAlertId = {
    baseRW : '#baseRewardAlert',
    cardRW : '#cardRewardAlert'
};
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
};
var queryPlayerLimits = {
    lv : {lower: 0, upper: 1000},
    vip : {lower:0, upper: 100},
    payTime : {lower:'1970-1-1', upper: '2040-12-31'},
    amount : {lower:0, upper: 1000000}
};

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
        cardTmp = $('#cardOptTemp').html();
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
    $('.limitTag, .form-control').removeAttr('style');
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
    $('#cardBox').append(cardTmp);
}

/**
 * 高亮传入的控件
 * @param $tag
 */
function highLightTag($tag) {

    if($tag instanceof Array) {
        for(var i in $tag) {
            highLightTag($tag[i]);
        }
    } else {
        $tag.css({
            'color' : '#a94442',
            'border-color' : '#a94442'
        });

    }
}

/**
 * 弹出确认提交弹窗
 * @param msg @returns {{areaId: Number, playerNames: string, content: string, validDate: string, options: {title: string, sender: string, rewards: {}}}} 包含页面所有信息
 */
function showModal(msg) {

    var modalForm = $('#actionConfirm');
    var contentArea = modalForm.find('.modal-content');
    contentArea.find('.area .text').text($('#area').find('option:selected').text());
    contentArea.find('.receiver .text').text(msg.playerNames);
    contentArea.find('.author .text').text(msg.options.sender);
    contentArea.find('.title .text').text(msg.options.title);
    contentArea.find('.content .text').text(msg.content);
    contentArea.find('.expDate .text').text(msg.validDate);

    // 生成奖励文本
    var rewardDom = '';
    $.each(msg.options.rewards, function (key, val) {
        if(key == 'cards') {
            rewardDom += '<br>卡牌 : ' + val.length + '张<br>';
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
 * 获取查询玩家选项中的数据
 * @returns object
 */
function getPlayerQueryOptData() {
    var data = {};

    // 处理player自带属性奖励
    $('#queryPlayerBox .paramSet').each(function() {
        var $this = $(this);
        var lower = $this.find('.low').val();
        var upper = $this.find('.up').val();
        var key = $this.attr('name');
        var param = null;
        if(lower && upper) {
            param = [lower, upper];
        } else if(lower) {
            param = [lower, queryPlayerLimits[key].upper];
        } else if(upper) {
            param = [queryPlayerLimits[key].lower, upper];
        }

        if(param) {
            // 最后时间推移到一天末尾
            if(key == 'payTime') {
                param[1] += ' 23:59:59';
            }
            data[key] = param;
        }
    });

    return data;
}

function queryPlayer() {
    removeErrors();

    var areaId = $("#area").val();

    if ((isNaN(areaId) || areaId == AREAID_ALL)) {
        $('#area').closest('.form-group').addClass('has-error');
        $('#area').parent().append('<span class="help-block">请选择服务器</span>');
        return;
    }

    var options = getPlayerQueryOptData();
    options.areaId = areaId;

    window.webAPI.getPlayerNames(options, function (data) {
        var text = '';
        for(var i in data) {
            text += data[i] += PLAYER_NAME_SEPARATOR;
        }
        $('#playerName').val(text).change();
    })
}

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
    var cards = [];
    $('.cardTag').each(function() {
        var $this = $(this);
        var lv = $this.find('.cLv').val() * 1;
        var qty = $this.find('.cQty').val() * 1;

        if(qty > 0 && lv > 0) {
            var card = {
                tableId : $this.find('.cName').val() * 1,
                qty : $this.find('.cQty').val() * 1,
                lv : $this.find('.cLv').val() * 1
            };
            cards.push(card);
        }
    });
    if(cards.length > 0) {
        data['cards'] = cards;
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
    var playerNameTxt = $("#playerName").val();
    var playerNames = playerNameTxt.length > 0 ? playerNameTxt.split(PLAYER_NAME_SEPARATOR) : '';
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
    if ((isNaN(areaId) || areaId == AREAID_ALL) && playerNames.length > 0) {
        $('#area').closest('.form-group').addClass('has-error');
        $('#area').parent().append('<span class="help-block">必须指定玩家所在的具体服务器</span>');
        return;
    }
    if (!validateText($expDate) || !validateText($author) || !validateText($title) || !validateText($content)) {
        return;
    }
    // 校验奖励输入合法性
    var options = getRewardOptData();
//    if (Object.keys(options).length == 0) {
//        $('#rewardBox').addClass('has-error');
//        showErrorAlert(formTipAlertId.baseRW, formErrTips.RW_EMPTY);
//        return;
//    }
    if (JSON.stringify(options).length >= OPTIONS_MAX_LENGTH) {
        $('#cardBox').addClass('has-error');
        showErrorAlert(formTipAlertId.cardRW, formErrTips.RW_CARDS_TOO_MANY);
    }
    var reqData = {
        areaId : areaId,
        playerNames : playerNames,
        content : $content.val(),
        validDate  : $expDate.val() + ' 23:59:59',
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
        doSubmit(areaId, playerNames, reqData);
    });

}

/**
 * 根据id获得area信息
 * @param id
 * @returns {*}
 */
function getAreaById(id) {
    for (var key in servers) {
        var area = servers[key];
        if (area.id = id) {
            return area;
        }
    }
    return null;
}

/**
 * 根据不同选项发送对应请求
 * @param areaId
 * @param playerNames
 * @param mail
 */
function doSubmit(areaId, playerNames, mail) {
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
                    var areaName = getAreaById(areaId).name;
                    window.webAPI.logReward(areaName, JSON.stringify(mail));
                }
            }
        );

    } else { //指定服务器
        if (playerNames.length == 0) {
            dealAll(areaId, mail, function(err) {
                if (err) {
                    console.log("err = ", err);
                } else {
                    var areaName = getAreaById(areaId).name;
                    window.webAPI.logReward(areaName, JSON.stringify(mail));
                }
            });
        } else { //指定玩家
            window.webAPI.getPlayerIdsByNames(areaId, playerNames, function (data){
                if (data.id) {
                    mail['playerIds'] = data.id;
                    dealAll(areaId, mail, function(err) {
                        if (err) {
                            console.log("err = ", err);
                        } else {
                            var areaName = getAreaById(areaId).name;
                            window.webAPI.logReward(areaName, JSON.stringify(mail), playerNames);
                        }
                    });
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
     * @param $highLightTag 应高亮的控件
     * @param alertId 提示框ID
     * @returns {num} 合理化后的输入
     */
    function makeValAdaptLimit(val, limitVal, $highLightTag, alertId) {
        if(val < 0) {
            val = 0;
            showErrorAlert(alertId, formErrTips.RW_NEGATIVE);
        } else if(val > limitVal * 1) {
            val = limitVal * 1;
            highLightTag($highLightTag);
            showErrorAlert(alertId, formErrTips.RW_OVERFLOW);
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
        inputVal = makeValAdaptLimit(inputVal, $limitTag.attr('limit'), [$limitTag, $input], alertId);
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
    $('#btnResetReward').click(function(e) {
        e.preventDefault();
        // 重置所有奖励
        removeErrors();
        $('.baseReward').val('').attr('disabled', false);
        $('#cardBox .cardTag').remove();
        addCardOpt();
    });
    $('#btnFindPlayer').click(function(e) {
        e.preventDefault();
        // 查询玩家
        queryPlayer();
    });
    $('#btnOk').click(function(e) {
        e.preventDefault();
        submit();
    });
    $('#area').change(function() {
        $('#playerName').val('').change();
    });
    $('#playerName').change(function(){
        var $this = $(this);
        var total = window.wsUtil.splitNoBlank($this.val(), PLAYER_NAME_SEPARATOR).length;
        $this.closest('#playerBox').find('.totalPlayers').text(total);
    });

    //** 卡牌奖励相关控件事件绑定 ************************************
    $('#cardBox').delegate('.btn', 'click', function () {
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