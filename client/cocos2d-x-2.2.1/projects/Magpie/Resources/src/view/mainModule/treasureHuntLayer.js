/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-8-21
 * Time: 下午3:40
 * To change this template use File | Settings | File Templates.
 */


/*
 * treasure hunt layer
 * */


var MAX_TREASURE_HUNT_COUNT = 20;
var TREASURE_HUNT_BUFFER_LEN = 10;
var TREASURE_HUNT_ACCELERATION = (0.5 - 0.02) / TREASURE_HUNT_BUFFER_LEN;

var TreasureHuntLayer = cc.Layer.extend({
    _treasureHuntLayerFit: null,

    _selectFrame: null,
    _treasureHuntItem: null,
    _treasureHuntIcon1: null,
    _treasureHuntIcon2: null,
    _freeCountLabel: null,
    _countLabel: null,
    _goldLabel: null,
    _index: 0,
    _slideCount: 0,
    _nowSlideNum: 0,
    _interval: 0,
    _str: {},
    _locate: [],

    onEnter: function () {
        cc.log("TreasureHuntLayer onEnter");

        this._super();
        this.update();

        lz.dc.beginLogPageView("寻宝界面");
    },

    onExit: function () {
        cc.log("TreasureHuntLayer onExit");

        this._super();

        lz.dc.endLogPageView("寻宝界面");
    },

    init: function () {
        cc.log("TreasureHuntLayer init");

        if (!this._super()) return false;

        this._treasureHuntLayerFit = gameFit.mainScene.treasureHuntLayer;

        this._locate = this._treasureHuntLayerFit.locatePoints;
        var table = outputTables.treasure_hunt.rows;

        var bgSprite = cc.Sprite.create(main_scene_image.bg11);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._treasureHuntLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        var headIcon = cc.Sprite.create(main_scene_image.icon2);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(this._treasureHuntLayerFit.headIconPoint);
        this.addChild(headIcon);

        var titleIcon = cc.Sprite.create(main_scene_image.icon251);
        titleIcon.setPosition(this._treasureHuntLayerFit.titleIconPoint);
        this.addChild(titleIcon);

        var backItem = cc.MenuItemImage.create(
            main_scene_image.button8,
            main_scene_image.button8s,
            this._onClickBack,
            this
        );
        backItem.setPosition(this._treasureHuntLayerFit.backItemPoint);
        var menu = cc.Menu.create(backItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu, 1);

        var headLabel = cc.Sprite.create(main_scene_image.icon147);
        headLabel.setPosition(this._treasureHuntLayerFit.headLabelPoint);
        this.addChild(headLabel);

        var goldIcon = cc.Sprite.create(main_scene_image.icon148);
        goldIcon.setPosition(this._treasureHuntLayerFit.goldIconPoint);
        this.addChild(goldIcon);

        this._goldLabel = cc.LabelTTF.create(0, "STHeitiTC-Medium", 20);
        this._goldLabel.setAnchorPoint(cc.p(0, 0.5));
        this._goldLabel.setPosition(this._treasureHuntLayerFit.goldLabelPoint);
        this.addChild(this._goldLabel);

        for (var i = 0; i < MAX_TREASURE_HUNT_COUNT; ++i) {
            var point = this._locate[i];

            var iconSprite = cc.Sprite.create(this._getIconUrl(table[i].type));
            iconSprite.setPosition(cc.p(point.x + 1, point.y - 1));
            this.addChild(iconSprite);

            var valueLabel = cc.LabelTTF.create("+" + table[i].value, "STHeitiTC-Medium", 16);
            valueLabel.setAnchorPoint(cc.p(1, 0));
            valueLabel.setPosition(cc.p(point.x + 33, point.y - 35));
            this.addChild(valueLabel);
        }

        this._selectFrame = cc.Sprite.create(main_scene_image.icon105);
        this.addChild(this._selectFrame);
        this._selectFrame.setVisible(false);

        var treasureHuntBg = cc.Sprite.create(main_scene_image.icon253);
        treasureHuntBg.setPosition(this._treasureHuntLayerFit.treasureHuntBgPoint);
        this.addChild(treasureHuntBg);

        this._treasureHuntItem = cc.MenuItemImage.create(
            main_scene_image.button2,
            main_scene_image.button2s,
            main_scene_image.button2d,
            this._onClickTreasureHunt,
            this
        );
        this._treasureHuntItem.setPosition(this._treasureHuntLayerFit.treasureHuntItemPoint);

        var menu = cc.Menu.create(this._treasureHuntItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        this._treasureHuntItem.setScale(1.3);
        this._treasureHuntItem.runAction(cc.RepeatForever.create(
            cc.Sequence.create(
                cc.ScaleTo.create(1.5, 1.05, 1.05),
                cc.ScaleTo.create(1.5, 1.3, 1.3)
            )
        ));

        this._treasureHuntIcon1 = cc.Sprite.create(main_scene_image.icon254);
        this._treasureHuntIcon1.setPosition(this._treasureHuntLayerFit.treasureHuntIcon1Point);
        this.addChild(this._treasureHuntIcon1);

        this._treasureHuntIcon2 = cc.Sprite.create(main_scene_image.icon255);
        this._treasureHuntIcon2.setPosition(this._treasureHuntLayerFit.treasureHuntIcon2Point);
        this.addChild(this._treasureHuntIcon2);

        this._freeCountLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 25);
        this._freeCountLabel.setPosition(this._treasureHuntLayerFit.freeCountLabelPoint);
        this.addChild(this._freeCountLabel);

        this._countLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 25);
        this._countLabel.setPosition(this._treasureHuntLayerFit.countLabelPoint);
        this.addChild(this._countLabel);

        return true;
    },

    update: function () {
        cc.log("TreasureHuntLayer update");

        this._goldLabel.setString(gameData.player.get("gold"));

        var treasureHunt = gameData.treasureHunt;

        var count = treasureHunt.get("count");
        var freeCount = treasureHunt.get("freeCount");

        this._countLabel.setString(count);
        this._freeCountLabel.setString(freeCount);

        this._treasureHuntIcon1.setVisible(freeCount > 0);
        this._treasureHuntIcon2.setVisible(freeCount <= 0);
    },

    _getIconUrl: function (type) {
        var url = "";

        switch (type) {
            case "power":
                url = main_scene_image.icon106;
                break;
            case "elixir":
                url = main_scene_image.icon107;
                break;
            case "money":
                url = main_scene_image.icon108;
                break;
            case "skillPoint":
                url = main_scene_image.icon109;
                break;
            case "energy":
                url = main_scene_image.icon110;
                break;
            case "spirit":
                url = main_scene_image.icon111;
                break;
            case "gold":
                url = main_scene_image.icon112;
                break;
        }

        return url;
    },

    _getRandomIndex: function () {
        cc.log("TreasureHuntLayer _getStartIndex");

        return (Math.floor(Math.random() * MAX_TREASURE_HUNT_COUNT));
    },

    _getSlideCount: function (targetIndex) {
        var count = MAX_TREASURE_HUNT_COUNT * 3;

        if (targetIndex > this._index) {
            count += targetIndex - this._index;
        } else {
            count += MAX_TREASURE_HUNT_COUNT + targetIndex - this._index;
        }

        return count;
    },

    _playAnimation: function (targetIndex) {
        cc.log("TreasureHuntLayer _playAnimation");

        this._index = this._getRandomIndex();
        this._slideCount = this._getSlideCount(targetIndex);
        this._nowSlideNum = 0;
        this._interval = 0.5;

        cc.log(this._index);
        cc.log(targetIndex);
        cc.log(this._slideCount);

        this._selectFrame.setPosition(this._locate[this._index]);
        this._selectFrame.setVisible(true);

        if (this._slideCount > 0) {
            this._playAStep();
        }
    },

    _playAStep: function () {
        cc.log("TreasureHuntLayer _playAStep");

        this.unschedule(this._playAStep);

        if (this._nowSlideNum >= this._slideCount) {
            this._end();
            return;
        }

        this._nowSlideNum++;
        this._index = (this._index + 1) % MAX_TREASURE_HUNT_COUNT;

        this._selectFrame.setPosition(this._locate[this._index]);

        this.schedule(this._playAStep, this._interval, 1);

        if (this._nowSlideNum <= TREASURE_HUNT_BUFFER_LEN) {
            this._interval -= TREASURE_HUNT_ACCELERATION;
        }

        if (this._nowSlideNum + TREASURE_HUNT_BUFFER_LEN + 1 >= this._slideCount) {
            this._interval += TREASURE_HUNT_ACCELERATION;
        }
    },

    _end: function () {
        cc.log("TreasureHuntLayer _end");

        this.update();
        this._selectFrame.setVisible(false);
        var effect = cc.BuilderReader.load(main_scene_image.uiEffect35, this);
        effect.setPosition(this._selectFrame.getPosition());
        effect.animationManager.setCompletedAnimationCallback(this, function () {
            effect.removeFromParent();
            lz.tipReward(this._str);
            this._treasureHuntItem.setEnabled(true);

        });

        this.addChild(effect);

    },

    _onClickTreasureHunt: function () {
        cc.log("TreasureHuntLayer _onClickTreasureHunt");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var treasureHunt = gameData.treasureHunt;

        if (!treasureHunt.canTreasureHunt()) {
            return;
        }

        this._treasureHuntItem.setEnabled(false);

        var that = this;
        gameData.treasureHunt.treasureHunt(function (data) {
            cc.log(data);

            if (data) {
                that._str = data.str;

                var id = data.id;
                if (id >= 0 && id <= 19) {
                    that._playAnimation(id);
                }
            } else {
                that.update();

                that._treasureHuntItem.setEnabled(true);
            }
        })
    },

    _onClickBack: function () {
        cc.log("TreasureHuntLayer _onClickBack");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        MainScene.getInstance().switchLayer(MainLayer);
    }
});


TreasureHuntLayer.create = function () {
    var ret = new TreasureHuntLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};

TreasureHuntLayer.canEnter = function () {
    var limitLv = outputTables.function_limit.rows[1].lottery;
    var lv = gameData.player.get("lv");

    if (lv >= limitLv) {
        return true;
    }

    TipLayer.tip("寻宝" + limitLv + "级开放");

    return false;
};