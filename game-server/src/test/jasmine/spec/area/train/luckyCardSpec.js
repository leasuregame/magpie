describe("Area Server", function() {

	describe("Train Handler", function() {
		var arthur = {
			id: 100,
			playerId: 100,
			areaId: 1,
			account: 'arthur',
			password: '1'
		};
		beforeAll(function() {
			doAjax('/loaddata/csv', {}, function(data) {
				expect(data).toEqual('done');
			});
		});

		describe("area.trainHandler.luckyCard", function() {
			var LOTTERY_TYPE = {
				GOLD: 1,
				ENERGY: 0
			};

			var GRADE = {
				LOWER: 1,
				MEDIUM: 2,
				HIGHT: 3
			};

			var CARD_SCOPE = {
				"1": {
					from: 0,
					to: 6
				},
				"2": {
					from: 1,
					to: 6
				},
				"3": {
					from: 2,
					to: 6
				}
			};

			var checkCard = function(card, min_star, max_star) {
				console.log('star: ', card.star);
				expect(card.star).toBeLessThan(max_star);
				expect(card.star).toBeGreaterThan(min_star);

				expect(card.star % 5).toEqual(card.tableId % 5);

				var ps_names = ['crit', 'dodge', 'atk_improve', 'hp_improve', 'dmg_reduce'];
				if (card.star >= 3) {
					expect(card.passiveSkills.length).toEqual(card.star - 2);
					for (var i = 0; i < card.passiveSkills.length; i++) {
						var ps = card.passiveSkills[i];
						expect(ps.cardId).toEqual(card.id);
						expect(ps.value).toBeLessThan(5);
						expect(ps.value).toBeGreaterThan(0);
						expect(ps_names).toContain(ps.name);
					}
				} else {
					expect(card.passiveSkills.length).toEqual(0);
				}
			};

			var execute_suit = function(name, level) {
				describe(name, function() {
					var before_gold, before_energy, before_fragments;

					beforeEach(function() {
						loginWith(arthur.account, arthur.password, arthur.areaId);

						doAjax('/player/' + arthur.playerId, {}, function(res) {
							before_gold = res.data.gold;
							before_energy = res.data.energy;
							before_fragments = res.data.fragments;
						});
					});

					var test = function(test_name, type) {
						it(test_name, function() {
							request('area.trainHandler.luckyCard', {
								type: type,
								level: level
							}, function(data) {
								console.log(name, test_name, data);
								expect(data.code).toEqual(200);
								expect(data.msg).hasProperties([
									'card',
									'consume',
									'hasFragment'
								]);

								var card = data.msg.card;
								var scope = CARD_SCOPE[level];
								checkCard(card, scope.from, scope.to);

								doAjax('/card/' + card.id, {}, function(res) {
									expect(res.data).toEqual({
										id: card.id,
										createTime: card.createTime,
										playerId: card.playerId,
										tableId: card.tableId,
										star: card.star,
										lv: card.lv,
										exp: card.exp,
										skillLv: card.skillLv,
										skillPoint: card.skillPoint,
										elixir: card.elixir,
										hpAddition: card.hpAddition,
										atkAddition: card.atkAddition
									});
								});

								card.passiveSkills.forEach(function(ps) {
									doAjax('/passiveSkill/' + ps.id, {}, function(res) {
										expect(res.data).toEqual({
											id: ps.id,
											createTime: ps.createTime,
											cardId: ps.cardId,
											name: ps.name,
											value: ps.value
										});
									});
								});

								doAjax('/player/' + arthur.playerId, {}, function(res) {
									if (type == LOTTERY_TYPE.GOLD) {
										expect(res.data.gold).toEqual(before_gold - data.msg.consume);
									} else {
										expect(res.data.energy).toEqual(before_energy - data.msg.consume);
									}

									if (data.msg.hasFragment) {
										expect(res.data.fragments).toEqual(before_fragments + 1);
									} else {
										expect(res.data.fragments).toEqual(before_fragments);
									}

								});

							});
						});
					};

					test("元宝抽卡 >> should can be get a lucky card", LOTTERY_TYPE.GOLD);
					test("活力值抽卡 >> should can be get a lucky card", LOTTERY_TYPE.ENERGY);

				});
			};

			execute_suit('低级抽卡', GRADE.LOWER);
			execute_suit('中级抽卡', GRADE.MEDIUM);
			execute_suit('高级抽卡', GRADE.HIGHT);

			describe("when gold or energy is not enought", function() {
				it("元宝不足时，不能抽卡", function() {
					request('area.trainHandler.luckyCard', {
						playerId: 104,
						type: LOTTERY_TYPE.GOLD,
						level: 1
					}, function(data) {
						console.log(data);
						expect(data.code).toEqual(501);
						expect(data.msg).toEqual('没有足够的资源来完成本次抽卡');
					});
				});

				it("友情值不足时，不能抽卡", function() {
					request('area.trainHandler.luckyCard', {
						playerId: 105,
						type: LOTTERY_TYPE.ENERGY,
						level: 1
					}, function(data) {
						console.log(data);
						expect(data.code).toEqual(501);
						expect(data.msg).toEqual('没有足够的资源来完成本次抽卡');
					});
				});

			});
		});
	});
});