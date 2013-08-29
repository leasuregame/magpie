var app = require('pomelo').app;
var dbClient = app.get('dbClient');
var logger = require('pomelo-logger').getLogger(__filename);
var DaoBase = require("./daoBase");
var utility = require("../../common/utility");

var FriendDao = (function(_super) {
    utility.extends(FriendDao, _super);

    function FriendDao() {
        FriendDao.__super__.constructor.apply(this, arguments);
    }

    FriendDao.table = 'friend';

    var domain = function(attrs) {
        this.playerId = attrs.playerId;
        this.friendId = attrs.friendId;
    };
    domain.DEFAULT_VALUES = {};
    domain.FIELDS = ['playerId', 'friendId'];
    FriendDao.domain = domain;

    FriendDao.getFriends = function(playerId, cb) {
        var sql = 'select id, name, lv, ability from player \
            where id in ( \
                select friendId from friend where playerId = ? \
                union \
                select playerId from friend where friendId = ? \
            );';
        var args = [playerId, playerId];

        return dbClient.query(sql, args, function(err, res) {
            if (err) {
                logger.error("[SQL ERROR, when query friends]", sql, args);
                logger.error(err.stack);
                return cb({
                    code: err.code,
                    msg: err.message
                });
            }
            
            if ( !! res && res.length > 0) {
                cb(null, res);
            } else {
                cb(null, []);
            }
        });
    };

    return FriendDao;

})(DaoBase);

module.exports = FriendDao;