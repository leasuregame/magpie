var ROWS_PER_PAGE = 10;
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
    honor : '荣誉点'
};

/**
 * 将服务器的id于name组成pair方便使用
 * @param cb
 */
function initServerNames(cb) {
    if(servers) {
        var tmpServs = servers;
        for(var i in tmpServs) {
            var tmpSer = tmpServs[i];
            serverNamePair[tmpSer.id] = tmpSer.name;
        }
        cb();
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

function areaIds2Names(areaIds) {
    var areaNames = [];
    if(areaIds instanceof Array) {
        for(var k in areaIds) {
            areaNames.push(serverNamePair[areaIds[k]]);
        }
    } else {
        areaNames.push(serverNamePair[areaIds]);
    }
    return areaNames;
}

/**
 * appendTxt2Dom
 * @param $dom
 * @param txt
 */
function appendTxt2Dom($dom, txt) {
    $dom.text(txt).attr('title', txt);
}

/**
 * 获取各查询条件选项内容
 * @returns {{createTime: *[]}}
 */
function getInputData() {
    var retData,createTime;

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
        createTime : createTime
    };

    return retData;
}

function submit() {
    var reqData = getInputData();
    doRequest(reqData);
}

function doRequest(reqData) {
    $('#rsTable tbody').empty();
    $(tipAlertId.NO_RS).addClass('hide');
    $(tipAlertId.LOADING).removeClass('hide');
    $('#submitCheck').attr('disabled', true);

    window.webAPI.getMsgOptions(reqData.createTime, function (data){
        $(tipAlertId.LOADING).addClass('hide');
        $('#submitCheck').attr('disabled', false);

        var tabBody = $('#rsTable tbody');
        var rowTemp = $('#rowTemp').html();
        for(var i in data) {
            var rowData = data[i];
            rowData.options = rowData.options ? $.parseJSON(rowData.options) : rowData.options;
            rowData.createDate = new Date(rowData.createTime).toLocaleDateString();

            // format data and append
            var $tmpRow = $(rowTemp);

            // areaIds
            var areaNames = areaIds2Names($.parseJSON(rowData.areaIds));
            rowData.areaTxt = areaNames.toString();
            appendTxt2Dom($tmpRow.find('.area'), rowData.areaTxt);
            // receiver
            var pns = $.parseJSON(rowData.playerNames);
            var receiverTxt = pns ? $.parseJSON(rowData.playerNames).toString() : "全服";
            appendTxt2Dom($tmpRow.find('.receiver'), receiverTxt);
            // sender
            appendTxt2Dom($tmpRow.find('.sender'), rowData.operator);
            // titile
            appendTxt2Dom($tmpRow.find('.title'), rowData.options.title);
            // reward
            var rewardTxt = rewardJson2Str(rowData.options.rewards);
            appendTxt2Dom($tmpRow.find('.rewards'), rewardTxt);
            // create time
            appendTxt2Dom($tmpRow.find('.createTime'), rowData.createDate);

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
                    qty += val.qty;
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
    initServer(function(){
        initServerNames(submit);
    });
    initConfCards();

    $('#submitCheck').click(function(){
        submit();
    });
//    $('.container').delegate('.btn', 'click', re)
});
