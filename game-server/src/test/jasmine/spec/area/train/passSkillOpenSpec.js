describe("Area Server", function() {

  describe("Train Handler", function() {

    describe('area.trainHandler.passSkillOpen', function() {

      beforeAll(function() {
        doAjax('/loaddata/csv', {}, function(data) {
          expect(data).toEqual('done');
        });
      });

      describe('当可以扩充卡牌被动分组数量时', function() {

        beforeEach(function() {
          loginWith('arthur', '1', 1);
        })

        it('执行正确，并返回结果', function() {
          request('area.trainHandler.passSkillOpen', {
            cardId: 100
          }, function(data) {
            console.log(data);
            expect(data.msg.gold).toEqual(39950);
            expect(data.msg.passiveSkill.id).toEqual(4);
            expect(data.msg.passiveSkill.active).toEqual(false);
            expect(data.msg.passiveSkill.items.length).toEqual(2);
          });

          doAjax('/card/100', function(res) {
            expect(res.data.psGroupCount).toEqual(4);
            var pss = JSON.parse(res.data.passiveSkills);
            expect(pss.length).toEqual(4);
          });
        });

      });

      describe('魔石不足时', function() {
        beforeEach(function() {
          doAjax('/update/player/100', {
            gold: 10,
          }, function() {
            loginWith('arthur', '1', 1);
          });
        });

        it('不能扩充', function() {
          request('area.trainHandler.passSkillOpen', {
            cardId: 100
          }, function(data) {
            console.log(data);
            expect(data).toEqual({
              code: 501,
              msg: '魔石不足'
            });
          });
        });

      });

      describe('缺少CardId', function() {
        beforeEach(function() {
          loginWith('arthur', '1', 1);
        });

        it('不能扩充', function() {
          request('area.trainHandler.passSkillOpen', {

          }, function(data) {
            console.log(data);
            expect(data).toEqual({
              code: 501,
              msg: '缺少卡牌Id参数'
            });
          });
        });

      });

      describe('卡牌不存在时', function() {
        beforeEach(function() {
          loginWith('arthur', '1', 1);

        });

        it('不能扩充', function() {
          request('area.trainHandler.passSkillOpen', {
            cardId: 10000
          }, function(data) {
            console.log(data);
            expect(data).toEqual({
              code: 501,
              msg: '找不到卡牌'
            });
          });
        });

      });

      describe('分组数量已达最大值时', function() {
        beforeEach(function() {
          doAjax('/update/card/100', {
            psGroupCount: 8
          }, function() {});


          doAjax('/update/player/100', {
            gold: 100,
          }, function() {
            loginWith('arthur', '1', 1);
          });
        });

        it('不能扩充', function() {
          request('area.trainHandler.passSkillOpen', {
            cardId: 100
          }, function(data) {
            console.log(data);
            expect(data).toEqual({
              code: 501,
              msg: '分组数量已达最大值'
            });
          });
        });

      });

    });

  });
});