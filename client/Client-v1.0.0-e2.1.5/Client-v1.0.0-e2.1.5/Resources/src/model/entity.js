/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-9
 * Time: 下午5:24
 * To change this template use File | Settings | File Templates.
 */


/*
 * entity
 * */


var Entity = Event.extend({
    set: function (name, value) {
        if (typeof value != "undefined") {
            if (this["_" + name] !== value) {
                this["_" + name] = value;

                this.emit(name + "Change");
            }
        }
    },

    sets: function (attrs) {
        var key;

        for (key in attrs) {
            this.set(key, attrs[key]);
        }
    },

    add: function (name, value) {
        if (typeof value != "undefined") {
            if (value) {
                this.set(name, this["_" + name] + value);
            }
        }
    },

    adds: function (attrs) {
        var key;

        for (key in attrs) {
            this.add(key, attrs[key]);
        }
    },

    get: function (name) {
        return this["_" + name];
    },

    has: function (name) {
        return (typeof (this["_" + name]) != "undefined");
    }
});
