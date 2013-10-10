/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-9-1
 * Time: 下午5:46
 * To change this template use File | Settings | File Templates.
 */

var cardDao = require('./dao/mysql/cardDao');
var passiveSkillDao = require('./dao/mysql/passiveSkillDao');
var async = require('async');
var table = require('./manager/table');

function Card() {};

Card.table = "cards";

Card.update = function(data,cb){

    var card = {
        where:{
            id:data.id
        },
        data:{
            lv:data.lv,
            skillLv:data.skillLv,
            elixirHp:data.elixirHp,
            elixirAtk:data.elixirAtk,
            star:data.star,
            tableId:data.tableId
        }
    };

    var passSkills = data.passSkills;

    cardDao.update(card,function(err,isOK){
        if(err) {
            console.log(err);
            return cb(err,null);
        }else {
            passSkills.forEach(function(pss){
                if(pss.id == '' && pss.name != '' && pss.value !='') {
                    var options = {
                        data:{
                            cardId:data.id,
                            name:pss.name,
                            value:pss.value

                        }
                    }
                    passiveSkillDao.create(options,function(err,res){
                        if(err){
                            //console.log(err);
                            return cb(err,null);
                        }else {
                            console.log(res);
                        }
                    });
                }else if(pss.id != '' && pss.name == '') {
                    console.log("id = " + pss.id);
                    var options = {
                        where:{
                            cardId:data.id,
                            id:pss.id
                        }
                    };
                    passiveSkillDao.delete(options,function(err,isOK){
                        if(err){
                            //console.log(err);
                            return cb(err,null);
                        }else {
                            console.log("del = " + isOK);
                        }
                    });

                }else {
                    var options = {
                        where:{
                            id:pss.id
                        },
                        data:{
                            cardId:data.id,
                            name:pss.name,
                            value:pss.value
                        }
                    }
                    passiveSkillDao.update(options,function(err,isOK){
                        if(err){
                            //console.log(err);
                            return cb(err,null);
                        }else {
                            console.log(isOK);
                        }
                    });
                }
            });
            var name = Card.getName(data.tableId);
            return cb(null,name);
        }
    });


};


Card.create = function(card,cb){
    var time = Date.now();
    var options = {
        data:{
            lv:card.lv,
            skillLv:card.skillLv,
            elixirHp:card.elixirHp,
            elixirAtk:card.elixirAtk,
            tableId:card.tableId,
            playerId:card.playerId,
            star:card.star,
            createTime:time
        }
    };
    var passSkills = card.passSkills;

    async.waterfall([
        function(callback){
            genSkillInc(options.data);
            console.log("after genSkillInc:",options.data);
            callback();
        },
        function(callback){
            cardDao.create(options, function(err,card){
              if(err) {
                  return cb(err,null);
              }
              else callback(null,card);
            })
        },
        function(card,callback){
            var cardId = card["insertId"];
            passSkills.forEach(function(pss){
                if(!(pss.name == '' || pss.value == '')) {
                    var options = {
                        data:{
                            cardId:cardId,
                            name:pss.name,
                            value:pss.value

                        }
                    }
                    passiveSkillDao.create(options,function(err,res){
                        if(err){
                            //error = err;
                            return cb(err,null);
                        }else {
                            console.log(res);
                        }
                    });
                }

            });
            callback(null,cardId);
        },
        function(cardId,callback){
            var options = {
                where:{
                    id:cardId
                }
            };
            cardDao.getCardInfo(options,function(err,card){

                if(err) {
                    return cb(err,null);
                }else {

                    card.name = Card.getName(card.tableId);
                    console.log(card);
                    //callback(null,card);
                    callback(null,card);
                    //  res.send(card);
                }
            });

        }

    ],function(err,card){
        if(err) {
            return cb(err,null);
        }else {
            return cb(null,card);
        }
    });
};

Card.delete = function(cardId,cb){

    var options = {
        where:{
            id:cardId
        }
    };

    cardDao.delete(options,function(err,isOK){
        if(err) {
            console.log(err);
            return cb(err,false);
        }else {
            var options = {
                where:{
                    cardId:cardId
                }
            };
            passiveSkillDao.delete(options,function(err,isOK){
                if(err) {
                    console.log(err);
                    return cb(null,false);
                } else {
                    return cb(null,true);
                }
            });
        }
    });
};



Card.getName = function(tableId){
    //console.log(Card.table);
    var data = table.getTableItem(Card.table,tableId);
   // console.log(data);
    return data.name;
};

Card.setCardsName =function(cards) {
   cards.forEach(function(card){
       card.name = Card.getName(card.tableId);
   });
};


var genSkillInc = function(card) {
    var cdata, max, min, skill;
    if(card.star < 3)
        return;
    cdata = table.getTableItem('cards', card.tableId);
    skill = cdata.skill_id_linktarget;
    if (skill != null) {
        min = skill["star" + card.star + "_inc_min"] * 10;
        max = skill["star" + card.star + "_inc_max"] * 10;
        return card.skillInc = _.random(min, max) / 10;
    } else {
        throw new Error('can not file skill info of card: ' + card.tableId);
    }
};


module.exports = Card;




