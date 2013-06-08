// Generated by CoffeeScript 1.6.2
var Events, Hero, Module, STATE_ATTACKED, STATE_ORIGIN, Skill, SpecialProperty, battleLog, exports, log, tab, utility, _, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Module = require('../common/module');

Events = require('../common/events');

Skill = require('./skill');

SpecialProperty = require('./special_property');

tab = require('../model/table');

utility = require('../common/utility');

_ = require('underscore');

battleLog = require('./battle_log');

log = require('../common/logger');

STATE_ORIGIN = 0;

STATE_ATTACKED = 1;

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
    this.dmg = 0;
    this.crit_factor = 1.5;
    this.pos = '00';
    this.idx = null;
    this.state = STATE_ORIGIN;
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
    var enemys;

    enemys = this.skill.getTargets();
    if ((this.skill != null) && this.skill.check(enemys)) {
      this.usingSkill(enemys, callback);
    } else {
      this.normalAttack(callback);
    }
    return this.state = STATE_ATTACKED;
  };

  Hero.prototype.reset = function() {
    return this.state = STATE_ORIGIN;
  };

  Hero.prototype.isAttacked = function() {
    return this.state === STATE_ATTACKED;
  };

  Hero.prototype.isDodge = function() {
    return this.sp.isDodge();
  };

  Hero.prototype.isCrit = function() {
    return this.sp.isCrit();
  };

  Hero.prototype.usingSkill = function(enemys, callback) {
    var doNothing;

    if (!enemys || !enemys.length > 0) {
      log.warn('技能攻击时，攻击的对方卡牌不能为空');
      return;
    }
    log.info(this.name, '使用技能', this.skill.name, this.skill.type);
    doNothing = function() {};
    switch (this.skill.type) {
      case 'single_fight':
      case 'aoe':
        return this.skillAttack(enemys, callback);
      case 'single_heal':
      case 'mult_heal':
        return this.cure(enemys, callback);
      default:
        return doNothing();
    }
  };

  Hero.prototype.skillAttack = function(enemys, callback) {
    var enemy, _d, _dmg, _e, _i, _len, _len1, _step;

    _step = {
      a: -this.idx,
      d: [],
      e: [],
      r: []
    };
    _len = (enemys != null) && enemys.length || 0;
    _dmg = parseInt(this.atk * (1 + this.skill.effectValue()));
    if (_len > 1) {
      _dmg = parseInt(_dmg / _len);
    }
    for (_i = 0, _len1 = enemys.length; _i < _len1; _i++) {
      enemy = enemys[_i];
      if (enemy.isDodge()) {
        _step.d.push(_d);
        _step.e.push(0);
        log.info(enemy.name, '闪避');
        callback(enemy);
        continue;
      } else if (this.isCrit()) {
        _dmg *= this.crit_factor;
        _e = -_dmg;
        _d = -enemy.idx;
        log.info(enemy.name, '暴击');
      } else {
        _e = -_dmg;
        _d = enemy.idx;
      }
      log.info("" + enemy.name + " 受到伤害 " + _dmg);
      _step.d.push(_d);
      _step.e.push(_e);
      _step['dhp'] = enemy.hp;
      enemy.damage(_dmg, this, _step);
      callback(enemy);
    }
    return this.log(_step);
  };

  Hero.prototype.cure = function(enemys, callback) {
    var enemy, _hp, _i, _len, _step;

    _step = {
      a: -this.idx,
      d: [],
      e: []
    };
    for (_i = 0, _len = enemys.length; _i < _len; _i++) {
      enemy = enemys[_i];
      _hp = parseInt(this.init_hp * this.skill.effectValue());
      enemy.damageOnly(-_hp);
      _step.d.push(enemy.idx);
      _step.e.push(_hp);
      _step['dhp'] = enemy.hp;
      callback(enemy);
      log.info("" + enemy.name + " 加血 " + _hp);
    }
    return this.log(_step);
  };

  Hero.prototype.normalAttack = function(callback) {
    var _d, _dmg, _e, _hero, _step;

    _hero = this.player.enemy.herosToBeAttacked('default', this.pos);
    if (_.isArray(_hero) && _hero.length === 1) {
      _hero = _hero[0];
      _dmg = this.atk;
      _e = -_dmg;
      _d = _hero.idx;
      if (_hero.isDodge()) {
        _dmg = 0;
        _e = 0;
      } else if (this.isCrit()) {
        _dmg *= this.crit_factor;
        _e = -_dmg;
        _d = -_hero.idx;
      }
      _step = {
        a: this.idx,
        d: [_d],
        e: [_e],
        r: []
      };
      log.info("" + _hero.name + " 受到伤害 " + _dmg);
      _hero.damage(_dmg, this, _step);
      callback(_hero);
      _step['dhp'] = _hero.hp;
      return this.log(_step);
    } else {
      log.error("普通攻击：找不到对方可攻击的卡牌");
      throw new Error('Normal Attack Error: can not find target to be attacked.');
    }
  };

  Hero.prototype.damage = function(value, enemy, step) {
    var _ref1, _ref2, _val, _value;

    _value = ((_ref1 = this.sp) != null ? _ref1.dmgReduce(value) : void 0) || value;
    if (_value < value) {
      step.e.pop();
      step.e.push(-_value);
      log.info('伤害减少了：', value - _value);
    }
    this.hp -= _value;
    _val = ((_ref2 = this.sp) != null ? _ref2.dmgRebound(_value) : void 0) || 0;
    if (_val !== 0) {
      enemy.damageOnly(_val);
      step.r.push(-_val);
      log.info("伤害反弹给 " + enemy.name + ", " + _val);
    } else {
      step.r.push(null);
    }
    if (this.death()) {
      log.info("" + this.name + " 死亡");
    }
    if (this.death()) {
      return step['death'] = true;
    }
  };

  Hero.prototype.damageOnly = function(value) {
    this.hp -= value;
    if (this.death()) {
      return log.info("" + this.name + " 死亡");
    }
  };

  Hero.prototype.log = function(step) {
    if ((step.r != null) && !_.some(step.r)) {
      delete step.r;
    }
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
