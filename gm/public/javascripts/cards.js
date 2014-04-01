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
var lastSelectId = null;
var EMPTY = -2;
var lineUp = [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY];
var matrixOrder = ['00', '01', '02', '10', '11', '12'];

var EXP_CARD = 30000;

//星级对应的最大等级
var MaxLevelConfig = [
    {
        star: 1,
        maxLevel: 30
    },
    {
        star: 2,
        maxLevel: 40
    },
    {
        star: 3,
        maxLevel: 50
    },
    {
        star: 4,
        maxLevel: 55
    },
    {
        star: 5,
        maxLevel: 60
    },
    {
        star: 6,
        maxLevel: 65
    },
    {
        star: 7,
        maxLevel: 70
    }
];


var OperateConfig = {
    ADD: 0,
    UPDATE: 1
};

//卡牌默认属性
var CardConfig = {
    lv: 1,
    skillLv: 1,
    elixirHp: 0,
    elixirAtk: 0,
    star: 1,
    tableId: 1,
    name: '',
    passiveSkills: []
};

function setPlayer(player) {
    //console.log(id);
    playerId = player.id;
    var line = player.lineUp.split(',');
    console.log(line);
    setLineUp(line);
    setCards(player.cards);
    init();
}

//设置阵型
function setLineUp(line) {

    for (var i = 0; i < line.length; i++) {
        var l = line[i].split(':'), pos = l[0], id = l[1];
        lineUp[positionToNumber(pos)] = parseInt(id);
    }
    console.log(lineUp);
};

function numberToPosition(num) {
    return matrixOrder[num];
};

function positionToNumber(pos) {
    return matrixOrder.indexOf(pos);
};

//获取站位
function getPos(id) {
    for (var i = 0; i < lineUp.length; i++) {
        if (lineUp[i] == id) {
            return i + 1;
        }
    }
    return '';
};

function getLineUp() {
    var line = "";
    for (var i = 0; i < lineUp.length; i++) {
        if (lineUp[i] == EMPTY)
            continue;
        line += numberToPosition(i) + ":" + lineUp[i] + ",";
    }
    line = line.substring(0, line.length - 1);
    console.log(line);
    return line;
}

function setCards(data) {

    cards = data;
    //init();
};

function init() {

    $("#tip").hide();
    //eventHandle();
    $("#divCardId").hide();
    $("#divPos").hide();
    $("#divTableId").hide();

    setCardsList();//设置卡牌列表
    if (cards.length != 0) {
        operate = OperateConfig.UPDATE;
        setCard(cards[0].id);//设置默认显示的卡牌
        setRowCss(cards[0].id);
    }
    else {
        operate = OperateConfig.ADD
        setCard(-1);
    }


    $("#btnAddCard").click(function () {

        operate = OperateConfig.ADD;
        setCard(-1);
        setRowCss(-1);
    });

    $("#btnOK").click(function () {

        if (operate == OperateConfig.ADD) {
            if (checkTableId() == false)
                return;
            if (checkSkillLv() == false)
                return;
            if (checkLv() == false)
                return;
            submitAdd();
        }
        else if (operate == OperateConfig.UPDATE) {
            if (checkLv() == false)
                return;
            if (checkSkillLv() == false)
                return;
            submitUpdate();
        }
    });

    $("#btnReset").click(function () {
        setCard($("#id").val());
    });

    $("#starList").change(function () {
        var key = hasCard($("#id").val());
        var card = (key == -1) ? CardConfig : cards[key];
        var passSkills = ((key == -1)) ? [] : card["passiveSkills"];
        setPassSkill(passSkills, $("#starList").val());
    });

}

//事件处理
function eventHandle() {
    $(document).ready(function () {
        $(".btnUpdateCard").unbind("click");
        $(".btnDelCard").unbind("click")
        $(".btnUpdateCard").bind("click", function () {
            operate = OperateConfig.UPDATE;
            setRowCss(this.value);
            setCard(this.value);
        });

        $(".btnDelCard").bind("click", function () {

            submitDel(this.value);

        });
    });
}

//检查tableID
function checkTableId() {
    var val = $("#tableId").val();
    var star = $("#starList").val();
    if (val == EXP_CARD) {
        val = 1;
    } else {
        val = val % 20;
    }

    if (val == 0) val = 20;

    if (val != star) {
        //  if(operate == OperateConfig.ADD)
        var info = $("#tableId").val() + "为" + val + "星卡牌";
        //   else
        //       var info =  $("#name").val() + "为" + val + "星卡牌";
        setShowMsg({type: "fail", info: info});
        return false;
    }
    return true;
};

//检查lv
function checkLv() {
    var val = $("#lv").val();
    if (val < 1) {
        var info = "卡牌最低等级为1";
        setShowMsg({type: "error", info: info});
        return false;
    }

    var star = $("#starList").val();
    if (val > MaxLevelConfig[star - 1].maxLevel) {
        $("#lv").val(MaxLevelConfig[star - 1].maxLevel);
        var info = star + "星卡牌最大等级为" + MaxLevelConfig[star - 1].maxLevel;
        setShowMsg({type: "error", info: info});
        return false;
    }

    return true;
};

function checkSkillLv() {
    var lv = $("#skillLv").val();
    if (lv < 0 || lv > 5) {
        var msg = {
            type: "error",
            info: "技能等级0-5级"
        }
        setShowMsg(msg);
        return false;
    }

    return true;
};


//提交添加
function submitAdd() {
    var data = getData();
    var url = "/addCard?card=" + JSON.stringify(data);
    $.ajax({
        url: url,
        type: "post",
        success: function (msg) {
            console.log(msg);
            if (msg.type == "success") {
                cards[cards.length] = msg.info;
                // updateCardsList();
                addRow(msg.info);
                setRowCss(msg.info.id);
                setShowMsg({type: msg.type, info: "添加成功"});
            } else {
                setShowMsg(msg);
            }

        }
    });
}

//提交更新
function submitUpdate() {

    var data = getData();

    //星级改变时要修改对应的配置表id
    for (var i = 0; i < cards.length; i++) {
        if (cards[i].id == data.id) {
            var tableId = cards[i].tableId;
            console.log("tableId=", tableId);
            data.tableId = (data.star - cards[i].star) + tableId;
            break;
        }
    }

    //更新站位处理
    var pos = $("#pos").val();
    var id = null;
    if (pos == '') {
        var p = getPos(data.id);
        if (p != '') {
            lineUp[p - 1] = EMPTY;
        }
    } else {
        var oldPos = getPos(data.id);
        if (oldPos == '') {
            id = lineUp[pos - 1];
            lineUp[pos - 1] = data.id; //设置为当前的id
        } else { //交换两张卡牌站位
            id = lineUp[pos - 1];
            lineUp[pos - 1] = data.id;
            lineUp[oldPos - 1] = id;
        }
    }

    var url = "/updateCard?card=" + JSON.stringify(data) + '&lineUp=' + getLineUp();
    console.log('card = ', data);
    $.ajax({
        url: url,
        type: "post",
        success: function (msg) {
            console.log(msg);
            if (msg.type == "success") {
                for (var i = 0; i < cards.length; i++) {
                    if (cards[i].id == data.id) {
                        cards[i] = data;
                        cards[i].name = msg.info;
                        console.log(cards[i]);
                        updateRow(cards[i]);
                        if (id != null) {
                            $("tr[id = " + id + "]").children().eq(9).html(getPos(id));
                        }
                        setShowMsg({type: msg.type, info: "更新成功"});
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
function submitDel(id) {

    var url = "/delCard?cardId=" + id;
    $.ajax({
        url: url,
        type: "post",
        success: function (msg) {
            console.log(msg);
            var row = $("tr[id =" + id + "]");
            var index = row.index();
            if (index == 0) {
                var d = $("tr:eq(" + (index + 2) + ")").attr("id");
                // console.log(d);
            } else {
                var d = $("tr:eq(" + (index) + ")").attr("id");//.val();
                //console.log(d);
            }
            if (msg.type == "success") {
                if (operate == OperateConfig.UPDATE) {
                    console.log(d);
                    setCard(d);
                    setRowCss(d);

                    //console.log(row.index());
                }
                setShowMsg(msg);

                delRow(id);

            } else {
                setShowMsg(msg);
            }
        }
    });
};

//设置卡牌表单显示
function setCard(id) {
    var key = hasCard(id);
    var card = (key == -1) ? CardConfig : cards[key];
    var passiveSkills = (key == -1) ? [] : JSON.parse(card["passiveSkills"]);

    if (key != -1) {
        $("#id").val(card.id);
    } else {
        $("#id").val("auto");
    }

    $("#lv").val(card.lv);
    $("#skillLv").val(card.skillLv);
    $("#elixirHp").val(card.elixirHp);
    $("#elixirAtk").val(card.elixirAtk);
    $("#starList").val(card.star);
    $("#tableId").val(card.tableId);
    //站位
    var pos = getPos(id);
    $("#pos").val(pos);


    $("#name").val(card.name);

    if (operate == OperateConfig.ADD) {
        $("#divCardName").hide();
        $("#divTableId").show();
        $("#divPos").hide();
        $("#operateName").html("添加卡牌");
    }
    else {
        $("#divCardName").show();
        $("#divTableId").hide();
        $("#divPos").show();
        $("#operateName").html("更新卡牌");
    }
    setPassSkill(passiveSkills, card.star);

};

//判断数据中是否有id = cardId的卡牌
function hasCard(cardId) {

    for (var i = 0; i < cards.length; i++) {
        if (cards[i].id == cardId) {
            return i;
        }
    }
    return -1;
};

//获取表单数据
function getData() {
    var data = {
        lv: $("#lv").val(),
        skillLv: $("#skillLv").val(),
        elixirHp: $("#elixirHp").val(),
        elixirAtk: $("#elixirAtk").val(),
        star: $("#starList").val(),
        passiveSkills: []

    }

    if ($("#id").val() != "auto")
        data.id = $("#id").val();
    else
        data.tableId = $("#tableId").val();

    var id = 0;
    if ($("#skill1Name").val() != "" && $("#skill1Value").val() != "") {
        data.passiveSkills[id++] = {
            id: 0,
            name: $("#skill1Name").val(),
            value: parseFloat($("#skill1Value").val())
        }
    }

    if ($("#skill2Name").val() != "" && $("#skill2Value").val() != "") {
        data.passiveSkills[id++] = {
            id: 1,
            name: $("#skill2Name").val(),
            value: parseFloat($("#skill2Value").val())
        }
    }

    if ($("#skill3Name").val() != "" && $("#skill3Value").val() != "") {
        data.passiveSkills[id++] = {
            id: 2,
            name: $("#skill3Name").val(),
            value: parseFloat($("#skill3Value").val())
        }
    }
    data.playerId = playerId;
    return data;
};

//设置卡牌列表
function setCardsList() {
    var inner = "";
    cards.forEach(function (card) {
        inner += "<tr id =" + card.id + "><td>" + card.name + "</td><td>" + card.lv + "</td><td>" + card.skillLv + "</td><td>" + card.elixirHp + "</td><td>" + card.elixirAtk + "</td><td>" + card.star + "</td>";
        var pss = JSON.parse(card.passiveSkills);
        // console.log(pss);
        for (var i = 0; i < 3; i++) {
            if (pss.length > i) {
                var ps = pss[i];
                inner += "<td>" + ps.name + "</td>";
            }
            else
                inner += "<td></td>";
        }

        inner += '<td>' + getPos(card.id) + '</td>';

        inner += '<td><button type="button" class="btn btn-primary btnUpdateCard" id = "btnUpdateCard" value=' + card.id + '>' + "更新" + '</button></td>';
        inner += '<td><button type="button" class="btn btn-primary btnDelCard" id = "btnDelCard" value=' + card.id + '>' + "删除" + '</button></td>';
        inner += "</tr>";
    });

    $("#cardsList").append(inner);
    eventHandle();
    setPagination();

};

//添加一行
function addRow(card) {
    var inner = "";
    inner += "<tr id =" + card.id + "><td>" + card.name + "</td><td>" + card.lv + "</td><td>" + card.skillLv + "</td><td>" + card.elixirHp + "</td><td>" + card.elixirAtk + "</td><td>" + card.star + "</td>";

    var pss = JSON.parse(card.passiveSkills);
    // console.log(pss);
    for (var i = 0; i < 3; i++) {
        if (pss.length > i) {
            var ps = pss[i];
            inner += "<td>" + ps.name + "</td>";
        }
        else
            inner += "<td></td>";
    }

    inner += "<td></td>";

    inner += '<td><button type="button" class="btn btn-primary btnUpdateCard" id = "btnUpdateCard" value=' + card.id + '>' + "更新" + '</button></td>';
    inner += '<td><button type="button" class="btn btn-primary btnDelCard" id = "btnDelCard" value=' + card.id + '>' + "删除" + '</button></td>';
    inner += "</tr>";


    $("#cardsList").append(inner);
    eventHandle();
    updatePagination(1);
};

//更新指定行
function updateRow(data) {

    var row = $("tr[id = " + data.id + "]").children();

    row.eq(0).html(data.name);
    row.eq(1).html(data.lv);
    row.eq(2).html(data.skillLv);
    row.eq(3).html(data.elixirHp);
    row.eq(4).html(data.elixirAtk)
    row.eq(5).html(data.star);

    var pss = data.passiveSkills;

    for (var i = 0; i < 3; i++) {
        if (pss.length > i)
            row.eq(i + 6).html(pss[i].name);
    }

    row.eq(9).html(getPos(data.id));


};

//删除指定行
function delRow(id) {
    $("tr[id =" + id + "]").remove();
    console.log("id = ", id);
    updatePagination(-1);
};

//设置选中行的背景色
function setRowCss(id) {
    //console.log(id);
    if (lastSelectId != null)
        $("tr[id = " + lastSelectId + "]").css("background-color", '#ffffff');
    $("tr[id = " + id + "]").css("background-color", "#dff0d8");
    lastSelectId = id;
};

//设置技能下拉框显示的值
function setPassSkill(pss, star) {

    var len = pss.length;
    console.log("len=" + len + "star=" + star);
    if (len == 0 || star < 3) {
        // $("#skill1").val("");
        $("#skill1Name").val("");
        $("#skill1Value").val("");

        // $("#skill2").val("");
        $("#skill2Name").val("");
        $("#skill2Value").val("");

        // $("#skill3").val("");
        $("#skill3Name").val("");
        $("#skill3Value").val("");
    }

    if (len > 0 && star >= 3) {

        //  $("#skill1").val(pss[0].id);
        $("#skill1Name").val(pss[0].name);
        $("#skill1Value").val(pss[0].value);
        // $("#skill2").val("");
        $("#skill2Name").val("");
        $("#skill2Value").val("");

        // $("#skill3").val("");
        $("#skill3Name").val("");
        $("#skill3Value").val("");


    }
    if (len > 1 && star >= 4) {

        // $("#skill2").val(pss[1].id);
        $("#skill2Name").val(pss[1].name);
        $("#skill2Value").val(pss[1].value);

        // $("#skill3").val("");
        $("#skill3Name").val("");
        $("#skill3Value").val("");


    }
    if (len > 2 && star >= 5) {

        //$("#skill3").val(pss[2].id);
        $("#skill3Name").val(pss[2].name);
        $("#skill3Value").val(pss[2].value);
    }

    updatePassSkill(star)

};

//更新技能下拉框是否可选
function updatePassSkill(star) {

    if (star < 3) {
        $("#skill1Name").attr("disabled", true);
        $("#skill1Value").attr("disabled", true);
        $("#skill2Name").attr("disabled", true);
        $("#skill2Value").attr("disabled", true);
        $("#skill3Name").attr("disabled", true);
        $("#skill3Value").attr("disabled", true);
    }
    else if (star == 3) {
        $("#skill3Name").attr("disabled", true);
        $("#skill3Value").attr("disabled", true);
        $("#skill2Name").attr("disabled", true);
        $("#skill2Value").attr("disabled", true);
        $("#skill1Name").attr("disabled", false);
        $("#skill1Value").attr("disabled", false);
    }
    else if (star == 4) {
        $("#skill3Name").attr("disabled", true);
        $("#skill3Value").attr("disabled", true);
        $("#skill2Name").attr("disabled", false);
        $("#skill2Value").attr("disabled", false);
        $("#skill1Name").attr("disabled", false);
        $("#skill1Value").attr("disabled", false);
    }
    else {
        $("#skill3Name").attr("disabled", false);
        $("#skill3Value").attr("disabled", false);
        $("#skill2Name").attr("disabled", false);
        $("#skill2Value").attr("disabled", false);
        $("#skill1Name").attr("disabled", false);
        $("#skill1Value").attr("disabled", false);
    }
};


//分页显示功能
function setPagination() {

    var total = $("#cardsList tbody tr").length;//总条数

    var current_items = 15;//每页显示15条
    //pagination("#cardsList tbody tr",current_items,total);
    Pagination.init("#cardsList tbody tr", current_items, total);
};

function updatePagination(val) {
    Pagination.update(val);
};


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








