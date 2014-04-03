describe("Area Server", function() {
  describe("Cdkey Handler", function() {
    describe("area.cdkeyHandler.verifyCdkey", function() {
      // beforeAll(function() {
      //   doAjax('/loaddata/csv', {}, function() {});
      // });

      describe('验证激活码', function() {

        beforeEach(function() {
          loginWith('arthur', '1', 1);
        });

        var doVerify = function(code) {
          it('do verify ' + code, function() {
            request('area.cdkeyHandler.verifyCdkey', {
              cdkey: code
            }, function(data) {
              console.log(data);
              expect(data.code).toEqual(200);

              doAjax('/cdkey/query', {
                code: code
              }, function(res) {
                doAjax('/update/cdkey/'+res.data.id, {
                  playerId: 1
                }, function() {});
              });
            });
          });
        };

        var codeList = [
          'TB1-XYTLL_B4J25',
          'TB1-EKWMXUBEJHC',
          'TB1-EY-ZEOZE1H5',
          'TB1-EY9ZLDZN125',
          'TB1-EYH-LOWEY35',
          'TB1-EYQXX_W4KHC',
          'TB1-EYUBXDZ412Q',
          'TB1-G14BLUZEK39',
          'TB1-G17MGU-NYN9',
          'TB1-EKRQL_ZVK39',
          'TB1-EKALOWN1H9',
          'TB1-EK5NXDB4Y39',
          'TB1-E1L7EDBEKHQ',
          'TB1-E1LLDWVJNQ',
          'TB1-E1MZE_-4YNC',
          'TB1-E1OZLDZ4KN9',
          'TB1-E1XDZEY39',
          'TB1-EJ7LGUBV1NC',
          'TB1-EJWGDBEJ39',
          'TB1-EJXWL_ZE13Q'
        ];

        codeList.forEach(function(code) {
          doVerify(code);
        });

      });


    });
  });
});