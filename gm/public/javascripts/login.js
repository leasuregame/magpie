/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-12-2
 * Time: 上午11:36
 * To change this template use File | Settings | File Templates.
 */


$(document).ready(function () {
    $("#tip").hide();
    $("#btnLogin").click(function () {
        $("form").submit();
        //login();
    });
});


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

    //$("#tip").hide(5000);
};
