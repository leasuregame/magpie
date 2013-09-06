/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-9-3
 * Time: 下午2:58
 * To change this template use File | Settings | File Templates.
 */

var player;
var rank;

function setData(p,r) {
    player = p;
    rank = r;
    //console.log(rank);

    init();
};

function init() {
    $("#tip").hide();
    if(!rank.ranking) {
        $("#divRank").hide();
        setShowMsg({type:"fail",info:"暂时没有该玩家的排名信息"});
    }else {
        setRankData();
    }

    $("#btnUpdate").click(function(){
        updateRankData();
    });
    $("#btnReset").click(function(){
        setRankData();
    })

}

function setRankData() {
    $("#ranking").val(rank.ranking);
};

function updateRankData() {
    var data = {};
    data.playerId = player.id;
    data.ranking = $("#ranking").val();

    console.log(data);
    $.ajax({
        url:"/rank?rank=" + JSON.stringify(data),
        type:"post",
        //target:$("#tip"),
        success:function(msg){
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

