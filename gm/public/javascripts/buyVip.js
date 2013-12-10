/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-10-8
 * Time: 上午11:54
 * To change this template use File | Settings | File Templates.
 */

var pomelo = window.pomelo;
var playerId = null;
var areaId = null;
var user;
var recharge = null;

$(document).ready(function(){
    $("#tip").hide();
    insertType();
    $("#btnOK").click(function(){
        submit();
    });
});

function setData(u,p,r){
    //console.log(u,p);
    user = u;
    playerId = parseInt(p.id);
    areaId = parseInt(p.areaId);
    console.log(r);
    recharge = r;
    $("#VIP").val(p.vip);
};

function insertType(){

   // console.log(type);
    var keys = _.keys(recharge);
    var values = _.values(recharge);
    var inner = "";
    for(var i = 0;i < keys.length;i++) {
        inner += "<option value='" + keys[i] + "'>" + values[i].cash + "</option>";
    }

    $("#buyType").append(inner);

};

function submit() {
    var id = $("#buyType").val();
    login(user.account, user.password, areaId,function(err){
        if(err) {
            console.log("err = ",err);
        } else {
            var route = "area.vipHandler.buyVip";
            console.log("id = ",id);
            pomelo.request(route,{id:id},function(data){
                console.log(data);
                var vip = data.msg.vip;
                $("#VIP").val(vip);
                if(data.code == 200) {
                    setShowMsg({type:"success",info:"充值成功"});
                }else {
                    setShowMsg({type:"error",info:"充值失败"});
                }
            });
        }
    });
}

function login(account, password, areaId, cb) {


    initConnect(function(){
        var route = "connector.userHandler.login";
        pomelo.request(route, {
            account: account,
            password: password,
            areaId: areaId
        }, function (data) {
            if (data.code === 200) {
                console.log(data);
                return cb(null);
            } else {
                return cb(data.msg);
            }
        });
    });


};

//信息提示
function setShowMsg(msg) {
    // console.log(msg);
    $("#tip").show();
    if (msg.type == "success") {
        $("#tip").css("background-color", "#dff0d8");
    } else {
        $("#tip").css("background-color", "#f2dede");
    }
    $("#tip").html(msg.info);
};



