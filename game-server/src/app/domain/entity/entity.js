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
var utility = require('../../common/utility');
var EventEmitter = require("events").EventEmitter;
var _ = require("underscore");

var Entity = (function(_super) {
    utility.extends(Entity, _super);

    function Entity(attributes) {
        attributes || (attributes = {});
        this.attributes = {};
        this.changedFields = [];
        this.tracked = [];

        _.defaults(attributes, utility.deepCopy(this.constructor.DEFAULT_VALUES));

        var self = this;
        Object.keys(attributes).forEach(function(key) {
            self.track(key);
        });
        this.set(attributes);

        if (typeof(this.init) === "function") {
            this.init.apply(this, arguments);
        }
        // clear changeFields when new an Entity instance
        this.changedFields = []
    };

    Entity.FIELDS = [];
    Entity.DEFAULT_VALUES = {};

    Entity.prototype.track = function(key) {
        this.tracked.push(key);
        this.__defineGetter__(key, function() {
            return this.get(key);
        });
        this.__defineSetter__(key, function(val) {
            return this.set(key, val);
        });
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
            if (_.isObject(v)) {
                v = _.clone(v);
            }

            if (_.has(_this.attributes, k)) {
                if (_this.attributes[k] == v) {
                    return; // equal string, number
                }
            }
            // add to tracked
            if (_this.tracked.indexOf(k) < 0) {
                _this.track(k);
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

    Entity.prototype.hasField = function(name) {
        return this.constructor.FIELDS.indexOf(name) > -1;
    };

    Entity.prototype.increase = function(name, val) {
        if (typeof val == 'undefined' || val == null) {
            val = 1;
        }
        this.set(name, parseInt(this[name]) + parseInt(val));
    };

    Entity.prototype.decrease = function(name, val) {
        if (typeof val == 'undefined' || val == null) {
            val = 1;
        }
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
                _results[field] = this.get(field);
            }
        }
        this.changedFields = [];
        return _results;
    };

    Entity.prototype.allData = function() {
        var __fields = this.constructor.FIELDS;
        var _results = {};
        for (var i = 0; i < __fields.length; i++) {
            var field = __fields[i];
            _results[field] = this.get(field);
        }
        return _results;
    };

    Entity.prototype.toJson = function() {};

    return Entity;

})(EventEmitter);

module.exports = Entity;