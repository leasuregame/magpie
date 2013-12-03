/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-9-14
 * Time: 下午2:03
 * To change this template use File | Settings | File Templates.
 */

$(document).ready(function(){
    $("#btnOK").click(function(){
        submitLottery();
    });
    $("#btnReset").click(function(){
        $("#level").val(1);
        $("#type").val(0);
        $("#times").val('');
    });
});

function submitLottery(){
    var level = $("#level").val();
    var type = $("#type").val();
    var times = $("#times").val();
    Lottery.simulate(level,type,times,function(err,result){
        if(err)
            console.log(err);
        setResult(result);
    });
};

function setResult(result) {

    $("#result tbody tr").remove();

    var inner = "";
    for(var i = 0;i < 5;i++) {
        var level = result.level[i];
        inner += "<tr><td>" + (i + 1) + "星</td><td>" + level.num + "</td><td>" + level.rate + "</td></tr>";
    }
    inner += "<tr><td>" + "卡魂" + "</td><td>" + result.fragment.num + "</td><td>" + result.fragment.rate + "</td></tr>";

    $("#result").append(inner);

};
