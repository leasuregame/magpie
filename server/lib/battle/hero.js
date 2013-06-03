// Generated by CoffeeScript 1.6.2
var Events, Hero, Module, Skill, SpecialProperty, battleLog, exports, log, tab, utility, _, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Module = require('../common/module');

Events = require('../common/events');

Skill = require('./skill');

SpecialProperty = require('./special_property');

tab = require('../model/table');

battleLog = require('./battle_log');

utility = require('../common/utility');

_ = require('underscore');

log = require('../common/logger');

Hero = (function(_super) {
  __extends(Hero, _super);

  function Hero() {
    _ref = Hero.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Hero.include(Events);

  Hero.table = 'cards';

  Hero.prototype.init = function(attrs, player) {
    this.player = player;
    this.id = attrs.id;
    this.lv = attrs.lv;
    this.star = attrs.star;
    this.card_id = attrs.card_id;
    this.skill_lv = attrs.skill_lv || 1;
    this.sp_value = attrs.sp_value || [];
    this.is_crit = false;
    this.is_dodge = false;
    this.cant_miss = false;
    this.cant_be_crit = false;
    this.dmg = 0;
    this.crit_factor = 1.5;
    this.pos = '00';
    this.skill = null;
    this.loadCardInfo();
    this.loadSpecialProperty();
    return this.loadSkill();
  };

  Hero.prototype.loadCardInfo = function() {
    var card, factor, _ref1;

    card = tab.getTableItem('cards', this.card_id);
    factor = (_ref1 = tab.getTableItem('factors', this.lv)) != null ? _ref1.factor : void 0;
    if (!card) {
      throw new Error("配置表错误：不能从表 " + this.constructor.table + " 中找到卡牌信息，卡牌id为 " + this.card_id);
    }
    this.name = card.name;
    this.init_atk = this.atk = parseInt(card.atk * factor);
    this.init_hp = this.hp = parseInt(card.hp * factor);
    return this.skill_id = card.skill_id;
  };

  Hero.prototype.loadSpecialProperty = function() {
    if (this.star < 3) {
      return;
    }
    this.sp = new SpecialProperty(this.sp_value);
    return this.sp.takeEffect(this);
  };

  Hero.prototype.loadSkill = function() {
    if (this.star < 3) {
      return;
    }
    this.skill_setting = tab.getTableItem('skills', this.skill_id);
    if (this.skill_setting != null) {
      return this.skill = new Skill(this, this.skill_setting);
    }
  };

  Hero.prototype.attack = function(callback) {
    this.setCrit();
    if ((this.skill != null) && this.skill.check()) {
      this.usingSkill(callback);
    } else {
      this.normalAttack(callback);
    }
    return this.unsetCrit();
  };

  Hero.prototype.setCrit = function() {
    return this.is_crit = this.sp.isCrit();
  };

  Hero.prototype.unsetCrit = function() {
    return this.is_crit = false;
  };

  Hero.prototype.isDodge = function() {
    return this.sp.isDodge();
  };

  Hero.prototype.isCrit = function() {
    return this.sp.isCrit();
  };

  Hero.prototype.usingSkill = function(callback) {
    var doNothing;

    doNothing = function() {};
    switch (this.skill.type) {
      case 'single_fight':
      case 'aoe':
        return this.skillAttack(this.skill.getTargets(), callback);
      case 'single_heal':
      case 'mult_heal':
        return this.cure(this.skill.getTargets(), callback);
      default:
        return doNothing();
    }
  };

  Hero.prototype.skillAttack = function(enemys, callback) {
    var enemy, _dmg, _i, _len, _len1, _step, _v;

    _step = {
      a: this.idx,
      d: [],
      v: [],
      t: 1,
      ahp: this.hp,
      dhp: []
    };
    _step.type = this.skill.type;
    _len = (enemys != null) && enemys.length;
    _dmg = parseInt(this.atk * this.skill.effectValue());
    if (_len > 1) {
      _dmg = parseInt(_dmg / _len);
    }
    for (_i = 0, _len1 = enemys.length; _i < _len1; _i++) {
      enemy = enemys[_i];
      _v = -_dmg;
      if (enemy.isDodge()) {
        _dmg = 0;
        _v = 0;
      } else if (this.isCrit()) {
        _dmg *= this.crit_factor;
        _v = ['crit', -_dmg];
      }
      enemy.damage(_dmg, this);
      _step.d.push(enemy.idx);
      _step.v.push(_v);
      _step.dhp.push(enemy.hp);
      callback(enemy);
    }
    return this.log(_step);
  };

  Hero.prototype.cure = function(enemys, callback) {
    var enemy, _hp, _i, _len, _step;

    _step = {
      a: this.idx,
      d: [],
      v: [],
      t: 1
    };
    for (_i = 0, _len = enemys.length; _i < _len; _i++) {
      enemy = enemys[_i];
      _hp = parseInt(enemy.hp * this.skill.effectValue());
      enemy.damageOnly(-_hp);
      _step.d.push(enemy.idx);
      _step.v.push(_hp);
      callback(enemy);
    }
    return this.log(_step);
  };

  Hero.prototype.normalAttack = function(callback) {
    var _dmg, _hero, _v;

    _hero = this.player.enemy.herosToBeAttacked('default', this.pos);
    if (_.isArray(_hero) && _hero.length === 1) {
      _hero = _hero[0];
      _dmg = this.atk;
      _v = -_dmg;
      if (_hero.isDodge()) {
        _dmg = 0;
        _v = 0;
      } else if (this.isCrit()) {
        _dmg *= this.crit_factor;
        _v = ['crit', -_dmg];
      }
      _hero.damage(_dmg, this);
      callback(_hero);
      return this.log({
        a: this.idx,
        d: _hero.idx,
        v: _v,
        t: 0,
        death: _hero.death(),
        ahp: this.hp,
        dhp: _hero.hp
      });
    } else {
      throw new Error('Normal Attack Error: can not find target to be attacked.');
    }
  };

  Hero.prototype.damage = function(value, enemy) {
    var _ref1, _ref2, _val;

    value = ((_ref1 = this.sp) != null ? _ref1.dmgReduce(value) : void 0) || value;
    this.hp -= value;
    _val = ((_ref2 = this.sp) != null ? _ref2.dmgRebound(value) : void 0) || 0;
    if (_val !== 0) {
      enemy.damageOnly(_val);
      this.log({
        a: this.idx,
        d: enemy.idx,
        v: ['rebound', -_val],
        t: 0
      });
    }
    if (this.death()) {
      return console.log(this.player.name, this.id, 'death');
    }
  };

  Hero.prototype.damageOnly = function(value) {
    return this.hp -= value;
  };

  Hero.prototype.log = function(step) {
    return battleLog.addStep(step);
  };

  Hero.prototype.death = function() {
    return this.hp <= 0;
  };

  Hero.prototype.setIdx = function(idx, atker) {
    return this.idx = atker ? idx : idx + 6;
  };

  Hero.prototype.setPos = function(pos) {
    return this.pos = pos;
  };

  return Hero;

})(Module);

exports = module.exports = Hero;
