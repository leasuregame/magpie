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

    function Entity(param) {
        this.changedFields = [];
        if (param) {
            _.defaults(param, this.constructor.DEFAULT_VALUES)
            setAttr(this, param);
        }

        if (typeof(this.init) === "function") {
            this.init.apply(this, arguments);
        }
    };

    Entity.prototype.sets = function(attrs) {
        setAttr(this, attrs);
    };

    Entity.prototype.set = function(name, value) {
        setAttr(this, name, value);
    };

    Entity.prototype.get = function(name) {
        return this[name];
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

    return Entity;

})(EventEmitter);

var setAttr = function(self, name, value) {
    if (arguments.length === 3) {
        if (typeof(self[name]) == "undefined") {
            self[name] = value;
        } else if (self[name] !== value) {
            self[name] = value;
            if (self.constructor.FIELDS.indexOf(name) > -1) {
                if (self.changedFields.indexOf(name) < 0) {
                    self.changedFields.push(name);
                }
            }
        }
    } else if (arguments.length === 2) {
        if (_.isObject(name)) {
            var key;
            var value;
            var patrn = /^[\{\[].*[\]\}]$/;

            for (key in name) {
                value = name[key];

                if (typeof value == 'string' && patrn.test(value)) {
                    try {
                        value = JSON.parse(value);
                    } catch (e) {
                        logger.error('can not parse to josn object: ', value);
                        logger.error(e);
                    }
                }

                if (name.hasOwnProperty(key) && typeof(name[key]) === "function") {
                    self[key](value);
                } else {
                    if (typeof(self[key]) == "undefined") {
                        self[key] = value;
                    } else if (self[key] !== value) {
                        self[key] = value;
                        if (self.constructor.FIELDS.indexOf(key) > -1) {
                            if (self.changedFields.indexOf(key) < 0) {
                                self.changedFields.push(key);
                            }
                        }
                    }
                }
            }
        }
    }
};

module.exports = Entity;