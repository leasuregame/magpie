describe("Area Server", function() {

  describe("Train Handler", function() {
    var user1 = {
      id: 1,
      playerId: 1,
      areaId: 1,
      account: '1',
      password: '1'
    };
    beforeAll(function() {
      doAjax('/loaddata/csv', {}, function(data) {
        expect(data).toEqual('done');
      });
    });

    describe("area.trainHandler.exchangeCard", function() {
      describe('when fragments is enought', function() {

        beforeEach(function() {
          doAjax('/update/player/' + user1.playerId, {
            fragments: 40
          }, function(res) {
            loginWith(user1.account, user1.password, user1.areaId);
          });
        });

        var doTest = function(id) {
          var star = id % 5 || 5;
          var canExchange = star >= 4;
          var cn = canExchange ? 'can' : 'can not';
          describe('when tableId is ' + id, function() {

            it("should " + cn + " exchange a card that star is " + star, function() {
              request(
                'area.trainHandler.exchangeCard', {
                  tableId: id
                },
                function(data) {
                  console.log(data);
                  if (!canExchange) {
                    expect(data).toEqual({
                      code: 501,
                      msg: '只能兑换4星，5星卡牌'
                    });
                  } else {
                    expect(data.msg.card).hasProperties([
                      'id', 'tableId', 'hp', 'atk', 'ability',
                      'lv', 'exp', 'skillLv', 'skillInc',
                      'skillPoint', 'elixirHp', 'elixirAtk',
                      'passiveSkills', 'factor'
                    ]);

                    expect(data.msg.card.tableId).toEqual(id);
                    expect(data.msg.card.passiveSkills.length).toEqual(star - 2);

                    doAjax('/player/' + user1.playerId, {}, function(res) {
                      expect(data.msg.fragments).toEqual(res.data.fragments);
                      expect(data.msg.fragments).toEqual(40 - (star == 4 ? 10 : 30));
                      if (star==5) {
                        expect((data.msg.achivements)).toEqual({})
                      }
                    });
                  }
                }
              );
            });
          });
        };

        // for (var i = 1; i <= 250; i++) {
        //   (function(i) {
        //     doTest(i);
        //   })(i);
        // }

        doTest(9);
        doTest(10);
        doTest(94);
        doTest(95);
      });


      describe('when fragments is not enought', function() {
        beforeEach(function() {
          doAjax('/update/player/' + user1.playerId, {
            fragments: 5
          }, function(res) {
            loginWith(user1.account, user1.password, user1.areaId);
          });
        });


        it('should can not exchange card that star is 1', function() {
          request('area.trainHandler.exchangeCard', {
            tableId: 6
          }, function(data) {
            expect(data).toEqual({
              code: 501,
              msg: '只能兑换4星，5星卡牌'
            });
          });
        });

        it('should can not exhcange a card that star is 4', function() {
          request('area.trainHandler.exchangeCard', {
            tableId: 9
          }, function(data) {
            expect(data).toEqual({
              code: 501,
              msg: '卡牌碎片不足'
            });
          });
        });
      });

      describe('when args is empty', function() {
        beforeEach(function() {
          loginWith(user1.account, user1.password, user1.areaId);
        });

        it('should can not exhcange a card', function() {
          request('area.trainHandler.exchangeCard', {}, function(data) {
            console.log(data);
            expect(data).toEqual({
              code: 501,
              msg: 'tableId require'
            });
          });
        });

      });

    });
  });
});