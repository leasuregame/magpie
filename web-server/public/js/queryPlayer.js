var AREAID_ALL = -1;
var PLAYER_NAME_SEPARATOR = ';';
var queryPlayerLimits = {
    lv : {lower: 0, upper: 1000},
    vip : {lower:0, upper: 100},
    payTime : {lower:'1970-1-1', upper: '2040-12-31'},
    amount : {lower:0, upper: 1000000}
};

function getInputAreaIds() {
    var areaId = $('#area').val();
    return areaId;
}

function getInputPlayerNames() {
    var playerNameTxt = $("#playerName").val().replace(/；/g, PLAYER_NAME_SEPARATOR);
    var playerNames = playerNameTxt.length > 0 ? window.wsUtil.splitNoBlank(playerNameTxt, PLAYER_NAME_SEPARATOR) : '';
    return playerNames;
}

function showQueryPlayerBoxAlert(tips) {
    $('#queryPlayerAlert').text(tips).removeClass('hide');
}

function hideQueryPlayerBoxAlert() {
    $('#queryPlayerAlert').addClass('hide');
}

/**
 * 初始化服务器列表
 */
function initAreasList() {
    if(servers) {
        var inner = "";

        inner += '<option value = "-1">所有</option>';
        servers.forEach(function(area) {
            inner += '<option value =' + area.id + '>' + area.name + '</option>';
        });

        $("#area").append(inner).prop("selectedIndex", 0);
    } else {
        setTimeout(initAreasList, 100);
    }
}

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
    var areaId = $("#area").val();

    if ((isNaN(areaId) || areaId == AREAID_ALL)) {
        $('#area').closest('.form-group').addClass('has-error');
        $('#area').parent().append('<span class="help-block">请选择服务器</span>');
        return;
    }

    var options = getPlayerQueryOptData();
    options.areaId = areaId;

    $('#btnQueryPlayer').attr('disabled', true);
    window.webAPI.getPlayerNames(options, function (data) {
        $('#btnQueryPlayer').attr('disabled', false);

        var text = '';
        for(var i in data) {
            text += data[i] += PLAYER_NAME_SEPARATOR;
        }
        $('#playerName').val(text).change();
    });
}

function removeAreaError() {
    $('#area').closest('.form-group').removeClass('has-error').find('.help-block').remove();
}

$(document).ready(function() {
    initAreasList();

    $('#btnQueryPlayer').click(queryPlayer);
    $('#area').change(function() {
        removeAreaError();
        $('#playerName').val('').change();
    });
    $('#playerName').change(function(){
        var $this = $(this);
        var total = getInputPlayerNames().length;
        $this.closest('#playerBox').find('.totalPlayers').text(total);
        hideQueryPlayerBoxAlert();
    });
});