/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-9-27
 * Time: 上午11:20
 * To change this template use File | Settings | File Templates.
 */

var pomelo = window.pomelo;
var areas;
var ALL = -1;


function setAreas(a) {
    areas = a;
    initAreasList();
};

function initAreasList() {
    var inner = "";
    inner += '<option value = "-1">所有</option>';
    areas.forEach(function (area) {
        inner += '<option value =' + area.id + '>' + area.name + '</option>';
    });
    $("#area").append(inner);
};


$(document).ready(function () {
   // initConnect(function(){});
    $("#btnOk").click(function () {
        submit();
    });
});

function submit() {
    var options = getData();
    var areaId = parseInt($("#area").val());
    var playerName = $("#playerName").val();
    var content = $("#content").val();
    var mail = {};

    mail['content'] = content;
    mail['options'] = options;

    if (areaId == ALL) {  //全部服务器
        var len = areas.length;
        var id = 0;
       // initConnect(function(){
       //     dealAll(id,mail);
      //  });
        async.whilst(
            function(){ alert(1);return id < len; },
            function(cb){
                $.when(dealAll(id,mail)).then(function(){
                        id++;
                      //  disconnect();
                        cb();
                    });


                //id++;
            },
            function(err){
                //id++;
                alert(3);
               // disconnect();
            }
        );

    } else { //指定服务器
        if (playerName == '') {
            $.when(connectServer(areaId)).then(sendMail(mail));

        } else { //指定玩家
            var url = "/playerId?name=" + playerName + "&areaId=" + areaId;
            $.ajax({
                url: url,
                type: "get",
                success: function (data) {
                    console.log(data);
                    if (data.type == 'success') {
                        mail['playerId'] = data.info;
                        $.when(connectServer(areaId)).then(sendMail(mail));
                    }
                }
            });
        }
    }

};


function dealAll(id,mail) {

    var dfd = $.Deferred();
    initConnect(function(){
        console.log(id);
        $.when(connectServer(areas[id].id)).then(sendMail(mail,function(){ dfd.resolve();}));

    });
    alert(2);
    //disconnect();
    return dfd.promise();


};

function getData() {
    var data = {};

    if ($("#gold").val() != '') {
        data['gold'] = parseInt($("#gold").val());
    }

    if ($("#money").val() != '') {
        data['money'] = parseInt($("#money").val());
    }

    if ($("#power").val() != '') {
        data['power'] = parseInt($("#power").val());
    }

    if ($("#spirit").val() != '') {
        data['spirit'] = parseInt($("#spirit").val());
    }

    if ($("#skillPoint").val() != '') {
        data['skillPoint'] = parseInt($("#skillPoint").val());
    }

    if ($("#elixir").val() != '') {
        data['elixir'] = parseInt($("#elixir").val());
    }

    return data;

};


function initConnect(cb) {
    var host = "127.0.0.1";
    var port = 3010;
    pomelo.init({
        host: host,
        port: port,
        log: true
    }, function () {
        cb()
    });
};

function connectServer(areaId) {

    var dfd = $.Deferred();

    var route = "connector.entryHandler.entryForGM";
    pomelo.request(route, {
        areaId: areaId
    }, function (data) {
        if (data.code === 200) {
            console.log(data);

            dfd.resolve();
        } else {
            console.log(data);
          //  cb(data.code);
        }
    });

   return dfd.promise();
};


function sendMail(mail,cb) {

    //var dfd = $.Deferred();
    console.log(mail);

    pomelo.request('area.messageHandler.sysMsg', mail, function (data) {
        console.log(data);
        alert("sendMail");
        cb();
    });
    //return dfd.promise();
};

function disconnect() {
    pomelo.disconnect();
    console.log("disconnect success");
};

