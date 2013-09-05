/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-9-3
 * Time: 上午10:57
 * To change this template use File | Settings | File Templates.
 */

var rankDao = require('./dao/mysql/rankDao');

function Rank(){};

Rank.updateRank = function(data,cb){

    var playerId = data.playerId;
    var ranking = data.ranking;

    var oldRanking;
    var oldPlayerId;

    Rank.getRankByPlayerId(playerId,function(err,rank){
        if(err) {
            return cb(err,false);
        }else {
            oldRanking = rank.ranking;
        }
    });

    Rank.getRankByRanking(ranking,function(err,rank){
        if(err){
            return cb(err,false);
        }else {
            oldPlayerId = rank.playerId;
        }
    });

    var options = {
        where:{
            playerId:playerId
        },
        data:{
            ranking:ranking
        }
    };
    rankDao.update(options,function(err,isOK){
        if(err) {
            return cb(err,false);
        }
        else {
            if(oldPlayerId) {
                var options = {
                    where:{
                        playerId:oldPlayerId
                    },
                    data:{
                        ranking:oldRanking
                    }
                };
                rankDao.update(options,function(err,isOK){
                    if(err) {
                        return cb(err,false);
                    }else {
                        return cb(null,true);
                    }
                });
            }
        }
    });

    return cb(null,true);
};


Rank.getRankByPlayerId = function(playerId,cb){

    var options = {
        where:{
            playerId:playerId
        }
    };

    rankDao.getRank(options,function(err,rank){
        if(err) {
            console.log(err);
            return cb(err,null);
        }else {
            return cb(null,rank);
        }

    });

};

Rank.getRankByRanking = function(ranking,cb){
    var options = {
        where:{
            ranking:ranking
        }
    };
    rankDao.getRank(options,function(err,rank){
        if(err) {
            console.log(err);
            return cb(err,null);
        }else {
            return cb(null,rank);
        }
    });
};

module.exports = Rank;


