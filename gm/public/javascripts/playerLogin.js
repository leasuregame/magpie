/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-12-2
 * Time: 下午3:24
 * To change this template use File | Settings | File Templates.
 */

$(document).ready(function () {
    //$("#tip").hide();

    initServer(function(){
        initAreasList();
    });

    $("#btnOK").click(function () {
        $("form").submit();
    });

});

function initAreasList() {
    var inner = "";
    servers.forEach(function (area) {
        inner += '<option value =' + JSON.stringify(area) + '>' + area.name + '</option>';
    });
    $("#areaList").append(inner);
};