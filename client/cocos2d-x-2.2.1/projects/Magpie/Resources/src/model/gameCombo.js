/**
 * Created by lcc3536 on 14-2-24.
 */


/*
 * game combo
 * */


var MAX_GAME_COMBO = 1 << 20;

var gameCombo = {
    _combo: null,
    _maxStep: 0,
    _index: 0,
    _isRun: true,

    reset: function () {
        this._combo = {};
        this._maxStep = 0;
        this._index = 0;
        this._isRun = true;
    },

    push: function (step) {
        cc.log("gameCombo push");

        cc.log("=============================");
        cc.log("this._maxStep " + this._maxStep);
        cc.log("this._index " + this._index);
        cc.log("=============================");

        if (!(step instanceof Array)) {
            step = [step];
        }

        cc.log("/////////////////////////////");
        cc.log(step);
        cc.log("/////////////////////////////");

        var ret = [];
        var len = step.length;
        for (var i = 0; i < len; ++i) {
            step[i] = typeof (step[i]) == "function" ? {fn: step[i]} : step[i];

            this._combo[this._maxStep] = step[i];
            ret[i] = this._maxStep;
            this._maxStep = (this._maxStep + 1) % MAX_GAME_COMBO;
        }

        this.next();

        return (len > 1 ? ret : ret[0]);
    },

    del: function (index) {
        cc.log("gameCombo del");

        if (this._combo[index]) {
            cc.log("this step is exist");

            delete this._combo[index];
        }
    },

    next: function () {
        cc.log("gameCombo run");

        var ret = false;

        if (this._isRun) {
            cc.log(this._maxStep);
            cc.log(this._index);

            while (this._index != this._maxStep) {
                cc.log("-----------------------------");
                cc.log("this._maxStep " + this._maxStep);
                cc.log("this._index " + this._index);
                cc.log("-----------------------------");

                var index = this._index;
                this._index += 1;
                var step = this._combo[index];

                if (step) {
                    ret = step.fn(step.data);
                    delete this._combo[index];
                    break;
                }
            }
        }

        return ret;
    },

    start: function () {
        cc.log("gameCombo start");

        this._isRun = true;
        this.next();
    },

    stop: function () {
        cc.log("gameCombo stop");

        this._isRun = false;
    }
};