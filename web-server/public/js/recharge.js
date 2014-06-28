var product = null;
var serverNamePair = [];
var rsPanel;
window.wsConst.IS_AREA_INCLUDE_ALL = true;

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
        product = data;
        cb && cb();
    });
}

/**
 * 初始化充值项目选项
 */
function initProductsList(){
    if(product) {
        var inner = "";
        for(var i in product) {
            var pro = product[i];
            inner += '<option value =' + pro.product_id + '>' + pro.name + '</option>';
        }
        $("#product").append(inner).prop("selectedIndex", 0);
    } else {
        setTimeout(initProductsList, 100);
    }
}

/**
 * 校验并纠正'数量'选项所填的值
 */
function validateQtyVal(){
    var $qty = $('#qty');
    var val = $qty.val() * 1;
    var err = '';
    if('number' != typeof val) {
        err = '数量请填入数字';
        val = 1;
    } else if(val <= 0) {
        err = '数量至少为 1';
        val = 1;
    } else if(val > 1) {
        var productId = $('#product').val();
        if(productId.indexOf('week') > -1 || productId.indexOf('month') > -1) {
            err = '周卡/月卡数量不可超过 1';
            val = 1;
        } else if(val > 20) {
            err = '数量不可超过 20';
            val = 20;
        }
    }
    if(err.length > 0) {
        $qty.val(val);
        console.log(err);
    }
}

/**
 * 获取各查询条件选项内容
 * @returns {{areaId: *, playerNames: *, productId: *, qty: *}}
 */
function getInputData() {
    var retData,areaId,playerNames,productId,qty;

    areaId = $('#area').val();
    playerNames = getInputPlayerNames();
    productId = $('#product').val();
    qty = $('#qty').val() * 1;

    retData = {
        areaId : areaId,
        playerNames : playerNames,
        productId : productId,
        qty : qty
    };

    return retData;
}

function submit() {
    var reqData = getInputData();

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
        showQueryPlayerBoxError('未指定玩家!');
        $('#playerName').focus();
    }
}

function doRequest(reqData) {
    if(!rsPanel) {
        rsPanel = dataPanel($('#rsPanel'));
    }
    rsPanel.hide();
    window.pomeloAPI.request(reqData.areaId, window.pomeloAPI.API.RECHARGE, reqData, function(data, cb){
        if(data.code == 200 || data.code == 501){
            rsPanel.setMode2Info();
            if(data.code == 200) {
                rsPanel.set2Success();
            } else {
                rsPanel.set2Warning();
            }
            var msg = data.msg;
            rsPanel.setField('.succeededPlayer', msg.players);
            rsPanel.setField('.failedPlayer', msg.failedPlayers);
            rsPanel.setField('.product', msg.product.name);
            rsPanel.setField('.qty', msg.qty);

            // 当前时间
            var now = new Date();
            rsPanel.setElement('.recDateTime', now.toLocaleString());
            cb();
        } else {
            cb(data.msg);
        }
    }, function(err){
        if(err) {
            rsPanel.setMode2Info();
            rsPanel.set2Danger();
            rsPanel.setElement('.error', err);
            console.log('error', err);
        }
        rsPanel.show();
    })
}

var dataPanel = function ($panel) {
    var dataPanel = {
        show : function(){
           $panel.fadeIn(800);
        },
        hide : function(){
            $panel.fadeOut(800);
        },
        set2Empty : function() {
            $panel.removeClass('panel-success panel-primary panel-danger panel-warning');
        },
        set2Success : function() {
            dataPanel.set2Empty();
            $panel.addClass('panel-success');
        },
        set2Primary : function() {
            dataPanel.set2Empty();
            $panel.addClass('panel-primary');
        },
        set2Warning : function() {
            dataPanel.set2Empty();
            $panel.addClass('panel-warning');
        },
        set2Danger : function() {
            dataPanel.set2Empty();
            $panel.addClass('panel-danger');
        },
        setMode2Info : function() {
            $panel.find('.info').show();
            $panel.find('.error').hide();
        },
        setMode2Error : function() {
            $panel.find('.info').hide();
            $panel.find('.error').show();
        },
        setField : function(fieldSelector, text) {
            $panel.find(fieldSelector).find('.val').text(text);
        },
        setElement : function(eleSelector, text) {
            $panel.find(eleSelector).text(text);
        }
    };
    return dataPanel;
};

$(document).ready(function() {
    initServer(initServerNames);
    initConfProduct(initProductsList);

    rsPanel = dataPanel($('#rsPanel'));

    $('#qty, #product').change(validateQtyVal);

    $('#submitCheck').click(function(){
        submit();
    });

});
