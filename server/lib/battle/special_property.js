// Generated by CoffeeScript 1.6.2
var SpecialProperty, exports, log, passive_propertys, utility, _;

_ = require('underscore');

utility = require('../common/utility');

log = require('../common/logger');

SpecialProperty = (function() {
  function SpecialProperty(attrs) {
    this._attrs = attrs;
  }

  SpecialProperty.prototype.takeEffect = function(tag) {
    var a, _i, _len, _pro, _ref, _results;

    _ref = this._attrs;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      a = _ref[_i];
      _pro = passive_propertys[a['name']];
      if (_pro != null) {
        tag['init_' + _pro] = tag[_pro] += parseInt(tag[_pro] * a['value'] / 100);
        _results.push(log.error(tag.name, tag.hp, tag.init_hp));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  SpecialProperty.prototype.has = function(name) {
    return !!_.findWhere(this._attrs, {
      name: name
    });
  };

  SpecialProperty.prototype.get = function(name) {
    var _ref;

    return (_ref = _.findWhere(this._attrs, {
      name: name
    })) != null ? _ref['value'] : void 0;
  };

  SpecialProperty.prototype.isCrit = function() {
    return this._hit('crit');
  };

  SpecialProperty.prototype.isDodge = function() {
    return this._hit('dodge');
  };

  SpecialProperty.prototype.dmgReduce = function(val) {
    if (!this.has('dmg_reduce')) {
      return val;
    }
    return parseInt(val * (1 - this.get('dmg_reduce') / 100));
  };

  SpecialProperty.prototype.dmgRebound = function(val) {
    if (!this.has('dmg_rebound')) {
      return 0;
    }
    return parseInt(val * (1 - this.get('dmg_rebound') / 100));
  };

  SpecialProperty.prototype._hit = function(type) {
    if (!this.has('crit')) {
      return false;
    }
    return utility.hitRate(parseInt(this.get('crit')));
  };

  return SpecialProperty;

})();

passive_propertys = {
  'atk_improve': 'atk',
  'hp_improve': 'hp'
};

exports = module.exports = SpecialProperty;
