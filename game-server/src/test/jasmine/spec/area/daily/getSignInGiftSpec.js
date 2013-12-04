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
					var singIn = {};
					singIn[mkey] = {
						mark: 31,
						flag: 1
					};

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
				var singIn = {};
				singIn[mkey] = { mark: 2147483647, flag: 0};

				beforeEach(function() {
					doAjax('/update/player/101', {
						signIn: JSON.stringify(singIn)
					}, function() {
						loginWith('user4', '1', 1);
					});
				});
				for (var i = 1; i <= 5; i++) {
					(function(id) {
						it('should can get sign in gift, id = ' + id, function() {
							request('area.dailyHandler.getSignInGift', {
								id: id
							}, function(data) {
								console.log(data);
								expect(data.code).toEqual(200);
							});
						});
					})(i);
				}
			});

			describe('when signIn days is not enough and get sign in gift', function() {
				var singIn = {
				};
				singIn[mkey] = {mark: 1, flag: 0};

				beforeEach(function() {
					doAjax('/update/player/102', {
						signIn: JSON.stringify(singIn)
					}, function() {
						loginWith('mike', '1', 1);
					});
				});

				var cMap = {
					1: 5,
					2: 10,
					3: 18,
					4: 25,
					5: new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
				};

				for (var i = 1; i <= 5; i++) {
					(function(id) {
						it('should can not get sign in gift, id = ' + id, function() {
							request('area.dailyHandler.getSignInGift', {
								id: id
							}, function(data) {
								console.log(data);
								expect(data).toEqual({
									code: 501,
									msg: '签到次数不足'+cMap[id]+'次'
								});
							});
						});
					})(i);
				}
			});


		});
	});
});