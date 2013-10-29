describe("Area Server", function() {
	describe("Vip Handler", function() {
		describe("area.vipHandler.buyVip", function() {
			beforeAll(function() {
				doAjax('/loaddata/csv', {}, function() {});
			});

			describe("购买VIP", function() {
				beforeEach(function() {
					loginWith('arthur', '1', 1);
				});

				var buyVip = function(id, lv) {
					it('充值类型id：' + id + ', vip ' + lv, function() {
						request('area.vipHandler.buyVip', {
							id: id
						}, function(data) {
							console.log(data.msg);
							expect(data.code).toEqual(200);
							expect(data.msg.player.vip).toEqual(lv);
							expect(data.msg.player).hasProperties('vip', 'dailyGift', 'spiritPool');
						});
					});
				};

				var ids = [
					[1, 1], // 10 vip1
					[3, 2], // 60 vip2
					[4, 3], // 160 vip3
					[5, 4], // 360 vip4
					[6, 5], // 860 vip5
					[7, 5], // 1460 vip5
					[7, 6], // 2060 vip6 200
					[7, 6], // 2660 vip6 800
					[7, 6], // 3260 vip6 1200
					[7, 7], // 3860 vip7 1800
					[7, 7], // 4260 vip8 400
					[7, 7], // 4860
					[7, 7], // 5460
					[7, 7], // 6060
					[7, 7], // 6660 
					[7, 7], // 7260
					[7, 7], // 7860
					[7, 7], // 8460
					[7, 8], // 9060
				];

				for (var i = 0; i < ids.length; i++) {
					(function(id, lv) {
						buyVip(id, lv);
					})(ids[i][0], ids[i][1]);
				}
			});
		});
	});
});