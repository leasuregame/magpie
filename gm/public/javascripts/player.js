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
};

$(document).ready(function(){
   $("#tip").hide();
   $("#tbnUpdate").click(function(){
       updatePlayerData();
   });
});

function updatePlayerData() {
    console.log(player);
    player.lv = $("#lv").val();
    player.money = $("#money").val();
    player.gold = $("#gold").val();

    var power = {
        time : Date.now(),
        value : $("#power").val()
    };

    player.power = power;

    player.skillPoint = $("#skillPoint").val();
    player.fragments = $("#fragments").val();
    player.energy = $("#energy").val();
    player.elixir = $("#elixir").val();

    var spiritor = {
        lv:$("#spiritor").val(),
        spirit:JSON.parse(player.spiritor).spirit
    };

    player.spiritor = JSON.stringify(spiritor);

    var spiritPool = {
        lv:$("#spiritPoolLv").val(),
        exp:JSON.parse(player.spiritPool).exp,
        collectCount:$("#spiritPoolCount").val()
    }

    player.spiritPool = JSON.stringify(spiritPool);

    $.ajax({
        url:"/playerData?player=" + JSON.stringify(player) + "&area=" + JSON.stringify(area),
        type:"post",
        //target:$("#tip"),
        success:function(msg){
            console.log(msg);
            var inner = "<p>" + msg + "</p>";
            $("#tip").append(inner);
            $("#tip").show();
        }
    });


};

