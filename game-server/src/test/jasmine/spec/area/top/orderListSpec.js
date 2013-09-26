describe("Area Server", function() {
	describe("Top Handler", function() {
		describe("area.topHandler.orderList", function() {
			beforeAll(function() {
				doAjax('/loaddata/all', {}, function() {});
			});


			describe('when get order list from server', function(){
				beforeEach(function(){
					loginWith('arthur', '1', 1);
				});

				var orders = function(items, name) {
					return items.map(function(i) {
						return i[name];
					});
				};

				it('should return the correct result', function(){
					request('area.topHandler.orderList', {}, function(data){
						expect(data.code).toEqual(200);
						expect(data.msg.level.length).toEqual(50);
						expect(data.msg.ability.length).toEqual(50);
						expect(data.msg.ranking.length).toEqual(50);
						expect(data.msg.pass.length).toEqual(0);

						expect(orders(data.msg.level, 'lv')).toEqual([ 60, 42, 40, 40, 40, 25, 20, 11, 11, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ] );
						expect(orders(data.msg.ability, 'ability')).toEqual(
							(function() {
								var abis = data.msg.ability;
								var items = [];
								for (var i = 0; i < abis.length; i++) {
									items = abis[i];
								}
								return items.sort(function(x, y) { return y - x; });
							})()
						);
						expect(orders(data.msg.ranking, 'ranking')).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50]);
						expect(orders(data.msg.pass, 'pass')).toEqual([]);
					});
				});
			});
		});
	});
});