var pomelo = window.pomelo;
var ALL = -1;
var types = ['普通','系统','加急'];

function setAreas(a) {
    areas = a;
    initList();
};

function initList() {
    var inner = "";
    inner += '<option value = "-1">所有</option>';
    areas.forEach(function (area) {
        inner += '<option value =' + area.id + '>' + area.name + '</option>';
    });
    $("#area").append(inner);

    inner = "";

    for(var i = 0;i < types.length;i++) {
        inner += "<option value = " + i + ">" + types[i] + "</option>";
    }
    $("#type").append(inner);
};

$(document).ready(function () {

    $("#btnOk").click(function () {
        submit();
    });
});

function submit() {
	var areaId = parseInt($("#area").val());
	var msg = {
		msg: $("#content").val(),
		type: parseInt($("#type").val())
	}	

	if (areaId == ALL) {  //全部服务器
        var len = areas.length;
        var id = 0;

        async.whilst(
            function(){ return id < len; },
            function(cb){
                dealAll(areas[id].id,msg,function(err){
                    if(err)
                        cb(err);
                    id++;
                    cb();
                });
            },
            function(err){
               console.log("err = ",err);
            }
        );
    } else {
    	dealAll(areaId,msg,function(err){
            if(err) {
                console.log("err = ",err);
            }
        });	
    } 

};

function dealAll(id,msg,cb) {
    async.waterfall([

        function(callback){
            connect(id,function(){
                callback();
            });
        },
        function(callback){
            sendMsg(msg,function(code){
                if(code == 200) {
                    callback();
                }else {
                    cb('error');
                }
            })
        },
        function(callback){
            disconnect();
            callback();
        }
    ],function(err){
        if(err) {
            cb(err);
        }
        cb(null);
    });
};


function sendMsg(msg,cb) {

    //var dfd = $.Deferred();
    console.log(msg);

    pomelo.request('area.gmHandler.sendSysMessage', msg, function (data) {
        console.log(data);
       // alert("sendMail");
        cb(data.code);
    });
    //return dfd.promise();
};

function disconnect() {
    pomelo.disconnect();
    console.log("disconnect success");
};

