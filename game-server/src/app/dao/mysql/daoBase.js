var sqlHelper = require('./sqlHelper');
var dbClient = require('pomelo').app.get('dbClient');
var logger = require('pomelo-logger').getLogger(__filename);
var DaoBase = module.exports;

DaoBase.create = function(data, cb) {
	
};