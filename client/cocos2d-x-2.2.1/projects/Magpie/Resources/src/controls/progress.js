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
    _showFull: false,
    _value: 0,
    _maxValue: 0,
    _bgSprite: null,
    _progressSprite: null,
    _progress: null,
    _slashesLabel: null,
    _valueLabel: null,
    _maxValueLabel: null,
    _fontColor: null,

    init: function (value, maxValue, showValue, showFull) {
        cc.log("Progress init");

        if (!this._super()) return false;

        this._showValue = showValue || false;
        this._showFull = showFull || false;

        this._progress = cc.ProgressTimer.create(this._progressSprite);

        this._progress.setType(cc.PROGRESS_TIMER_TYPE_BAR);
        this._progress.setMidpoint(cc.p(0.0, 0.5));
        this._progress.setBarChangeRate(cc.p(1.0, 0.0));

        if (this._bgSprite != null) {
            this.addChild(this._bgSprite, -1);
        }
        this.addChild(this._progress);

        if (this._showValue) {
            this._slashesLabel = cc.LabelTTF.create("/", "Times New Roman", 22);
            this._slashesLabel.setAnchorPoint(cc.p(0.5, 0.5));
            this._slashesLabel.setPosition(cc.p(0, 0));
            this.addChild(this._slashesLabel);

            this._valueLabel = cc.LabelTTF.create("", "Times New Roman", 22);
            this._valueLabel.setAnchorPoint(cc.p(1, 0.5));
            this._valueLabel.setPosition(cc.p(-10, 0));
            this.addChild(this._valueLabel);

            this._maxValueLabel = cc.LabelTTF.create("", "Times New Roman", 22);
            this._maxValueLabel.setAnchorPoint(cc.p(0, 0.5));
            this._maxValueLabel.setPosition(cc.p(10, 0));
            this.addChild(this._maxValueLabel);
        }

        this.update(value, maxValue);

        return true;
    },

    initWithFile: function (bgFileName, progressFileName, value, maxValue, showValue, showFull) {
        cc.log("Progress initWithFile");

        this._bgSprite = bgFileName == null ? null : cc.Sprite.create(bgFileName);
        this._progressSprite = cc.Sprite.create(progressFileName);

        return this.init(value, maxValue, showValue, showFull);
    },

    initWithSpriteFrameName: function (bgSpriteFrameName, progressSpriteFrameName, value, maxValue, showValue, showFull) {
        cc.log("Progress initWithSpriteFrameName");

        this._bgSprite = bgFileName == null ? null : cc.Sprite.createWithSpriteFrameName(bgSpriteFrameName);
        this._progressSprite = cc.Sprite.createWithSpriteFrameName(progressSpriteFrameName);

        return this.init(value, maxValue, showValue, showFull);
    },

    update: function (value, maxValue, duration) {
        cc.log("Progress update");

        if (this._showFull) {
            this._updateShowFull(value, maxValue, duration);
        } else {
            this._update(value, maxValue, duration);
        }

        if (this._showValue) {
            this._valueLabel.setString(this._value);
            this._maxValueLabel.setString(this._maxValue);
        }
    },

    _update: function (value, maxValue, duration) {
        cc.log("Progress _update");

        duration = duration || 0;

        this._value = value || 0;
        this._maxValue = maxValue || 0;

        if (this._value > this._maxValue) {
            this._value = this._maxValue;
        }

        var ratio = 0;

        if (this._maxValue === 0 && this._value === 0) {
            ratio = 100;
        }

        if (this._maxValue > 0) {
            ratio = this._value / this._maxValue * 100;
        }

        if (duration == 0) {
            this._progress.setPercentage(ratio);
        } else {
            var action = cc.ProgressFromTo.create(duration, this._ratio, ratio);
            this._progress.runAction(action);
        }
        this._ratio = ratio;
    },

    _updateShowFull: function (value, maxValue, duration) {
        cc.log("Progress _updateShowFull");

        if (maxValue == 0 || this._maxValue == 0) {
            this._update(value, maxValue, duration);

            return;
        }

        duration = duration || 0;

        var duration0 = 0;

        if (value < this._value) {
            if (this._value < this._maxValue) {
                var p1 = (this._maxValue - this._value) / this._maxValue;
                var p2 = value / maxValue;

                duration0 = duration * p1 / (p1 + p2);
                duration = duration - duration0;

                var action = cc.Sequence.create(
                    cc.ProgressFromTo.create(duration0, this._ratio, 100),
                    cc.CallFunc.create(function () {
                        this._ratio = 0;
                        this._update(value, maxValue, duration);
                    }, this)
                );

                this._progress.runAction(action);

                return;
            }
        }

        this._update(value, maxValue, duration);
    },

    /**
     * opacity setter
     * @param {Number} opacity
     */
    setOpacity: function (opacity) {
        this._progress.setOpacity(opacity);

        if (this._bgSprite) this._bgSprite.setOpacity(opacity);
    },

    getDifferenceValue: function () {
        cc.log("Progress getDifferenceValue");

        return (this._maxValue - this._value);
    },

    getValue: function () {
        cc.log("Progress getValue");

        return this._value;
    },

    setValue: function (value, duration) {
        cc.log("Progress setValue");

        if (this._value != value) {
            this.update(value, this._maxValue, duration);
        }
    },

    getMaxValue: function () {
        cc.log("Progress getMaxValue");

        return this._maxValue;
    },

    addValue: function (value, duration) {
        cc.log("Progress addValue");

        if (value != 0) {
            value += this._value;

            this.update(value, this._maxValue, duration);
        }
    },

    setMaxValue: function (maxValue, duration) {
        cc.log("Progress setMaxValue");

        if (this._maxValue != maxValue) {
            this.update(this._value, maxValue, duration);
        }
    },

    setAllValue: function (value, maxValue, duration) {
        if (this._value != value || this._maxValue != maxValue) {
            this.update(value, maxValue, duration);
        }
    },

    setFontColor: function (color) {
        cc.log("Progress setFontColor");

        if (this._showValue && this._fontColor != color) {
            this._fontColor = color;

            this._slashesLabel.setColor(color);
            this._valueLabel.setColor(color);
            this._maxValueLabel.setColor(color);
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
});


/*
 * 创建函数
 * */
Progress.create = function (bgFileName, progressFileName, value, maxValue, showValue, showFull) {
    var progress = new Progress();
    if (progress && progress.initWithFile(bgFileName, progressFileName, value, maxValue, showValue, showFull)) {
        return progress;
    }

    return null;
};

Progress.createWithSpriteFrameName = function (bgSpriteFrameName, progressSpriteFrameName, value, maxValue, showValue, showFull) {
    var progress = new Progress();
    if (progress && progress.initWithSpriteFrameName(bgSpriteFrameName, progressSpriteFrameName, value, maxValue, showValue, showFull)) {
        return progress;
    }

    return null;
};
