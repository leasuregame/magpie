var ROWS_PER_PAGE = 10;
var serverNamePair = {};
var productNamePair = {};
var tipAlertId = {
    LOADING : '#loadingAlert',
    NO_RS : '#noRsAlert'
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
 * 向服务器获取预设充值项目信息
 */
function initConfProduct(cb) {
    window.webAPI.getRechargeProduct(function(data){
        for(var key in data) {
            var product = data[key];
            productNamePair[product.product_id] = product.name;
        }
        cb && cb();
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

    window.webAPI.getRechargeRecord(reqData.areaId, reqData.playerIds, reqData.createTime, function(data){
        $(tipAlertId.LOADING).addClass('hide');
        $('#submitCheck').attr('disabled', false);

        var tabBody = $('#rsTable tbody');
        var rowTemp = $('#rowTemp').html();
        for(var i in data) {
            var rowData = data[i];
            var $tmpRow = $(rowTemp);
            var areaTxt = serverNamePair[rowData.areaId];
            $tmpRow.find('.area').text(areaTxt).attr('title', areaTxt);
            $tmpRow.find('.player').text(rowData.playerName).attr('title', rowData.playerName);
            var productTxt = productNamePair[rowData.productId];
            $tmpRow.find('.product').text(productTxt).attr('title', productTxt);
            $tmpRow.find('.qty').text(rowData.qty);
            $tmpRow.find('.amount').text(rowData.amount);
            $tmpRow.find('.gain').text(rowData.gain);
            var createTimeTxt = new Date(rowData.createTime).toLocaleString();
            $tmpRow.find('.createTime').text(createTimeTxt).attr('title', createTimeTxt);
            tabBody.append($tmpRow);
        }
        initPaginator();
    },function(data){
        console.log(data.responseText);
        $(tipAlertId.LOADING).addClass('hide');
        $('#submitCheck').attr('disabled', false);
    });
}

$(document).ready(function() {
    initServer(initServerNames);
    initConfProduct();
    submitAfterInit();

    $('#submitCheck').click(function(){
        submit();
    });

});
