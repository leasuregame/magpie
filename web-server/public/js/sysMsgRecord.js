var ROWS_PER_PAGE = 10;
var messageStatus = {
    1 : 'ASKING',
    2 : '已接受',
    3 : '已拒绝',
    4 : '未处理',
    5 : '已处理',
    6 : 'NOTICE'
};
var serverNamePair = {};
var configCards = {};
var tipAlertId = {
    LOADING : '#loadingAlert',
    NO_RS : '#noRsAlert'
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
    honor : '荣誉点',
    pill : '觉醒玉'
};

/**
 * 将服务器的id于name组成pair方便使用
 */
function initServerNames() {
    if(servers) {
        var tmpServs = servers;
        for(var i in tmpServs) {
            var tmpSer = tmpServs[i];
            serverNamePair[tmpSer.id] = tmpSer.name;
        }
    }
}

/**
 * 向服务器获取预设卡牌信息
 */
function initConfCards() {
    window.webAPI.getActorCards(function(data){
        configCards = data;
    });
}

/**
 * 获取数据后初始化分页控件
 */
function initPaginator() {
    var tabBody = $('#rsTable tbody');

    var totalPages = Math.ceil(tabBody.find('tr').length / ROWS_PER_PAGE);

    $('#paginatorCntr').empty().append('<ul class="paginator" />');

    if(totalPages > 0) {
        var paginatorOpts = {
            currentPage: 1,
            totalPages: totalPages,
            bootstrapMajorVersion: 3,
            alignment: 'right',
            size: 'normal',
            onPageChanged: function (e, from, to) {
                showTabPage(to);
            }
        };

        $('.paginator').bootstrapPaginator(paginatorOpts);

        showTabPage(1);
    } else {
        $(tipAlertId.NO_RS).removeClass('hide');
    }
}

/**
 * 控制表格展示对应页的数据
 * @param pageIdx 具体页码,从 1 开始计数
 */
function showTabPage(pageIdx){
    $('#rsTable tbody tr').addClass('hide').slice(ROWS_PER_PAGE * (pageIdx - 1), ROWS_PER_PAGE * pageIdx).removeClass('hide');
}

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
 * 获取各查询条件选项内容
 * @returns {{areaId: (*|jQuery), playerNames: *, createTime: *[]}}
 */
function getInputData() {
    var retData,areaId,playerNames,createTime;

    areaId = $('#area').val();
    if(areaId == AREAID_ALL && servers) {
        areaId = [];
        for(var i in servers) {
            areaId.push(servers[i].id);
        }
    }
    playerNames = getInputPlayerNames();

    var lowerCreateTime = $('#createTime .low').val();
    var upperCreateTime = $('#createTime .up').val();

    if(lowerCreateTime.length == 0) {
        lowerCreateTime = '1970-1-1';
    }
    if(upperCreateTime.length == 0) {
        upperCreateTime = '2040-12-31';
    }
    createTime = [lowerCreateTime + ' 00:00:00', upperCreateTime + ' 23:59:59'];

    retData = {
        areaId : areaId,
        playerNames : playerNames,
        createTime : createTime
    };

    return retData;
}

/**
 * 完成相关初始化后自动执行一次提交查询
 */
function submitAfterInit(){
    var areaCount = $('#area option').length;
    if(areaCount > 0) {
        submit();
    }else {
        setTimeout(submitAfterInit, 100);
    }
}

function submit() {
    removeErrors();

    var reqData = getInputData();

    if ((isNaN(reqData.areaId) || reqData.areaId == AREAID_ALL) && reqData.playerNames.length > 0) {
        $('#area').closest('.form-group').addClass('has-error');
        $('#area').parent().append('<span class="help-block">必须指定玩家所在的具体服务器</span>');
        return;
    }

    if(reqData.playerNames) {
        window.webAPI.getPlayerIdsByNames(reqData.areaId, reqData.playerNames, function (resPids){
            if (resPids.id) {
                reqData.playerIds = resPids.id;
                doRequest(reqData);
            }
        }, function (data) {
            if(data.status == 404) {
                showQueryPlayerBoxError('发送失败! 玩家不存在,请确认');
                $('#playerName').focus();
            }
        });
    } else {
        doRequest(reqData);
    }
}

function doRequest(reqData) {
    $('#rsTable tbody').empty();
    $(tipAlertId.NO_RS).addClass('hide');
    $(tipAlertId.LOADING).removeClass('hide');
    $('#submitCheck').attr('disabled', true);

    window.webAPI.getSysMessages(reqData.areaId, reqData.playerIds, reqData.createTime, function(data){
        $(tipAlertId.LOADING).addClass('hide');
        $('#submitCheck').attr('disabled', false);

        var tabBody = $('#rsTable tbody');
        var rowTemp = $('#rowTemp').html();
        for(var i in data) {
            var rowData = data[i];
            rowData.options = $.parseJSON(rowData.options);
            rowData.createDate = new Date(rowData.createTime).toLocaleDateString();
            rowData.validDate = new Date(rowData.validDate).toLocaleDateString();
            var $tmpRow = $(rowTemp);
            var receiverTxt = rowData.name ? '(' + serverNamePair[rowData.areaId] + ") " + rowData.name : serverNamePair[rowData.areaId];
            $tmpRow.find('.receiver').text(receiverTxt).attr('title', receiverTxt);
            $tmpRow.find('.title').text(rowData.options.title).attr('title', rowData.options.title);
            $tmpRow.find('.content').text(rowData.content).attr('title', rowData.content);
            var rewardTxt = rewardJson2Str(rowData.options.rewards);
            $tmpRow.find('.rewards').text(rewardTxt).attr('title', rewardTxt);
            $tmpRow.find('.status').text(messageStatus[rowData.status]);
            $tmpRow.find('.createTime').text(rowData.createDate);
            $tmpRow.find('.validDate').text(rowData.validDate);
            tabBody.append($tmpRow);
        }
        initPaginator();
    },function(data){
        console.log(data.responseText);
        $(tipAlertId.LOADING).addClass('hide');
        $('#submitCheck').attr('disabled', false);
    });
}

/**
 * 奖励格式化为可展示字符串
 * @param reward
 * @returns {string}
 */
function rewardJson2Str(reward) {
    var ret = "";
    if (window.wsUtil.isNotEmptyObj(reward)){
        $.each(reward, function (key, val) {
            if (key == 'cardArray') {
                var qty = 0;
                $.each(val, function (idx, val) {
                    qty += val.qty * 1;
                    var card = configCards[val.tableId + ""];
                    ret += val.lv + '级  ' + card.star + '☆  ' + card.name + '  x ' + val.qty + ';\n';
                });
                ret ='\n卡牌 : ' + qty + '张;\n' + ret;
            } else {
                ret += baseRewardNames[key] + ' x ' + val + ';\n';
            }
        });
    } else {
        ret = '-';
    }
    return ret;
}

$(document).ready(function() {
    initServer(initServerNames);
    initConfCards();
    submitAfterInit();

    $('#submitCheck').click(function(){
        submit();
    });
//    $('.container').delegate('.btn', 'click', re)
});
