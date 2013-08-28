/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-16
 * Time: 下午6:35
 * To change this template use File | Settings | File Templates.
 */


/*
 * explore layer
 * */


var ExploreLayer = cc.Layer.extend({
    _index: 0,
    _turnLeftSprite: null,
    _turnRightSprite: null,
    _scrollView: null,
    _exploreLabelList: {},
    _scrollViewLayer: null,
    _mapLabel: null,

    onEnter: function () {
        cc.log("ExploreLayer onEnter");

        this._super();
        this.update();
    },

    init: function (index) {
        cc.log("ExploreLayer init");

        if (!this._super()) return false;

        this._index = index;

        var bgSprite = cc.Sprite.create(main_scene_image.bg9);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(GAME_BG_POINT);
        this.addChild(bgSprite);

        var headIcon = cc.Sprite.create(main_scene_image.icon2);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(cc.p(40, 962));
        this.addChild(headIcon);

        this._mapLabel = cc.Sprite.create(main_scene_image.bg4, cc.rect(0, 0, 640, 193));
        this._mapLabel.setAnchorPoint(cc.p(0, 0));
        this._mapLabel.setPosition(cc.p(40, 766));
        this.addChild(this._mapLabel);

        var line1Icon = cc.Sprite.create(main_scene_image.icon96);
        line1Icon.setAnchorPoint(cc.p(0.5, 0));
        line1Icon.setPosition(cc.p(360, 928));
        this.addChild(line1Icon);

        var line2Icon = cc.Sprite.create(main_scene_image.icon96);
        line2Icon.setRotation(180);
        line2Icon.setAnchorPoint(cc.p(0.5, 0));
        line2Icon.setPosition(cc.p(360, 797));
        this.addChild(line2Icon);

        this._turnLeftSprite = cc.Sprite.create(main_scene_image.icon37);
        this._turnLeftSprite.setRotation(180);
        this._turnLeftSprite.setPosition(cc.p(60, 520));
//        this._turnLeftSprite.setVisible(false);
        this.addChild(this._turnLeftSprite, 1);

        this._turnRightSprite = cc.Sprite.create(main_scene_image.icon37);
        this._turnRightSprite.setPosition(cc.p(660, 520));
//        this._turnRightSprite.setVisible(false);
        this.addChild(this._turnRightSprite, 1);

        var titleLabel = cc.LabelTTF.create("第" + index + "章: " + outputTables.chapter.rows[index].chapter, "黑体", 30);
        titleLabel.setPosition(cc.p(360, 1005));
        this.addChild(titleLabel);

        var backItem = cc.MenuItemImage.create(main_scene_image.button8, main_scene_image.button8s, function () {
            MainScene.getInstance().switchLayer(PveLayer);
        }, this);
        backItem.setPosition(cc.p(100, 1005));

        var menu = cc.Menu.create(backItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        // 读配置表
        var chapterTable = outputTables.task.rows;

        this._scrollViewLayer = MarkLayer.create(cc.rect(92, 380, 537, 276));

        var lazyMenu = LazyMenu.create();
        lazyMenu.setPosition(cc.p(0, 0));
        this._scrollViewLayer.addChild(lazyMenu, 1);

        for (var i = 1; i <= 10; ++i) {
            var id = i + 10 * (this._index - 1);
            var offsetX = 493 * (i - 1);

            cc.log(id);

            var exploreBgSprite = cc.Sprite.create(main_scene_image.bg10);
            exploreBgSprite.setAnchorPoint(cc.p(0, 0));
            exploreBgSprite.setPosition(cc.p(offsetX, 180));
            this._scrollViewLayer.addChild(exploreBgSprite);

            var exploreItem = cc.MenuItemImage.create(
                main_scene_image.button9,
                main_scene_image.button9s,
                this._onClickExplore(id),
                this
            );
            exploreItem.setPosition(cc.p(246 + offsetX, 235));
            lazyMenu.addChild(exploreItem);

            var exploreIcon = cc.Sprite.create(main_scene_image.icon38);
            exploreIcon.setPosition(cc.p(246 + offsetX, 235));
            this._scrollViewLayer.addChild(exploreIcon, 1);

            var powerLabel = cc.LabelTTF.create("0/0", "黑体", 20);
            powerLabel.setPosition(cc.p(420 + offsetX, 381));
            this._scrollViewLayer.addChild(powerLabel);

            var expLabel = cc.LabelTTF.create("0/0", "黑体", 20);
            expLabel.setPosition(cc.p(420 + offsetX, 333));
            this._scrollViewLayer.addChild(expLabel);

            var progressLabel = cc.LabelTTF.create("0/0", "黑体", 20);
            progressLabel.setPosition(cc.p(420 + offsetX, 294));
            this._scrollViewLayer.addChild(progressLabel);

            var nameLabel = cc.LabelTTF.create(chapterTable[id].section_name, "黑体", 25);
            nameLabel.setPosition(cc.p(246 + offsetX, 432));
            this._scrollViewLayer.addChild(nameLabel);

            var storyLabel = cc.LabelTTF.create(
                "哈哈哈哈哈哈啊哈哈哈哈哈哈\n哈哈哈哈哈哈啊哈哈哈哈哈哈",
                "黑体",
                20,
                cc.size(537, 100),
                cc.TEXT_ALIGNMENT_LEFT
            );
            storyLabel.setAnchorPoint(cc.p(0, 1));
            storyLabel.setPosition(cc.p(30 + offsetX, 100));
            this._scrollViewLayer.addChild(storyLabel);

            var powerProgress = Progress.create(null, main_scene_image.progress2, 200, 200);
            powerProgress.setPosition(cc.p(240 + offsetX, 382));
            this._scrollViewLayer.addChild(powerProgress);

            var expProgress = Progress.create(null, main_scene_image.progress3, 200, 200);
            expProgress.setPosition(cc.p(240 + offsetX, 335));
            this._scrollViewLayer.addChild(expProgress);

            var sectionProgress = Progress.create(null, main_scene_image.progress3, 200, 200);
            sectionProgress.setPosition(cc.p(240 + offsetX, 297));
            this._scrollViewLayer.addChild(sectionProgress);

            this._exploreLabelList[i] = {
                powerLabel: powerLabel,
                expLabel: expLabel,
                progressLabel: progressLabel,
                powerProgress: powerProgress,
                expProgress: expProgress,
                sectionProgress: sectionProgress
            }
        }

        this._scrollView = cc.ScrollView.create(cc.size(493, 556), this._scrollViewLayer);
        this._scrollView.setContentSize(cc.size(5370, 556));
        this._scrollView.setPosition(cc.p(113, 200));
        this._scrollView.setBounceable(false);
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_HORIZONTAL);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);

        return true;
    },

    update: function () {
        cc.log("ExploreLayer update");

        for (var i = 1; i <= 10; ++i) {
            var exploreLabel = this._exploreLabelList[i];
            var player = gameData.player;
            var task = gameData.task;
            var progress = task.getProgress(i + 10 * (this._index - 1));
            cc.log(progress);
            var power = player.get("power");
            var maxPower = player.get("maxPower");
            var exp = player.get("exp");
            var maxExp = player.get("maxExp");
            var section = progress.progress;
            var maxSection = progress.points;

            exploreLabel.powerLabel.setString(power + "/" + maxPower);
            exploreLabel.expLabel.setString(exp + "/" + maxExp);
            exploreLabel.progressLabel.setString(section + "/" + maxSection);

            exploreLabel.powerProgress.setAllValue(maxPower, power);
            exploreLabel.expProgress.setAllValue(maxExp, exp);
            exploreLabel.sectionProgress.setAllValue(maxSection, section);
        }
    },

    _onClickExplore: function (id) {
        return function () {
            cc.log("ExploreLayer _onClickExplore " + id);

            var that = this;
            gameData.task.explore(function (data) {
                cc.log("ExploreLayer _onClickExplore yes");
                cc.log(data);

                if (data.result == "fight") {
                    var scene = BattleScene.create(BattleLogNote.getInstance().getBattleByBattleLogId(data.battleLogId));
                    cc.Director.getInstance().replaceScene(scene);
//            cc.Director.getInstance().replaceScene(cc.TransitionPageTurn.create(1, scene, true));
                } else {
                    that.update();
                }
            }, id);
        }
    },

    _showSprite: function (sprite) {
        cc.log("ExploreLayer _showSprite");
    },

    _hitSprite: function (sprite) {
        cc.log("ExploreLayer _showSprite");
    }
});


ExploreLayer.create = function (index) {
    var ret = new ExploreLayer();

    if (ret && ret.init(index)) {
        return ret;
    }

    return null;
};