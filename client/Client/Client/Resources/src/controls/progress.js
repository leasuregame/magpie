/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-4-21
 * Time: 下午3:46
 * To change this template use File | Settings | File Templates.
 */

/*
 * 进度条
 * */


var Progress = cc.Node.extend({
    _value: 0,
    _maxValue: 0,
    _bgSprite: null,
    _progressSprite: null,
    _progress: null,

    init: function () {
        cc.log("Progress init");

        if (!this._super()) return false;

        this._progress = cc.ProgressTimer.create(this._progressSprite);

        this._progress.setType(cc.PROGRESS_TIMER_TYPE_BAR);
        this._progress.setMidpoint(cc.p(0.0, 0.5));
        this._progress.setBarChangeRate(cc.p(1.0, 0.0));

        this.addChild(this._bgSprite, -1);
        this.addChild(this._progress, 1);

        this.update();

        return true;
    },

    initWithFile: function (bgFileName, progressFileName, value, maxValue) {
        cc.log("Progress initWithFile");

        this._value = value;
        this._maxValue = maxValue;
        this._bgSprite = cc.Sprite.create(bgFileName);
        this._progressSprite = cc.Sprite.create(progressFileName);

        return this.init();
    },

    initWithSpriteFrameName: function (bgSpriteFrameName, progressSpriteFrameName, value, maxValue) {
        cc.log("Progress initWithSpriteFrameName");

        this._value = value;
        this._maxValue = maxValue;
        this._bgSprite = cc.Sprite.createWithSpriteFrameName(bgSpriteFrameName);
        this._progressSprite = cc.Sprite.createWithSpriteFrameName(progressSpriteFrameName);

        return this.init();
    },

    update: function () {
        cc.log("Progress update");

        if (this._maxValue < 0) this._maxValue = 0;
        if (this._value > this._maxValue) this._value = this._maxValue;
        if (this._value < 0) this._value = 0;

        var ratio = this._value / this._maxValue * 100;

        var pto = cc.ProgressTo.create(0, ratio);
        this._progress.runAction(pto);
    },

    getValue: function () {
        cc.log("Progress getValue");

        return this._value;
    },

    setValue: function (value) {
        cc.log("Progress setValue");

        this._value = value;
        this.update();
    },

    getMaxValue: function () {
        cc.log("Progress getMaxValue");

        return this._maxValue;
    },

    addValue: function (value) {
        cc.log("Progress addValue");

        this._value += value;
        this.update();
    },

    setMaxValue: function (maxValue) {
        cc.log("Progress setMaxValue");

        this._maxValue = maxValue;
        this.update();
    },

    setAllValue: function (maxValue, value) {
        cc.log("Progress setAllValue");

        this._maxValue = maxValue;
        this._value = value;
        this.update();
    },

    setBgSprite: function (bgSprite) {
        cc.log("Progress setBgSprite");

        this.removeChild(this._bgSprite, true);
        this.addChild(bgSprite, -1);
        this._bgSprite = bgSprite;
    },

    setProgressSprite: function (progressSprite) {
        cc.log("Progress setProgressSprite");

        this._progress.setSprite(progressSprite);
    }
})


/*
 * 创建函数
 * */
Progress.create = function (bgFileName, progressFileName, value, maxValue) {
    var progress = new Progress();
    if (progress && progress.initWithFile(bgFileName, progressFileName, value, maxValue)) {
        return progress;
    }

    return null;
}

Progress.createWithSpriteFrameName = function (bgSpriteFrameName, progressSpriteFrameName, value, maxValue) {
    var progress = new Progress();
    if (progress && progress.initWithSpriteFrameName(bgSpriteFrameName, progressSpriteFrameName, value, maxValue)) {
        return progress;
    }

    return null;
}