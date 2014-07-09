var AREAID_ALL = -1;
var tipAlertId = {
    LOADING : '#loadingAlert',
    NO_RS : '#noRsAlert'
};
var SORT_TYPES = {
    ASC : 1,
    DESC : 0
};
var serverNamePair = {};
var lastReqData = {};

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
 * 初始化服务器列表
 */
function initAreasList(cb) {
    if(servers) {
        var inner = "";

        inner += '<option value = "-1">所有</option>';
        servers.forEach(function(area) {
            inner += '<option value =' + area.id + '>' + area.name + '</option>';
        });
        $("#area").append(inner).prop("selectedIndex", 0);
        cb && cb();
    } else {
        setTimeout(function(){initAreasList(cb);}, 100);
    }
}

function getDateInputData($input) {
    var lowerDate = $input.find('.low').val();
    var upperDate = $input.find('.up').val();

    if(lowerDate.length == 0) {
        lowerDate = '1970-1-1';
    }
    if(upperDate.length == 0) {
        var now = new Date();
        upperDate = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
    }
    return [lowerDate, upperDate];
}


/**
 * 获取各查询条件选项内容
 * @returns {{areaId: *[], playerCreateTime: *[], recordDate: *}}
 */
function getInputData() {
    var retData, areaId, recordDate, playerCreateTime;

    areaId = $('#area').val();
    if(areaId == AREAID_ALL && servers) {
        areaId = [];
        for(var i in servers) {
            areaId.push(servers[i].id);
        }
    }

    recordDate = getDateInputData($('#recordDate'));
    playerCreateTime = getDateInputData($('#playerCreateTime'));
    playerCreateTime = [playerCreateTime[0] + ' 00:00:00', playerCreateTime[1] + ' 23:59:59'];

    retData = {
        areaId : areaId,
        created : playerCreateTime,
        recordDate : recordDate
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

    window.webAPI.getLvWastageRate(reqData.areaId, reqData.created, reqData.recordDate, function(data){
        $(tipAlertId.LOADING).addClass('hide');
        $('#submitCheck').attr('disabled', false);
        lastReqData = data;
        if(data.length > 0) {
            buildResTable(data);
        } else {
            $(tipAlertId.NO_RS).removeClass('hide');
        }
    },function(data){
        $(tipAlertId.LOADING).addClass('hide');
        $('#submitCheck').attr('disabled', false);
    });
}

/**
 * 将传入数据显示到结果表格中
 * @param data
 */
function buildResTable(data){
    var tabBody = $('#rsTable tbody');
    var rowTemp = $('#rowTemp').html();
    for(var i in data) {
        var rowData = data[i];
        var $tmpRow = $(rowTemp);

        $tmpRow.find('.lv').text(rowData.lv);
        $tmpRow.find('.total').text(rowData.total);
        $tmpRow.find('.totalRate').text(Math.round(rowData.totalRate * 10000)/100 + '%');
        $tmpRow.find('.wastage').text(rowData.wastage);
        $tmpRow.find('.wastageRate').text(Math.round(rowData.wastageRate * 10000)/100 + '%');
        $tmpRow.find('.totalWastageRate').text(Math.round(rowData.totalWastageRate * 10000)/100 + '%');
        tabBody.append($tmpRow);
    }
}

$(document).ready(function() {
    initServer(initServerNames);
    initAreasList(submit);

    $('#rsTable .sortBtn').click(function(){
        $this = $(this);
        var sKey = $this.attr('sortKey');
        var sType = $this.attr('sortType');
        sType = sType ? sType : SORT_TYPES.ASC;
        if(lastReqData) {
            var data = lastReqData;
            data.sort(function(a, b) {
                if(sType == SORT_TYPES.ASC) {
                    return a[sKey] - b[sKey];
                } else {
                    return b[sKey] - a[sKey];
                }
            });
            var sortMark = '';
            if(sType == SORT_TYPES.ASC) {
                sType = SORT_TYPES.DESC;
                sortMark = '↑';
            } else {
                sType = SORT_TYPES.ASC;
                sortMark = '↓';
            }
            $('.sortMark').text('');
            $this.attr('sortType', sType).find('.sortMark').text(sortMark);
            $('#rsTable tbody').empty();
            buildResTable(data);
        }
    });

    $('#submitCheck').click(function(){
        submit();
    });

    $('#exportCSV').click(function(){
        var url = window.webAPI.API.DOWNLOAD_WASTAGE_RATE_ON_LV + "?" + $.param(getInputData());
        $(this).attr('href', url);
        return true;
    });

});
