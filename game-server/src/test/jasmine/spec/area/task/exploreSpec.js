describe("Area Server", function() {

	describe("Task Handler", function() {

		beforeAll(function() {
			doAjax('/loaddata/csv', {}, function(data) {
				expect(data).toEqual('done');
			});
		});

		describe("area.taskHandler.explore", function() {

			describe("when start a explore", function() {
				var arthur = {
					id: 100,
					playerId: 100,
					areaId: 1,
					account: 'arthur',
					password: '1'
				};
				beforeEach(function() {
					loginWith(arthur.account, arthur.password, arthur.areaId);
				});

				it("should can be return the correct result", function() {
					request('area.taskHandler.explore', {
						taskId: 250
					}, function(data) {
						console.log(data);
						expect(data.code).toEqual(200);
						expect(data.msg).hasProperties([
							'result',
							'power_consume',
							'exp_obtain',
							'money_obtain',
							'upgrade',
							'open_box_card',
							'battle_log',
							'fragment',
							'task'
						]);

						var res = data.msg;
						switch (res.result) {
							case 'fight':
								expect(res.battle_log).toBeBattleLog();
								expect(res.battle_log.rewards).hasProperties([
									'spirit', 'cards'
								]);
								if (res.battle_log.winner == 'own') {
									expect(res.task).toEqual({id: 250, progress: 3, hasWin: true});
								} else {
									expect(res.task).toEqual({id: 250, progress: 2});
								}
								break;
							case 'box':
								if (!res.fregment) {
									expect(typeof res.open_box_card).toEqual('object');
									expect(res.open_box_card).hasProperties([
										'id', 'lv', 'exp', 'star', 'tableId', 
										'skillLv', 'hpAddition', 'atkAddition',
										'passiveSkills', 'playerId', 'skillPoint', 
										'elixir', 'createTime',
										'init_hp', 'init_atk', 'hp', 'atk', 'incs'
									]);
								} else {
									expect(res.open_box_card).toEqual(null);
								}
								expect(res.task).toEqual({id: 250, progress: 3});
								break;
							default:
								expect(res.result).toEqual('none');
								expect(res.battle_log).toEqual(null);
								expect(res.open_box_card).toEqual(null);
								expect(res.task).toEqual({id: 250, progress: 3});
						}

						expect(res.power_consume).toEqual(5);
						expect(res.exp_obtain).toEqual(145);
						expect(res.money_obtain).toEqual(290);
						expect(typeof res.upgrade).toEqual('boolean');
						expect(typeof res.fragment).toEqual('boolean');
					});
				});
			});

			describe("when power is not enought", function() {
				var mike = {
					id: 102,
					playerId: 102,
					areaId: 1,
					account: 'mike',
					password: '1'
				};
				beforeEach(function() {
					loginWith(mike.account, mike.password, mike.areaId);
				});

				it('should can not explore', function() {
					request('area.taskHandler.explore', {
						taskId: 6
					}, function(data) {
						expect(data.code).toEqual(501);
						expect(data.msg).toEqual('体力不足');
					});
				});
			});

		});


	});

});