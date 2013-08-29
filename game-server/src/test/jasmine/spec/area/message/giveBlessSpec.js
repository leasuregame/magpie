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

			beforeEach(function() {
				loginWith(arthur.account, arthur.password, arthur.areaId);
			});

			describe('when a player is my friend', function(){
				it('should can give bless to him', function(){
					request('area.messageHandler.giveBless', {friendId: 1}, function(data){
						expect(data).toEqual('');
					});
				});
			});

			describe('when receive bless from a friend', function(){
				it('should can get energy', function(){
					request('area.messageHandler.receiveBless', {msgId: 1}, function(data){
						expect(data).toEqual('');
					});
				});
			});


		});
	});
});