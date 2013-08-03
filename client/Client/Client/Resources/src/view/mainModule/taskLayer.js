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
    _task: null,
    _titleLabel: {},
    _sectionItem: {},


    _wipeOutItemList: {},

    _turnLeftSprite: null,
    _turnRightSprite: null,
    _scrollViewLayer: null,
    _scrollView: null,
    _locate: [
        cc.p(180, 600),
        cc.p(500, 550),
        cc.p(320, 400),
        cc.p(480, 280),
        cc.p(220, 200)
    ],

    onEnter: function () {
        cc.log("TaskLayer onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("TaskLayer init");

        if (!this._super()) return false;

        this._task = gameData.task;

        this._turnLeftSprite = cc.Sprite.create(main_scene_image.icon37);
        this._turnLeftSprite.setRotation(180);
        this._turnLeftSprite.setPosition(cc.p(80, 570));
//        this._turnLeftSprite.setVisible(false);
        this.addChild(this._turnLeftSprite, 1);

        this._turnRightSprite = cc.Sprite.create(main_scene_image.icon37);
        this._turnRightSprite.setPosition(cc.p(640, 570));
//        this._turnRightSprite.setVisible(false);
        this.addChild(this._turnRightSprite, 1);


        // 读配置表
        var chapterTable = outputTables.chapter.rows;

        this._scrollViewLayer = MarkLayer.create(cc.rect(40, 198, 640, 744));

        var menu = LazyMenu.create();
        menu.setPosition(cc.p(0, 0));
        this._scrollViewLayer.addChild(menu, 1);

        for (var i = 1; i <= TASK_CHAPTER_COUNT; ++i) {
            var offsetX = 640 * (i - 1);

            var bgSprite = cc.Sprite.create(main_scene_image.bg8);
            bgSprite.setAnchorPoint(cc.p(0, 0));
            bgSprite.setPosition(offsetX, 0);
            this._scrollViewLayer.addChild(bgSprite);

            var wipeOutItem = cc.MenuItemImage.create(main_scene_image.button9, main_scene_image.button9s, this._onClickWipeOut(i), this);
            wipeOutItem.setPosition(cc.p(120 + offsetX, 715));
            menu.addChild(wipeOutItem);

            var wipeOutIconSprite = cc.Sprite.create(main_scene_image.icon15);
            wipeOutIconSprite.setPosition(cc.p(120 + offsetX, 715));
            this._scrollViewLayer.addChild(wipeOutIconSprite, 1);

            var titlesLabel = cc.LabelTTF.create("第 " + i + " 页", 'Times New Roman', 30);
            titlesLabel.setPosition(cc.p(320 + offsetX, 715));
            this._scrollViewLayer.addChild(titlesLabel);

            for (var j = 1; j <= TASK_SECTION_COUNT; ++j) {
                var index = 5 * (i - 1) + j;

                var sectionItem = cc.MenuItemImage.create(main_scene_image.button18, main_scene_image.button18, this._onClickSection(index), this);
                sectionItem.setPosition(cc.p(this._locate[j - 1].x + offsetX, this._locate[j - 1].y));
                menu.addChild(sectionItem);

                var sectionNameLabel = cc.LabelTTF.create(chapterTable[index].chapter, 'Times New Roman', 30);
                sectionNameLabel.setPosition(cc.p(this._locate[j - 1].x + offsetX, this._locate[j - 1].y - 100));
                this._scrollViewLayer.addChild(sectionNameLabel);
            }
        }

        this._scrollView = cc.ScrollView.create(cc.size(640, 744), this._scrollViewLayer);
        this._scrollView.setContentSize(cc.size(640 * TASK_CHAPTER_COUNT, 744));
        this._scrollView.setPosition(GAME_BG_POINT);
        this._scrollView.setBounceable(false);
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_HORIZONTAL);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);

        return true;
    },

    update: function () {
        cc.log("TaskLayer update");

//        var chapter = this._task.getChapter();
//        var section = this._task.getSection();
//        var id = this._task.get("id");
//
//        cc.log(chapter);
//        cc.log(id);
//
//        for (var i = 0; i < TASK_CHAPTER_COUNT; ++i) {
//            if (i + 1 < chapter) {
//                this._titleLabel[i + 1].setString("第" + (i + 1) + "章 (5/5)");
//                this._wipeOutItem[i + 1].setEnabled(true);
//            } else if (i + 1 == chapter) {
//                this._titleLabel[i + 1].setString("第" + (i + 1) + "章 (" + section + "/5)");
//                this._wipeOutItem[i + 1].setEnabled(false);
//            } else {
//                this._titleLabel[i + 1].setString("第" + (i + 1) + "章 (0/5)");
//                this._wipeOutItem[i + 1].setEnabled(false);
//            }
//
//            for (var j = 0; j < TASK_SECTION_COUNT; ++j) {
//                var index = i * TASK_SECTION_COUNT + j + 1;
//
//                this._sectionItem[index].setEnabled(index <= id ? true : false);
//            }
//        }
    },

    _onClickSection: function (id) {
        return function () {
            cc.log("TaskLayer _onClickSection " + id);

            MainScene.getInstance().switch(ExploreLayer.create(id));
        }
    },

    _onClickWipeOut: function (id) {
        return function () {
            cc.log("TaskLayer _onClickWipeOut " + id);

            this._task.wipeOut(function (data) {
                cc.log(data);
            });
        }
    }
})


TaskLayer.create = function () {
    var ret = new TaskLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
}