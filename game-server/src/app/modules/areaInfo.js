/*!
 * Pomelo -- consoleModule sceneInfo
 * Copyright(c) 2012 fantasyni <fantasyni@163.com>
 * MIT Licensed
 */
var logger = require('pomelo-logger').getLogger(__filename);

module.exports = function(opts) {
	return new Module(opts);
};

module.exports.moduleId = 'areaInfo';

var Module = function(opts) {
	opts = opts || {};
	this.type = opts.type || 'pull';
	this.interval = opts.interval || 5;
};

Module.prototype.monitorHandler = function(agent, msg, cb) {
	//collect data
	var serverId = agent.id;
	var area = require('../domain/area/area');
	var data = area.getPlayers().map(function(p) {
		return {
			id: p.id,
			name: p.name,
			lv: p.lv
		};
	});
	//console.log('area info monitor: ', data.length);
	agent.notify(module.exports.moduleId, {serverId: serverId, body: data});
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
		console.log('client handler: ', agent.get(module.exports.moduleId));
		var data = agent.get(module.exports.moduleId);
		if (data) {
			cb(null, data[msg.sid]);
		} else {
			cb(null, []);	
		}		
	}
};
