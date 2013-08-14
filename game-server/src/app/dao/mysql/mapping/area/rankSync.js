var RankDao = require('../../rankDao');

var rankSync = {
	updateRank: function (dbClient, param) {
		var cb = function() {};
        if(typeof (param.cb) != "undefined") {
            cb = param.cb;
        }

		if (typeof (param.id) == "undefined" || typeof (param.data) == "undefined") {
		    return cb("param error", null);
		}

		return RankDao.update({
			where: {id: param.id},
			data: param.data
		}, cb);
	}
};

module.exports = rankSync;