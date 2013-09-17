/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-9-14
 * Time: 下午5:36
 * To change this template use File | Settings | File Templates.
 */

$(document).ready(function(){
    $("#btnOK").click(function(){
        submitRequest();
    });
    $("#btnReset").click(function(){
        $("#type").val("1");
        $("#times").val('');
    });
});

var submitRequest = function() {

    var type = $("#type").val();
    var times = $("#times").val();

    var url = "/passSkillAfresh?type=" + type + "&times=" + times;
    $.ajax({
        url:url,
        type:"post",
        success:function(msg){
            if(msg.type == "success") {
                setResult(msg.info);
            }
        }
    });

};

var setResult = function(result) {

    $("#result tbody tr").remove();
    var inner = "";
    for(var i = 0;i < result.length;i++) {
        var r = result[i];
        inner += "<tr><td>" + r.value + "</td><td>" + r.num + "</td><td>" + r.rate + "</td></tr>";
    }

    $("#result").append(inner);


};