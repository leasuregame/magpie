var cwd = process.cwd();
var pomelo = require(cwd + '/app/script/pomeloClient');

var START = 'start';
var END = 'end';
var DirectionNum = 8;

var ActFlagType = {
	EXPLORE: 0
};

var monitor = function(type, name, reqId) {
	if (typeof actor !== 'undefined') {
		console.log('add monitor: ', actor.emit);
		actor.emit(type, name, reqId);
	} else {
		console.log('not actor.....');
		console.error(Array.prototype.slice.call(arguments, 0));
	}
};


pomelo.init({
	host: "127.0.0.1",
	port: 3010,
	log: true
}, function() {

	pomelo.request('connector.userHandler.login', {
		account: 'arthur',
		password: '1',
		areaId: 1
	}, function(data) {
		console.log('login result: ', data);

		setInterval(function() {
			exploreEvent();
		}, 3000);

	});

});

var exploreEvent = function() {
	monitor('incr', 'exploreReq');
	monitor(START, 'explore', ActFlagType.EXPLORE);

	pomelo.request('area.taskHandler.explore', {}, function(data) {
		monitor(END, 'explore', ActFlagType.EXPLORE);
		console.log('explore');
	});
};