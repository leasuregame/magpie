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
    _selectFrame: null,
    _tipLabel: null,
    _freeCountLabel: null,
    _countLabel: null,
    _index: 0,
    _slideCount: 0,
    _nowSlideNum: 0,
    _interval: 0,
    _locate: [
        cc.p(110, 883),
        cc.p(235, 883),
        cc.p(360, 883),
        cc.p(485, 883),
        cc.p(610, 883),
        cc.p(610, 788),
        cc.p(610, 683),
        cc.p(610, 578),
        cc.p(610, 473),
        cc.p(610, 368),
        cc.p(610, 263),
        cc.p(485, 263),
        cc.p(360, 263),
        cc.p(235, 263),
        cc.p(110, 263),
        cc.p(110, 368),
        cc.p(110, 473),
        cc.p(110, 578),
        cc.p(110, 683),
        cc.p(110, 788)
    ],

    onEnter: function () {
        cc.log("TreasureHuntLayer onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("TreasureHuntLayer init");

        if (!this._super()) return false;

        var table = outputTables.treasure_hunt.rows;

        var bgSprite = cc.Sprite.create(main_scene_image.bg11);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(GAME_BG_POINT);
        this.addChild(bgSprite);

        for (var i = 0; i < MAX_TREASURE_HUNT_COUNT; ++i) {
            var point = this._locate[i];
            var frame = cc.Sprite.create(main_scene_image.card_item_bg1);
            frame.setScale(0.8);
            frame.setPosition(cc.p(point.x + 2, point.y - 2));
            this.addChild(frame);

            var iconSprite = cc.Sprite.create(this._getIconUrl(table[i].type));
            iconSprite.setPosition(point);
            this.addChild(iconSprite);

            var valueLabel = cc.LabelTTF.create("+" + table[i].value, "黑体", 16);
            valueLabel.setAnchorPoint(cc.p(1, 0));
            valueLabel.setPosition(cc.p(point.x + 33, point.y - 35));
            this.addChild(valueLabel);
        }

        this._selectFrame = cc.Sprite.create(main_scene_image.icon105);
        this._selectFrame.setPosition(cc.p(500, 500));
        this.addChild(this._selectFrame);
        this._selectFrame.setVisible(false);

        var treasureHuntItem = cc.MenuItemImage.create(
            main_scene_image.button35,
            main_scene_image.button35,
            this._onClickTreasureHunt,
            this
        );
        treasureHuntItem.setPosition(cc.p(360, 630));

        var menu = cc.Menu.create(treasureHuntItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        this._tipLabel = cc.Sprite.create(main_scene_image.icon114);
        this._tipLabel.setPosition(cc.p(360, 780));
        this.addChild(this._tipLabel);
//        this._tipLabel.setVisible(false);

        var helpLabel = cc.Sprite.create(main_scene_image.icon113);
        helpLabel.setPosition(cc.p(360, 400));
        this.addChild(helpLabel);

        this._freeCountLabel = cc.LabelTTF.create("0", "黑体", 30);
        this._freeCountLabel.setAnchorPoint(cc.p(0, 0.5));
        this._freeCountLabel.setPosition(cc.p(400, 427));
        this.addChild(this._freeCountLabel);

        this._countLabel = cc.LabelTTF.create("0", "黑体", 30);
        this._countLabel.setAnchorPoint(cc.p(0, 0.5));
        this._countLabel.setPosition(cc.p(400, 373));
        this.addChild(this._countLabel);

        return true;
    },

    update: function () {
        cc.log("TreasureHuntLayer update");


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
            LazyLayer.showCloudLayer();
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

        var scaleAction1 = cc.ScaleTo.create(0.3, 1.2);
        var scaleAction2 = cc.ScaleTo.create(0.3, 1);

        var selectFrameAction = cc.Sequence.create(
            scaleAction1.copy(),
            scaleAction2.copy(),
            scaleAction1.copy(),
            scaleAction2.copy(),
            scaleAction1,
            scaleAction2
        );

        this._selectFrame.runAction(selectFrameAction);

        this.scheduleOnce(function () {
            this._selectFrame.setVisible(false);
            LazyLayer.closeCloudLayer();
        }, 1.8);
    },

    _onClickTreasureHunt: function () {
        cc.log("TreasureHuntLayer _onClickTreasureHunt");

        this._playAnimation(this._getRandomIndex());
    }
});


TreasureHuntLayer.create = function () {
    var ret = new TreasureHuntLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};