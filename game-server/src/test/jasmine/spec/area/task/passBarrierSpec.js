describe("Area Server", function() {

	describe("Task Handler", function() {
		var passer = {
			id: 110,
			playerId: 110,
			areaId: 1,
			account: 'passer',
			password: '1'
		};

		var mike = {
			id: 102,
			playerId: 102,
			areaId: 1,
			account: 'mike',
			password: '1'
		};

		beforeAll(function() {
			doAjax('/loaddata/csv', {}, function(data) {
				expect(data).toEqual('done');
			});
		});

		describe("area.taskHandler.passBarrier", function() {
			describe("一般爬塔测试", function() {

				describe("when start a passBarrier", function() {
					beforeEach(function() {
						loginWith('arthur', '1', 1);
					});

					it("should can be execute and return result of pass barrier", function() {
						request('area.taskHandler.passBarrier', {}, function(data) {
							console.log('闯关', data);
							expect(data.code).toEqual(200);
							expect(data.msg).toBeDefined();
							expect(data.msg.battleLog.winner).toEqual('own');
							expect(data.msg.battleLog.rewards).hasProperties(['totalSpirit', 'exp', 'skillPoint', 'money']);
							expect(data.msg.pass).hasProperties(['layer', 'mark', 'canReset', 'hasMystical']);
							expect(data.msg.battleLog).toBeBattleLog();

							doAjax('/player/' + arthur.playerId, {}, function(res) {
								expect(_.extend(JSON.parse(res.data.pass), {
									layer: res.data.passLayer
								})).toEqual(data.msg.pass);
								expect(res.data.passLayer).toEqual(data.msg.pass.layer);
							});
						});
					});
				});

				describe('Cases that can not pass', function() {
					beforeEach(function() {
						loginWith(mike.account, mike.password, mike.areaId);
					});


					describe('when start a pass than greater than the player has passed', function() {
						it('should can not execute the pass that greater than the player has passed', function() {
							request('area.taskHandler.passBarrier', {
								layer: 27
							}, function(data) {
								expect(data).toEqual({
									code: 501,
									msg: '不能闯此关'
								});
							});
						});
					});

					describe('when pass is less than 1', function() {
						it('should can not execute the pass', function() {
							request('area.taskHandler.passBarrier', {
								layer: 0
							}, function(data) {
								expect(data).toEqual({
									code: 501,
									msg: '不能闯此关'
								});
							});
						});
					});


					describe('when pass is greater than 100', function() {

						it('should can not execute the pass', function() {
							request('area.taskHandler.passBarrier', {
								layer: 101
							}, function(data) {
								expect(data).toEqual({
									code: 501,
									msg: '不能闯此关'
								});
							});
						});
					});

				});

				describe('when player upgrade', function() {
					describe('when player is vip', function() {
						beforeEach(function() {
							doAjax('/update/player/' + 100, {
								exp: 625,
								vip: 7,
								lv: 30
							}, function() {
								loginWith('arthur', '1', 1);
							});
						});

						it('should can upgrade player', function() {
							request('area.taskHandler.passBarrier', {
								layer: 1
							}, function(data) {
								console.log(data);
								expect(data.code).toEqual(200);
								expect(data.msg.upgradeInfo).toEqual({
									lv: 31,
									rewards: {
										money: 300,
										energy: 115,
										skillPoint: 250,
										elixir: 250
									},
									friendsCount: 60
								});
								expect(data.msg.exp).toEqual(3);
							});
						});
					});

					describe('when player is not vip', function() {
						beforeEach(function() {
							doAjax('/update/player/' + 101, {
								exp: 625,
								vip: 0,
								lv: 30
							}, function() {
								loginWith('user4', '1', 1);
							});
						});

						it('should can upgrade player', function() {
							request('area.taskHandler.passBarrier', {
								layer: 1
							}, function(data) {
								console.log(data);
								expect(data.code).toEqual(200);
								expect(data.msg.upgradeInfo).toEqual({
									lv: 31,
									rewards: {
										money: 300,
										energy: 115,
										skillPoint: 250,
										elixir: 250
									},
									friendsCount: 30
								});
								expect(data.msg.exp).toEqual(3);
							});
						});
					});
				});
			});

			describe("连续爬塔50层测试", function() {
				beforeAll(function() {
					doAjax('/update/player/' + passer.playerId, {
						lv: 60,
						exp: 10000
					}, function() {});
				})
				beforeEach(function() {
					loginWith(passer.account, passer.password, passer.areaId);

				});

				var curLv = 60;

				function doPassBarrier(layer) {
					it('爬塔第 ' + layer + ' 层', function() {
						request('area.taskHandler.passBarrier', {
							layer: layer
						}, function(data) {
							console.log('第' + layer + '层：', data);
							expect(data.code).toEqual(200);
							expect(data.msg).toBeDefined();
							if (data.msg.upgradeInfo) {
								console.log('player upgraded: ', data.msg.upgradeInfo);
								expect(data.msg).hasProperties([
									'battleLog',
									'pass',
									'power',
									'exp',
									'lv',
									'upgradeInfo'
								]);

								expect(data.msg.upgradeInfo).hasProperties(['lv', 'rewards', 'friendsCount']);
								expect(data.msg.upgradeInfo.lv).toEqual(++curLv);
								expect(data.msg.upgradeInfo.friendsCount).toEqual(20);
								expect(data.msg.upgradeInfo.rewards).hasProperties([
									'money', 'energy', 'skillPoint', 'elixir'
								]);
							} else {
								expect(data.msg).hasProperties([
									'battleLog',
									'pass',
									'power',
									'exp',
									'lv'
								]);
							}
							expect(data.msg.battleLog.winner).toEqual('own');
							//expect(data.msg.battleLog.rewards).hasProperties(['exp', 'skillPoint', 'spirit'])
							expect(data.msg.pass).hasProperties(['layer', 'mark', 'hasMystical', 'canReset']);
							expect(data.msg.battleLog).toBeBattleLog();

							expect(data.msg.battleLog.rewards).hasProperties([
								'totalSpirit', 'skillPoint', 'exp', 'money'
							]);

							doAjax('/player/' + passer.playerId, {}, function(res) {
								var pass = JSON.parse(res.data.pass);
								expect(pass.mark).toEqual(data.msg.pass.mark);
								expect(res.data.passLayer).toEqual(data.msg.pass.layer);
								expect(pass.resetTimes > 0).toEqual(data.msg.pass.canReset);
								expect(pass.mystical.isTrigger && !pass.mystical.isClear).toEqual(data.msg.pass.hasMystical);
							});
						});
					});
				}

				for (var i = 1; i <= 60; i++) {
					(function(layer) {
						doPassBarrier(layer);
					})(i);
				}

			});


		});
	});
});