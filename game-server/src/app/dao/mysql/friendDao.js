var app = require('pomelo').app;
var dbClient = app.get('dbClient');
var logger = require('pomelo-logger').getLogger(__filename);
var DaoBase = require("./daoBase");
var utility = require("../../common/utility");
var util = require('util');
var sprintf = require('sprintf-js').sprintf;

var FriendDao = (function(_super) {
    utility.extends(FriendDao, _super);

    function FriendDao() {
        FriendDao.__super__.constructor.apply(this, arguments);
    }

    FriendDao.table = 'friend';

    var domain = function(attrs) {
        this.playerId = attrs.playerId;
        this.friendId = attrs.friendId;
        this.giveCount = attrs.giveCount;
        this.receiveCount = attrs.receiveCount;
        this.friendGiveCount = attrs.friendGiveCount;
        this.friendReceiveCount = attrs.friendReceiveCount;
    };
    domain.DEFAULT_VALUES = {
        giveCount: 0,
        receiveCount: 0,
        friendGiveCount: 0,
        friendReceiveCount: 0
    };
    domain.FIELDS = ['playerId', 'friendId', 'giveCount', 'receiveCount', 'friendGiveCount', 'friendReceiveCount'];
    FriendDao.domain = domain;   

    FriendDao.getFriends = function(playerId, cb) {
        var sql = 'select p.id, p.name, p.lv, p.ability, f.giveCount, f.receiveCount from player as p \
            join friend as f on p.id = f.friendId \
            where f.playerId =  ? \
            union \
            select p.id, p.name, p.lv, p.ability, f.friendGiveCount as giveCount, f.friendReceiveCount as receiveCount from player as p \
            join friend as f on p.id = f.playerId \
            where f.friendId = ?';
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

            if ( !!res && res.length > 0) {
                cb(null, res.map(function(r) {
                    return {
                        id: r.id,
                        name: r.name,
                        lv: r.lv,
                        ability: r.ability,
                        giveCount: r.giveCount,
                        receiveCount: r.receiveCount
                    }
                }));
            } else {
                cb(null, []);
            }
        });
    };

    FriendDao.deleteFriend = function(options, cb) {
        var condition = "(playerId = %d and friendId = %d) or (playerId = %d and friendId = %d)";
        condition = util.format(
            condition, 
            options.playerId,
            options.friendId,
            options.friendId,
            options.playerId
        );
        FriendDao.delete({where: condition}, cb);
    };

    FriendDao.updateGiveCount = function(playerId, friendId, cb) {
        FriendDao.updateFriendBlessCount(playerId, friendId, 'give', cb);
    };

    FriendDao.updateReceiveCount = function(playerId, friendId, cb) {
        FriendDao.updateFriendBlessCount(playerId, friendId, 'receive', cb);
    }

    FriendDao.updateFriendBlessCount = function(playerId, friendId, type, cb) {
        var format = 'update friend \
            set %(type)sCount = case \
            when playerId = %(playerId)s and friendId = %(friendId)s then \
                %(type)sCount + 1 \
            else \
                %(type)sCount \
            end, \
            friend%(type)sCount = case \
            when playerId = %(friendId)s and friendId = %(playerId)s then \
                friend%(type)sCount + 1 \
            else \
                friend%(type)sCount \
            end \
            where (playerId = %(playerId)s and friendId = %(friendId)s) \
            or (playerId = %(friendId)s and friendId = %(playerId)s)';

        var sql = sprintf(format, {playerId: playerId, friendId: friendId, type: type});
        return dbClient.query(sql, [], function(err, res) {
            if (err) {
                logger.error('faild to update friend bless count', 'playerId=', playerId, 'friendId=', friendId);
                logger.error(err);
                return cb(err, {code: err.code, msg: err.message})
            } 
            
            if (!!res && res.affectedRows > 0) {
                return cb(null, true);
            } else {
                return cb(null, false);
            }
        });
    };

    return FriendDao;
})(DaoBase);

module.exports = FriendDao;