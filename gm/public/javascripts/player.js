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
    $("#vip").val(player.vip);
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
    data.vip = parseInt($("#vip").val());
    data.lv = parseInt($("#lv").val());
    data.money = parseInt($("#money").val());
    data.gold = parseInt($("#gold").val());

    var power = {
        time : Date.now(),
        value : parseInt($("#power").val())
    };

    data.power = power;

    data.skillPoint = parseInt($("#skillPoint").val());
    data.fragments = parseInt($("#fragments").val());
    data.energy = parseInt($("#energy").val());
    data.elixir = parseInt($("#elixir").val());

    var spiritor = {
        lv:parseInt($("#spiritor").val()),
        spirit:JSON.parse(player.spiritor).spirit
    };

    data.spiritor = JSON.stringify(spiritor);

    var spiritPool = {
        lv:parseInt($("#spiritPoolLv").val()),
        exp:JSON.parse(player.spiritPool).exp,
        collectCount:parseInt($("#spiritPoolCount").val())
    };

    data.spiritPool = JSON.stringify(spiritPool);


    var task = {
        id:parseInt($("#taskId").val()),
        progress:0
        //hasWin:false

    };
    data.task = JSON.stringify(task);
    var mark = JSON.parse(player.pass).mark;
  //  console.log(mark);
    var layer = parseInt($("#layer").val());

    var pass = {
        layer:layer,
        mark:[]
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


