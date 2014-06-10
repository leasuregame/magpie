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
    var lowerCreateTime = $input.find('.low').val();
    var upperCreateTime = $input.find('.up').val();

    if(lowerCreateTime.length == 0) {
        lowerCreateTime = '1970-1-1';
    }
    if(upperCreateTime.length == 0) {
        var now = new Date();
        upperCreateTime = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
    }
    return [lowerCreateTime + ' 00:00:00', upperCreateTime + ' 23:59:59'];
}


/**
 * 获取各查询条件选项内容
 * @returns {{areaId: (*|jQuery), playerNames: *, createTime: *[]}}
 */
function getInputData() {
    var retData,areaId,createTime;

    areaId = $('#area').val();
    if(areaId == AREAID_ALL && servers) {
        areaId = [];
        for(var i in servers) {
            areaId.push(servers[i].id);
        }
    }

    var createTime = getDateInputData($('#createTime'));
    var playerCreateTime = getDateInputData($('#playerCreateTime'));

    retData = {
        areaId : areaId,
        playerCreateTime : playerCreateTime,
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

    window.webAPI.getLvWastageRate(reqData.areaId, reqData.playerCreateTime, reqData.createTime, function(data){
        $(tipAlertId.LOADING).addClass('hide');
        $('#submitCheck').attr('disabled', false);
        lastReqData = data;
        if(data.length > 0) {
            buildResTable(data);
        } else {
            $(tipAlertId.NO_RS).removeClass('hide');
        }
    },function(data){
        console.log(data);
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
});
