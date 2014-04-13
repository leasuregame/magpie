var logger = require('pomelo-logger').getLogger(__filename);
var DaoBase = require("./daoBase");
var utility = require("../../common/utility");
var dbClient = require('pomelo').app.get('dbClient');
var util = require('util');

var CdkeyDao = (function(_super) {
  utility.extends(CdkeyDao, _super);

  function CdkeyDao() {
    CdkeyDao.__super__.constructor.apply(this, arguments);
  }

  CdkeyDao.table = 'cdkey';

  var domain = function(attrs) {
    this.code = attrs.code,
    this.playerId = attrs.playerId,
    this.activate = attrs.activate,
    this.startDate = attrs.startDate,
    this.endDate = attrs.endDate
  };
  domain.DEFAULT_VALUES = {
    activate: 0
  };
  domain.FIELDS = ['code', 'playerId', 'activate', 'startDate', 'endDate'];
  CdkeyDao.domain = domain;

  CdkeyDao.isAvalifyPlayer = function (playerId, prefix, cb) {
    var sql = "select `code` from cdkey where playerId="+playerId+" and `code` like \'"+prefix+"-%\'";
    dbClient.query(sql,function(err, res) {
      if (err) {
        logger.error("[SQL ERROR, when query cdkey]", sql);
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