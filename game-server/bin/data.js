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

Data.prototype.deleteUnUsedCards = function() {
  var tableIds = table.getTable('cards').filter(function(id) {
    return id <= 250;
  }).map(function(item) {
    return parseInt(item.id);
  });
  this.db['card'].delete({
    where: ' tableId not in (' + tableIds.toString() + ', 30000)'
  }, function(err, res) {
    console.log('delete result:', err, res)
  });

  this.db['player'].update({
    where: {
      1: 1
    },
    data: {
      lineUp: '12:-1'
    }
  }, function(err, res) {
    console.log('updated players: ', err, res);
  });
};

Data.prototype.importCsvToSql = function(table, filepath, callback) {
  var self = this;
  csv()
    .from(filepath, {
      columns: true,
      delimiter: ';',
      escape: '"'
    })
    .transform(function(row, index, cb) {
      _.each(row, function(val, key) {
        if (_.isEmpty(val)) {
          delete row[key];
        }
      });

      if (_.isEmpty(row)) {
        cb(null);
        return;
      }
      var where = {
        id: row.id
      };
      if (table == 'friend') {
        where = {
          playerId: row.playerId,
          friendId: row.friendId
        };
      }
      if (table == 'card') {
        genSkillInc(row);
        initPassiveSkill(row);
      }
      self.db[table].delete({
        where: where
      }, function(err, res) {
        self.db[table].create({
          data: row
        }, function(err, res) {
          if (err) {
            console.log(err);
          }
          cb(null, true);
        });
      });


    })
    .on('error', function(error) {
      console.log(error.message);
    })
    .on('close', function() {
      console.log('');
    })
    .on('end', function(count) {
      callback(null, count);
    });
};

Data.prototype.loadCsvDataToSql = function(callback) {
  console.log("  *** load data from csv ***  ");
  var self = this;
  var files = fs.readdirSync(this.fixtures_dir).filter(function(file) {
    return /\.csv$/.test(file) && !/user\.csv$/.test(file);
  });

  var count = 0;
  for (var i = 0; i < files.length; i++) {
    (function(i) {
      var filename = files[i];

      var table = path.basename(filename, '.csv');
      self.importCsvToSql(table, self.fixtures_dir + filename, function(err, res) {
        count++;
        if (err) {
          console.log('load ' + filename + ' error: ', err);
          return;
        }

        console.log(filename + '   >>   ' + table);
        if (count == files.length) {
          console.log("  *** load data from csv complete ***  ");
          callback(null, true);
        }
      });
    })(i);
  }
};

Data.prototype.dataForRankingUser = function(callback) {
  var self = this,
    id;
  async.times(5000, function(n, next) {
    id = n + 11;
    self.db.user.create({
      data: {
        id: id,
        account: 'robot' + id,
        password: '1',
        roles: [1]
      }
    }, next);
  }, function(err, results) {
    if (err) console.log(err);
    console.log('user');
    callback(null, true)
  });
};

Data.prototype.loadRobotUser = function(areaId, callback) {
  var self = this;
  var filePath = path.join(this.fixtures_dir, 'robot.csv');
  console.log(filePath);
  csv()
    .from(filePath, {
      columns: true,
      delimiter: ';',
      escape: '"'
    })
    .transform(function(row, index, cb) {
      _.each(row, function(val, key) {
        if (_.isEmpty(val)) {
          delete row[key];
        }
      });

      if (_.isEmpty(row)) {
        cb(null);
        return;
      }
      console.log(row.account);
      var userData = {
        id: row.userId,
        account: row.account,
        password: row.password,
        roles: JSON.stringify([areaId])
      };
      self.db.user.delete({
        where: {id: row.id}
      }, function(err, res) {
        self.db.user.create({
          data: userData
        }, cb);
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

Data.prototype.loadRobot = function loadRobot(areaId, callback) {
  var self = this;
  var filePath = path.join(this.fixtures_dir, '..', '..', 'robot.csv');
  console.log(filePath);
  csv()
    .from(filePath, {
      columns: true,
      delimiter: ';',
      escape: '"'
    })
    .transform(function(row, index, cb) {
      _.each(row, function(val, key) {
        if (_.isEmpty(val)) {
          delete row[key];
        }
      });

      if (_.isEmpty(row)) {
        cb(null);
        return;
      }
      console.log(row.playerName);
      var playerData = {
        id: row.id,
        userId: row.userId,
        areaId: areaId,
        lv: row.level,
        name: row.playerName,
      };
      var rankData = {
        ranking: row.ranking,
        playerId: row.id
      };

      async.parallel([
        function(cb) {
          self.db.player.delete({
            where: {id: playerData.id}
          }, cb);
        },
        function(cb) {
          self.db.player.create({
            data: playerData
          }, cb);
        },
        function(cb) {
          self.db.rank.delete({
            where: rankData
          }, cb);
        },
        function(cb) {
          self.db.rank.create({
            data: rankData
          }, cb);
        },
        function(cb) {
          var cards = JSON.parse(row.cards);
          var count = cards.ids.length;
          async.times(count, function(n, next) {
            var cardData = {
              playerId: row.id,
              tableId: cards.ids[n],
              lv: cards.lvs[n],
              star: cards.ids[n] % 5 || 5
            };
            genSkillInc(cardData);
            initPassiveSkill(cardData);
            self.db.card.delete({
              where: {
                playerId: playerData.id
              }
            }, function(err, res) {
              self.db.card.create({
                data: cardData
              }, next);
            });            
          }, cb);
        }
      ], function(err, results) {
        if (err) return console.log(err);

        var player = results[0];
        var rank = results[1];
        var cards = results[2];

        player.lineUp = random_lineup(cards);
        self.db.player.update({
          where: {
            id: player.id
          },
          data: {
            lineUp: player.lineUp
          }
        }, function(err, res) {
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

Data.prototype.dataForRanking = function(callback) {
  // 新浪服务器使用的数据
  var userId = 20;
  var self = this;
  var filepath = path.join(this.fixtures_dir, '..', 'robot', 'player.csv');
  console.log(filepath);
  csv()
    .from(filepath, {
      columns: true,
      delimiter: ';',
      escape: '"'
    })
    .transform(function(row, index, cb) {
      _.each(row, function(val, key) {
        if (_.isEmpty(val)) {
          delete row[key];
        }
      });

      if (_.isEmpty(row)) {
        cb(null);
        return;
      }

      var playerData = {
        id: row.id,
        userId: userId++,
        areaId: 1,
        lv: 1,
        name: row.name
      };
      var rankData = {
        playerId: row.id,
        ranking: row.ranking
      };

      var ids = _.range(parseInt(row.card_star), 250, 5);
      var cardData = {
        playerId: row.id,
        star: row.card_star,
        lv: row.card_lv,
        skillLv: _.random(1, 6)
      };
      async.parallel([
        function(cb) {
          self.db.player.create({
            data: playerData
          }, cb);
        },
        function(cb) {
          self.db.rank.create({
            data: rankData
          }, cb);
        },
        function(cb) {
          async.times(row.card_count, function(n, next) {
            cardData.tableId = ids[_.random(0, ids.length - 1)];
            genSkillInc(cardData);
            initPassiveSkill(cardData);
            self.db.card.create({
              data: cardData
            }, next);
          }, cb)
        }
      ], function(err, results) {
        if (err) return console.log(err);

        var player = results[0];
        var rank = results[1];
        var cards = results[2];

        player.lineUp = random_lineup(cards);
        self.db.player.update({
          where: {
            id: player.id
          },
          data: {
            lineUp: player.lineUp
          }
        }, function(err, res) {
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

Data.prototype.loadDataForRankingList = function(callback) {
  // 接口测试使用的数据
  var self = this;
  var count = 0;
  console.log('  *** create test data for ranking list ***  ');
  console.log('raking list data creating......');
  for (var i = 10000; i < 20001; i++) {
    (function(id) {
      var data = {
        id: id,
        name: 'james' + id,
        userId: id,
        areaId: 1,
        lv: 20,
        ability: id + _.random(10000)
      };

      self.db.player.create({
        data: data
      }, function(err, res) {
        if (err) {
          console.log(err);
        }

        self.db.rank.create({
          data: {
            playerId: id,
            createTime: Date.now(),
            ranking: id - 9999
          }
        }, function(err, _res) {
          count += 1;
          if (count == 10001) {
            console.log('  ***  data for ranking list completed ***  ');
            callback(null, true);
          }
        });
      });
    })(i);
  }
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
  if (parseInt(card.star) < 3) {
    // console.log("card = ",card);
    card.skillInc = 0;
    return;
  }
  var cdata, max, min, skill;
  cdata = table.getTableItem('cards', card.tableId);
  skill = cdata.skill_id_linktarget;
  if (skill != null) {
    min = skill["star" + card.star + "_inc_min"];
    max = skill["star" + card.star + "_inc_max"];
    card.skillInc = _.random(min, max);
    //console.log("skillInc = ",card.skillInc);
  } else {
    throw new Error('can not file skill info of card: ' + card.tableId);
  }
};

var initPassiveSkill = function(card) {
  if (card.passiveSkills) return;

  var count, end, index, results, start, _ref;
  // var ps = _.keys(card.passiveSkills);

  results = [];
  if (card.star < 3)
    return results;
  count = card.star - 2;

  for (var i = 0; i < count; i++) {
    index = _.random(cardConfig.PASSIVESKILL.TYPE.length - 1);
    _ref = cardConfig.PASSIVESKILL.VALUE_SCOPE.split('-'), start = _ref[0], end = _ref[1];
    results.push({
      id: i,
      name: cardConfig.PASSIVESKILL.TYPE[index],
      value: parseFloat(parseFloat(_.random(parseInt(start) * 10, parseInt(end) * 10) / 10).toFixed(1))
    });
  }

  card.passiveSkills = results;
};