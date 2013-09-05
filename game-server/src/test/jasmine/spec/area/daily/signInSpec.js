describe('Area Server', function() {
	describe('Daily Handler >> Sign In', function() {
		beforeAll(function() {
			doAjax('/loaddata/csv', {}, function() {});
		});

		

		describe('area.dailyHandler.signIn', function() {
			beforeEach(function() {
				loginWith('arthur', '1', 1);
			});
			describe('when signIn today', function() {
				it('should can sign in today', function() {
					request('area.dailyHandler.signIn', {}, function(data) {
						console.log(data);
						expect(data).toEqual({
							code: 200,
							msg: {
								money: 2000,
								energy: 100
							}
						});
					});
				});
			});
		});

		

	});
});