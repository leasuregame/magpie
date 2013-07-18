var sqlHelper = require("../sqlHelper");
var dbClient = require("pomelo").app.get("dbClient");
var logger = require("pomelo-logger").getLogger(__filename);

var rankSync = {
	updateRank: function (dbClient, param) {
		var cb = function() {};
        if(typeof (param.cb) != "undefined") {
            cb = param.cb;
        }

		if (typeof (param.id) == "undefined" || typeof (param.data) == "undefined") {
		    return cb("param error", null);
		}

		var stm = sqlHelper.updateSql("rank", {"id": param.id}, param.data);
		console.log(stm);
		return dbClient.update(stm.sql, stm.args, function (err, res) {
		    if (err) {
		        logger.error("[rankSync.updateRank faild] ", err.stack);

		        return cb({
		            code: err.code,
		            msg: err.message
		        }, null);
		    } if (!!res && res.affectedRows > 0) {
		        return cb(null, true);
		    } else {
		        return cb(null, false);
		    }
		});
	}
};

module.exports = rankSync;