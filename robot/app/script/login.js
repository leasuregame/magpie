var cwd = process.cwd();
var pomelo = require(cwd + '/app/script/pomeloClient');

var START = 'start';
var END = 'end';
var DirectionNum = 8;

var ActFlagType = {
	EXPLORE: 0,
	LOGIN: 1,
	PASS
};

var monitor = function(type, name, reqId) {
	if (typeof actor !== 'undefined') {
		console.log('add monitor: ', actor.id);
		actor.emit(type, name, reqId);
	} else {
		console.log('not actor.....');
		console.error(Array.prototype.slice.call(arguments, 0));
	}
};

var offset = (typeof actor !== 'undefined') ? actor.id + 2 : 30;
var count = 0;
pomelo.init({
	host: "127.0.0.1",
	port: 3010,
	log: true
}, function() {

	monitor('incr', 'login');
	monitor(START, 'login', ActFlagType.LOGIN);
	pomelo.request('connector.userHandler.login', {
		account: 'robotUser' + offset,
		password: '1',
		areaId: 1
	}, function(data) {
		monitor(END, 'login', ActFlagType.LOGIN);
		console.log(data.msg.user.account + ' login succeed.');
		count += 1;

		setInterval(function() {
			exploreEvent();
		}, 3000);

	});

});

var exploreEvent = function() {
	monitor('incr', 'explore');
	monitor(START, 'explore', ActFlagType.EXPLORE);

	pomelo.request('area.taskHandler.explore', {}, function(data) {
		monitor(END, 'explore', ActFlagType.EXPLORE);
		console.log('explore： ', data.code);
		console.log('explore result: ', data.msg);
	});
};

var passEven = function(){
	monitor('incr', 'passBarrier');
	monitor(START, 'passBarrier', ActFlagType.PASS);

	pomelo.request('area.taskHandler.passBarrier', {}, function(data) {
		monitor(END, 'passBarrier', ActFlagType.PASS);
		console.log('passBarrier ', data.code);
		console.log('passBarrier result: ', data.msg);
	});
};