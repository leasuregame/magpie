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
        this._signInEffect = null;

        for (var i = 0; i < monthMark.days; ++i) {
            var point = cc.p(39 + i % 7 * 72, 327 - Math.floor(i / 7) * 72);

            var url = "icon186";

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
            hookLabel.setVisible(false);

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

        for (var i = 0; i < monthMark.days; ++i) {
            var flag = monthMark.mark >> i & 1;

            if (flag) {

                if (i + 1 == nowDay && this._signInEffect) {
                    this._signInEffect.removeFromParent();
                    this._signInEffect = null;
                }

                if (this._hookEffect[i]) {
                    this._hookEffect[i].removeFromParent();
                    this._hookEffect[i] = null;

                    var effect = cc.BuilderReader.load(main_scene_image.uiEffect63, this);
                    var point = this._hookList[i].getPosition();
                    effect.setPosition(point);

                    var hook = this._hookList[i];
                    effect.animationManager.setCompletedAnimationCallback(this, function () {
                        effect.removeFromParent();
                        hook.setVisible(true);
                    });

                    this.addChild(effect);

                } else {
                    this._hookList[i].setVisible(true);
                }

            } else {
                this._hookList[i].setVisible(false);

                if (this._index == 0) {
                    if (i + 1 <= nowDay && !this._hookEffect[i]) {
                        this._hookEffect[i] = cc.BuilderReader.load(main_scene_image.uiEffect60, this);
                        var point = this._dayLabel[i].getPosition();
                        this._hookEffect[i].setPosition(point);
                        this.addChild(this._hookEffect[i]);

                        if (i + 1 == nowDay && !this._signInEffect) {
                            this._signInEffect = cc.BuilderReader.load(main_scene_image.uiEffect62, this);
                            this._signInEffect.setPosition(point);
                            this.addChild(this._signInEffect);
                        }

                    }
                }
            }
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

