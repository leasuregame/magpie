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
function Card() {};

Card.update = function(data,cb){

    var card = {
        where:{
            id:data.id
        },
        data:{
            lv:data.lv,
            skillLv:data.skillLv,
            elixir:data.elixir,
            star:data.star,
            tableId:data.tableId
        }
    };

    var passSkills = data.passSkills;

    cardDao.update(card,function(err,isOK){
        if(err) {
            console.log(err);
            return cb(err,false);
        }else {
            passSkills.forEach(function(pss){
                if(pss.id == '' && pss.name != '' && pss.value !='') {
                    var options = {
                        data:{
                            cardId:data.id,
                            name:pss.name,
                            value:pss.value,
                            createTime:Date.now()
                        }
                    }
                    passiveSkillDao.create(options,function(err,res){
                        if(err){
                            console.log(err);
                            return cb(err,false);
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
                            console.log(err);
                            return cb(err,false);
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
                            console.log(err);
                            return cb(err,false);
                        }else {
                            console.log(isOK);
                        }
                    });
                }
            });

        }
    });

    return cb(null,false);

};


Card.create = function(card,cb){
    var time = Date.now();
    var options = {
        data:{
            lv:card.lv,
            skillLv:card.skillLv,
            elixir:card.elixir,
            tableId:card.tableId,
            playerId:card.playerId,
            star:card.star,
            createTime:time
        }
    };
    var passSkills = card.passSkills;

    cardDao.create(options, function(err,card){
        if(err) {
            //console.log("create=" + err);
            return cb(err,null);
        }else {
           // console.log(card);
            var cardId = card["insertId"];


            passSkills.forEach(function(pss){
                if(!(pss.name == '' || pss.value == '')) {
                    var options = {
                        data:{
                            cardId:cardId,
                            name:pss.name,
                            value:pss.value,
                            createTime:Date.now()
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


                var options = {
                    where:{
                        id:cardId
                    }
                };
                cardDao.getCardInfo(options,function(err,card){
                   // console.log(card);
                   // console.log(JSON.stringify(card));
                    if(err) {
                        return cb(err,null);
                    }
                    return cb(null,card);
                  //  res.send(card);
                });

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

};


module.exports = Card;




