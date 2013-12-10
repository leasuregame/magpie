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
				var today = new Date();
				var day = today.getDate();
				var key = today.getFullYear().toString() + (today.getMonth() + 1).toString();

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
					console.log(day, key);
					doAjax('/player/' + 100, {}, function(res) {
						expect(JSON.parse(res.data.signIn)[key]).toEqual({
							mark: 0 | (1 << (day - 1)),
							flag: 0
						});
					});
				});
			});
		});

		describe('area.dailyHandler.reSignIn', function(){
			beforeEach(function() {
				doAjax('/update/player/' + 101, {
					signIn: JSON.stringify({
						201310: {
							makr: 0,
							flag: 0
						}
					})
				}, function(){
					loginWith('user4', '1', 1);
				});
				
			});

			describe('when resignIn', function() {
				var today = new Date();
				var day = today.getDate();
				var key = today.getFullYear().toString() + (today.getMonth() + 1).toString();

				it('should can resign in', function() {
					request('area.dailyHandler.reSignIn', {}, function(data) {
						console.log(data);
						expect(data).toEqual({
							code: 200,
							msg: {
								day: 1,
								goldResume: 20,
								reward: {
									money: 2000,
									energy: 100
								}
							}
						});
					});
					console.log(day, key);
					doAjax('/player/' + 101, {}, function(res) {
						expect(JSON.parse(res.data.signIn)[key]).toEqual({
							mark: 1,
							flag: 0
						});
					});
				});
			});
		})

	});
});