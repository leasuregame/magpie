var logger = require('pomelo-logger').getLogger(__filename);
var DaoBase = require("./daoBase");
var utility = require("../../common/utility");
var dbClient = require('pomelo').app.get('dbClient');

var CdkeyDao = (function(_super) {
  utility.extends(CdkeyDao, _super);

  function CdkeyDao() {
    CdkeyDao.__super__.constructor.apply(this, arguments);
  }

  CdkeyDao.table = 'cdkey';

  var domain = function(attrs) {
    this.key = attrs.key,
    this.playerId = attrs.playerId,
    this.activate = attrs.activate,
    this.startDate = attrs.startDate,
    this.endDate = attrs.endDate
  };
  domain.DEFAULT_VALUES = {
    activate: 0
  };
  domain.FIELDS = ['key', 'playerId', 'activate', 'startDate', 'endDate'];
  CdkeyDao.domain = domain;

  CdkeyDao.isAvalifyPlayer = function (playerId, prefix, cb) {
    var sql = "select key from cdkey where playerId=? and key like '?%'";
    dbClient.query(sql, [playerId, prefix], function(err, res) {
      if (err) {
        logger.error("[SQL ERROR, when query cdkey]", sql, args);
        logger.error(err.stack);
        return cb({
            code: err.code,
            msg: err.message
        });
      }

      if (!!res && res.length > 0) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    })
  };

  return CdkeyDao;
})(DaoBase);

module.exports = CdkeyDao;