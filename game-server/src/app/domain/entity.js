/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-6-28
 * Time: 上午9:32
 * To change this template use File | Settings | File Templates.
 */


/*
 * entity
 * */

var logger = require('pomelo-logger').getLogger(__filename);
var utility = require('../common/utility');
var EventEmitter = require("events").EventEmitter;
var _ = require("underscore");

var Entity = (function(_super) {
    utility.extends(Entity, _super);

    function Entity(attributes) {
        attributes || (attributes = {});
        this.attributes = {};
        this.changedFields = [];
        this.tracked = [];

        _.defaults(attributes, this.constructor.DEFAULT_VALUES)
        this.track(Object.keys(attributes));
        this.set(attributes);

        if (typeof(this.init) === "function") {
            this.init.apply(this, arguments);
        }
    };

    Entity.FIELDS = [];
    Entity.DEFAULT_VALUES = {};

    Entity.prototype.track = function(keys) {
        var _this = this;
        _.each(keys, function(key) {
            _this.tracked.push(key);
            _this.__defineGetter__(key, function() {
                return _this.get(key);
            });
            return _this.__defineSetter__(key, function(val) {
                return _this.set(key, val);
            });
        });
        return this;
    };

    Entity.prototype.set = function() {
        var _this = this;
        var attrs, key, val, cb;
        attrs = key = val = false;

        if (typeof arguments[0] !== 'object') {
            key = arguments[0];
            val = arguments[1];
            attrs = {};
            attrs[key] = val;
        } else {
            attrs = arguments[0];
        }

        _.each(attrs, function(v, k) {
            if (_this.attributes[k] == v) {
                return; // value is not changed
            }

            // add to tracked
            if (_this.tracked.indexOf(k) < 0) {
                _this.track([k]);
            }

            // if value is object string, convert to object
            var patrn = /^[\{\[].*[\]\}]$/;
            if (typeof v == 'string' && patrn.test(v)) {
                try {
                    v = JSON.parse(v);
                } catch (e) {
                    logger.error('can not parse to josn object: ', v);
                    logger.error(e);
                }
            }

            // add to changeFields
            if (_this.constructor.FIELDS.indexOf(k) > -1 && _this.changedFields.indexOf(k) < 0) {
                _this.changedFields.push(k);
            }

            _this.attributes[k] = v;
        });

        _this.emit('change', _this.attributes);

        _.each(attrs, function(v, k) {
            var type = k + '.change';
            _this.emit(type, v);
        });

        return this;
    };

    Entity.prototype.get = function(name) {
        return this.attributes[name];
    };

    Entity.prototype.increase = function(name, val) {
        val = val || 1;
        this.set(name, parseInt(this[name]) + parseInt(val));
    };

    Entity.prototype.decrease = function(name, val) {
        val = val || 1;
        this.set(name, parseInt(this[name]) - parseInt(val));
    };

    Entity.prototype.save = function(cb) {
        if (!_.isEmpty(this.changedFields)) {
            this.emit("save", cb);
        }
    };

    Entity.prototype.getSaveData = function() {
        var __fields = this.constructor.FIELDS;
        var _results = {};
        for (var i = 0; i < __fields.length; i++) {
            field = __fields[i];
            if (this.changedFields.indexOf(field) > -1) {
                _results[field] = this[field];
            }
        }
        this.changedFields = [];
        return _results;
    };

    Entity.prototype.changedData = function() {
        var __fields = this.constructor.FIELDS;
        var _results = {};
        for (var i = 0; i < __fields.length; i++) {
            field = __fields[i];
            if (this.changedFields.indexOf(field) > -1) {
                _results[field] = this[field];
            }
        }
        this.changedFields = [];
        return _results;
    };

    Entity.prototype.toJson = function() {};

    return Entity;

})(EventEmitter);

module.exports = Entity;