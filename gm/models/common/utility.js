// Generated by CoffeeScript 1.6.3
var Utility, _;

_ = require('underscore');

Utility = {
  hitRate: function(rate) {
    var rd;
    rate = parseInt(rate);
    if (isNaN(rate) || rate < 0 && rate > 100) {
      throw new Error("Invilid argument: can't pass " + rate + " to int");
    }
    rd = _.random(0, 100);
    if (rd <= rate) {
      return true;
    } else {
      return false;
    }
  },
  /*
  get random value from the given values
  @param {array} values, the given values for get the random one from them
  @param {array} rates, the option parameter, if given, will return the value for the rates
  */

  randomValue: function(values, rates) {
    var i, r, rd, _i, _j, _len, _len1, _r, _rates;
    if (rates != null) {
      _rates = [];
      _r = 0;
      for (_i = 0, _len = rates.length; _i < _len; _i++) {
        r = rates[_i];
        _rates.push(_r += r);
      }
      rd = _.random(0, 100);
      for (i = _j = 0, _len1 = _rates.length; _j < _len1; i = ++_j) {
        r = _rates[i];
        if (rd <= r) {
          return values[i];
        }
      }
    } else if (values.length > 0) {
      return values[_.random(0, values.length - 1)];
    } else {
      return values[0];
    }
  },
  parseEffect: function(value) {
    var base_val, lv_grow, pattern, _ref;
    pattern = /^\d+,\d+$/;
    if (!pattern.exec(value)) {
      throw new Error("effect value " + value + " is invalid");
    }
    _ref = value.split(','), base_val = _ref[0], lv_grow = _ref[1];
    return [parseInt(base_val), parseInt(lv_grow)];
  },
  "extends": function(child, parent) {
    var ctor, key;
    for (key in parent) {
      if (parent.hasOwnProperty(key)) {
        child[key] = parent[key];
      }
    }
    ctor = function() {
      this.constructor = child;
    };
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
    child.__super__ = parent.prototype;
    return child;
  },
  deepCopy: function(obj) {
    var item, key, newArr, newObj, _i, _len, _ref;
    newObj = {};
    for (key in obj) {
      if (_.isObject(obj[key])) {
        newObj[key] = Utility.deepCopy(obj[key]);
      } else if (_.isArray(obj[key])) {
        newArr = [];
        _ref = obj[key];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          if (_.isObject(item) || _.isArray(item)) {
            newArr.push(Utility.deepCopy(item));
          } else {
            newArr.push(item);
          }
        }
        newObj[key] = newArr;
      } else {
        newObj[key] = obj[key];
      }
    }
    return newObj;
  }
};

module.exports = Utility;
