/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-8-28
 * Time: 下午9:02
 * To change this template use File | Settings | File Templates.
 */



var cards = [];
var playerId;
var operate = 1;
var lastSelectId = null;

//星级对应的最大等级
var MaxLevelConfig = [
    {
        star:1,
        maxLevel:30
    },
    {
        star:2,
        maxLevel:40
    },
    {
        star:3,
        maxLevel:50
    },
    {
        star:4,
        maxLevel:55
    },
    {
        star:5,
        maxLevel:60
    }
];


var OperateConfig = {
    ADD:0,
    UPDATE:1
};

//卡牌默认属性
var CardConfig = {
    lv:1,
    skillLv:0,
    elixirHp:0,
    elixirAtk:0,
    star:1,
    tableId:1,
    name:'',
    passSkills:[]
};

function setPlayerId(id) {
    //console.log(id);
    playerId = id;
}

function setCards(data) {
    cards = data;

    init();
};

function init(){

    setCardsList();//设置卡牌列表
    setCard(cards[0].id);//设置默认显示的卡牌

    setRowCss(cards[0].id);
    $("#tip").hide();
    //eventHandle();
    $("#divCardId").hide();

    $("#divTableId").hide();

    $("#btnAddCard").click(function(){

        operate = OperateConfig.ADD;
        setCard(-1);
        setRowCss(-1);
    });

    $("#btnOK").click(function(){

        if(operate == OperateConfig.ADD) {
            if(checkTableId() == false)
                return;
            submitAdd();
        }
        else if(operate == OperateConfig.UPDATE) {
            if(checkLv() == false)
                return;
            submitUpdate();
        }
    });

    $("#btnReset").click(function(){
        setCard($("#id").val());
    });

    $("#starList").change(function(){
        var key = hasCard($("#id").val());
        var card = (key == -1) ? CardConfig : cards[key];
        var passSkills = card["passSkills"];
        setPassSkill(passSkills,$("#starList").val());
    });

}

//事件处理
function eventHandle(){
    $(document).ready(function(){

        $(".btnUpdateCard").bind("click",function(){
            operate = OperateConfig.UPDATE;
            setRowCss(this.value);
            setCard(this.value);
        });

        $(".btnDelCard").click(function(){
            submitDel(this.value);

        });
    });
}

//检查tableID
function checkTableId(){
    var val = $("#tableId").val();
    var star = $("#starList").val();
    val = val % 5;
    if(val == 0) val = 5;

    if(val != star) {
     //  if(operate == OperateConfig.ADD)
            var info =  $("#tableId").val() + "为" + val + "星卡牌";
     //   else
     //       var info =  $("#name").val() + "为" + val + "星卡牌";
        setShowMsg({type:"fail",info:info});
        return false;
    }
    return true;
};

//检查lv
function checkLv() {
    var val = $("#lv").val();
    if(val < 1) {
        var info = "卡牌最低等级为1";
        setShowMsg({type:"error",info:info});
        return false;
    }

    var star = $("#starList").val();
    if(val > MaxLevelConfig[star - 1].maxLevel) {
        $("#lv").val(MaxLevelConfig[star - 1].maxLevel);
        var info = star + "星卡牌最大等级为" + MaxLevelConfig[star - 1].maxLevel;
        setShowMsg({type:"error",info:info});
        return false;
    }

    return true;
}

//提交添加
function submitAdd() {
    var data = getData();
    var url = "/addCard?card=" + JSON.stringify(data);
    $.ajax({
        url:url,
        type:"post",
        success:function(msg){
          //  console.log(msg);
            if(msg.type == "success") {
                cards[cards.length] = msg.info;
           // updateCardsList();
                addRow(msg.info);
                setRowCss(msg.info.id);
                setShowMsg({type:msg.type,info:"添加成功"});
            }else {
                setShowMsg(msg);
            }

        }
    });
}

//提交更新
function submitUpdate(){

    var data = getData();

    //星级改变时要修改对应的配置表id
    for(var i = 0;i < cards.length;i++) {
        if(cards[i].id == data.id) {
            var tableId = cards[i].tableId;
            console.log("tableId=",tableId);
            data.tableId = (data.star - cards[i].star) + tableId;
            break;
        }
    }

    var url = "/updateCard?card=" + JSON.stringify(data);
    $.ajax({
        url:url,
        type:"post",
        success:function(msg){
           // console.log(msg);
            if(msg.type == "success") {
                for(var i = 0;i < cards.length;i++) {
                    if(cards[i].id == data.id) {
                        cards[i] = data;
                        cards[i].name = msg.info;
                       // console.log(cards[i]);
                        updateRow(cards[i]);
                        setShowMsg({type:msg.type,info:"更新成功"});
                        break;
                    }
                }
            } else {
                setShowMsg(msg);
            }

        }
    });
};

//提交删除
function submitDel(id){
    var url = "/delCard?cardId=" + id;
    $.ajax({
        url:url,
        type:"post",
        success:function(msg){
            //console.log(msg);
            var row = $("tr[id =" + id + "]");
            var index = row.index();
            if(index == 0) {
                var d = $("tr:eq(" + (index + 2) + ")").attr("id");
               // console.log(d);
            }else {
                var d = $("tr:eq(" + (index) + ")").attr("id");//.val();
                //console.log(d);
            }
            if(msg.type == "success") {
                if(operate == OperateConfig.UPDATE) {
                    console.log(d);
                    setCard(d);
                    setRowCss(d);

                //console.log(row.index());
                }
                setShowMsg(msg);
                delRow(id);

            }else {
                setShowMsg(msg);
            }
        }
    });
};

//设置卡牌表单显示
function setCard(id) {
    var key = hasCard(id);
    var card = (key == -1) ? CardConfig : cards[key];
    var passSkills = card["passSkills"];

    if(key != -1){
        $("#id").val(card.id);
    }else {
        $("#id").val("auto");
    }

    $("#lv").val(card.lv);
    $("#skillLv").val(card.skillLv);
    $("#elixirHp").val(card.elixirHp);
    $("#elixirAtk").val(card.elixirAtk);
    $("#starList").val(card.star);
    $("#tableId").val(card.tableId);
    $("#name").val(card.name);

    if(operate == OperateConfig.ADD) {
        $("#divCardName").hide();
        $("#divTableId").show();
        $("#operateName").html("添加卡牌");
    }
    else {
        $("#divCardName").show();
        $("#divTableId").hide();
        $("#operateName").html("更新卡牌");
    }
    setPassSkill(passSkills,card.star);

};

//判断数据中是否有id = cardId的卡牌
function hasCard(cardId) {

    for(var i = 0; i < cards.length;i++) {
        if(cards[i].id == cardId) {
            return i;
        }
    }
    return -1;
};

//获取表单数据
function getData() {
    var data = {
        lv:$("#lv").val(),
        skillLv:$("#skillLv").val(),
        elixirHp:$("#elixirHp").val(),
        elixirAtk:$("#elixirAtk").val(),
        star:$("#starList").val(),
        passSkills:[]

    }

    if($("#id").val() != "auto")
       data.id = $("#id").val();
    else
       data.tableId = $("#tableId").val();

    var id = 0;
    if($("#skill1Name").val() != "" || $("#skill1").val() != "") {
        data.passSkills[id++] = {
            id:$("#skill1").val(),
            name:$("#skill1Name").val(),
            value:$("#skill1Value").val()
        }
    }

    if($("#skill2Name").val() != "" || $("#skill2").val() != "") {
        data.passSkills[id++] = {
            id:$("#skill2").val(),
            name:$("#skill2Name").val(),
            value:$("#skill2Value").val()
        }
    }

    if($("#skill3Name").val() != "" || $("#skill3").val != "") {
        data.passSkills[id++] = {
            id:$("#skill3").val(),
            name:$("#skill3Name").val(),
            value:$("#skill3Value").val()
        }
    }
    data.playerId = playerId;
    return data;
};

//设置卡牌列表
function setCardsList() {
    var inner = "";
    cards.forEach(function(card){
        inner += "<tr id =" + card.id +"><td>" + card.name + "</td><td>" + card.lv + "</td><td>" + card.skillLv + "</td><td>" + card.elixirHp + "</td><td>" + card.elixirAtk + "</td><td>" + card.star + "</td>";

        for(var i = 0;i < 3;i++) {
            if(card.passSkills.length > i)
                inner += "<td>" + card.passSkills[i].name + "</td>";
            else
                inner += "<td></td>";
        }

        inner += '<td><button type="button" class="btn btn-primary btnUpdateCard" id = "btnUpdateCard" value=' + card.id + '>' + "更新" + '</button></td>';
        inner += '<td><button type="button" class="btn btn-primary btnDelCard" id = "btnDelCard" value=' + card.id +'>' + "删除" + '</button></td>';
        inner += "</tr>";
    });

    $("#cardsList").append(inner);
    eventHandle();
    setPagination();

};

//添加一行
function addRow(card){
    var inner = "";
        inner += "<tr id =" + card.id +"><td>" + card.name + "</td><td>" + card.lv + "</td><td>" + card.skillLv + "</td><td>" + card.elixirHp + "</td><td>" + card.elixirAtk + "</td><td>"  + card.star + "</td>";

        for(var i = 0;i < 3;i++) {
            if(card.passSkills.length > i)
                inner += "<td>" + card.passSkills[i].name + "</td>";
            else
                inner += "<td></td>";
        }

        inner += '<td><button type="button" class="btn btn-primary btnUpdateCard" id = "btnUpdateCard" value=' + card.id + '>' + "更新" + '</button></td>';
        inner += '<td><button type="button" class="btn btn-primary btnDelCard" id = "btnDelCard" value=' + card.id +'>' + "删除" + '</button></td>';
        inner += "</tr>";


        $("#cardsList").prepend(inner);
        eventHandle();
    setPagination();
};

//更新指定行
function updateRow(data) {

    var row = $("tr[id = "+ data.id +  "]").children();
    $("#name").val(data.name);
   // console.log(data.name);
    row.eq(0).html(data.name);
    row.eq(1).html(data.lv);
    row.eq(2).html(data.skillLv);
    row.eq(3).html(data.elixirHp);
    row.eq(4).html(data.elixirAtk)
    row.eq(5).html(data.star);

    for(var i = 0;i < 3;i++) {
        if(data.passSkills.length > i)
            row.eq(i + 6).html(data.passSkills[i].name);
    }

};

//删除指定行
function delRow(id){
    $("tr[id =" + id + "]").remove();
    setPagination();
};

//设置选中行的背景色
function setRowCss(id){
    //console.log(id);
    if(lastSelectId != null)
        $("tr[id = "+ lastSelectId +  "]").css("background-color",'#ffffff');
    $("tr[id = "+ id +  "]").css("background-color","#dff0d8");
    lastSelectId = id;
};

//设置技能下拉框显示的值
function setPassSkill(pss,star) {

    var len = pss.length;
    console.log("len=" + len + "star=" + star);
    if(len == 0 || star < 3) {
        $("#skill1").val("");
        $("#skill1Name").val("");
        $("#skill1Value").val("");

        $("#skill2").val("");
        $("#skill2Name").val("");
        $("#skill2Value").val("");

        $("#skill3").val("");
        $("#skill3Name").val("");
        $("#skill3Value").val("");
    }

    if(len > 0 && star >= 3) {

        $("#skill1").val(pss[0].id);
        $("#skill1Name").val(pss[0].name);
        $("#skill1Value").val(pss[0].value);
       // $("#skill2").val("");
        $("#skill2Name").val("");
        $("#skill2Value").val("");

       // $("#skill3").val("");
        $("#skill3Name").val("");
        $("#skill3Value").val("");


    }
    if(len > 1 && star >= 4) {

        $("#skill2").val(pss[1].id);
        $("#skill2Name").val(pss[1].name);
        $("#skill2Value").val(pss[1].value);

       // $("#skill3").val("");
        $("#skill3Name").val("");
        $("#skill3Value").val("");



    }
    if(len > 2 && star >= 5) {

        $("#skill3").val(pss[2].id);
        $("#skill3Name").val(pss[2].name);
        $("#skill3Value").val(pss[2].value);
    }

    updatePassSkill(star)

};

//更新技能下拉框是否可选
function updatePassSkill(star) {

    if(star < 3) {
        $("#skill1Name").attr("disabled",true);
        $("#skill1Value").attr("disabled",true);
        $("#skill2Name").attr("disabled",true);
        $("#skill2Value").attr("disabled",true);
        $("#skill3Name").attr("disabled",true);
        $("#skill3Value").attr("disabled",true);
    }
    else if(star == 3) {
        $("#skill3Name").attr("disabled",true);
        $("#skill3Value").attr("disabled",true);
        $("#skill2Name").attr("disabled",true);
        $("#skill2Value").attr("disabled",true);
        $("#skill1Name").attr("disabled",false);
        $("#skill1Value").attr("disabled",false);
    }
    else if(star == 4) {
        $("#skill3Name").attr("disabled",true);
        $("#skill3Value").attr("disabled",true);
        $("#skill2Name").attr("disabled",false);
        $("#skill2Value").attr("disabled",false);
        $("#skill1Name").attr("disabled",false);
        $("#skill1Value").attr("disabled",false);
    }
    else {
        $("#skill3Name").attr("disabled",false);
        $("#skill3Value").attr("disabled",false);
        $("#skill2Name").attr("disabled",false);
        $("#skill2Value").attr("disabled",false);
        $("#skill1Name").attr("disabled",false);
        $("#skill1Value").attr("disabled",false);
    }
};


//分页显示功能
function setPagination() {
    /*
    var total = $("#cardsList tbody tr").length;//总条数

    var current_items = 10;//每页显示10条
    var current_page = 1;//当前页面
    var total_page = Math.ceil(total / current_items);//总页面数
   // console.log(total_page);

    $(".current_page").val(current_page);
    $(".total").text(total_page);

    showPage(current_page);

    //下一页
    $(".next").click(function(){
        if(current_page >= total_page) {
            return false;
        }else {
            $(".current_page").text(++current_page);
            showPage(current_page);
        }

    });


    //上一页
    $(".prev").click(function(){
        if(current_page <= 1) {
            return false;
        }else {
            $(".current_page").text(--current_page);
            showPage(current_page);
        }
    });

    //首页
    $(".page_first").click(function(){
        current_page = 1;
        $(".current_page").text(current_page);
        showPage(current_page);
    });

    //末页
    $(".page_last").click(function(){
        current_page = total_page;
        $(".current_page").text(current_page);
        showPage(current_page);
    });

    //输入框
    $(".current_page").change(function(){
        var val = $(".current_page").val();
        if(val < 1 || val > total_page) {
            $(".current_page").val(current_page)
            return;
        }else {
            current_page = val;
            showPage(current_page);
        }

    });

    function showPage(page) {
        $("#cardsList tbody tr").hide();
        $.each($("#cardsList tbody tr"),function(index,item){
            var start = current_items * (current_page - 1);
            var end = current_items * current_page;
            if(index >= start && index < end || index == 0)
                $(this).show();
        });


    };
    */
    var total = $("#cardsList tbody tr").length;//总条数

    var current_items = 10;//每页显示10条
   pagination("#cardsList tbody tr",current_items,total);

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








