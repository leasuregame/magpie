 describe('Area Server', function() {
	describe('Battle Handler', function() {
		beforeAll(function() {
			doAjax('/loaddata/csv', {}, function() {});
		});

		describe('area.battleHandler.playBack', function() {
			beforeEach(function() {
				loginWith('arthur', '1', 1);
			});

			describe('when do playBack', function() {
				it('should can return the right result', function() {
					request('area.battleHandler.playBack', {battleLogId: 1}, function(data) {
						console.log(data);
						expect(data.code).toEqual(200);
					});
				});
			});
		});
	});
});