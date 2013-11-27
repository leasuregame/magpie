describe("Gate Server", function() {
	describe("Gate Handler", function() {
		describe("when request query entry server", function() {
			it("should can return a connector server host and port", function() {
				pomelo.disconnect()

				var ok = false;
				runs(function() {
					pomelo.init({
						host: '192.168.1.8',
						port: '3009'
					}, function() {
						console.log('connected to gate server!');
						ok = true;
					});
				});

				waitsFor(function() {
					return ok;
				});

				request("gate.gateHandler.queryEntry", {}, function(data) {
					console.log(data);
					expect(data.code).toEqual(200);
					expect(data.msg.host).toEqual('127.0.0.1');
					expect(_.contains([3010, 3011], data.msg.port)).toEqual(true);
					expect(data.msg.servers).toEqual([{
						id: 1,
						name: '花果山'
					}, {
						id: 2,
						name: '水帘洞'
					}]);
				});
			});
		});
	});
});