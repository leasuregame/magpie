// Generated by CoffeeScript 1.6.2
var base, key_1, key_2, not_stored_err, should, val_1;

base = require('../model/base');

should = require('should');

key_1 = 'key_1';

key_2 = 'key_2';

val_1 = 'value_1';

not_stored_err = {
  "notStored": true
};

describe('DB base', function() {
  beforeEach(function() {
    return base.add(key_1, val_1, function(err, data) {});
  });
  afterEach(function() {
    return base.del(key_1, function(err, data) {});
  });
  it('.add(), new key', function() {
    return base.add(key_2, val_1, function(err, data) {
      should.strictEqual(void 0, err);
      return data.should.be.ok;
    });
  });
  it('.del(), exist key', function() {
    return base.del(key_2, function(err, data) {
      should.strictEqual(void 0, err);
      return data.should.be.ok;
    });
  });
  it('.del(), not exist key', function() {
    return base.del('not_exist_key', function(err, data) {
      should.strictEqual(void 0, err);
      return data.should.not.be.ok;
    });
  });
  it('.add(), exist key', function() {
    return base.add(key_1, val_1, function(err, data) {
      err.should.eql(not_stored_err);
      return data.should.not.be.ok;
    });
  });
  it('.set(), new key', function() {
    base.set(key_2, val_1, function(err, data) {
      should.strictEqual(void 0, err);
      return data.should.be.ok;
    });
    return base.del(key_2, function(err, data) {
      should.strictEqual(void 0, err);
      return data.should.be.ok;
    });
  });
  it('.set(), exist key', function() {
    base.set(key_2, 'new value', function(err, data) {
      should.strictEqual(void 0, err);
      return data.should.be.ok;
    });
    base.get(key_2, function(err, data) {
      should.strictEqual(void 0, err);
      return data.should.be.equal('new value');
    });
    return base.del(key_2, function(err, data) {
      should.strictEqual(void 0, err);
      return data.should.be.ok;
    });
  });
  it('.get(), not exsit key', function() {
    return base.get('not_exsit_key', function(err, data) {
      should.strictEqual(void 0, err);
      return data.should.not.be.ok;
    });
  });
  it('.get()', function() {
    return base.get(key_1, function(err, data) {
      should.strictEqual(void 0, err);
      return data.should.be.equal(val_1);
    });
  });
  it('.set(), json', function() {
    base.set(key_2, {
      a: 1,
      b: 2
    }, function(err, data) {
      should.strictEqual(void 0, err);
      return data.should.be.ok;
    });
    base.get(key_2, function(err, data) {
      should.strictEqual(void 0, err);
      return data.should.be.equal('{"a":1,"b":2}');
    });
    return base.del(key_2, function(err, data) {
      should.strictEqual(void 0, err);
      return data.should.be.ok;
    });
  });
  return it('.getJson()', function() {
    base.set(key_2, {
      a: 1,
      b: 2
    }, function(err, data) {
      should.strictEqual(void 0, err);
      return data.should.be.ok;
    });
    base.getJson(key_2, function(err, data) {
      should.strictEqual(void 0, err);
      return data.should.eql({
        a: 1,
        b: 2
      });
    });
    return base.del(key_2, function(err, data) {
      should.strictEqual(void 0, err);
      return data.should.be.ok;
    });
  });
});
