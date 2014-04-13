
var logger = require('pomelo-logger').getLogger(__filename);

module.exports = function(opts) {
	return new Module(opts);
};

module.exports.moduleId = 'loginsOnArea';

var Module = function(opts) {
	opts = opts || {};
	this.type = opts.type || 'pull';
	this.interval = opts.interval || 5;
};

Module.prototype.monitorHandler = function(agent, msg, cb) {
	//collect data
	var serverId = agent.id;
	var area = require('../domain/area/area');
	var count = area.getPlayers().length;
	//console.log('area info monitor: ', data.length);
	agent.notify(module.exports.moduleId, {serverId: serverId, body: count});
};

Module.prototype.masterHandler = function(agent, msg, cb) {
	if(!msg) {
		// pull interval callback
		
		var list = agent.typeMap['area'];
		if(!list || list.length === 0) {
			return;
		}
		agent.notifyByType('area', module.exports.moduleId);
		return;
	}
	//console.log('master handler: ', msg);
	var data = agent.get(module.exports.moduleId);
	if(!data) {
		data = {};
		agent.set(module.exports.moduleId, data);
	}
	data[msg.serverId] = msg.body;
};

Module.prototype.clientHandler = function(agent, msg, cb) {
	if(!!cb && typeof cb === 'function') {
		cb(null, agent.get(module.exports.moduleId)||{});
	}
};
