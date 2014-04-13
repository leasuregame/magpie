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
            }

            this.emit(name + "Change");
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
    },

    schedule: function (fn, interval, repeat, delay) {
        interval = interval || 0;
        repeat = (repeat == null) ? cc.REPEAT_FOREVER : repeat;
        delay = delay || 0;

        cc.Director.getInstance().getScheduler().scheduleCallbackForTarget(this, fn, interval, repeat, delay, false);
    },

    scheduleOnce: function (fn, delay) {
        this.schedule(fn, 0.0, 0, delay);
    },

    unschedule: function (fn) {
        // explicit nil handling
        cc.Director.getInstance().getScheduler().unscheduleCallbackForTarget(this, fn);
    },

    unscheduleAllCallbacks: function () {
        cc.Director.getInstance().getScheduler().unscheduleAllCallbacksForTarget(this);
    }
});
