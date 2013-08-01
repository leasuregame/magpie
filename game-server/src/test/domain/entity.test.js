var Entity = require('../../app/domain/entity');
var should = require('should');
var sinon = require('sinon');

describe("Entity Object", function(){
	describe(".set()", function(){
		it("should can be set correct property", function(){
			var ent = new Entity();
			ent.set('name', 'eval').name.should.equal('eval');

			ent.set({
				age: 5,
				favor: 'apple'
			});
			ent.age.should.equal(5);
			ent.favor.should.equal('apple');
		});
	});

	describe('.get()', function(){
		it('should can get value of a property', function(){
			var ent = new Entity({id: 1});
			ent.get('id').should.equal(1);
		});
	});

	describe('.track()', function(){
		it('should can be track a property', function(){
			var ent = new Entity({
				name: 'entity one',
				lv: 10
			});
			var spy = sinon.spy();

			ent.tracked.should.eql(['name', 'lv']);
			ent.name.should.equal('entity one');
			ent.lv.should.equal(10);

			ent.on('name.change', spy);
			ent.name = 'change to entity two';
			sinon.assert.calledOnce(spy);
      		sinon.assert.calledWith(spy, 'change to entity two');
		});
	});
});