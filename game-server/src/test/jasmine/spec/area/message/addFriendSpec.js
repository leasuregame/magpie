describe("Area Server", function(){
	describe('Message Handler', function(){
		describe('area.messageHandler.addFriend', function(){
			var arthur = {
				id: 100,
				playerId: 100,
				areaId: 1,
				account: 'arthur',
				password: '1'
			};

			beforeAll(function(){
				doAjax('/loaddata/csv', {}, function(){});
			});

			beforeEach(function(){
				loginWith(arthur.account, arthur.password, arthur.areaId);
			});

			describe('when asking to add an exist player as a friend', function(){
				it('should can send the message', function(){
					request('area.messageHandler.addFriend', {name: 'Mike'}, function(data){
						expect(data).toEqual('');
					});
				});
			});

			describe('when receive a friendship asking', function(){
				it('should can accept', function(){
					request('area.messageHandler.accept', {msgId: 1}, function(data){
						expect(data).toEqual('')
					});
				});

				it('should can reject', function(){
					request('area.messageHandler.reject', {msgId: 1}, function(data){
						expect(data).toEqual('')
					});
				});
			});

			describe('')
		});
	});
});
