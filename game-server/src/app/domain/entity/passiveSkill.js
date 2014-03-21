var psConfig = require('../../../config/passSkill');
var utility = require('../../common/utility');
var _ = require('underscore');


var PassiveSkillGroup = function(attrs) {
  this.id = attrs.id;
  this.items = attrs.items;
  this.active = attrs.active;
};

PassiveSkillGroup.prototype.toJson = function() {
  return {
    id: this.id,
    items: this.items
  };
};

PassiveSkillGroup.prototype.create = function(star) {
  star = star > 5 ? 5 : star
  if (star < 3) {
    return;
  }

  var len = star - 2;
  for (var i = 0; i < len; i++) {
    this.born();
  }
};

PassiveSkillGroup.prototype.born = function() {
  var br = psConfig.BORN_RATES;
  var name = utility.randomValue(_.keys(br), _.values(br));
  var value = _.random(100, psConfig.INIT_MAX * 100);

  var id = 0;
  if (this.items.length > 0) {
    id = _.max(this.items, function(i) {
      return i.id;
    }).id;
  }

  this.items.push({
    id: id,
    name: name,
    value: parseFloat((value / 100).toFixed(1))
  });
};

PassiveSkillGroup.prototype.afrash = function(type, star ps) {
  var born_rates = psConfig.BORN_RATES;
  var star = star >= 5 ? this.star : 5;
  var value_obj = psConfig.AFRESH.TYPE[type].STAR[star];

  var name = utility.randomValue(_.keys(born_rates), _.values(born_rates));
  var valueScope = utility.randomValue(_.keys(value_obj), _.values(value_obj));
  var _ref = valueScope.split('~'),
      start = _ref[0],
      end = _ref[1];
  var value = _.random(start * 100, end * 100);

  var p = _.clone(ps);

  p.name = name;
  p.value = parseFloat((value / 100).toFixed(1));
  this.update(p);
};

PassiveSkillGroup.prototype.update = function(ps) {
  for (var i = 0; i < this.items.length; i++) {
    if (this.items[i].id == ps.id) {
      this.items[i] = ps
    }
  }
};