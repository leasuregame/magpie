/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-9-10
 * Time: 下午6:56
 * To change this template use File | Settings | File Templates.
 */

$(document).ready(function () {
    for(var i = 0;i < 5;i++)
        $("#attackCards").append(setInnerHtml(i));
    for(var i = 5;i < 10;i++)
        $("#defendCards").append(setInnerHtml(i));
    $("#btnBattle").click(function(){
        submitBattle();
    });

});

function setInnerHtml(id) {
    var inner = "<tr><td>" + (id % 5 + 1) + "</td>";
    inner += '<td><input type="text" class="input-mmini" id="skillLv' + id + '"></td>'
        + '<td><input type="text" class="input-mmini" id="tableId' + id + '"></td>'
        + '<td><input type="text" class="input-mmini" id="hp_improve' + id + '"></td>'
        + '<td><input type="text" class="input-mmini" id="atk_improve' + id + '"></td>'
        + '<td><input type="text" class="input-mmini" id="dodge' + id + '"></td>'
        + '<td><input type="text" class="input-mmini" id="crit' + id + '"></td>'
        + '<td><input type="text" class="input-mmini" id="dmg_reduce' + id + '"></td>'

    inner += "</tr>";
    return inner;
};

function submitBattle() {
    var attack = {};
    var defend = {};
    attack.id = 0;
    attack.name = "attack";

    defend.id = 1;
    defend.name = "defend";

    var cards = [];
    for(var i = 0;i < 5;i++) {
        var card = getCard(i);
        if(card == {})
            continue;
        cards.push(card);
    }

    attack.cards = cards;

    cards = [];
    for(var i = 5;i < 10;i++) {
        var card = getCard(i);
        if(card == {})
            continue;
        cards.push(card);
    }

    defend.cards = cards;

    console.log(attack);
    console.log(defend);

    var url = "/simBattle?attack=" + JSON.stringify(attack) + "&defend=" + JSON.stringify(defend);
   // console.log(url);
    $.ajax({
        url:url,
        type:"post",
        success:function(msg) {
            console.log(msg);
        }
    });
};

function getCard(id){
    var skillLv = $("#skillLv" + id).val();
    var tableId = $("#tableId" + id).val();
    var hp_improve = $("#hp_improve" + id).val();
    var atk_improve = $("#atk_improve" + id).val();
    var dodge = $("#dodge" + id).val();
    var crit = $("#crit" + id).val();
    var dmg_reduce = $("#dmg_reduce" + id).val();

    var star = 5;
    if(tableId % 5 != 0)
        star = tableId % 5;

    var card = {
        id:id,
        skillLv:parseInt(skillLv),
        tableId:parseInt(tableId),
        star:star
    };

    var passiveSkills = [];
    if(hp_improve != '' && passiveSkills.length < star - 2) {
        passiveSkills.push({
            id:id * 10 + 1,
            cardId:id,
            name:"hp_improve",
            value:parseInt(hp_improve)
        });
    }
    if(atk_improve != '' && passiveSkills.length < star - 2) {
        passiveSkills.push({
            id:id * 10 + 2,
            cardId:id,
            name:"atk_improve",
            value:parseInt(atk_improve)
        });
    }
    if(dodge != '' && passiveSkills.length < star - 2) {
        passiveSkills.push({
            id:id * 10 + 3,
            cardId:id,
            name:"atk_improve",
            value:parseInt(atk_improve)
        });
    }
    if(crit != '' && passiveSkills.length < star - 2) {
        passiveSkills.push({
            id:id * 10 + 3,
            cardId:id,
            name:"crit",
            value:parseInt(crit)
        });
    }
    if(dmg_reduce != '' && passiveSkills.length < star - 2) {
        passiveSkills.push({
            id:id * 10 + 3,
            cardId:id,
            name:"dmg_reduce",
            value:parseInt(dmg_reduce)
        });
    }

    card.passiveSkills = passiveSkills;
    return card;
};

