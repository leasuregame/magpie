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

		describe("area.trainHandler.strengthen", function() {

			describe("when start a strengthen", function() {

				var before_player, before_card;

				beforeEach(function() {
					loginWith(arthur.account, arthur.password, arthur.areaId);

					doAjax('/player/' + arthur.playerId, {}, function(res) {
						before_player = res.data;
					});

					doAjax('/card/' + 100, {}, function(res) {
						before_card = res.data;
					});
				});

				it("should can be strenthen, and return properties", function() {
					request('area.trainHandler.strengthen', {
						target: 100,
						sources: [150, 151]
					}, function(data) {
						console.log(data);
						expect(data.code).toEqual(200);
						expect(data.msg).hasProperties([
							'exp_obtain',
							'money_consume',
							'cur_lv',
							'cur_exp',
                            'ability'
						]);

						expect(data.msg.exp_obtain).toEqual(254534);
						expect(data.msg.money_consume).toEqual(729864);
						expect(data.msg.cur_lv).toEqual(55);
						expect(data.msg.cur_exp).toEqual(0);


						doAjax('/player/' + arthur.playerId, {}, function(res) {
							var _player = res.data;
							expect(_player.money).toEqual(before_player.money - data.msg.money_consume);
						});

						doAjax('/card/' + 100, {}, function(res) {
							var _card = res.data;
							expect(_card.lv).toEqual(data.msg.cur_lv);
							expect(_card.exp).toEqual(data.msg.cur_exp);
						});

						doAjax('/card/' + 150, {}, function(res) {
							expect(res).toEqual({
								code: 404,
								data: 'card not exists'
							});
						});

						doAjax('/card/' + 151, {}, function(res) {
							expect(res).toEqual({
								code: 404,
								data: 'card not exists'
							});
						});

					});
				});

				it("卡牌强化并升级, 当1星1级卡牌吞掉两张1星1级的卡牌时", function() {
					request('area.trainHandler.strengthen', {
						target: 250,
						sources: [251, 252]
					}, function(data) {
						console.log(data);
						expect(data.code).toEqual(200);

						expect(data.msg.exp_obtain).toEqual(230);
						expect(data.msg.money_consume).toEqual(247);
						expect(data.msg.cur_lv).toEqual(3);
						expect(data.msg.cur_exp).toEqual(89);

						doAjax('/card/' + 250, {}, function(res) {
							var _card = res.data;
							expect(_card.lv).toEqual(data.msg.cur_lv);
							expect(_card.exp).toEqual(data.msg.cur_exp);
						});

						doAjax('/card/' + 251, {}, function(res) {
							expect(res).toEqual({
								code: 404,
								data: 'card not exists'
							});
						});

						doAjax('/card/' + 252, {}, function(res) {
							expect(res).toEqual({
								code: 404,
								data: 'card not exists'
							});
						});
					});
				});
			});

			describe("when money is not enought", function() {
				var poorman = {
					account: 'poorman',
					password: '1',
					areaId: 1,
					id: 106,
					playerId: 106
				}

				beforeEach(function() {
					loginWith(poorman.account, poorman.password, poorman.areaId);
				});

				it("should warnning a message that can not find source card", function() {
					request('area.trainHandler.strengthen', {
						target: 160,
						sources: [150, 151]
					}, function(data) {
						console.log(data);
						expect(data.code).toEqual(501);
						expect(data.msg).toEqual('找不到素材卡牌');
					});
				});

				it("should warnning a message that can not find target card", function() {
					request('area.trainHandler.strengthen', {
						target: 100,
						sources: [161, 162]
					}, function(data) {
						console.log(data);
						expect(data.code).toEqual(501);
						expect(data.msg).toEqual('找不到目标卡牌');
					});
				});

				it("should warnning a message that money is not enought", function() {
					request('area.trainHandler.strengthen', {
						target: 160,
						sources: [161, 162]
					}, function(data) {
						console.log(data);
						expect(data.code).toEqual(501);
						expect(data.msg).toEqual('铜板不足');
					});
				});

				describe("when parameter sources is empty", function() {
					it("should warning a message", function() {
						request('area.trainHandler.strengthen', {
							target: 160,
							sources: []
						}, function(data) {
							console.log(data);
							expect(data.code).toEqual(501);
							expect(data.msg).toEqual('素材卡牌不能为空');
						});
					});
				});
			});



		});
	});
});