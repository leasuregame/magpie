describe('Area Server', function() {
	describe('Daily Handler >> Sign In', function() {
		beforeAll(function() {
			doAjax('/loaddata/csv', {}, function() {});
		});

		describe('area.dailyHandler.getSignInGift', function() {
			var now = new Date();
			var mkey = now.getFullYear().toString() + (now.getMonth() + 1).toString();

			describe('when had got sign in gift', function() {
				beforeEach(function() {
					var singIn = {months: {}, flag: 1};
					singIn.months[mkey] = 31;

					doAjax('/update/player/100', {
						signIn: JSON.stringify(singIn)
					}, function() {
						loginWith('arthur', '1', 1);
					});

				});

				it('should can not get sign in gift again', function() {
					request('area.dailyHandler.getSignInGift', {
						id: 1
					}, function(data) {
						console.log(data);
						expect(data.code).toEqual(501);
						expect(data.msg).toEqual('不能重复领取');
					});
				});
			});

			describe('when get sign in gift', function() {
				var singIn = {months: {}, flag: 0};
				singIn.months[mkey] = 31;

				beforeEach(function() {
					doAjax('/update/player/100', {
						signIn: JSON.stringify(singIn)
					}, function() {
						loginWith('arthur', '1', 1);
					});					
				});

				it('should can get sign in gift', function() {
					request('area.dailyHandler.getSignInGift', {
						id: 1
					}, function(data) {
						console.log(data);
						expect(data.code).toEqual(200);
					});
				});
			});

		});
	});
});