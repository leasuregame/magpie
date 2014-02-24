/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-6-26
 * Time: 下午5:13
 * To change this template use File | Settings | File Templates.
 */


/*
 * user dao
 *
 * create
 * update
 * select
 * delete
 * */

var app = require("pomelo").app;
var dbClient = app.get("dbClient");
var User = require("../../domain/entity/user");

var DaoBase = require("./daoBase");
var utility = require("../../common/utility");

var UserDao = (function (_super) {
    utility.extends(UserDao, _super);

    function UserDao() {
        UserDao.__super__.constructor.apply(this, arguments);
    }

    UserDao.table = 'user';
    UserDao.domain = User;
    UserDao.syncKey = 'userSync.updateUserById';

    UserDao.createUser = UserDao.create;
    UserDao.getUserById = UserDao.fetchOne;
    UserDao.getUserByAccount = UserDao.fetchOne;
    UserDao.deleteUserById = UserDao.delete;

    return UserDao;
})(DaoBase);

module.exports = UserDao;