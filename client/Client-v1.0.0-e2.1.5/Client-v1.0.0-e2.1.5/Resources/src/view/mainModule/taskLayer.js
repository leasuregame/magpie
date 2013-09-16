/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-20
 * Time: 下午4:17
 * To change this template use File | Settings | File Templates.
 */


/*
 * task layer
 * */


var TASK_CHAPTER_COUNT = 10;
var TASK_SECTION_COUNT = 5;

var TaskLayer = cc.Layer.extend({
    _index: 0,

    _turnLeftItem: null,
    _turnRightItem: null,

    _sectionItem: {},
    _wipeOutItemList: {},
    _scrollViewLayer: null,
    _scrollView: null,
    _beganOffset: null,
    _locate: [
        cc.p(160, 550),
        cc.p(200, 270),
        cc.p(440, 440),
        cc.p(480, 260),
        cc.p(360, 70)
    ],

    onEnter: function () {
        cc.log("TaskLayer onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("TaskLayer init");

        if (!this._super()) return false;

        this.setTouchEnabled(true);

        this._index = 0;

        // 读配置表
        var chapterTitleTable = outputTables.chapter_title.rows;
        var chapterTable = outputTables.chapter.rows;

        var scrollViewLayer = MarkLayer.create(cc.rect(40, 198, 640, 744));

        var lazyMenu = LazyMenu.create();
        lazyMenu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(lazyMenu, 1);

        for (var i = 1; i <= TASK_CHAPTER_COUNT; ++i) {
            var x = 640 * (i - 1);

            var bgSprite = cc.Sprite.create(main_scene_image.bg8);
            bgSprite.setAnchorPoint(cc.p(0, 0));
            bgSprite.setPosition(x, 0);
            scrollViewLayer.addChild(bgSprite);

            var wipeOutItem = cc.MenuItemImage.createWithIcon(
                main_scene_image.button9,
                main_scene_image.button9s,
                main_scene_image.icon15,
                this._onClickWipeOut(i),
                this
            );
            wipeOutItem.setPosition(cc.p(530 + x, 50));
            lazyMenu.addChild(wipeOutItem);

            var titlesLabel = StrokeLabel.create(chapterTitleTable[i].name, "黑体", 30);
            titlesLabel.setPosition(cc.p(320 + x, 745));
            scrollViewLayer.addChild(titlesLabel);

            for (var j = 1; j <= TASK_SECTION_COUNT; ++j) {
                var index = 5 * (i - 1) + j;

                var sectionItem = cc.MenuItemImage.create(
                    main_scene_image["task" + ((index - 1) % 5 + 1)],
                    main_scene_image["task" + ((index - 1) % 5 + 1)],
                    this._onClickSection(index),
                    this
                );
                sectionItem.setAnchorPoint(cc.p(0.5, 0));
                sectionItem.setPosition(cc.p(this._locate[j - 1].x + x, this._locate[j - 1].y));
                lazyMenu.addChild(sectionItem);

                var point = cc.p(this._locate[j - 1].x + x, this._locate[j - 1].y - 20);

                var sectionNameBgSprite = cc.Sprite.create(main_scene_image.icon3);
                sectionNameBgSprite.setPosition(point);
                scrollViewLayer.addChild(sectionNameBgSprite);

                var sectionNameLabel = cc.LabelTTF.create(chapterTable[index].chapter, "黑体", 25);
                sectionNameLabel.setPosition(point);
                scrollViewLayer.addChild(sectionNameLabel);
            }
        }

        this._scrollView = cc.ScrollView.create(cc.size(640, 768), scrollViewLayer);
        this._scrollView.setContentSize(cc.size(640 * TASK_CHAPTER_COUNT, 768));
        this._scrollView.setPosition(GAME_BG_POINT);
        this._scrollView.setBounceable(false);
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_HORIZONTAL);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);

        this._beganOffset = this._scrollView.getContentOffset();

        return true;
    },

    update: function () {
        cc.log("TaskLayer update");

        var offset = cc.p(-640 * this._index, 0);
        this._scrollView.setContentOffset(offset, true);
    },

    _onClickSection: function (id) {
        return function () {
            cc.log("TaskLayer _onClickSection " + id);

            MainScene.getInstance().switch(ExploreLayer.create(id));
        }
    },

    _onClickWipeOut: function () {
        cc.log("TaskLayer _onClickWipeOut");

        gameData.task.wipeOut(function (data) {
            cc.log(data);
        });
    },

    /**
     * when a touch finished
     * @param {cc.Touch} touches
     * @param {event} event
     */
    onTouchesEnded: function (touches, event) {
        cc.log("TaskLayer onTouchesEnded");

        this._scrollView.unscheduleAllCallbacks();
        this._scrollView.stopAllActions();

        var endOffset = this._scrollView.getContentOffset();
        var offset = this._beganOffset;

        if (this._beganOffset.x - endOffset.x > 100) {
            offset = cc.p(Math.floor(endOffset.x / 640) * 640, 0);
        } else if (this._beganOffset.x - endOffset.x < -100) {
            offset = cc.p(Math.ceil(endOffset.x / 640) * 640, 0);
        } else {
            if (Math.abs(offset.x) % 640 > 320) {
                offset = cc.p(Math.floor(offset.x / 640) * 640, 0);
            } else {
                offset = cc.p(Math.ceil(offset.x / 640) * 640, 0);
            }
        }

        this._scrollView.setContentOffset(offset, true);
        this._beganOffset = offset;
    },

    /**
     * @param touch
     * @param event
     */
    onTouchesCancelled: function (touch, event) {
        this.onTouchesEnded(touch, event);
    }
});


TaskLayer.create = function () {
    var ret = new TaskLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};