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
    _value : 0,
    _maxValue : 0,
    _bgSprite : null,
    _progressSprite : null,
    _progress : null,


    ctor : function() {
        this._super();
        cc.associateWithNative(this, cc.Node);
    },

    init : function() {
        if(!this._super()) return false;

        this._progress = cc.ProgressTimer.create(this._progressSprite);

        //this._bgSprite.ignoreAnchorPointForPosition(true);
        //this._bgSprite.setAnchorPoint(cc.p(0.0, 0.0));
        this._progress.setType(cc.PROGRESS_TIMER_TYPE_BAR);
        this._progress.setMidpoint(cc.p(0.0, 0.5));
        this._progress.setBarChangeRate(cc.p(1.0, 0.0));

//        this._progress.ignoreAnchorPointForPosition(true);
//        this._progress.setAnchorPoint(cc.p(1, 0.5));
//        this._progress.setPosition(size.width / 2, size.height / 2);

        this.addChild(this._bgSprite, -1);
        this.addChild(this._progress, 1);

        this.updataProgress();

        return true;
    },

    initWithFile : function(bgFileName, progressFileName, value, maxValue) {
        this._value = value;
        this._maxValue = maxValue;
        this._bgSprite = cc.Sprite.create(bgFileName);
        this._progressSprite = cc.Sprite.create(progressFileName);

        return this.init();
    },

    initWithSpriteFrameName : function(bgSpriteFrameName, progressSpriteFrameName, value, maxValue) {
        this._value = value;
        this._maxValue = maxValue;
        this._bgSprite = cc.Sprite.createWithSpriteFrameName(bgSpriteFrameName);
        this._progressSprite = cc.Sprite.createWithSpriteFrameName(progressSpriteFrameName);

        return this.init();
    },

    getValue : function() {
        return this._value;
    },

    setValue : function(value) {
        this._value = value;
        this.updataProgress();
    },

    getMaxValue : function() {
        return this._maxValue;
    },

    addValue : function(value) {
        this._value += value;
        this.updataProgress();
    },

    setMaxValue : function(maxValue) {
        this._maxValue = maxValue;
        this.updataProgress();
    },

    updataProgress : function() {
        var ratio = this._value / this._maxValue * 100;

        var pto = cc.ProgressTo.create(0, ratio);
        this._progress.runAction(pto);
    },

    setBgSprite : function(bgSprite) {
        this.removeChild(this._bgSprite, true);
        this.addChild(bgSprite, -1);
        this._bgSprite = bgSprite;
    },

    setProgressSprite : function(progressSprite) {
        this._progress.setSprite(progressSprite);
    }
})


/*
* 创建函数
* */
Progress.createWithFile = function(bgFileName, progressFileName, value, maxValue) {
    var progress = new Progress();
    if(progress && progress.initWithFile(bgFileName, progressFileName, value, maxValue)) {
        return progress;
    }

    return null;
}

Progress.createWithSpriteFrameName = function(bgSpriteFrameName, progressSpriteFrameName, value, maxValue) {
    var progress = new Progress();
    if(progress && progress.initWithSpriteFrameName(bgSpriteFrameName, progressSpriteFrameName, value, maxValue)) {
        return progress;
    }

    return null;
}