/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-9-16
 * Time: 下午3:00
 * To change this template use File | Settings | File Templates.
 */

//var areas = [];
var pomelo = window.pomelo;
var maxId = 500;


function setAreas(areas) {
    //console.log(data);
   // areas = data;
    var inner = "";
    areas.forEach(function(area){
        inner += '<option value="' + area.id + '">' + area.name + '</option>';
    });
    //console.log(inner)
    $("#areaId").append(inner);

};



$(document).ready(function(){
    $("#tip").hide();
    $("#btnOk").click(function(){
        submit();
    });
});

function submit() {
    var areaId = parseInt($("#areaId").val());
    var player = $("#player").val();
    var passNum = parseInt($("#passNum").val());
    if(areaId == '' || player == '' || passNum == '') {
        setShowMsg({type:"error",info:"信息不能为空"});
        return;
    }

    maxId = passNum;
    var url = "/explore?areaId=" + areaId + "&player=" + player;
    console.log(url);
    $.ajax({
        url:url,
        type:"post",
        success:function(msg) {
           // console.log(msg);
            if(msg.type != "success") {
                setShowMsg(msg);
            }else {
                var user = msg.info;
                submitExplore(user.account,user.password,areaId);
            }
        }
    });

};

function submitExplore(account,password,areaId) {
    login(account,password,areaId,function(err,taskId){

        if(err) {
            console.log(err);
        }
        else {
            initResult();
            explore(taskId);
        }
    });
};

var result = {};

function initResult(){
    result = {
        fight:{
            times:0,
            rate:0
        },
        box:{
            times:0,
            rate:0
        },
        none:{
            times:0,
            rate:0
        }
    };
}

function analyze(data) {

    result[data.result].times++;


};

function explore(taskId){
    console.log(taskId,maxId)
    if(taskId > maxId) {
        console.log("stop");
        return;
    }
    var route = "area.taskHandler.explore";
    pomelo.request(route,{
        taskId:taskId
    },function(data){
        if(data.code === 200) {
            console.log(data.msg);
            taskId = data.msg.task.id;
            //Explore.analyze(data.msg);
            //return cb(null,data.msg);
            explore(taskId);

        } else {
            console.log(data.msg);
            //  return cb(data.msg,null);
        }
    });
}

function login(account,password,areaId,cb) {
   // queryEntry(function(host,port){
   var host = "127.0.0.1";
   var port = 3010;
        pomelo.init({
            host:host,
            port:port,
            log:true
        },function(){
            var route = "connector.userHandler.login";
            pomelo.request(route,{
                account:account,
                password:password,
                areaId:areaId
            },function(data){
                if(data.code === 200) {
                    console.log(data);
                    return cb(null,data.msg.player.task.id);
                }else {
                    return cb(data.msg,null);
                }
            });
        });
   // });
};

/*
function queryEntry(cb) {
    var route = 'gate.gateHandler.queryEntry';
    pomelo.init({
        host: "127.0.0.1",
        port: 3009,
        log: true
    }, function() {
        pomelo.request(route,function(data) {
            pomelo.disconnect();
            if(data.code === 500) {
                //    showError(LOGIN_ERROR);
                return;
            }
         //   console.log(data);
            cb(data.host, data.port);
        });
    });
};
*/

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
};


