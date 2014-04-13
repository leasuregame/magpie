describe("Area Server", function() {
  describe("Greeting Handler", function() {
    describe("area.greetingHandler.getLatest", function() {
      beforeAll(function() {
        doAjax('/loaddata/csv', {}, function() {});
      });

      describe('当没有任何喊话记录时', function() {
        beforeEach(function() {
          loginWith('arthur', '1', 1);
        });

        it('拿到的是空列表', function() {
          request('area.greetingHandler.getLatest', {}, function(data) {
            expect(data).toEqual({
              code: 200,
              msg: []
            })
          });
        });
      });

      describe('当有玩家的喊话记录时', function() {
        beforeEach(function() {
          doAjax('/create/greeting', {
            playerId: 1,
            playerName: 'Linc',
            content: 'hi, all.',
            created: '2014-2-17 10:55:23'
          }, function() {});

          doAjax('/create/greeting', {
            playerId: 2,
            playerName: 'Mike',
            content: 'hi, all.',
            created: '2014-2-17 10:55:10'
          }, function() {});

          doAjax('/create/greeting', {
            playerId: 101,
            playerName: 'Defender',
            content: 'hi, all.',
            created: '2014-2-17 10:55:30'
          }, function() {});

          loginWith('arthur', '1', 1);
        });

        it('可以拿到最近的50条记录', function() {

          request('area.greetingHandler.getLatest', {}, function(data) {
            expect(data).toEqual({
              code: 200,
              msg: [{
                content: 'hi, all.',
                name: 'Defender',
                created: 1392605730000
              }, {
                content: 'hi, all.',
                name: 'Linc',
                created: 1392605723000
              }, {
                content: 'hi, all.',
                name: 'Mike',
                created: 1392605710000
              }]
            })
          });

        });
      });

    });
  });
});