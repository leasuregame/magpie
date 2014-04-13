var GoldCard = require('../../app/domain/entity/goldCard');

describe('GoldCard Entity', function(){
  describe('init goldCard', function(){
    it('should can new a GoldCard object', function(){
      var gc = new GoldCard();

      gc.flag.should.be.equal(0);
      gc.type.should.be.equal('');
    
      gc = new GoldCard({
        id: 1,
        orderId: 1,
        playerId: 1,
        type: 'month',
        flag: '0',
        created: '2014-1-6',
        validDate: '2014-2-6'
      });

      gc.attributes.should.be.eql({
        id: 1,
        orderId: 1,
        playerId: 1,
        type: 'month',
        status: 0,
        flag: '0',
        created: '2014-1-6',
        validDate: '2014-2-6'
      })
    });
  });

  describe('.daysRemaining()', function() {
    it('should can return the correct days for month card', function(){
      var gc = new GoldCard({
        id: 1,
        orderId: 1,
        playerId: 1,
        type: 'month',
        flag: '0',
        created: '2014-1-20',
        validDate: '2014-2-18'
      });

      gc.daysRemaining('2014-1-20').should.be.equal(30);
      gc.daysRemaining('2014-1-25').should.be.equal(25);
      gc.daysRemaining('2014-2-18').should.be.equal(1);
      gc.daysRemaining('2014-2-19').should.be.equal(0);
    });

    it('should can return the correct days for week card', function(){
      var gc = new GoldCard({
        id: 1,
        orderId: 1,
        playerId: 1,
        type: 'week',
        flag: '0',
        created: '2014-1-1',
        validDate: '2014-1-7'
      });

      gc.daysRemaining('2014-1-1').should.be.equal(7);
      gc.daysRemaining('2014-1-2').should.be.equal(6);
      gc.daysRemaining('2014-1-7').should.be.equal(1);
      gc.daysRemaining('2014-1-8').should.be.equal(0);
    });
  });

  describe('.hasFlag()', function(){
    it('should can return the correct flag', function() {
      var gc = new GoldCard({
        id: 1,
        orderId: 1,
        playerId: 1,
        type: 'week',
        flag: '0',
        created: '2014-1-21',
        validDate: '2014-1-27'
      });

      gc.hasFlag().should.not.be.ok;

      gc.flag = '1';
      gc.hasFlag().should.be.ok;
    });
  });

  describe('.setFlag()', function(){
    it('should can set a falg', function(){
      var gc = new GoldCard({
        id: 1,
        orderId: 1,
        playerId: 1,
        type: 'month',
        flag: '1',
        created: '2014-1-19',
        validDate: '2014-1-25'
      });

      gc.hasFlag().should.not.be.ok;
      gc.setFlag();
      gc.hasFlag().should.be.ok;
      gc.flag.should.be.equal('5')
    });
  });

});