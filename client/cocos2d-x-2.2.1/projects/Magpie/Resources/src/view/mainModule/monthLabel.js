/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-9-6
 * Time: 下午2:58
 * To change this template use File | Settings | File Templates.
 */


/*
 * month layer
 * */


var MonthLabel = cc.Node.extend({
    _index: 0,
    _hookList: [],
    _dayLabel: [],
    _hookEffect: [],
    _signInEffect: null,
    _effect: [],

    onEnter: function () {
        cc.log("MonthLabel onEnter");

        this._super();
        this.update();
    },

    init: function (index) {
        cc.log("MonthLabel init");

        if (!this._super()) return false;

        this._index = index;

        var monthMark = gameData.signIn.getMonthMark(this._index);

        var bgSprite = cc.Scale9Sprite.create(main_scene_image.icon185);
        bgSprite.setContentSize(cc.size(510, 366));
        bgSprite.setAnchorPoint(cc.p(0, 0));
        this.addChild(bgSprite);

        this._hookList = [];
        this._hookEffect = [];
        this._effect = [];
        this._signInEffect = null;
        var nowDay = new Date().getDate();

        for (var i = 0; i < monthMark.days; ++i) {
            var flag = monthMark.mark >> i & 1;
            var point = cc.p(39 + i % 7 * 72, 327 - Math.floor(i / 7) * 72);
            var url = "icon186";
            if (i < nowDay && this._index == 0) {
                url = "icon305";
            }
            var label = cc.Sprite.create(main_scene_image[url]);
            label.setPosition(point);
            this.addChild(label);

            this._dayLabel[i] = cc.LabelTTF.create(i + 1, "STHeitiTC-Medium", 40);
            this._dayLabel[i].setColor(cc.c3b(255, 252, 175));
            this._dayLabel[i].setPosition(point);
            this.addChild(this._dayLabel[i]);

            var hookLabel = cc.Sprite.create(main_scene_image.icon306);
            hookLabel.setPosition(point);
            this.addChild(hookLabel);
            hookLabel.setVisible(flag);

            this._hookList[i] = hookLabel;
        }

        var dateLabel = cc.LabelTTF.create(monthMark.year + " . " + monthMark.month, "STHeitiTC-Medium", 20);
        dateLabel.setColor(cc.c3b(255, 252, 175));
        dateLabel.setPosition(cc.p(450, 25));
        this.addChild(dateLabel);

        return true;
    },

    update: function () {
        cc.log("MonthLabel update");

        var monthMark = gameData.signIn.getMonthMark(this._index);
        var nowDay = new Date().getDate();
        var that = this;

        for (var i = 0; i < monthMark.days; ++i) {
            (function(i){
                var flag = monthMark.mark >> i & 1;

                if (flag) {

                    if (i + 1 == nowDay && that._signInEffect) {
                        that._signInEffect.removeFromParent();
                        that._signInEffect = null;
                    }

                    if (!that._hookList[i].isVisible() && !that._effect[i]) {

                        that._effect[i] = cc.BuilderReader.load(main_scene_image.uiEffect63, this);
                        var point = that._hookList[i].getPosition();
                        that._effect[i].setPosition(point);

                        var hook = that._hookList[i];
                        that._effect[i].animationManager.setCompletedAnimationCallback(this, function () {
                            cc.log(i);
                            that._effect[i].removeFromParent();
                            that._effect[i] = null;
                            hook.setVisible(true);
                        });

                        that.addChild(that._effect[i]);

                    } else {
                        that._hookList[i].setVisible(true);
                    }

                } else {
                    that._hookList[i].setVisible(false);

                    if (that._index == 0) {
                        var point = that._dayLabel[i].getPosition();
                        if (i + 1 == nowDay && !that._signInEffect) {
                            that._signInEffect = cc.BuilderReader.load(main_scene_image.uiEffect60, this);
                            that._signInEffect.setPosition(point);
                            that.addChild(that._signInEffect);
                        }
                    }
                }
            })(i);

        }
    }
});


MonthLabel.create = function (index) {
    var ret = new MonthLabel();

    if (ret && ret.init(index)) {
        return ret;
    }

    return null;
};

