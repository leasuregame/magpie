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


var CHAPTER_COUNT = 10;
var SECTION_COUNT = 5;

var TaskLayer = cc.Layer.extend({
    _task: null,
    _titleLabel: {},
    _sectionItem: {},
    _wipeOutItem: {},

    onEnter: function () {
        cc.log("TaskLayer onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("TaskLayer init");

        if (!this._super()) return false;

        this._task = gameData.task;

        var chapterTable = outputTables.chapter.rows;
        var scrollViewLayer = cc.Layer.create();

        var line = cc.LayerColor.create(cc.c4b(100, 0, 100, 250), 20, 750);
        scrollViewLayer.addChild(line);

        for (var i = 0; i < CHAPTER_COUNT; ++i) {
            var cell = cc.LayerColor.create(cc.c4b(100, 100, 0, 100), 600, 750);
            cell.setPosition(cc.p(600 * i + 20 * (i + 1), 0));
            scrollViewLayer.addChild(cell);

            line = cc.LayerColor.create(cc.c4b(100, 0, 100, 250), 20, 750);
            line.setPosition(cc.p((600 + 20) * (i + 1), 0));
            scrollViewLayer.addChild(line);

            var label = cc.LabelTTF.create("第" + (i + 1) + "章", 'Times New Roman', 50);
            label.setPosition(cc.p(300, 800));
            cell.addChild(label);
            this._titleLabel[i + 1] = label;

            var lazyMenu = LazyMenu.create();
            lazyMenu.setPosition(cc.p(0, 0));
            cell.addChild(lazyMenu);

            var wipeOutItem = cc.MenuItemFont.create("扫荡", this._onClickWipeOut(i + 1), this);
            wipeOutItem.setPosition(cc.p(550, 800));
            lazyMenu.addChild(wipeOutItem);
            this._wipeOutItem[i + 1] = wipeOutItem;

            for (var j = 0; j < SECTION_COUNT; ++j) {
                var id = i * SECTION_COUNT + j + 1;
                var name = chapterTable[id].chapter;

                var idLabel = cc.LabelTTF.create("第" + (j + 1) + "小节", 'Times New Roman', 30);
                idLabel.setPosition(cc.p(180, 600 - j * 110));
                cell.addChild(idLabel);

                var sectionItem = cc.MenuItemFont.create(name, this._onClickSection(id), this);
                sectionItem.setPosition(cc.p(400, 600 - j * 110));
                lazyMenu.addChild(sectionItem);

                this._sectionItem[id] = sectionItem;
            }
        }

        var scrollView = cc.ScrollView.create(cc.size(GAME_WIDTH, 840), scrollViewLayer);
        scrollView.setContentSize(cc.size(GAME_WIDTH * CHAPTER_COUNT - 20 * (CHAPTER_COUNT - 1), 840));
        scrollView.setPosition(cc.p(GAME_HORIZONTAL_LACUNA, 150));
        scrollView.setBounceable(false);
        scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_HORIZONTAL);
        scrollView.updateInset();
        this.addChild(scrollView);

        return true;
    },

    update: function () {
        cc.log("TaskLayer update");

        var chapter = this._task.getChapter();
        var section = this._task.getSection();
        var id = this._task.get("id");

        cc.log(chapter);
        cc.log(id);

        for (var i = 0; i < CHAPTER_COUNT; ++i) {
            if (i + 1 < chapter) {
                this._titleLabel[i + 1].setString("第" + (i + 1) + "章 (5/5)");
                this._wipeOutItem[i + 1].setEnabled(true);
            } else if (i + 1 == chapter) {
                this._titleLabel[i + 1].setString("第" + (i + 1) + "章 (" + section + "/5)");
                this._wipeOutItem[i + 1].setEnabled(false);
            } else {
                this._titleLabel[i + 1].setString("第" + (i + 1) + "章 (0/5)");
                this._wipeOutItem[i + 1].setEnabled(false);
            }

            for (var j = 0; j < SECTION_COUNT; ++j) {
                var index = i * SECTION_COUNT + j + 1;

                this._sectionItem[index].setEnabled(index <= id ? true : false);
            }
        }
    },

    _onClickSection: function (id) {
        return function () {
            cc.log("TaskLayer _onClickSection " + id);
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