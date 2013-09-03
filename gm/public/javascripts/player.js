/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-8-30
 * Time: 上午11:25
 * To change this template use File | Settings | File Templates.
 */


var player = null;
var area = null;

function setPlayer(p,a) {
    player = p;
    area = a;
   // console.log(player);
    setPlayerData();
};

function setPlayerData() {
    $("#lv").val(player.lv);
    $("#money").val(player.money);
    $("#gold").val(player.gold);
    $("#power").val(JSON.parse(player.power).value);
    $("#skillPoint").val(player.skillPoint);
    $("#fragments").val(player.fragments);
    $("#energy").val(player.energy);
    $("#elixir").val(player.elixir);
    $("#spiritor").val(JSON.parse(player.spiritor).lv);
    $("#spiritPoolLv").val(JSON.parse(player.spiritPool).lv);
    $("#spiritPoolCount").val(JSON.parse(player.spiritPool).collectCount);
    $("#taskId").val(JSON.parse(player.task).id);
    $("#layer").val(JSON.parse(player.pass).layer);
};

$(document).ready(function(){
    $("#tip").hide();
    $("#btnUpdate").click(function(){
        updatePlayerData();
    });
    $("#btnReset").click(function(){
        setPlayerData();
    })
});

function updatePlayerData() {
   // console.log(player);
    var data = {};
    data.lv = $("#lv").val();
    data.money = $("#money").val();
    data.gold = $("#gold").val();

    var power = {
        time : Date.now(),
        value : $("#power").val()
    };

    data.power = power;

    data.skillPoint = $("#skillPoint").val();
    data.fragments = $("#fragments").val();
    data.energy = $("#energy").val();
    data.elixir = $("#elixir").val();

    var spiritor = {
        lv:$("#spiritor").val(),
        spirit:JSON.parse(player.spiritor).spirit
    };

    data.spiritor = JSON.stringify(spiritor);

    var spiritPool = {
        lv:$("#spiritPoolLv").val(),
        exp:JSON.parse(player.spiritPool).exp,
        collectCount:$("#spiritPoolCount").val()
    };

    data.spiritPool = JSON.stringify(spiritPool);


    var task = {
        id:$("#taskId").val(),
        progress:0
    };

    data.task = JSON.stringify(task);

    var pass = {
        layer:$("#layer").val(),
        mark:JSON.parse(player.pass).mark
    };

    data.pass = JSON.stringify(pass);

    data.name = player.name;
   // data.name = player.name;
   console.log(data);
    $.ajax({
        url:"/playerData?player=" + JSON.stringify(data) + "&area=" + JSON.stringify(area),
        type:"post",
        //target:$("#tip"),
        success:function(msg){
           // console.log(msg);
            setShowMsg(msg);
        }
    });
};


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


