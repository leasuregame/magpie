/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-8-28
 * Time: 下午9:02
 * To change this template use File | Settings | File Templates.
 */

//var dao = require('../../models/dao/mysql/cardDao');


var cards = [];

function setCards(data) {
    //console.log(data);
    cards = data;

    setCardsList();

    $("#id").val(cards[0].id);
    setCard(0);
    updateButton(0);

    $("#id").change(function(){
        var id = hasCard($("#id").val()); //-1代表没有
        setCard(id);
        updateButton(id);
    });

   // $("#cardShow").hide();
};

var Cardconfig = {
    lv:0,
    skill:0,
    elixir:0,
    star:1,
    passSkills:[]
};


//设置卡牌显示
function setCard(key) {
    var card = (key == -1) ? Cardconfig:cards[key];
    var passSkill = card["passSkills"];

    if(key != -1)
        $("#id").val(card.id);
    $("#lv").val(card.lv);
    $("#skillLv").val(card.skillLv);
    $("#elixir").val(card.elixir);
    $("#starList").val(card.star);
    $("#starList").change(function(){
        updatePassSkill($("#starList").val());
    });

    setPassSkill(passSkill,card.star);
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

    if(len == 0) {
        $("#passSkill1").val("null");
        $("#passSkill11").val("");
        $("#passSkill2").val("null");
        $("#passSkill12").val("");
        $("#passSkill3").val("null");
        $("#passSkill13").val("");
    }

    if(len > 0) {
        //console.log(pss[0].name);
        $("#passSkill1").val(pss[0].name);
        $("#passSkill11").val(pss[0].value);
    }
    if(len > 1) {
        $("#passSkill2").val(pss[1].name);
        $("#passSkill12").val(pss[1].value);
    }
    if(len > 2) {
        $("#passSkill3").val(pss[2].name);
        $("#passSkill13").val(pss[2].value);
    }

    updatePassSkill(star)

};

//更新技能下拉框是否可选
function updatePassSkill(star) {

   // console.log(star);

    if(star < 3) {
        $("#passSkill3").attr("disabled",true);
        $("#passSkill13").attr("disabled",true);
        $("#passSkill2").attr("disabled",true);
        $("#passSkill12").attr("disabled",true);
        $("#passSkill1").attr("disabled",true);
        $("#passSkill11").attr("disabled",true);
    }
    else if(star == 3) {
        $("#passSkill3").attr("disabled",true);
        $("#passSkill13").attr("disabled",true);
        $("#passSkill2").attr("disabled",true);
        $("#passSkill12").attr("disabled",true);
        $("#passSkill1").attr("disabled",false);
        $("#passSkill11").attr("disabled",false);
    }
    else if(star == 4) {
        $("#passSkill3").attr("disabled",true);
        $("#passSkill13").attr("disabled",true);
        $("#passSkill2").attr("disabled",false);
        $("#passSkill12").attr("disabled",false);
        $("#passSkill1").attr("disabled",false);
        $("#passSkill11").attr("disabled",false);
    }
    else {
        $("#passSkill3").attr("disabled",false);
        $("#passSkill13").attr("disabled",false);
        $("#passSkill2").attr("disabled",false);
        $("#passSkill12").attr("disabled",false);
        $("#passSkill1").attr("disabled",false);
        $("#passSkill11").attr("disabled",false);
    }
};

//更新按钮显示隐藏
function updateButton(key){

    //console.log(key);

    if(key == -1) {
       // $("#btnAddCard").show();
        $("#btnUpdateCard").hide();
        $("#btnDelCard").hide();
    }else {
      //  $("#btnAddCard").hide();
        $("#btnUpdateCard").show();
        $("#btnDelCard").show();
    }

};


//设置卡牌列表
function setCardsList() {
    var inner = "<ul> ";
    cards.forEach(function(card){
        inner += "<li value= " + card.id + "><a>" + card.id + "</a></li>";
    });
    inner += "</ul>";
    // console.log(cards.length);
    console.log(inner);
    $("#cardsList").append(inner);
    $.each($("#cardsList ul li"),function(index,item){
        $(this).click(function(){
            var cardId = item.value;
            //console.log(cardId);
            var id = hasCard(cardId)
            setCard(id);
        });
    });

    setPagination();
};

//分页显示功能
function setPagination() {

    var total = $("#cardsList ul li").length;//总条数

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
        $("#cardsList ul li").hide();
        $.each($("#cardsList ul li"),function(index,item){
            var start = current_items * (current_page - 1);
            var end = current_items * current_page;
            if(index >= start && index < end)
                $(this).show();

        });
    };




}








