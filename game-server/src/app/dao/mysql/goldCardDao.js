var app = require('pomelo').app;
var dbClient = app.get('dbClient');
var logger = require('pomelo-logger').getLogger(__filename);
var DaoBase = require("./daoBase");
var utility = require("../../common/utility");
var GoldCard = require('../../domain/entity/goldCard');

var GoldCardDao = (function(_super) {
  utility.extends(GoldCardDao, _super);

  function GoldCardDao() {
    GoldCardDao.__super__.constructor.apply(this, arguments);
  }

  GoldCardDao.table = 'goldCard';
  GoldCardDao.domain = GoldCard;

  GoldCardDao.getValidCards = function(playerId, cb) {
    var today = new Date();
    var sql = 'select * from goldCard where playerId = ' + playerId + ' and validDate >= "' + utility.dateFormat(today, 'yyyy-MM-dd') + '"';

    dbClient.query(sql, [], function(err, res) {
      if (err) {
        logger.error("[SQL ERROR, when query goldCard]", sql, args);
        logger.error(err.stack);
        return cb({
          code: err.code,
          msg: err.message
        });
      }

      if ( !! res && res.length > 0) {
        cb(null, res.map(function(r) {
          return new GoldCardDao.domain(r);
        }));
      } else {
        cb(null, []);
      }
    });
  };

  GoldCardDao.getByType = function(playerId, type, cb) {
    var today = new Date();
    var sql = "select * from goldCard where playerId = " + playerId + " and validDate >= " + utility.dateFormat(today, 'yyyy-MM-dd') + " and type = '" + type + "'";

    dbClient.query(sql, [], function(err, res) {
      if (err) {
        logger.error("[SQL ERROR, when query goldCard]", sql, args);
        logger.error(err.stack);
        return cb({
          code: err.code,
          msg: err.message
        });
      }

      if ( !! res && res.length > 0) {
        cb(null, res.map(function(r) {
          return new GoldCardDao.domain(r);
        }));
      } else {
        cb(null, []);
      }
    });
  };

  return GoldCardDao;
})(DaoBase);

module.exports = GoldCardDao;