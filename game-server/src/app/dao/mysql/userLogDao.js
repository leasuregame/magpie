var DaoBase = require("./daoBase");
var utility = require("../../common/utility");

var UserLogDao = (function (_super) {
    utility.extends(UserLogDao, _super);

    function UserLogDao() {
        UserLogDao.__super__.constructor.apply(this, arguments);
    }

    UserLogDao.table = 'user';
    UserLogDao.domain = function(attrs) {
        this.id = attrs.id;
        this.playerId = attrs.playerId;
        this.route = attrs.route;
        this.params = attrs.params;
        this.result = attrs.result;
        this.created = this.created;
    };
    UserLogDao.domain.DEFAULT_VALUES = {};
    UserLogDao.domain.FIELDS = ['id', 'playerId', 'route', 'params', 'result', 'created'];
    UserLogDao.FIELDS = [];
    UserLogDao.syncKey = 'userLogSync.update';

    UserLogDao.createLog = function(options, cb){
        options.data.created = utility.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss");
        this.create(options, cb);
    };

    return UserLogDao;
})(DaoBase);

module.exports = UserLogDao;