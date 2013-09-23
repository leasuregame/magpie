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
        for (var i = 0; i < monthMark.days; ++i) {
            var point = cc.p(39 + i % 7 * 72, 327 - Math.floor(i / 7) * 72);

            var label = cc.Sprite.create(main_scene_image.icon186);
            label.setPosition(point);
            this.addChild(label);

            var dayLabel = cc.LabelTTF.create(i + 1, "STHeitiTC-Medium", 40);
            dayLabel.setColor(cc.c3b(255, 252, 175));
            dayLabel.setPosition(point);
            this.addChild(dayLabel);

            var hookLabel = cc.Sprite.create(main_scene_image.icon195);
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

        for (var i = 0; i < monthMark.days; ++i) {
            var flag = monthMark.mark >> i & 1;

            if (flag) {
                this._hookList[i].setVisible(true);
            } else {
                this._hookList[i].setVisible(false);
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

