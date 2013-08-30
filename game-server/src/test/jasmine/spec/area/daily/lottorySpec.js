describe('Area Server', function() {
	describe('Daily Handler', function() {
		beforeAll(function() {
			doAjax('/loaddata/csv', {}, function() {});
		});

		describe('area.dailyHandler.lottery', function() {
			beforeEach(function() {
				loginWith('arthur', '1', 1);
			});

			describe('when do a lottery', function() {
				it('should can return the right result', function() {
					request('area.dailyHandler.lottery', {}, function(data) {
						console.log(data);
						expect(data.code).toEqual(200);
						expect(data.msg.resourceId).toBeLessThan(20);
						expect(data.msg.resourceId).toBeGreaterThan(-1);
					});
				});
			});

			// describe('when do 10000 times lottery', function() {
			// 	it('should distribute with the rates', function() {
			// 		var results = {}
			// 		var ok = false;
			// 		runs(function() {
			// 			for (var i = 0; i < 10000; i++) {
			// 				(function(i) {
			// 					request('area.dailyHandler.lottery', {}, function(data) {
			// 						if (typeof results[data.msg.resourceId] == 'undefined') {
			// 							results[data.msg.resourceId] = 1;
			// 						} else {
			// 							results[data.msg.resourceId] += 1;
			// 						}
			// 						console.log(i, results);
			// 						if (i == 9999) {
			// 							ok = true;
										
			// 						}
			// 					});
			// 				})(i);
			// 			}
			// 		});
			// 		waitsFor(function() {
			// 			return ok;
			// 		});
			// 		console.log(results);
			// 		expect(results).toEqual({});
			// 	});
			// });
		});
	});
});