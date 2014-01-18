var csv = require('csv');
var path = require('path');
var fs = require('fs');
var async = require('async');
var _ = require('underscore');
var table = require('../app/manager/table');
var cardConfig = require('../config/data/card');

module.exports = function(db, dir) {
	return new Data(db, dir);
};

var Data = function(db, dir) {
	this.db = db;
  if (typeof dir !== 'undefined') {
    this.fixtures_dir = dir;  
  } else {
    this.fixtures_dir = path.join(__dirname, '..', 'config', 'fixtures/');
  }
  
};

Data.prototype.dataForRankingUser = function(callback) {
  var self = this, id;
  async.times(10000, function(n, next) {
    id = n + 1;
    self.db.user.create({
      data: {
        id: id,
        account: 'robotUser' + id,
        password: '1',
        roles: [1]
      }
    }, next);
  }, function(err, results) {
    if (err) console.log(err);
    console.log('user complete.');
    callback(null, true);
  });
};

Data.prototype.dataForRanking = function(callback){
  // 新浪服务器使用的数据
  var userId = 1;
  var self = this;
  var filepath = path.join(this.fixtures_dir, 'pfmData.csv');
  console.log(filepath);
  csv()
    .from(filepath, {
      columns: true,
      delimiter: ';',
      escape: '"'
    })
    .transform(function(row, index, cb) {
      // if (row.id < 6865) {
      //   return;
      // }
      _.each(row, function(val, key) {
        if (_.isEmpty(val)) {
          delete row[key];
        }
      });

      if (_.isEmpty(row)) {
        cb(null);
        return;
      }

      var now = Date.now();
      var playerData = {
        id: row.id,
        userId: userId++,
        areaId: 1,
        lv: row.lv,
        name: row.name,
        power: {
          time: now,
          value: row.powerValue
        }
      };
      var rankData = {
        playerId: row.id,
        ranking: row.ranking
      };

      var ids = [10,15,35,45,60,90,95,100,110,125,140,150];
      var cardData = {
        playerId: row.id,
        star: row.card_star,
        lv: row.card_lv,
        skillLv: row.skill_lv
      };
      async.parallel([
        function(cb) {
          self.db.player.create({data: playerData}, cb);    
        },
        function(cb) {
          self.db.rank.create({data: rankData}, cb);
        },
        function(cb) {
          async.times(row.card_count, function(n, next){
            cardData.tableId = ids[_.random(0, ids.length-1)];
            genSkillInc(cardData);
            initPassiveSkill(cardData);
            self.db.card.create({data: cardData}, next);
          }, cb)
        }
      ], function(err, results) {
        if (err) return console.log(err);

        var player = results[0];
        var rank = results[1];
        var cards = results[2];

        player.lineUp = random_lineup(cards);
        self.db.player.update({
          where: { id: player.id},
          data: {lineUp: player.lineUp}
        }, function(err, res){
          console.log(row.id);
          cb(null, true);
        });
      });
    })
    .on('error', function(error) {
      console.log('load csv error:', error.message);
    })
    .on('close', function() {
      console.log('');
    })
    .on('end', function(count) {
      callback(null, count);
    });
};

var random_lineup = function(cards) {
  var i, ids, lu, pos, r, _i, _ref, _res, tids;
  ids = _.map(cards, function(h) {
    return [h.id, h.tableId];
  });
  
  pos = ['00', '01', '02', '10', '11'];
  _res = [];
  while (true) {
    r = _.random(0, 4);
    if (_res.indexOf(r) < 0) {
      _res.push(r);
    }
    if (_res.length >= ids.length) {
      break;
    }
  }
  
  lu = '';
  tids = [];
  for (i = _i = 0, _ref = _res.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
    if (tids.indexOf(ids[i][1]) < 0) {
      lu += "" + pos[_res[i]] + ":" + ids[i][0] + ",";
      tids.push(ids[i][1]);
    }
  }

  return lu + '12:-1';
};

var genSkillInc = function(card) {
    if(parseInt(card.star) < 3) {
       // console.log("card = ",card);
        card.factor = 0.0;
        return;
    }

    card.factor = _.random(1,1000)
};

var initPassiveSkill = function(card) {
    if (card.passiveSkills) return;

    var count, end, index, results, start, _ref;
    // var ps = _.keys(card.passiveSkills);

    results = [];
    if(card.star < 3)
        return results;
    count = card.star - 2;

    for(var i = 0;i < count; i++) {
        index = _.random(cardConfig.PASSIVESKILL.TYPE.length - 1);
        _ref = cardConfig.PASSIVESKILL.VALUE_SCOPE.split('-'), start = _ref[0], end = _ref[1];
        results.push({
            id:i,
            name: cardConfig.PASSIVESKILL.TYPE[index],
            value: parseFloat(parseFloat(_.random(parseInt(start) * 10, parseInt(end) * 10) / 10).toFixed(1))
        });
    }

    card.passiveSkills = results;
};

