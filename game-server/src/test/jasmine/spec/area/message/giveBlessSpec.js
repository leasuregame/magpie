describe("Area Server", function() {
	describe('Message Handler', function() {
		describe('area.messageHandler.giveBless', function() {
			var arthur = {
				id: 100,
				playerId: 100,
				areaId: 1,
				account: 'arthur',
				password: '1'
			};

			beforeAll(function() {
				doAjax('/loaddata/csv', {}, function() {});
			});

			describe('when a player is my friend', function() {
				beforeEach(function() {
					loginWith(arthur.account, arthur.password, arthur.areaId);
				});

				it('should can give bless to him', function() {
					request('area.messageHandler.giveBless', {
						friendId: 1
					}, function(data) {
						expect(data).toEqual({
							code: 3004
						});
					});
				});
			});

			describe('when receive bless from a friend', function() {
				describe('when the message is not mine', function() {
					beforeEach(function() {
						loginWith(arthur.account, arthur.password, arthur.areaId);
					});

					it('should can not handler the messages that not sended to me', function() {
						request('area.messageHandler.receiveBless', {
							msgId: 1
						}, function(data) {
							expect(data).toEqual({
								code: 501,
								msg: '你没有权限处理此消息'
							});
						});
					});
				});

				describe('when the message is mine', function(){
					beforeEach(function() {
						loginWith('1', '1', 1);
					});

					it('should can not handler the messages that not sended to me', function() {
						request('area.messageHandler.receiveBless', {
							msgId: 1
						}, function(data) {
							expect(data).toEqual({
								code: 200
							});
						});
					});
				});

			});


		});
	});
});