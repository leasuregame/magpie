describe("Area Server", function() {

	describe("Task Handler", function() {

		beforeAll(function() {
			doAjax('/loaddata/csv', {}, function(data) {
				expect(data).toEqual('done');
			});
		});

		describe("area.taskHandler.explore", function() {

			describe("when start a explore", function() {

				beforeEach(function() {
					loginWith('1', '1', 1);
				});

				it("should can be return the correct result", function() {
					request('area.taskHandler.explore', {
						taskId: 100
					}, function(data) {
						console.log(data);
						expect(data.code).toEqual(200);
						expect(data.msg).hasProperties([
							'result',
							'power_consume',
							'exp_obtain',
							'money_obtain',
							'gold_obtain',
							'open_box_card',
							'battle_log',
							'exp',
							'task',
							'power',
							'momo'
						]);

						var res = data.msg;
						switch (res.result) {
							case 'fight':
								expect(res.battle_log).toBeBattleLog();

								if (res.battle_log.winner == 'own') {
									expect(res.task).toEqual({
										id: 100,
										progress: 3,
										mark: []
									});
									expect(res.battle_log.rewards).hasProperties([
										'fragment', 'totalSpirit', 'cards'
									]);
								} else {
									expect(res.task).toEqual({
										id: 100,
										progress: 2,
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
									id: 100,
									progress: 3,
									mark: []
								});
								break;
							default:
								expect(res.result).toEqual('none');
								expect(res.battle_log).toEqual(null);
								expect(res.open_box_card).toEqual(null);
								expect(res.task).toEqual({
									id: 100,
									progress: 3,
									mark: []
								});
						}

						expect(res.power_consume).toEqual(5);
						expect(res.exp_obtain).toEqual(70);
						expect(res.money_obtain).toEqual(140);
					});
				});
			});

			describe('when player is upgrade', function() {
				beforeEach(function() {
					doAjax('/update/player/' + 1, {
						exp: 388
					}, function() {
						loginWith('1', '1', 1);
					});
				});

				it('should can upgrade player', function() {
					request('area.taskHandler.explore', {
						taskId: 1
					}, function(data) {
						console.log(data);
						expect(data.code).toEqual(200);
						expect(data.msg.upgradeInfo).toEqual({
							lv: 26,
							rewards: {
								money: 250,
								energy: 90,
								skillPoint: 200,
								elixir: 200
							},
							friendsCount: 20
						});
						expect(data.msg.exp).toEqual(2);
					});
				});
			});

			describe('when player level upgrade to 9', function() {
				beforeEach(function() {
					doAjax('/update/player/' + 108, {
						exp: 75,
						lv: 8
					}, function() {
						loginWith('user5', '1', 1);
					});
				});

				it('should can upgrade player', function() {
					request('area.taskHandler.explore', {
						taskId: 1
					}, function(data) {
						console.log(data);
						expect(data.code).toEqual(200);
						expect(data.msg.upgradeInfo).toEqual({
							lv: 9,
							rewards: {
								money: 100,
								energy: 10,
								skillPoint: 10,
								elixir: 10
							},
							friendsCount: 20
						});
						expect(data.msg.exp).toEqual(1);

						doAjax('/player/108', function(err, res) {
							console.log(err, res);
						});
					});
				});
			});

			describe('when player level is upgrade from 30 to 31', function() {
				describe('when player is vip', function() {
					beforeEach(function() {
						doAjax('/update/player/' + 2, {
							exp: 625,
							vip: 7,
							lv: 30
						}, function() {
							loginWith('2', '1', 1);
						});
					});

					it('should can upgrade player', function() {
						request('area.taskHandler.explore', {
							taskId: 1
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
								friendsCount: 45
							});
							expect(data.msg.exp).toEqual(1);
						});
					});
				});

				describe('when player is not vip', function() {
					beforeEach(function() {
						doAjax('/update/player/' + 4, {
							exp: 625,
							vip: 0,
							lv: 30
						}, function() {
							loginWith('4', '1', 1);
						});
					});

					it('should can upgrade player', function() {
						request('area.taskHandler.explore', {
							taskId: 1
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
							expect(data.msg.exp).toEqual(1);
						});
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
					doAjax('/update/player/' + 100, {
						power: JSON.stringify({
							time: Date.now(),
							value: 10000000
						}),
						cardsCount: 1000,
						cardBook: JSON.stringify({
							mark: [],
							flag: []
						})
					}, function() {
						//loginWith(passer.account, passer.password, passer.areaId);
						loginWith('arthur', '1', 1);
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
				var totalCount = 100;
				var curLv = 10;

				it(totalCount + '次', function() {
					var doTest = function() {
						if (count >= totalCount) {
							return;
						}

						request('area.taskHandler.explore', {
							taskId: task.id
						}, function(data) {
							console.log('第' + count + '次', data);
							//expect(data).toEqual({});
							oldTask.id = task.id;
							oldTask.progress = task.progress;
							oldTask.hasWin = task.hasWin;
							task.id = data.msg.task.id;
							task.progress = data.msg.task.progress;
							task.hasWin = data.msg.task.hasWin;

							checkExploreResult(data, task, oldTask);
							if (data.msg.upgradeInfo) {
								console.log('upgraded: ', data.msg.upgradeInfo);
								expect(data.msg.upgradeInfo).hasProperties(['lv', 'rewards', 'friendsCount']);
								expect(data.msg.upgradeInfo.lv).toEqual(++curLv);
								expect(data.msg.upgradeInfo.rewards).hasProperties([
									'money', 'energy', 'skillPoint', 'elixir'
								]);
								expect(data.msg.upgradeInfo.friendsCount).toEqual(20);
							}



							// doAjax('/player/' + passer.playerId, {}, function(res) {
							// 	expect(res.data.lv).toEqual(data.msg.lv);
							// 	expect(res.data.exp).toEqual(data.msg.exp);
							// });

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
	// expect(data.msg).hasProperties([
	// 	'result',
	// 	'power_consume',
	// 	'exp_obtain',
	// 	'money_obtain',
	// 	'upgrade',
	// 	'open_box_card',
	// 	'battle_log',
	// 	'lv',
	// 	'exp',
	// 	'task',
	// 	'power',
	// 	'spiritor',
	// 	'momo'
	// ]);

	var res = data.msg;
	switch (res.result) {
		case 'fight':
			expect(res.battle_log).toBeBattleLog();
			console.log('card lv: ', res.battle_log.rewards.cards[0].lv);
			if (res.battle_log.winner == 'own') {
				expect(res.task).toEqual({
					id: task.id,
					progress: task.progress,
					mark: []
				});
				// if (oldTask.hasWin) {
				// 	expect(res.battle_log.rewards).hasProperties([
				// 		'cards', 'fragment'
				// 	]);
				// } else {
				// 	expect(res.battle_log.rewards).hasProperties([
				// 		'totalSpirit', 'cards', 'fragment'
				// 	]);
				// }


			} else {
				expect(res.task).toEqual({
					id: oldTask.id,
					progress: oldTask.progress,
					mark: []
				});
			}

			if (res.first_win) {
				expect(res.money_obtain).toBeGreaterThan(5000);
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
}