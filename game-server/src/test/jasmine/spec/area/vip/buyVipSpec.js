describe("Area Server", function(){
	describe("Vip Handler", function(){
		describe("area.vipHandler.buyVip", function(){
			beforeAll(function(){
				doAjax('/loaddata/csv', {}, function(){});
			});

			describe("购买VIP", function(){
				beforeEach(function(){
					loginWith('arthur', '1', 1);
				})
				
				var moneyList = [10, 50, 100, 200, 500, 1000, 2000, 5000, 8000, 10000, 20000, 50000];
				
				var buyVip = function(lv) {
					it("VIP " + lv, function(){
						request('area.vipHandler.buyVip', {cash: moneyList[lv -1]}, function(data) {
							expect(data.code).toEqual(200);
							expect(data.msg.player.vip).toEqual(lv);
							expect(data.msg.player).hasProperties('vip', 'dailyGift', 'spiritPool');
						});
					});
				};

				for (var i = 1; i <= 12; i++) {
					buyVip(i);
				}
			});

			

			

		});
	});
});