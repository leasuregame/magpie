/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-4-27
 * Time: 下午4:02
 * To change this template use File | Settings | File Templates.
 */

/*
* 卡牌数据类
* */

var Card = function() {
    this.databaseId = 0;
    this.id = 0;
    this.name = "";
    this.description = "";
    this.grade = 0;
    this.level = 0;
    this.maxLevel = 0;
    this.hp = 0;
    this.damage = 0;
    this.skillId = 0;
    this.skillName = "";
    this.skillDescription = "";

    this.skillLevel = 0;

    this.init = function(databaseId, id, level, skillLevel) {
        this.databaseId = databaseId;
        this.id = id;
        this.level = level;
        this.skillLevel = skillLevel;
    }

    this.initWithTable = function() {
        var tableRow;
        this.name = tableRow.name;
        this.grade = tableRow.grade;
        this.maxLevel = tableRow.maxLevel;
        this.hp = tableRow.hp;
        this.damage = tableRow.damage;
    }
}

Card.create = function(databaseId, id, level, skillLevel) {
    var card = new Card();
    card.init(databaseId, id, level, skillLevel);
    return card;
}