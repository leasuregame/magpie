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
var __hasProp = {}.hasOwnProperty;
var __extends = function (child, parent) {
    for (var key in parent) {
        if (__hasProp.call(parent, key)) child[key] = parent[key];
    }
    function ctor() {
        this.constructor = child;
    }

    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
    child.__super__ = parent.prototype;
    return child;
};

var EventEmitter = require("events").EventEmitter;
var _ = require("underscore");

var Entity = (function (_super) {
    __extends(Entity, _super);

    function Entity(param) {
        this._mark = {};

        if (param) {
            setAttr(this, param);
        }

        if (typeof(this.init) === "function") {
            this.init.apply(this, arguments);
        }
    }

    Entity.prototype.getEntityId = function () {
        return this.id;
    };

    Entity.prototype.sets = function (attrs) {
        setAttr(this, attrs);
    };

    Entity.prototype.set = function (name, value) {
        setAttr(this, name, value);
    };

    Entity.prototype.get = function (name) {
        return this[name];
    };

    Entity.prototype.increase = function (name, val) {
        val = val || 1;
        this.set(name, this[name] + val);
    };

    Entity.prototype.decrease = function (name, val) {
        val = val || 1;
        this.set(name, this[name] - val);
    };

    Entity.prototype.save = function () {
        if (_.isEmpty(this._mark)) {
            this.emit("save", this);
        }
    };

    return Entity;

})(EventEmitter);

var setAttr = function (self, name, value) {
    if (arguments.length === 3) {
        if (typeof (self[name]) == "undefined") {
            self[name] = value;
        } else if (self[name] !== value) {
            self[name] = value;
            self._mark[name] = true;
        }
    } else if (arguments.length === 2) {
        if (_.isObject(name)) {
            var key;
            var value;
            var patrn = /^\{.*\}$/;

            for (key in name) {
                value = name[key];

                if (typeof value == 'string' && patrn.test(value)) {
                    try{
                        value = JSON.parse(value);
                    } catch (e) {
                        logger.error('can not parse to josn object: ', value);
                        logger.error(e);
                    }
                }

                if (name.hasOwnProperty(key) && typeof (name[key]) === "function") {
                    self[key](value);
                } else {
                    if (typeof (self[key]) == "undefined") {
                        self[key] = value;
                    } else if (self[key] !== value) {
                        self[key] = value;
                        self._mark[key] = true;
                    }
                }
            }
        }
    }
};

module.exports = Entity;