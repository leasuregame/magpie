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

    return MessageDao;
})(DaoBase);

module.exports = MessageDao;