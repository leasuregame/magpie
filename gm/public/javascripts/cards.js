/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-8-28
 * Time: 下午9:02
 * To change this template use File | Settings | File Templates.
 */



var cards = [];
var playerId;
var operate;

var OperateConfig = {
    ADD:0,
    UPDATE:1

};

var Cardconfig = {
    lv:0,
    skill:0,
    elixir:0,
    star:1,
    passSkills:[]
};

function setPlayerId(id) {
    console.log(id);
    playerId = id;
}

function setCards(data) {
    cards = data;
    setCardsList();//设置卡牌列表
};

$(document).ready(function(){

    setCard(cards[0].id);//设置默认显示的卡牌

    $("#btnAddCard").click(function(){
        operate = OperateConfig.ADD;
        setCard(-1);
    });

    $(".btnUpdateCard").click(function(){
        operate = OperateConfig.UPDATE;
        setCard(this.value);
    });

    $(".btnDelCard").click(function(){
        submitDel(this.value);
        delRow(this.value);
    });

    $("#btnOK").click(function(){
        if(operate == OperateConfig.ADD)
            submitAdd();
        else if(operate == OperateConfig.UPDATE)
            submitUpdate();
    });

    $("#btnReset").click(function(){
        setCard($("#id").val());
    });

});

function submitAdd() {
    var data = getData();
    var url = "/addCard?card=" + JSON.stringify(data);
    $.ajax({
        url:url,
        type:"post",
        success:function(msg){
            console.log(msg);
            for(var i = 0;i < cards.length;i++) {
                if(cards[i].id == data.id) {
                    cards[i] = data;
                }
            }
            updateCardsList();
        }
    });
}

//提交更新
function submitUpdate(){

   // console.log(data);
    var data = getData();
    console.log(data);
    var url = "/cardData?card=" + JSON.stringify(data);
    $.ajax({
        url:url,
        type:"post",
        success:function(msg){
            console.log(msg);
            for(var i = 0;i < cards.length;i++) {
                if(cards[i].id == data.id) {
                    cards[i] = data;
                }
            }
            updateCardsList();
        }
    });
};

function submitDel(id){
    var url = "/delCard?cardId=" + id;
    $.ajax({
        url:url,
        type:"post",
        success:function(msg){
            console.log(msg);
           /* for(var i = 0;i < cards.length;i++) {
                if(cards[i].id == data.id) {
                    cards[i] = data;
                }
            }*/
          //  updateCardsList();
        }
    });
};

function getData() {
    var data = {
        lv:$("#lv").val(),
        skillLv:$("#skillLv").val(),
        elixir:$("#elixir").val(),
        star:$("#starList").val(),
        passSkills:[]

    }

    if($("#id").val() != "auto")
       data.id = $("#id").val();

    var id = 0;
    if($("#skill1Name").val() != "") {
        data.passSkills[id++] = {
            id:$("#skill1").val(),
            name:$("#skill1Name").val(),
            value:$("#skill1Value").val()
        }
    }

    if($("#skill2Name").val() != "") {
        data.passSkills[id++] = {
            id:$("#skill2").val(),
            name:$("#skill2Name").val(),
            value:$("#skill2Value").val()
        }
    }

    if($("#skill3Name").val() != "") {
        data.passSkills[id++] = {
            id:$("#skill3").val(),
            name:$("#skill3Name").val(),
            value:$("#skill3Value").val()
        }
    }
    return data;
};

//设置卡牌列表
function setCardsList() {
    var inner = "";
    cards.forEach(function(card){
        inner += "<tr id =" + card.id +"><td>" + card.id + "</td><td>" + card.lv + "</td><td>" + card.skillLv + "</td><td>" + card.elixir + "</td><td>" + card.star + "</td>";

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
    setPagination();

};

//更新表格
function updateCardsList(){
    delCardsList();
    setCardsList();
};

//删除表格
function delCardsList(){
    $("tr[id !='th']").remove();
};

function delRow(id){
    $("tr[id =" + id + "]").remove();
};

//设置卡牌显示
function setCard(id) {
    var key = hasCard(id);
    var card = (key == -1) ? Cardconfig:cards[key];
    var passSkill = card["passSkills"];

    if(key != -1){
        $("#id").val(card.id);
        //$("#id").show();
    }else {
        $("#id").val("auto");
    }

    $("#lv").val(card.lv);
    $("#skillLv").val(card.skillLv);
    $("#elixir").val(card.elixir);
    $("#starList").val(card.star);

    $("#starList").change(function(){
        setPassSkill(passSkill,$("#starList").val());
    });

    $('#skill1Name').change(function(){
        var val = $('#skill1Name').val;
        $('#skill2Name option[value = ' + "val" +'] ').attr("disabled",true);
    });

    setPassSkill(passSkill,card.star);
   // $("#cardShow").show();

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


//设置技能下拉框显示的值
function setPassSkill(pss,star) {

    var len = pss.length;

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
        $("#skill2").val("");
        $("#skill2Name").val("");
        $("#skill2Value").val("");

        $("#skill3").val("");
        $("#skill3Name").val("");
        $("#skill3Value").val("");


    }
    if(len > 1 && star >= 4) {

        $("#skill2").val(pss[1].id);
        $("#skill2Name").val(pss[1].name);
        $("#skill2Value").val(pss[1].value);

        $("#skill3").val("");
        $("#skill3Name").val("");
        $("#skill3Value").val("");



    }
    if(len > 2 && star >= 5) {

        $("#skill3").val(pss[2].id);
        $("#skill3Name").val(pss[2].name);
        $("#skill3Value").val(pss[2].value);
    }

   // console.log($("#skill1").val());
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

    var total = $("#cardsList tr").length;//总条数

    var current_items = 10;//每页显示10条
    var current_page = 1;//当前页面
    var total_page = Math.ceil(total / current_items);//总页面数
   // console.log(total_page);

    $(".current_page").text(current_page);
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

    function showPage(page) {
        $("#cardsList tr").hide();
        $.each($("#cardsList tr"),function(index,item){
            var start = current_items * (current_page - 1);
            var end = current_items * current_page;
            if(index >= start && index < end || index == 0)
                $(this).show();
        });


    };

};








