var app = require('pomelo').app;
var dbClient = app.get('dbClient');
var Message = require('../../domain/entity/message');
var DaoBase = require("./daoBase");
var utility = require("../../common/utility");

var MessageDao = (function (_super) {
    utility.extends(MessageDao, _super);

    function MessageDao() {
        MessageDao.__super__.constructor.apply(this, arguments);
    }

    MessageDao.table = 'message';
    MessageDao.domain = Message;
    MessageDao.syncKey = 'messageSync.update';

    MessageDao.systemMessage = function(options, cb) {
        var queryReceived = 'select m.* from message as m \
            left join message as s on m.msgId = s.id \
            where m.sender = -1 and m.type = 4 \
            and m.receiver = ?';
        var queryAll = 'select * from message where sender = -1 and receiver = -1 and \
            type = 4 and msgId is null';

        var sql = queryAll, args = [];
        if (options.receiver) {
            sql = queryReceived;
            args = [options.reveiver];
        }
        return dbClient.query(sql, args, function (err, res) {
            if (err) {
                logger.error("[SQL ERROR, when query system message]", sql, args);
                logger.error(err.stack);
                return cb({
                    code: err.code,
                    msg: err.message
                });
            }

            if ( !!res && res.length > 0) {
                cb(null, res);
            } else {
                cb(null, []);
            }
        });
    };

    return MessageDao;
})(DaoBase);

module.exports = MessageDao;