/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-10-28
 * Time: 上午1:27
 * To change this template use File | Settings | File Templates.
 */


/*
 * game flow
 * */


var gameFlow = {
    _flow: [],

    run: function () {
        if (this._flow.length > 0) {
            var fn = this._flow[0].fn;
            var delay = this._flow[0].delay;

            if (delay) {
                lz.scheduleOnce(fn, delay);
            } else {
                fn();
            }
        }
    },

    push: function (/*Multiple Arguments*/) {
        var flowLen = this._flow.length;

        var flow = [];
        var len = arguments.length;

        for (var i = 0; i < len; ++i) {
            var fn, delay;

            if (typeof(arguments[i]) == "function") {
                fn = arguments[i];
            } else {
                cc.log("game flow push error");
                return;
            }

            var next = i + 1;
            if (next < len) {
                if (typeof(arguments[next]) == "number") {
                    delay = arguments[next];
                    i += 1;
                }
            }

            flow.push({
                fn: fn,
                delay: delay
            });
        }

        if (flow.length > 0) {
            this._flow.push(flow);
        }

        if (!flowLen && this._flow.length > 0) {
            this.run();
        }
    },

    next: function () {
        this._flow.shift();
        this.run();
    },

    end: function () {
        this._flow = [];
    },

    delete: function (fn) {
        var len = this._flow.length;

        for (var i = 1; i < len; ++i) {
            if (this._flow.fn === fn) {
                this._flow.splice(i, 1);
            }
        }
    }
};