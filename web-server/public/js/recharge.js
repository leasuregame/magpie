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
 * 唤出确认弹窗
 */
function showConfirm(point){
    var form = $('#confirm');
    point.left -= 90;
    point.top -= 70;
    form.css(point).removeClass('hide');
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
                getSignature(reqData, doRequest);
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

function getSignature(reqData, cb){
    window.webAPI.getRchgSig(reqData, function(data){
        reqData.signature = data;
        cb(reqData);
    }, function(data){
        alert('failed!!\n' + data.msg);
    });
}

function doRequest(reqData) {
    if(!rsPanel) {
        rsPanel = dataPanel($('#rsPanel'));
    }

    rsPanel.hide(function(){
        $('.loading-panel').show();
        window.pomeloAPI.request(reqData.areaId, window.pomeloAPI.API.RECHARGE, reqData, function(data, cb){
            if(data.code == 200){

                rsPanel.setMode2Info();
                var msg = data.msg;
                rsPanel.setField('.product', msg.product.name);
                rsPanel.setField('.qty', msg.qty);

                // 当前时间
                var now = new Date();
                rsPanel.setElement('.recDateTime', now.toLocaleString());

                var playerNames = [];
                for(var i in data.msg.players) {
                    var player = data.msg.players[i];
                    rsPanel.addPlayerPanel(player);
                    if(player.status == 1) {
                        playerNames.push(player.name);
                    }
                }

                var option = {
                    product : reqData.productId,
                    qty : reqData.qty
                };
                window.webAPI.recordRechargeOpt(reqData.areaId, option, playerNames, 1);
                cb && cb();
            } else {
                cb(data.msg);
            }
        }, function(err){
            if(err) {
                rsPanel.setMode2Error();
                rsPanel.setElement('.error', err);
            }
            $('.loading-panel').hide();
            rsPanel.show();
        })
    });
}

var dataPanel = function ($panel) {

    var rowTemp = $('#rowTemp').html();
    var $playerArea = $panel.find('.players');

    var dataPanel = {
        show : function(){
           $panel.fadeIn(800);
        },
        hide : function(cb){
            $panel.fadeOut(200, cb);
        },
        set2Empty : function() {
            $panel.removeClass('panel-success panel-primary panel-danger panel-warning');
            $playerArea.empty();
        },
        setMode2Info : function() {
            dataPanel.set2Empty();
            $panel.find('.info').show();
            $panel.find('.error').hide();
            $panel.addClass('panel-default');
        },
        setMode2Error : function() {
            dataPanel.set2Empty();
            $panel.find('.error').show();
            $panel.find('.info').hide();
            $panel.addClass('panel-danger');
        },
        setField : function(fieldSelector, text) {
            $panel.find(fieldSelector).find('.val').text(text);
        },
        setElement : function(eleSelector, text) {
            $panel.find(eleSelector).text(text);
        },
        addPlayerPanel : function(player) {
            var $tmpRow = $(rowTemp);
            $tmpRow.find('.name').find('.val').text(player.name);

            if(player.status == 1) {
                $tmpRow.addClass('panel-success');
                $tmpRow.find('.panel-heading').text('充值成功');
            } else if (player.status == 2) {
                $tmpRow.addClass('panel-danger');
                $tmpRow.find('.panel-heading').text('充值失败');
                $tmpRow.find('.msg').removeClass('hide').find('.val').text(player.msg);
            }
            $playerArea.append($tmpRow);
        }
    };
    return dataPanel;
};

$(document).ready(function() {
    initServer(initServerNames);
    initConfProduct(initProductsList);

    rsPanel = dataPanel($('#rsPanel'));

    $('#qty, #product').change(validateQtyVal);

    $('#submit').click(function(evt){
        showConfirm({
            left : evt.pageX,
            top : evt.pageY
        });
    });

    var confirmForm = $('#confirm');
    confirmForm.delegate('.btn', 'click', function(){
        confirmForm.offset({left:0,top:0}).addClass('hide');
    }).delegate('.submit', 'click', submit);
});
