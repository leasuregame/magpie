describe("Area Server", function() {

	describe("Task Handler", function() {
		var arthur = {
			id: 100,
			playerId: 100,
			areaId: 1,
			account: 'arthur',
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
			describe("when start a passBarrier", function() {
				beforeEach(function() {
					loginWith(arthur.account, arthur.password, arthur.areaId);
				});

				it("should can be execute and return result of pass barrier", function() {
					request('area.taskHandler.passBarrier', {}, function(data) {
						console.log('闯关', data);
						expect(data.code).toEqual(200);
						expect(data.msg).toBeDefined();
						expect(data.msg).hasProperties([
							'battleLog',
							'pass'
						]);
						expect(data.msg.battleLog.winner).toEqual('own')
						expect(data.msg.battleLog.rewards).hasProperties(['exp', 'skillPoint'])
						expect(data.msg.pass).hasProperties(['layer', 'mark'])
						expect(data.msg.battleLog).toBeBattleLog();

						doAjax('/player/' + arthur.playerId, {}, function(res) {
							expect(JSON.parse(res.data.pass)).toEqual(data.msg.pass);
						});
					});
				});
			});

			describe('Cases than can not pass', function() {
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
		});
	});
});