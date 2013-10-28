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
					request('area.playerHandler.getFriends', {}, function(data) {
						console.log(data);
						expect(data.code).toEqual(200);
						expect(data.msg).toEqual({
							friends: [{
								id: 1,
								name: 'Linc',
								lv: 25,
								ability: 0,
								canReceive: false,
								canGive: true
							}, {
								id: 3,
								name: 'Marhon',
								lv: 11,
								ability: 0,
								canReceive: false,
								canGive: true
							}],
							giveCount: 5,
							receiveCount: 5,
							friendsCount: 20
						});
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
					request('area.playerHandler.getFriends', {}, function(data) {
						console.log(data);
						expect(data.code).toEqual(200);
						expect(data.msg).toEqual({
							friends: [{
								id: 1,
								name: 'Linc',
								lv: 25,
								ability: 0,
								canReceive: false,
								canGive: true
							}],
							giveCount: 10,
							receiveCount: 10,
							friendsCount: 30
						});
					});
				});
			});

			describe('when player level is 51', function() {
				beforeEach(function() {
					doAjax('/update/player/1', {
						lv: 51
					}, function() {
						loginWith('1', '1', 1);
					});
				});

				it('should can get friends of player', function() {
					request('area.playerHandler.getFriends', {}, function(data) {
						console.log(data);
						expect(data.code).toEqual(200);
						expect(data.msg).toEqual({
							friends: [{
								id: 100,
								name: 'Attacker',
								lv: 10,
								ability: 81671,
								canReceive: false,
								canGive: true
							}, {
								id: 101,
								name: 'Defender',
								lv: 31,
								ability: 95123,
								canReceive: false,
								canGive: true
							}, {
								id: 102,
								name: 'Player power is not enough',
								lv: 40,
								ability: 0,
								canReceive: false,
								canGive: true
							}],
							giveCount: 15,
							receiveCount: 15,
							friendsCount: 40
						});
					});
				});
			});

			describe('when player level is 71', function() {
				beforeEach(function() {
					doAjax('/update/player/2', {
						lv: 71
					}, function() {
						loginWith('2', '1', 1);
					});
				});

				it('should can get friends of player', function() {
					request('area.playerHandler.getFriends', {}, function(data) {
						console.log(data);
						expect(data.code).toEqual(200);
						expect(data.msg).toEqual({
							friends: [],
							giveCount: 20,
							receiveCount: 20,
							friendsCount: 50
						});
					});
				});
			});
		});
	});
});