/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-10-25
 * Time: 下午3:57
 * To change this template use File | Settings | File Templates.
 */

function setVip(privilege) {
    $("#VIP").val(privilege.id);
    $("#lottery").val(privilege.lottery_free_count);
    $("#friend").val(privilege.friend_count);
    $("#buyPower").val(privilege.buy_power_count);
    $("#giveBless").val(privilege.give_bless_count);
    $("#receiveBless").val(privilege.receive_bless_count);
    $("#challenge").val(privilege.challenge_count);
    $("#spiritCollect").val(privilege.spirit_collect_count)

};

function getVip() {
    var vip = $("#VIP").val();

    return vip == '' ? 0 : parseInt(vip);
};

$(document).ready(function() {
    $("#tip").hide();
    $("#btnOK").click(function(){
        var vip = getVip();
        console.log("vip = ",vip);
        $.ajax({
            url: "/testVip?vip=" + vip,
            type: "post",
            success: function(msg) {
                console.log(msg);
                if(msg.type == 'error') {
                    setShowMsg({type: 'error',info: '更新失败'});
                }else {
                    setShowMsg({type: 'success',info: '更新成功'});
                }
                setVip(msg.privilege);
            }
        })
    })
});

//信息提示
function setShowMsg(msg) {
    // console.log(msg);
    $("#tip").show();
    if(msg.type == "success") {
        $("#tip").css("background-color","#dff0d8");
    }else{
        $("#tip").css("background-color","#f2dede");
    }
    $("#tip").html(msg.info);

    //$("#tip").hide(5000);
};