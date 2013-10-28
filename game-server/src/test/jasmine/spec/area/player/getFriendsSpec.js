describe("Area Server", function() {
	describe("Player Handler", function() {
		describe("area.playerHandler.getFriends", function() {

			beforeAll(function() {
				doAjax('/loaddata/csv', {}, function() {});
			});

			describe('when player level is 10', function() {
				beforeEach(function() {
					doAjax('/update/player/100', {
						lv: 10
					}, function() {
						loginWith('arthur', '1', 1);
					});
				});

				it('should can get friends of player', function() {
					request('area.player.handler.getFriends', {}, function(data) {
						console.log(data);
						expect(data.code).toEqual(200);
						expect(data.msg).toEqual({});
					});
				});
			});

			describe('when player level is 31', function() {
				beforeEach(function() {
					doAjax('/update/player/101', {
						lv: 31
					}, function() {
						loginWith('user4', '1', 1);
					});
				});

				it('should can get friends of player', function() {
					request('area.player.handler.getFriends', {}, function(data) {
						console.log(data);
						expect(data.code).toEqual(200);
						expect(data.msg).toEqual({});
					});
				});
			});

			describe('when player level is 51', function() {
				beforeEach(function() {
					doAjax('/update/player/100', {
						lv: 51
					}, function() {
						loginWith('arthur', '1', 1);
					});
				});

				it('should can get friends of player', function() {
					request('area.player.handler.getFriends', {}, function(data) {
						console.log(data);
						expect(data.code).toEqual(200);
						expect(data.msg).toEqual({});
					});
				});
			});

			describe('when player level is 71', function() {
				beforeEach(function() {
					doAjax('/update/player/101', {
						lv: 71
					}, function() {
						loginWith('user4', '1', 1);
					});
				});

				it('should can get friends of player', function() {
					request('area.player.handler.getFriends', {}, function(data) {
						console.log(data);
						expect(data.code).toEqual(200);
						expect(data.msg).toEqual({});
					});
				});
			});
		});
	});
});