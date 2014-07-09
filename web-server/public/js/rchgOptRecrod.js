var ROWS_PER_PAGE = 10;
var serverNamePair = {};
var productNamePair = {};
var tipAlertId = {
    LOADING : '#loadingAlert',
    NO_RS : '#noRsAlert'
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

    window.webAPI.getRechargeOptions(reqData.createTime, function (data){
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

            // todo test it!!!!!

            // areaIds
            var areaNames = areaIds2Names($.parseJSON(rowData.areaIds));
            rowData.areaTxt = areaNames.toString();
            appendTxt2Dom($tmpRow.find('.area'), rowData.areaTxt);
            // receiver
            var pns = $.parseJSON(rowData.playerNames);
            appendTxt2Dom($tmpRow.find('.receiver'), pns);
            // sender
            appendTxt2Dom($tmpRow.find('.sender'), rowData.operator);
            // product
            var productTxt = productNamePair[rowData.options.product];
            appendTxt2Dom($tmpRow.find('.product'), productTxt);
            // qty
            appendTxt2Dom($tmpRow.find('.qty'), rowData.options.qty);
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

$(document).ready(function() {
    initServer(function(){
        initServerNames(submit);
    });
    initConfProduct();

    $('#submitCheck').click(function(){
        submit();
    });
//    $('.container').delegate('.btn', 'click', re)
});
