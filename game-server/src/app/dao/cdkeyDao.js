var logger = require('pomelo-logger').getLogger(__filename);
var DaoBase = require("./daoBase");
var utility = require("../../common/utility");

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

  return CdkeyDao;
})(DaoBase);

module.exports = CdkeyDao;