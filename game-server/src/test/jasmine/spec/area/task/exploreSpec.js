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
							'lv',
							'exp',
							'task',
							'power',
							'spiritor',
							'momo'
						]);

						var res = data.msg;
						switch (res.result) {
							case 'fight':
								expect(res.battle_log).toBeBattleLog();

								if (res.battle_log.winner == 'own') {
									expect(res.task).toEqual({
										id: 250,
										progress: 3,
										hasWin: true,
										mark: []
									});
									expect(res.battle_log.rewards).hasProperties([
										'fragment', 'totalSpirit', 'cards'
									]);
								} else {
									expect(res.task).toEqual({
										id: 250,
										progress: 2,
										hasWin: false,
										mark: []
									});
								}
								break;
							case 'box':
								if (!res.fregment) {
									expect(typeof res.open_box_card).toEqual('object');
									expect(res.open_box_card).hasProperties([
										'id', 'lv', 'exp', 'tableId',
										'skillLv', 'elixirHp', 'elixirAtk',
										'passiveSkills', 'skillPoint',
										'hp', 'atk', 'ability', 'skillInc'
									]);
								} else {
									expect(res.open_box_card).toEqual(null);
								}
								expect(res.task).toEqual({
									id: 250,
									progress: 3,
									hasWin: false,
									mark: []
								});
								break;
							default:
								expect(res.result).toEqual('none');
								expect(res.battle_log).toEqual(null);
								expect(res.open_box_card).toEqual(null);
								expect(res.task).toEqual({
									id: 250,
									progress: 3,
									hasWin: false,
									mark: []
								});
						}

						expect(res.power_consume).toEqual(5);
						expect(res.exp_obtain).toEqual(145);
						expect(res.money_obtain).toEqual(290);
						expect(typeof res.upgrade).toEqual('boolean');
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
					doAjax('/update/player/102', {
						power: JSON.stringify({
							time: Date.now(),
							value: 0
						})
					}, function() {
						loginWith(mike.account, mike.password, mike.areaId);
					});
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

			describe("连续探索", function() {
				var passer = {
					id: 110,
					playerId: 110,
					areaId: 1,
					account: 'passer',
					password: '1'
				};

				beforeAll(function() {
					doAjax('/update/player/' + passer.playerId, {
						power: JSON.stringify({
							time: Date.now(),
							value: 100000
						})
					}, function() {
						loginWith(passer.account, passer.password, passer.areaId);
					});
				});

				var task = {
					id: 1,
					progress: 0,
					hasWin: false
				};
				var oldTask = {
					id: 1,
					progress: 0,
					hasWin: true
				};

				var count = 1;
				var totalCount = 500;


				it(toatlCount + '次', function() {
					var doTest = function() {
						if (count >= 500) {
							return;
						}

						request('area.taskHandler.explore', {
							taskId: task.id
						}, function(data) {
							console.log(data);
							oldTask.id = task.id;
							oldTask.progress = task.progress;
							oldTask.hasWin = task.hasWin;
							task.id = data.msg.task.id;
							task.progress = data.msg.task.progress;
							task.hasWin = data.msg.task.hasWin;

							checkExploreResult(data, task, oldTask);

							count += 1;
							doTest();
						});
					};
					doTest();
				});



			});

		});


	});

});

var checkExploreResult = function(data, task, oldTask) {
	expect(data.code).toEqual(200);
	expect(data.msg).hasProperties([
		'result',
		'power_consume',
		'exp_obtain',
		'money_obtain',
		'upgrade',
		'open_box_card',
		'battle_log',
		'lv',
		'exp',
		'task',
		'power',
		'spiritor',
		'momo'
	]);

	var res = data.msg;
	switch (res.result) {
		case 'fight':
			expect(res.battle_log).toBeBattleLog();

			if (res.battle_log.winner == 'own') {
				expect(res.task).toEqual({
					id: task.id,
					progress: task.progress,
					hasWin: task.hasWin,
					mark: []
				});
				if (oldTask.hasWin) {
					expect(res.battle_log.rewards).hasProperties([
						'cards', 'fragment'
					]);
				} else {
					expect(res.battle_log.rewards).hasProperties([
						'totalSpirit', 'cards', 'fragment'
					]);
				}


			} else {
				expect(res.task).toEqual({
					id: oldTask.id,
					progress: oldTask.progress,
					hasWin: oldTask.hasWin,
					mark: []
				});
			}
			break;
		case 'box':
			if (!res.fregment) {
				expect(typeof res.open_box_card).toEqual('object');
				expect(res.open_box_card).hasProperties([
					'id', 'lv', 'exp', 'tableId',
					'skillLv', 'elixirHp', 'elixirAtk',
					'passiveSkills', 'skillPoint',
					'hp', 'atk', 'ability', 'skillInc'
				]);
			} else {
				expect(res.open_box_card).toEqual(null);
			}
			expect(res.task).toEqual({
				id: task.id,
				progress: task.progress,
				hasWin: task.hasWin,
				mark: []
			});
			break;
		default:
			expect(res.result).toEqual('none');
			expect(res.battle_log).toEqual(null);
			expect(res.open_box_card).toEqual(null);
			expect(res.task).toEqual({
				id: task.id,
				progress: task.progress,
				hasWin: task.hasWin,
				mark: []
			});
	}

	// expect(res.power_consume).toEqual(5);
	// expect(res.exp_obtain).toEqual(145);
	// expect(res.money_obtain).toEqual(290);
	expect(typeof res.upgrade).toEqual('boolean');
}