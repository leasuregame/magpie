var psConfig = require('../../../config/data/passSkill');
var utility = require('../../common/utility');
var _ = require('underscore');

var LOCK = {
  NULL: 0,
  NAME: 1,
  VALUE: 2,
  BOTH: 3
};

var PassiveSkillGroup = function(attrs) {
  this.id = attrs.id;
  this.items = attrs.items;
  this.active = attrs.active;
};

PassiveSkillGroup.prototype.toJson = function() {
  return {
    id: this.id,
    items: this.items,
    active: this.active
  };
};

PassiveSkillGroup.prototype.getItems = function(ids) {
  if (!_.isArray(ids)) {
    ids = [ids];
  }

  return this.items.filter(function(i) {
    return ids.indexOf(i.id) > -1;
  });
};

PassiveSkillGroup.prototype.getItem = function(id) {
  return this.getItems([id])[0] || null;
};

PassiveSkillGroup.prototype.create = function(star) {
  star = star > 5 ? 5 : star
  if (star < 3) {
    return;
  }

  var id = this.items.length,
      len = star - 2,
      i;
  for (i = id; i < len; i++) {
    this.born(i);
  }
  return this;
};

PassiveSkillGroup.prototype.born = function(id) {
  var br = psConfig.BORN_RATES;
  var name = utility.randomValue(_.keys(br), _.values(br));
  var value = _.random(100, psConfig.INIT_MAX * 100);

  this.items.push({
    id: id,
    name: name,
    value: parseFloat((value / 100).toFixed(1))
  });
};

PassiveSkillGroup.prototype.afrash = function(type, star, ps, lock) {
  if (!ps || _.isUndefined(lock) || lock == LOCK.BOTH) return;

  var born_rates = psConfig.BORN_RATES;
  var star = star >= 5 ? star : 5;
  var value_obj = psConfig.AFRESH.TYPE[type].STAR[star];

  var name = ps.name, value = ps.value;
  if (lock != LOCK.NAME) {
    name = utility.randomValue(_.keys(born_rates), _.values(born_rates));
  }

  if (lock != LOCK.VALUE) {
    var valueScope = utility.randomValue(_.keys(value_obj), _.values(value_obj));
    var _ref = valueScope.split('~'),
      start = _ref[0],
      end = _ref[1];
    value = _.random(start * 100, end * 100);
    value = parseFloat((value / 100).toFixed(1));
  }  

  var p = _.clone(ps);
  p.name = name;
  p.value = value;
  this.update(p);
};

PassiveSkillGroup.prototype.afrashGroup = function(type, star, psIds) {
  var self = this;
  psIds.forEach(function(id) {
    self.afrash(type, star, self.getItem(id.id), id.lock);
  });
};

PassiveSkillGroup.prototype.update = function(ps) {
  for (var i = 0; i < this.items.length; i++) {
    if (this.items[i].id == ps.id) {
      this.items[i] = ps
    }
  }
};

module.exports = PassiveSkillGroup;