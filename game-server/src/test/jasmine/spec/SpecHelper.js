beforeEach(function() {
  this.addMatchers({
    toBePlaying: function(expectedSong) {
      var player = this.actual;
      return player.currentlyPlayingSong === expectedSong && 
             player.isPlaying;
    },
    toBeBattleLog: function() {
      var battleLog = this.actual;
      var result = false;
      result = _.isEqual(
        _.keys(battleLog).sort(), 
        [
          'enemy',
          'own',
          'winner',
          'steps',
          'rewards'
        ].sort()
      );
      return result;
    }
  });
});

var doAjax = function(url, params, cb) {
  var ok = false;
  runs(function() {
    $.get(url, params, function(data) {
      cb(data);
      ok = true;
    });
  });

  waitsFor(function() {
    return ok;
  }, "The ajax request should be completed", 60000);
};

var request = function(route, msg, cb) {
	var ok = false;
	runs(function() {
	  pomelo.request(route, msg, function(data) {
	    ok = true;
	    cb(data);
	  });
	});

	waitsFor(function() {
	  return ok;
	});
};

var intiPomelo = function() {
  var inited = false;
  runs(function() {
    pomelo.init({
      host: '127.0.0.1',
      port: '3010'
    }, function() {
      console.log('connect success!');
      inited = true;
    });
  });
  waitsFor(function() {
    return inited;
  });
};