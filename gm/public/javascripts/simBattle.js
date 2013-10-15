/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-9-10
 * Time: 下午6:56
 * To change this template use File | Settings | File Templates.
 */

$(document).ready(function () {
    for(var i = 0;i < 6;i++)
        $("#attackCards").append(setInnerHtml(i));
    for(var i = 6;i < 12;i++)
        $("#defendCards").append(setInnerHtml(i));
    $("#btnBattle").click(function(){
       // $("#tip").html("战报：正在模拟中，请稍等……");
        submitBattle();
    });

  //  $("table td").css("height","32px");

});

function setInnerHtml(id) {
    var inner = "<tr><td>" + (id % 6 + 1) + "</td>";
    inner += '<td><input type="text" class="input-mmini" id="cardLv' + id + '"></td>'
        +'<td><input type="text" class="input-mmini" id="skillLv' + id + '"></td>'
        + '<td><input type="text" class="input-mmini" id="tableId' + id + '"></td>'
        + '<td>' + setSelectList("1" + id) + '</td>'
        + '<td><input type="text" class="input-mmini" id="skillValue1' + id + '"></td>'
        + '<td>' + setSelectList("2" + id) + '</td>'
        + '<td><input type="text" class="input-mmini" id="skillValue2' + id + '"></td>'
        + '<td>' + setSelectList("3" + id) + '</td>'
        + '<td><input type="text" class="input-mmini" id="skillValue3' + id + '"></td>'


    inner += "</tr>";
    return inner;
};

function setSelectList(id) {
    var inner = "";
    inner = '<select id="skillName' + id + '"class="form-control input-mini">' +
        '<option value = ""></option>' +
        '<option value = "hp_improve">血量</option>'+
        '<option value = "atk_improve">攻击</option>'+
        '<option value = "dodge">闪避</option>'+
        '<option value = "crit">暴击</option>'+
        '<option value = "dmg_reduce">减伤</option>'+
    '</select>'
    return inner;
}

function submitBattle() {

    var attack = {};
    var defend = {};
    attack.id = 0;
    attack.name = "attack";
    attack.lv = 1;
    attack.lineUp = '';
    attack.spiritor = {
        lv: parseInt($("#attackSpiritorLv").val()) || 0,
        spirit: 0
    };

    defend.id = 1;
    defend.name = "defend";
    defend.lv = 1;
    defend.lineUp = '';
    defend.spiritor = {
        lv: parseInt($("#defendSpiritorLv").val()) || 0,
        spirit: 0
    };

    var cards = [];
    var spirit = false;
    for(var i = 0;i < 6;i++) {
        var card = getCard(i);
        if(card == null) {
            if(!spirit) {
                attack.lineUp += '' + (i < 3 ? 0 : 1) + i % 3 +':-1' + ',';
                spirit = true;
            }
            continue;
        }
        cards.push(card);
        attack.lineUp += '' + (i < 3 ? 0 : 1) + i % 3 +':' + i + ',';
    }
    attack.lineUp = attack.lineUp.substring(0,attack.lineUp.length - 1);
    attack.cards = cards;

    cards = [];
    spirit = false;
    for(var i = 6;i < 12;i++) {
        var card = getCard(i);
        if(card == null) {
            if(!spirit) {
                defend.lineUp += '' + (i < 3 ? 0 : 1) + i % 3 +':-1' + ',';
                spirit = true;
            }
            continue;
        }
        cards.push(card);
        var ii = i - 6;
        defend.lineUp += '' + (ii < 3 ? 0 : 1) + ii % 3 +':' + i + ',';
    }
    defend.lineUp = defend.lineUp.substring(0,defend.lineUp.length - 1);
    defend.cards = cards;

    console.log(attack);
    console.log(defend);

    var times = parseInt($("#times").val());
    Battle.startBattle(attack,defend,times,function(err,report){
        if(err) {
            console.log(err);
        }
        console.log('report = ',report);
        setReport(report);
    });
};


function getCard(id){
    var lv = $("#cardLv" + id).val();
    var skillLv = $("#skillLv" + id).val();
    var tableId = $("#tableId" + id).val();
    var skillName1 = $("#skillName1" + id).val();
    var skillValue1 = $("#skillValue1" + id).val();
    var skillName2 = $("#skillName2" + id).val();
    var skillValue2 = $("#skillValue2" + id).val();
    var skillName3 = $("#skillName3" + id).val();
    var skillValue3 = $("#skillValue3" + id).val();

    if(lv == '' || skillLv == '' || tableId == '') {
        return null;
    }

    var star = 5;
    if(tableId % 5 != 0)
        star = tableId % 5;

    var card = {
        id:id,
        lv:parseInt(lv),
        skillLv:parseInt(skillLv),
        tableId:parseInt(tableId),
        star:star
    };

    var passiveSkills = [];
    if(skillName1 != '' && passiveSkills.length < star - 2) {
        passiveSkills.push({
            id:id * 10 + 1,
            cardId:id,
            name:skillName1,
            value:parseInt(skillValue1)
        });
    }
    if(skillName2!= '' && passiveSkills.length < star - 2) {
        passiveSkills.push({
            id:id * 10 + 2,
            cardId:id,
            name:skillName2,
            value:parseInt(skillValue2)
        });
    }
    if(skillName3 != '' && passiveSkills.length < star - 2) {
        passiveSkills.push({
            id:id * 10 + 3,
            cardId:id,
            name:skillName3,
            value:parseInt(skillValue3)
        });
    }

    card.passiveSkills = passiveSkills;
    return card;
};

function setReport(report) {
    $("#attackWin").val(report.attack.win);
    $("#attackRate").val(report.attack.rate);

    $("#defendWin").val(report.defend.win);
    $("#defendRate").val(report.defend.rate);

    $("#aveRound").val(report.ave_round);

    $("#attackReport tbody tr").remove();
    $("#defendReport tbody tr").remove();
    var inner = "";
    for(var i = 1;i <= 6;i++) {
        var card = report.attack.cards[i];
       // if(isNaN(card.crit_rate))
        //    continue;
        if(card.hit == 0 && card.hurt == 0)
            inner += "<tr><td>" + (i) + "</td><td>" + "</td><td>" + "</td><td>" +"</td><td>" + "</td><td>" +"</td><td>" +  "</td><tr>";
        else
            inner += "<tr><td>" + (i)+ "</td><td>" + card.crit + "</td><td>" + card.crit_rate+ "</td><td>" + card.dodge + "</td><td>" + card.dodge_rate + "</td><td>" + card.skill + "</td><td>" + card.skill_rate + "</td><tr>";
    }

    $("#attackReport").append(inner);

    var inner = "";
    for(var i = 1;i <= 6;i++) {
        var card = report.defend.cards[i];
      //  if(isNaN(card.crit_rate))
         //   continue;
        if(card.hit == 0 && card.hurt == 0)
            inner += "<tr><td>" + (i) + "</td><td>" + "</td><td>" + "</td><td>" +"</td><td>" + "</td><td>" +"</td><td>" +  "</td><tr>";
        else
            inner += "<tr><td>" + (i)+ "</td><td>" + card.crit + "</td><td>" + card.crit_rate+ "</td><td>" + card.dodge + "</td><td>" + card.dodge_rate + "</td><td>" + card.skill + "</td><td>" + card.skill_rate + "</td><tr>";

    }

    $("#defendReport").append(inner);

};

function clone(obj) {
    var newObj = (obj instanceof Array) ? [] : {};
    for (var key in obj) {
        var copy = obj[key];
        if (copy instanceof Array) {
            newObj[key] = Battle.clone(copy);
        } else if (((typeof copy) == "object")) {
            newObj[key] = Battle.clone(copy);
        } else {
            newObj[key] = copy;
        }
    }
    return newObj;
};




