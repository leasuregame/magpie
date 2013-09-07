describe('Area Server', function() {
	describe('Daily Handler >> Sign In', function() {
		beforeAll(function() {
			doAjax('/loaddata/csv', {}, function() {});
		});
		describe('area.dailyHandler.signInDetails', function() {
			beforeEach(function() {
				loginWith('arthur', '1', 1);
			});
			describe('when get sign in details', function() {
				it('should can return sign in info', function() {
					request('area.dailyHandler.signInDetails', {}, function(data) {
						console.log(data);
						expect(data).toEqual('');
					});
				});
			});
		});
	});
});