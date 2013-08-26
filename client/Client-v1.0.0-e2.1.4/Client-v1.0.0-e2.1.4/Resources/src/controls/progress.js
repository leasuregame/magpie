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
    _ratio: 0,
    _showValue: false,
    _value: 0,
    _maxValue: 0,
    _bgSprite: null,
    _progressSprite: null,
    _progress: null,
    _valueLabel: null,
    _maxValueLabel: null,

    onEnter: function () {
        cc.log("Progress onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("Progress init");

        if (!this._super()) return false;

        this._progress = cc.ProgressTimer.create(this._progressSprite);

        this._progress.setType(cc.PROGRESS_TIMER_TYPE_BAR);
        this._progress.setMidpoint(cc.p(0.0, 0.5));
        this._progress.setBarChangeRate(cc.p(1.0, 0.0));

        if (this._bgSprite != null) {
            this.addChild(this._bgSprite, -1);
        }
        this.addChild(this._progress);

        if (this._showValue) {
            var slashesLabel = cc.LabelTTF.create("/", "Times New Roman", 22);
            slashesLabel.setAnchorPoint(cc.p(0.5, 0.5));
            slashesLabel.setPosition(cc.p(0, 0));
            this.addChild(slashesLabel);

            this._valueLabel = cc.LabelTTF.create("", "Times New Roman", 22);
            this._valueLabel.setAnchorPoint(cc.p(1, 0.5));
            this._valueLabel.setPosition(cc.p(-10, 0));
            this.addChild(this._valueLabel);

            this._maxValueLabel = cc.LabelTTF.create("", "Times New Roman", 22);
            this._maxValueLabel.setAnchorPoint(cc.p(0, 0.5));
            this._maxValueLabel.setPosition(cc.p(10, 0));
            this.addChild(this._maxValueLabel);
        }

        return true;
    },

    initWithFile: function (bgFileName, progressFileName, value, maxValue, showValue) {
        cc.log("Progress initWithFile");

        this._showValue = showValue;
        this._value = value;
        this._maxValue = maxValue;
        this._bgSprite = bgFileName == null ? null : cc.Sprite.create(bgFileName);
        this._progressSprite = cc.Sprite.create(progressFileName);

        return this.init();
    },

    initWithSpriteFrameName: function (bgSpriteFrameName, progressSpriteFrameName, value, maxValue, showValue) {
        cc.log("Progress initWithSpriteFrameName");

        this._showValue = showValue;
        this._value = value;
        this._maxValue = maxValue;
        this._bgSprite = bgFileName == null ? null : cc.Sprite.createWithSpriteFrameName(bgSpriteFrameName);
        this._progressSprite = cc.Sprite.createWithSpriteFrameName(progressSpriteFrameName);

        return this.init();
    },

    update: function (duration) {
        cc.log("Progress update");

        duration = duration || 0;

        if (this._maxValue < 0) this._maxValue = 0;
        if (this._value > this._maxValue) this._value = this._maxValue;
        if (this._value < 0) this._value = 0;

        if (this._showValue) {
            this._valueLabel.setString(this._value);
            this._maxValueLabel.setString(this._maxValue);
        }

        var ratio = 0;

        if (this._maxValue > 0) {
            ratio = this._value / this._maxValue * 100;
        }

        var pto = cc.ProgressFromTo.create(duration, this._ratio, ratio);
        this._progress.runAction(pto);

        this._ratio = ratio;
    },

    /**
     * opacity setter
     * @param {Number} opacity
     */
    setOpacity: function (opacity) {
        if (this._bgSprite) this._bgSprite.setOpacity(opacity);
        this._progress.setOpacity(opacity);
    },

    getValue: function () {
        cc.log("Progress getValue");

        return this._value;
    },

    setValue: function (value, duration) {
        cc.log("Progress setValue");

        if (this._value != value) {
            this._value = value;
            this.update(duration);
        }
    },

    getMaxValue: function () {
        cc.log("Progress getMaxValue");

        return this._maxValue;
    },

    addValue: function (value, duration) {
        cc.log("Progress addValue");

        if (value != 0) {
            this._value += value;
            this.update(duration);
        }
    },

    setMaxValue: function (maxValue, duration) {
        cc.log("Progress setMaxValue");

        if (this._maxValue != maxValue) {
            this._maxValue = maxValue;
            this.update(duration);
        }
    },

    setAllValue: function (maxValue, value, duration) {
        cc.log("Progress setAllValue");

        if (this._maxValue != maxValue || this._value != value) {
            this._maxValue = maxValue;
            this._value = value;
            this.update(duration);
        }
    },

    setBgSprite: function (bgSprite) {
        cc.log("Progress setBgSprite");

        if (this._bgSprite != null) {
            this.removeChild(this._bgSprite, true);
        }

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
Progress.create = function (bgFileName, progressFileName, value, maxValue, showValue) {
    showValue = showValue || false;

    var progress = new Progress();
    if (progress && progress.initWithFile(bgFileName, progressFileName, value, maxValue, showValue)) {
        return progress;
    }

    return null;
}

Progress.createWithSpriteFrameName = function (bgSpriteFrameName, progressSpriteFrameName, value, maxValue, showValue) {
    showValue = showValue || false;

    var progress = new Progress();
    if (progress && progress.initWithSpriteFrameName(bgSpriteFrameName, progressSpriteFrameName, value, maxValue, showValue)) {
        return progress;
    }

    return null;
}