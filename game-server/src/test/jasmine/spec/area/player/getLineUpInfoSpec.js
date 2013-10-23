describe("Area Server", function() {
	describe("Player Handler", function() {
		describe("area.playerHandler.getLineUpInfo", function() {

			beforeAll(function() {
				doAjax('/loaddata/csv', {}, function() {});
			});

			beforeEach(function() {
				loginWith('arthur', '1', 1);
			});

			describe('when parameter is empty', function() {
				it('should can not get player lineUp info', function() {
					request('area.playerHandler.getLineUpInfo', {}, function(data) {
						expect(data).toEqual({
							code: 501,
							msg: 'id参数不能为空'
						});
					})
				});
			});

			describe('when parameter is right', function() {
				it('should can get correct player lineUp info', function() {
					request('area.playerHandler.getLineUpInfo', {
						playerId: 101
					}, function(data) {
						expect(data).toEqual({
							code: 200,
							msg: {
								lineUp: {
									2: {
										id: 106,
										tableId: 34,
										hp: 18725,
										atk: 7396,
										ability: 17654,
										lv: 50,
										exp: 10000,
										skillLv: 2,
										skillInc: 50,
										skillPoint: 0,
										elixirHp: 0,
										elixirAtk: 0,
										passiveSkills: [{
											id: 0,
											name: 'crit',
											value: 3.2
										}, {
											id: 1,
											name: 'crit',
											value: 3
										}]
									},
									3: {
										id: 107,
										tableId: 39,
										hp: 18912,
										atk: 7432,
										ability: 17576,
										lv: 50,
										exp: 10000,
										skillLv: 2,
										skillInc: 47.7,
										skillPoint: 0,
										elixirHp: 0,
										elixirAtk: 0,
										passiveSkills: [{
											id: 0,
											name: 'dmg_reduce',
											value: 3.6
										}, {
											id: 1,
											name: 'hp_improve',
											value: 1
										}]
									},
									4: {
										id: 108,
										tableId: 45,
										hp: 31786,
										atk: 13020,
										ability: 29919,
										lv: 55,
										exp: 15000,
										skillLv: 3,
										skillInc: 167.6,
										skillPoint: 0,
										elixirHp: 0,
										elixirAtk: 0,
										passiveSkills: [{
											id: 0,
											name: 'atk_improve',
											value: 2.2
										}, {
											id: 1,
											name: 'dmg_reduce',
											value: 3.2
										}, {
											id: 2,
											name: 'hp_improve',
											value: 2
										}]
									},
									5: {
										id: 109,
										tableId: 50,
										hp: 30341,
										atk: 13134,
										ability: 29238,
										lv: 55,
										exp: 15000,
										skillLv: 3,
										skillInc: 168,
										skillPoint: 0,
										elixirHp: 0,
										elixirAtk: 0,
										passiveSkills: [{
											id: 0,
											name: 'dmg_reduce',
											value: 2.3
										}, {
											id: 1,
											name: 'hp_improve',
											value: 1.7
										}, {
											id: 2,
											name: 'atk_improve',
											value: 2
										}]
									},
									6: 4
								},
								name: 'Defender',
								lv: 42,
								ability: 0
							}
						});
					})
				});
			});

		});
	});
});