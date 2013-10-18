/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-9-22
 * Time: 下午6:05
 * To change this template use File | Settings | File Templates.
 */


/*
 * gold layer
 * */


var MIN_GOLD_HEIGHT = 1700;
var MAX_GOLD_HEIGHT = 1900;

var MIN_GOLD_OFFSET = 30;
var MAX_GOLD_OFFSET = 320;

var MIN_GOLD_SPEED = 250;
var MAX_GOLD_SPEED = 400;

var MIN_GOLD_ROTATION = -450;
var MAX_GOLD_ROTATION = 450;

var GoldLayer = LazyLayer.extend({
    _gold: 0,
    _goldList: [],
    _goldItem: [],
    _goldBoxItem: null,
    _length: 0,

    init: function (data) {
        cc.log("GoldLayer init");

        if (!this._super()) return false;

        this.setTouchPriority(MAIN_MENU_LAYER_HANDLER_PRIORITY);

        this._gold = 0;
        this._goldList = data || [];

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 230), 640, 960);
        bgLayer.setPosition(GAME_ZERO);
        this.addChild(bgLayer);

        var goldIcon = cc.Sprite.create(main_scene_image.icon214);
        goldIcon.setPosition(cc.p(550, 1000));
        this.addChild(goldIcon);

        this._goldLabel = cc.LabelTTF.create(this._gold, "STHeitiTC-Medium", 20);
        this._goldLabel.setColor(cc.c3b(255, 239, 131));
        this._goldLabel.setAnchorPoint(cc.p(0, 0.5));
        this._goldLabel.setPosition(cc.p(600, 1000));
        this.addChild(this._goldLabel);

        var menu = cc.Menu.create();
        menu.setTouchPriority(MAIN_MENU_LAYER_HANDLER_PRIORITY);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        this._goldBoxItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.icon221,
            main_scene_image.icon221,
            this._onClickGoldBox,
            this
        );
        this._goldBoxItem.setPosition(cc.p(360, 350));
        menu.addChild(this._goldBoxItem);

        var action = cc.Sequence.create(
            cc.Spawn.create(
                cc.MoveBy.create(1, cc.p(0, -30)),
                cc.ScaleTo.create(1, 0.96, 0.96)
            ),
            cc.Spawn.create(
                cc.MoveBy.create(1, cc.p(0, 30)),
                cc.ScaleTo.create(1, 1, 1)
            )
        );

        this._goldBoxItem.runAction(cc.RepeatForever.create(action));

        this._length = this._goldList.length;

        for (var i = 0; i < this._length; ++i) {
            this._goldItem[i] = cc.MenuItemImage.createWithIcon(
                main_scene_image.icon221,
                main_scene_image.icon221,
                this._onClickGold(i),
                this
            );
            this._goldItem[i].setScale(this._getScale(this._goldList[i]));
            this._goldItem[i].setPosition(cc.p(360, 350));
            menu.addChild(this._goldItem[i]);
            this._goldItem[i].setVisible(false);
        }

        return true;
    },

    _getScale: function (value) {
        var scale = 0.15;

        if (value > 20) {
            scale = 0.45;
        } else if (value > 10) {
            scale = 0.35;
        } else if (value > 5) {
            scale = 0.25;
        }

        return scale;
    },

    _getTime: function (height, offset) {
        return ((height + offset) / this._getRandomSpeed());
    },

    _getRandomHeight: function () {
        return lz.random(MIN_GOLD_HEIGHT, MAX_GOLD_HEIGHT);
    },

    _getRandomOffset: function () {
        return lz.random(MIN_GOLD_OFFSET, MAX_GOLD_OFFSET);
    },

    _getRandomSpeed: function () {
        return lz.random(MIN_GOLD_SPEED, MAX_GOLD_SPEED);
    },

    _getRandomRotation: function () {
        return lz.random(MIN_GOLD_ROTATION, MAX_GOLD_ROTATION);
    },

    _open: function () {
        cc.log("GoldLayer _open");
        this._goldBoxItem.removeFromParent();

        for (var i = 0; i < this._length; ++i) {
            this._popGold(i);
        }
    },

    _popGold: function (index) {
        this._goldItem[index].setVisible(true);

        var height = this._getRandomHeight();
        var offset = this._getRandomOffset();
        var rotation = this._getRandomRotation();
        var time = this._getTime(height, offset);
        var starPoint = cc.p(360, 350);
        var endPoint = cc.p(360, 100);

        if (index % 2 == 0) {
            endPoint.x -= offset;
        } else {
            endPoint.x += offset;
        }

        var controlPoint = cc.p((starPoint.x + endPoint.x) / 2, height);

        var action = cc.Sequence.create(
            cc.EaseExponentialOut.create(
                cc.Spawn.create(
                    cc.BezierTo.create(time, [starPoint, controlPoint, endPoint]),
                    cc.RotateBy.create(time, rotation)
                )
            ),
            cc.CallFunc.create(function () {
                this._removeGold(index);
            }, this)
        );

        this._goldItem[index].runAction(action);
    },

    _removeGold: function (index) {
        cc.log("GoldLayer _removeGold: " + index);

        this._length -= 1;
        this._goldItem[index].removeFromParent();

        if (this._length <= 0) {
            this._end();
        }
    },

    _obtainGold: function (index) {
        cc.log("GoldLayer _obtainGold: " + index);

        var goldItem = this._goldItem[index];
        var starPoint = goldItem.getPosition();
        var endPoint = cc.p(548, 1003);
        var xLen = endPoint.x - starPoint.x;
        var yLen = endPoint.y - starPoint.y;
        var time = Math.sqrt(xLen * xLen + yLen * yLen) / 400;
        var scaleTime = 0.3;

        if (scaleTime > time) {
            scaleTime = time;
        }

        var waitTime = time - scaleTime;

        TipLayer.tipNoBg("元宝 + " + this._goldList[index]);

        var action = cc.Sequence.create(
            cc.EaseExponentialOut.create(
                cc.Spawn.create(
                    cc.MoveTo.create(time, endPoint),
                    cc.RotateTo.create(time, 0),
                    cc.Sequence.create(
                        cc.DelayTime.create(waitTime),
                        cc.ScaleTo.create(scaleTime, 0.12)
                    )
                )
            ),
            cc.CallFunc.create(function () {
                this._gold += this._goldList[index];
                this._goldLabel.setString(this._gold);

                this._removeGold(index);
            }, this)
        );

        goldItem.setEnabled(false);
        goldItem.stopAllActions();
        goldItem.runAction(action);
    },

    _end: function () {
        cc.log("GoldLayer _end");

        if (this._gold > 0) {
            gameData.task.obtainGold(this._gold);

            var tipLabel = cc.LabelTTF.create("恭喜您，获得 " + this._gold + " 元宝", "STHeitiTC-Medium", 35);
            tipLabel.setColor(cc.c3b(255, 239, 131));
            tipLabel.setPosition(cc.p(360, 550));
            this.addChild(tipLabel);
        }

        this.scheduleOnce(function () {
            this.removeFromParent();
        }, 2);
    },

    _onClickGoldBox: function () {
        cc.log("GoldLayer _onClickGoldBox");

        this._open();
    },

    _onClickGold: function (index) {
        return function () {
            cc.log("GoldLayer _onClickGold: " + index);

            this._obtainGold(index);
        }
    }
});


GoldLayer.create = function (data) {
    var ret = new GoldLayer();

    if (ret && ret.init(data)) {
        return ret;
    }

    return null;
};


GoldLayer.play = function (data) {
    var goldLayer = GoldLayer.create(data);

    cc.Director.getInstance().getRunningScene().addChild(goldLayer, 2);
};