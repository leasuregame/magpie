// Generated by CoffeeScript 1.6.2
var Module, exports, moduleKeywords,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

moduleKeywords = ['included', 'extended'];

Module = (function() {
  Module.include = function(obj) {
    var key, value, _ref;

    if (!obj) {
      throw new Error('include(obj) requires obj');
    }
    for (key in obj) {
      value = obj[key];
      if (__indexOf.call(moduleKeywords, key) < 0) {
        this.prototype[key] = value;
      }
    }
    if ((_ref = obj.included) != null) {
      _ref.apply(this);
    }
    return this;
  };

  Module.extend = function(obj) {
    var key, value, _ref;

    if (!obj) {
      throw new Error('extend(obj) requires obj');
    }
    for (key in obj) {
      value = obj[key];
      if (__indexOf.call(moduleKeywords, key) < 0) {
        this[key] = value;
      }
    }
    if ((_ref = obj.extended) != null) {
      _ref.apply(this);
    }
    return this;
  };

  Module.proxy = function(func) {
    var _this = this;

    return function() {
      return func.apply(_this, arguments);
    };
  };

  Module.create = function() {
    var instance;

    instance = Object.create(this.prototype);
    instance.constructor.apply(instance, arguments);
    return instance;
  };

  Module.prototype.proxy = function(func) {
    var _this = this;

    return function() {
      return func.apply(_this, arguments);
    };
  };

  function Module() {
    if (typeof this.init === "function") {
      this.init.apply(this, arguments);
    }
  }

  return Module;

})();

exports = module.exports = Module;
