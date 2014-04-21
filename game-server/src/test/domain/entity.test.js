var Entity = require('../../app/domain/entity/entity');
var should = require('should');
var sinon = require('sinon');

Entity.FIELDS = ['name'];

describe("Entity Object", function() {
    describe(".set()", function () {
        it("should can be set correct property", function () {
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

    describe('.set() for object value', function() {
        it('should can be set correct property', function() {
            var ent = new Entity({
                name: {
                    firstName: 'arthur',
                    lastName: 'wu'
                }
            });

            ent.name.should.eql({
                firstName: 'arthur',
                lastName: 'wu'
            });

            ent.name.firstName = 'andy';
            ent.set('name', ent.name);

            ent.name.should.eql({
                firstName: 'andy',
                lastName: 'wu'
            });
            ent.changedFields.should.eql(['name']);
            ent.getSaveData().should.eql({
                name: {
                    firstName: 'andy',
                    lastName: 'wu'
                }
            });
        });
    })

    describe('.get()', function() {
        it('should can get value of a property', function() {
            var ent = new Entity({
                id: 1
            });
            ent.get('id').should.equal(1);
        });
    });

    describe('.track()', function() {
        it('should can be track a property', function() {
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

    describe('.increase', function() {
        it('should can be increase a value', function() {
            var ent = new Entity();
            ent.set('money', 10);
            ent.increase('money', 3);
            ent.get('money').should.equal(13);
        });

        it('should can be increase a value undefined', function() {
            var ent = new Entity();
            ent.set('money', 10);
            ent.increase('money');
            ent.get('money').should.equal(11);
        });
    });

    describe('.decrease', function() {
        it('should can be decrease a value', function() {
            var ent = new Entity();
            ent.set('money', 10);
            ent.decrease('money', 5);
            ent.get('money').should.equal(5);
        });
        it('should can be decrease a value', function() {
            var ent = new Entity();
            ent.set('money', 10);
            ent.decrease('money');
            ent.get('money').should.equal(9);
        });
    });

    describe('.getSaveData', function() {
        it('should can be getSaveData', function() {
            Entity.FIELDS = ['name', 'lv', 'money'];
            Entity.DEFAULT_VALUES = {
                name: 'ha',
                lv: 10,
                money: 1000
            };
            var ent = new Entity();
            ent.increase('lv', 2);
            ent.decrease('money', 500);
            ent.getSaveData().should.eql({
                lv: 12,
                money: 500
            });
        });
    });

    describe('.allData', function() {
        it('should can be get allData', function() {
            Entity.FIELDS = ['id', 'lv', 'money'];
            Entity.DEFAULT_VALUES = {
                id: 1,
                lv: 10,
                money: 1000
            };
            var ent = new Entity();
            ent.allData().should.eql({
                id: 1,
                lv: 10,
                money: 1000
            });
        });
    });

});