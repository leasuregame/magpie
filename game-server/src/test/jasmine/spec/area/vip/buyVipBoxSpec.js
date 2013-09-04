describe("Area Server", function() {
	describe("Vip Handler", function() {
		describe("area.vipHandler.buyVipBox", function() {
			beforeAll(function(){
				doAjax('/loaddata/csv', {}, function(){});
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

				describe("当玩家元宝不足时", function() {
					beforeEach(function() {
						loginWith('poorman', '1', 1);
					});

					it("不能购买vip礼包", function() {
						request('area.vipHandler.buyVip', {
							id: 1
						}, function(data) {
							expect(data.code).toEqual(200);
						});

						request('area.vipHandler.buyVipBox', {
							boxId: 1
						}, function(data) {
							expect(data).toEqual({
								code: 501,
								msg: '元宝不足'
							});
						});
					});
				});

				describe("当玩家可以购买vip礼包时", function() {
					beforeAll(function(){
						doAjax('/update/player/' + 100, {vip: 12}, function(){});
					});

					beforeEach(function() {
						loginWith('arthur', '1', 1);
					});

					var vipBoxInfo = {
						1: {boxInfo: { id : 1, power : 100, energy : 500, money : 100000, price : 10 }, card : { }, qty : 0 },
						2: {boxInfo: {id : 2, power : 120, energy : 600, money : 120000, skillPoint : 1000, price : 50 }, card : { }, qty : 0 } ,
						3: {boxInfo: {id : 3, power : 140, energy : 700, money : 150000, skillPoint : 1100, elixir : 1000, price : 100 }, card : { }, qty : 0 } ,
						4: {boxInfo: {id : 4, power : 160, energy : 800, money : 200000, skillPoint : 1200, elixir : 1500, fragments : 3, price : 200 }, card : { }, qty : 0 },
						5: {boxInfo: {id : 5, power : 180, energy : 900, money : 250000, skillPoint : 2000, elixir : 2000, fragments : 3, price : 300 }, card : { }, qty : 0 },
						6: {boxInfo: {id : 6, power : 200, energy : 1000, money : 300000, skillPoint : 2100, elixir : 2500, fragments : 3, exp_card : 10, price : 400 }, card : { id : 307, createTime : 1378203349842, playerId : 100, tableId : 30000, init_hp : 15, init_atk : 7, hp : 15, atk : 7, incs : { group_hp : 0, group_atk : 0, spirit_hp : 0, spirit_atk : 0, ps_hp : 0, ps_atk : 0, elixir_hp : 0, elixir_atk : 0 }, star : 1, lv : 6, exp : 29, skillLv : 0, skillPoint : 0, elixir : 0, hpAddition : 0, atkAddition : 0, passiveSkills : [ ] }, qty : 10 } ,
						7: {boxInfo: {id : 7, power : 200, energy : 1100, money : 350000, skillPoint : 2200, elixir : 3000, fragments : 3, exp_card : 15, price : 500 }, card : { id : 316, createTime : 1378203350092, playerId : 100, tableId : 30000, init_hp : 15, init_atk : 7, hp : 15, atk : 7, incs : { group_hp : 0, group_atk : 0, spirit_hp : 0, spirit_atk : 0, ps_hp : 0, ps_atk : 0, elixir_hp : 0, elixir_atk : 0 }, star : 1, lv : 6, exp : 29, skillLv : 0, skillPoint : 0, elixir : 0, hpAddition : 0, atkAddition : 0, passiveSkills : [ ] }, qty : 15 },
						8: {boxInfo: {id : 8, power : 200, energy : 1200, money : 400000, skillPoint : 5000, elixir : 5000, fragments : 5, exp_card : 20, price : 600 }, card : { id : 331, createTime : 1378203350335, playerId : 100, tableId : 30000, init_hp : 15, init_atk : 7, hp : 15, atk : 7, incs : { group_hp : 0, group_atk : 0, spirit_hp : 0, spirit_atk : 0, ps_hp : 0, ps_atk : 0, elixir_hp : 0, elixir_atk : 0 }, star : 1, lv : 6, exp : 29, skillLv : 0, skillPoint : 0, elixir : 0, hpAddition : 0, atkAddition : 0, passiveSkills : [ ] }, qty : 20 },
						9: {boxInfo: {id : 9, power : 200, energy : 1300, money : 450000, skillPoint : 5100, elixir : 5500, fragments : 5, exp_card : 15, price : 700 }, card : { id : 351, createTime : 1378203350611, playerId : 100, tableId : 30000, init_hp : 15, init_atk : 7, hp : 15, atk : 7, incs : { group_hp : 0, group_atk : 0, spirit_hp : 0, spirit_atk : 0, ps_hp : 0, ps_atk : 0, elixir_hp : 0, elixir_atk : 0 }, star : 1, lv : 6, exp : 29, skillLv : 0, skillPoint : 0, elixir : 0, hpAddition : 0, atkAddition : 0, passiveSkills : [ ] }, qty : 15 },
						10: {boxInfo: {id : 10, power : 200, energy : 1400, money : 500000, skillPoint : 10000, elixir : 6000, fragments : 10, exp_card : 20, price : 800 }, card : { id : 366, createTime : 1378203350892, playerId : 100, tableId : 30000, init_hp : 15, init_atk : 7, hp : 15, atk : 7, incs : { group_hp : 0, group_atk : 0, spirit_hp : 0, spirit_atk : 0, ps_hp : 0, ps_atk : 0, elixir_hp : 0, elixir_atk : 0 }, star : 1, lv : 6, exp : 29, skillLv : 0, skillPoint : 0, elixir : 0, hpAddition : 0, atkAddition : 0, passiveSkills : [ ] }, qty : 20 } ,
						11: {boxInfo: {id : 11, power : 200, energy : 1500, money : 550000, skillPoint : 11000, elixir : 7000, fragments : 10, exp_card : 20, price : 900 }, card : { id : 386, createTime : 1378203351176, playerId : 100, tableId : 30000, init_hp : 15, init_atk : 7, hp : 15, atk : 7, incs : { group_hp : 0, group_atk : 0, spirit_hp : 0, spirit_atk : 0, ps_hp : 0, ps_atk : 0, elixir_hp : 0, elixir_atk : 0 }, star : 1, lv : 6, exp : 29, skillLv : 0, skillPoint : 0, elixir : 0, hpAddition : 0, atkAddition : 0, passiveSkills : [ ] }, qty : 20 } ,
						12:  {boxInfo: {id : 12, power : 200, energy : 1600, money : 600000, skillPoint : 15000, elixir : 10000, fragments : 10, exp_card : 20, price : 1000 }, card : { id : 406, createTime : 1378203351489, playerId : 100, tableId : 30000, init_hp : 15, init_atk : 7, hp : 15, atk : 7, incs : { group_hp : 0, group_atk : 0, spirit_hp : 0, spirit_atk : 0, ps_hp : 0, ps_atk : 0, elixir_hp : 0, elixir_atk : 0 }, star : 1, lv : 6, exp : 29, skillLv : 0, skillPoint : 0, elixir : 0, hpAddition : 0, atkAddition : 0, passiveSkills : [ ] }, qty : 20 }
					};

					var buyVipBox = function(id) {
						it('购买vip' + id + '礼包', function() {
							request('area.vipHandler.buyVipBox', {
								boxId: id
							}, function(data) {
								expect(data.boxInfo).toEqual(vipBoxInfo[id].bonxInfo);
							});
						});
					};

					for (var i = 1; i <= 12; i++) {
						(function(i) {
							buyVipBox(i)
						})(i);
					}
				});
			});
		});
	});
});

