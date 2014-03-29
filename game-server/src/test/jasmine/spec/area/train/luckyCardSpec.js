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
				//MEDIUM: 2,
				HIGHT: 2
			};

			var CARD_SCOPE = {
				"1": {
					from: 0,
					to: 5
				},
				"2": {
					from: 2,
					to: 6
				}
			};

			var checkCard = function(card, min_star, max_star) {
				var card_star = card.tableId % 5;
				if (card_star == 0) card_star = 5;
				expect(card_star).toBeLessThan(max_star);
				expect(card_star).toBeGreaterThan(min_star);

				//expect(card.star % 5).toEqual(card.tableId % 5);

				var ps_names = ['crit', 'dodge', 'atk_improve', 'hp_improve', 'dmg_reduce'];
				if (card_star >= 3) {
					expect(card.passiveSkills.length).toEqual(card_star - 2);
					for (var i = 0; i < card.passiveSkills.length; i++) {
						var ps = card.passiveSkills[i];
						//expect(ps.cardId).toEqual(card.id);
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

					beforeAll(function() {
						doAjax('/clear/card', {}, function() {});
						doAjax('/update/player/' + arthur.playerId, {
							cardsCount: 1000
						}, function() {});
					});

					beforeEach(function() {
						loginWith(arthur.account, arthur.password, arthur.areaId);
					});

					var doIt = function(type, timeout, times) {
						doAjax('/player/' + arthur.playerId, {}, function(res) {
							before_gold = res.data.gold;
							before_energy = res.data.energy;
							before_fragments = res.data.fragments;
						});

						request('area.trainHandler.luckyCard', {
							type: type,
							level: level,
							times: times
						}, function(data) {
							console.log(name, data);
							if (data.code == 501 && data.msg == '卡牌容量已经达到最大值') {
								return;
							}

							expect(data.code).toEqual(200);
							if (times > 1) {
								expect(data.msg).hasProperties([
									'cards',
									'consume',
									'fragment'
								]);
							} else {
								expect(data.msg).hasProperties([
									'card',
									'consume',
									'fragment'
								]);
							}


							var card = data.msg.card || data.msg.cards[0];
							var scope = CARD_SCOPE[level];
							checkCard(card, scope["from"], scope["to"]);

							doAjax('/card/' + card.id, {}, function(res) {
								expect(_.pick(res.data,
									'id', 'tableId', 'lv', 'exp', 'skillPoint', 'elixirHp', 'elixirAtk'
								))
									.toEqual({
										id: card.id,
										tableId: card.tableId,
										lv: card.lv,
										exp: card.exp,
										skillPoint: card.skillPoint,
										elixirHp: card.elixirHp,
										elixirAtk: card.elixirAtk,
									});

								if (card.star >= 3) {
									expect(res.data.skillLv).toEqual(card.skillLv);
								}

								var pss = JSON.parse(res.data.passiveSkills);
								for (var i = 0; i < card.passiveSkills.length; i++) {
									var ps = card.passiveSkills[i];
									expect(pss[i]).toEqual({
										id: ps.id,
										//cardId: ps.cardId,
										name: ps.name,
										value: ps.value
									});
								}
							});


							doAjax('/player/' + arthur.playerId, {}, function(res) {
								if (type == LOTTERY_TYPE.GOLD) {
									expect(res.data.gold).toEqual(before_gold - data.msg.consume);
								} else {
									expect(res.data.energy).toEqual(before_energy - data.msg.consume);
								}

								if (data.msg.fragment) {
									expect(res.data.fragments).toEqual(before_fragments + 1);
								} else {
									expect(res.data.fragments).toEqual(before_fragments);
								}

							});

						}, timeout);
					};

					var LOTTERY_COUNT = 10;
					var test = function(test_name, type) {
						it(test_name, function() {
							doIt(type, 5000, 1);
						});
					};

					var test100times = function(test_name, type) {
						it(test_name + ' >> ' + LOTTERY_COUNT + ' times', function() {
							for (var i = 0; i < LOTTERY_COUNT; i++) {
								(function(i) {
									doIt(type, 15000, 10);
								})(i);
							}
						});
					};

					test("元宝抽卡 >> should can be get a lucky card", LOTTERY_TYPE.GOLD);
					test100times('元宝抽卡', LOTTERY_TYPE.GOLD);

					test("活力值抽卡 >> should can be get a lucky card", LOTTERY_TYPE.ENERGY);
					test100times('活力值抽卡', LOTTERY_TYPE.ENERGY);
				});
			};

			execute_suit('普通抽卡', GRADE.LOWER);
			execute_suit('高级抽卡', GRADE.HIGHT);

			describe("when gold or energy is not enought", function() {

				it("魔石不足时，不能抽卡", function() {
					doAjax('/update/player/104', {
						firstTime: JSON.stringify({
							highLuckyCard: 0,
							lowLuckyCard: 0
						})
					}, function() {
						loginWith('user3', '1', 1);
					});

					request('area.trainHandler.luckyCard', {
						type: LOTTERY_TYPE.GOLD,
						level: 1
					}, function(data) {
						console.log(data);
						expect(data.code).toEqual(501);
						expect(data.msg).toEqual('没有足够的资源来完成本次抽卡');
					});
				});

				it("友情值不足时，不能抽卡", function() {
					loginWith('user2', '1', 1);
					request('area.trainHandler.luckyCard', {
						type: LOTTERY_TYPE.ENERGY,
						level: 1
					}, function(data) {
						console.log(data);
						expect(data.code).toEqual(501);
						expect(data.msg).toEqual('没有足够的资源来完成本次抽卡');
					});
				});
			});

			describe("当次数达到上限时", function() {

				beforeAll(function() {
					doAjax('/update/player/108', {
						rowFragmentCount: 99,
						highFragmentCount: 39,
						highDrawCardCount: 239,
						firstTime: JSON.stringify({
							lowLuckyCard: 0,
							highLuckyCard: 0
						}),
						gold: 300
					}, function(data) {
						console.log(data);
					});
				});

				beforeEach(function() {
					loginWith('user5', '1', 1);
				})

				it('普通抽卡可以获得卡魂', function() {

					request('area.trainHandler.luckyCard', {
						type: LOTTERY_TYPE.GOLD,
						level: 1
					}, function(data) {
						console.log(data);
						expect(data.code).toEqual(200);
						expect(data.msg.fragment).toEqual(1);
					});
				});

				it('高级抽卡可以获得5星卡和卡魂', function() {
					request('area.trainHandler.luckyCard', {
						type: LOTTERY_TYPE.GOLD,
						level: 2
					}, function(data) {
						console.log(data);
						expect(data.code).toEqual(200);
						// expect(data.msg).toEqual('没有足够的资源来完成本次抽卡');
						expect(data.msg.fragment).toEqual(1);
						var star = data.msg.card.tableId % 5 || 5;
						expect(star).toEqual(5);
					});
				});

				it('记录可以归零', function() {
					doAjax('/player/' + arthur.playerId, {}, function(res) {
						res.rowFragmentCount.toEqual(0);
						res.highFragmentCount.toEqual(0);
						res.highDrawCardCount.toEqual(0);
					});
				});

			});

			describe('第一次抽卡', function() {
				describe('普通抽卡', function() {
					beforeEach(function() {
						loginWith('115', '1', 1);
					});

					it('只有第一次免费', function() {
						request('area.trainHandler.luckyCard', {
							type: LOTTERY_TYPE.GOLD,
							level: 1
						}, function(data) {
							console.log(data);
							expect(data.code).toEqual(200);
							expect(data.msg.fragment).toEqual(0);
							var star = data.msg.card.tableId % 5 || 5;
							expect(star).toEqual(3);
						});

						request('area.trainHandler.luckyCard', {
							type: LOTTERY_TYPE.GOLD,
							level: 1
						}, function(data) {
							console.log(data);
							expect(data.code).toEqual(501);
							expect(data.msg).toEqual('没有足够的资源来完成本次抽卡');
						});
					});
				});

				describe('高级抽卡', function() {
					beforeEach(function() {
						doAjax('/update/player/108', {
							firstTime: JSON.stringify({
								lowLuckyCard: 1,
								highLuckyCard: 1
							}),
							gold: 0
						}, function(data) {
							loginWith('user5', '1', 1);
						});
					});

					it('只有第一次免费', function() {
						request('area.trainHandler.luckyCard', {
							type: LOTTERY_TYPE.GOLD,
							level: 2
						}, function(data) {
							console.log(data);
							expect(data.code).toEqual(200);
							expect(data.msg.fragment).toEqual(0);
							var star = data.msg.card.tableId % 5 || 5;
							expect(star).toEqual(4);
						});

						request('area.trainHandler.luckyCard', {
							type: LOTTERY_TYPE.GOLD,
							level: 2
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
});


// describe("Area Server", function() {

//     describe("Train Handler", function() {
//         var arthur = {
//             id: 100,
//             playerId: 100,
//             areaId: 1,
//             account: 'arthur',
//             password: '1'
//         };
//         beforeAll(function() {
//             doAjax('/loaddata/csv', {}, function(data) {
//                 expect(data).toEqual('done');
//             });

//             doAjax('/clear/card', {}, function(){});
//         });

//         describe("area.trainHandler.luckyCard", function() {
//             var LOTTERY_TYPE = {
//                 GOLD: 1,
//                 ENERGY: 0
//             };

//             var GRADE = {
//                 LOWER: 1,
//                 HIGHT: 2
//             };

//             var execute_suit = function(name, level) {
//                 describe(name, function() {
//                     var before_gold, before_energy, before_fragments;

//                     beforeEach(function() {
//                         loginWith(arthur.account, arthur.password, arthur.areaId);
//                     });

//                     var doIt = function(type, timeout) {
//                         doAjax('/player/' + arthur.playerId, {}, function(res) {
//                             before_gold = res.data.gold;
//                             before_energy = res.data.energy;
//                             before_fragments = res.data.fragments;
//                         });

//                         request('area.trainHandler.luckyCard', {
//                             type: type,
//                             level: level
//                         }, function(data) {
//                             console.log(name, data);
//                             expect(data.code).toEqual(200);
//                             expect(data.msg).hasProperties([
//                                 'card',
//                                 'consume',
//                                 'fragment'
//                             ]);

//                             expect(data.msg.fragment).toEqual(0);

//                             var card = data.msg.card;
//                             var scope = CARD_SCOPE[level];


//                             doAjax('/player/' + arthur.playerId, {}, function(res) {
//                                 if (type == LOTTERY_TYPE.GOLD) {
//                                     expect(res.data.gold).toEqual(before_gold - data.msg.consume);
//                                 } else {
//                                     expect(res.data.energy).toEqual(before_energy - data.msg.consume);
//                                 }

//                                 if (data.msg.fragment) {
//                                     expect(res.data.fragments).toEqual(before_fragments + 1);
//                                 } else {
//                                     expect(res.data.fragments).toEqual(before_fragments);
//                                 }

//                             });

//                         }, timeout);
//                     };

//                     var test = function(test_name, type, times) {
//                         it(test_name + ' >> should can not get fragment', function() {
//                             for (var i = 0; i < times; i++) {
//                                 (function(i) {
//                                     doIt(type, 15000);
//                                 })(i);
//                             }
//                         });
//                     };

//                     var times = 0;
//                     if(level == GRADE.LOWER)
//                         times = 50;
//                     else
//                         times = 20;
//                     test(name, LOTTERY_TYPE.GOLD,times);

//                 });
//             };

//             execute_suit('普通抽卡1', GRADE.LOWER);
//             execute_suit('高级抽卡1', GRADE.HIGHT);

//         });
//     });
// });