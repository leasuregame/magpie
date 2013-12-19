describe("Area Server", function() {
	describe("Vip Handler", function() {
		describe("area.vipHandler.buyVipBox", function() {
			beforeAll(function() {
				doAjax('/loaddata/csv', {}, function() {});
			});

			describe("购买Vip礼包", function() {
				describe("当玩家不是vip身份时", function() {
					beforeEach(function() {
						loginWith('poorman', '1', 1);
					});

					it("不能购买vip礼包", function() {
						request('area.vipHandler.buyVipBox', {
							boxId: 1
						}, function(data) {
							expect(data).toEqual({
								code: 501,
								msg: '你还不是VIP1, 不能购买VIP1礼包'
							})
						});
					});
				});

				describe("当购买的礼包不存在时", function() {
					beforeEach(function() {
						loginWith('poorman', '1', 1);
					});

					it("不能购买vip礼包", function() {
						request('area.vipHandler.buyVipBox', {
							boxId: 13
						}, function(data) {
							expect(data).toEqual({
								code: 501,
								msg: '找不到礼包信息'
							})
						});
					});
				});

				describe("当玩家魔石不足时", function() {
					beforeEach(function() {
						loginWith('poorVip', '1', 1);
					});

					it("不能购买vip礼包", function() {
						request('area.vipHandler.buyVipBox', {
							boxId: 1
						}, function(data) {
							expect(data).toEqual({
								code: 501,
								msg: '魔石不足'
							});
						});
					});
				});

				describe('当资源达到上限时', function() {
					beforeEach(function() {
						doAjax('/update/player/' + 101, {
							energy: 99999,
							money: 99999999,
							skillPoint: 9999999,
							elixir: 999999,
							vip: 1
						}, function(res) {
							loginWith('user4', '1', 1);
						});
					});

					it('不能购买vip礼包', function() {
						request('area.vipHandler.buyVipBox', {
							boxId: 1
						}, function(data) {
							expect(data).toEqual({
								code: 501,
								msg: '活力值，仙币，技能点，仙丹已经达到上限，不能购买'
							});
						});
					});
				});

				describe("当玩家可以购买vip礼包时", function() {
					beforeAll(function() {
						doAjax('/update/player/' + 1, {
							vip: 12,
							energy: 0
						}, function() {});
					});

					beforeEach(function() {
						loginWith('1', '1', 1);
					});

					var countList = [0, 0, 0, 0, 0, 10, 15, 20, 15, 20, 20, 20];

					var buyVipBox = function(id) {
						it('购买vip' + id + '礼包', function() {
							request('area.vipHandler.buyVipBox', {
								boxId: id
							}, function(data) {
								console.log(data);

								expect(data.code).toEqual(200);
								expect(data.msg.cardIds.length).toEqual(countList[id - 1]);
								if (data.msg.card) {
									delete data.msg.card.id;
									expect(data.msg.card).toEqual({
										tableId: 30000,
										hp: 15,
										atk: 7,
										ability: 14,
										lv: 6,
										exp: 29,
										skillPoint: 0,
										elixirHp: 0,
										elixirAtk: 0,
										passiveSkills: []
									});
								}
							});
						});
					};

					for (var i = 1; i <= 7; i++) {
						(function(i) {
							buyVipBox(i)
						})(i);
					}
				});
			});
		});
	});
});