/**
 * Created by lujunyu on 14-6-14.
 */

var ExpInstanceLayer = cc.Layer.extend({
    _expInstanceLayerFit: null,

    _subdueItems: null,
    _tipLabels: null,
    _openLvLabels: null,
    _shadeLabels: null,

    onEnter: function () {
        cc.log("ExpInstanceLayer onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("ExpInstanceLayer init");

        if (!this._super()) return false;

        this._expInstanceLayerFit = gameFit.mainScene.expInstanceLayer;

        var bgSprite = cc.Sprite.create(main_scene_image.bg11);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._expInstanceLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        var topLabel = cc.Sprite.create(main_scene_image.icon60);
        topLabel.setPosition(this._expInstanceLayerFit.topLabelPoint);
        this.addChild(topLabel);

        var headIcon = cc.Sprite.create(main_scene_image.icon2);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(this._expInstanceLayerFit.headIconPoint);
        this.addChild(headIcon);

        var titleLabel = cc.Sprite.create(main_scene_image.icon469);
        titleLabel.setPosition(this._expInstanceLayerFit.titleLabelPoint);
        this.addChild(titleLabel);

        var powerIcon = cc.Sprite.create(main_scene_image.icon150);
        powerIcon.setPosition(this._expInstanceLayerFit.powerIconPoint);
        this.addChild(powerIcon);

        this._powerLabel = cc.LabelTTF.create(gameData.player.get("power") + "/150", "STHeitiTC-Medium", 25);
        this._powerLabel.setAnchorPoint(cc.p(0, 0.5));
        this._powerLabel.setPosition(this._expInstanceLayerFit.powerLabelPoint);
        this.addChild(this._powerLabel);

        var timesBgLabel = cc.Sprite.create(main_scene_image.icon477);
        timesBgLabel.setPosition(this._expInstanceLayerFit.timesBgLabelPoint);
        this.addChild(timesBgLabel);

        var remainTimesLabel = cc.LabelTTF.create("今日剩余：    次", "STHeitiTC-Medium", 28);
        remainTimesLabel.setPosition(this._expInstanceLayerFit.remainTimesLabelPoint);
        this.addChild(remainTimesLabel);

        this._timesLabel = cc.LabelTTF.create("10", "STHeitiTC-Medium", 28);
        this._timesLabel.setPosition(this._expInstanceLayerFit.timesLabelPoint);
        this.addChild(this._timesLabel);

        var buyCountItem = cc.MenuItemImage.create(
            main_scene_image.button16,
            main_scene_image.button16s,
            this._onClickBuyCount,
            this
        );
        buyCountItem.setScale(1.3);
        buyCountItem.setPosition(this._expInstanceLayerFit.buyCountItemPoint);

        var menu = cc.Menu.create(buyCountItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        this._addScrollView();

        return true;
    },

    update: function () {
        cc.log("ExpInstanceLayer update");

        var lv = gameData.player.get("lv");

        var lvs = [0, 40, 65];
        for (var i = 0; i < 3; i++) {
            this._tipLabels[i].setVisible(lv >= lvs[i]);
            this._subdueItems[i].setEnabled(lv >= lvs[i]);
            this._openLvLabels[i].setVisible(lv < lvs[i]);
            this._shadeLabels[i].setVisible(lv < lvs[i]);
        }

    },

    _addScrollView: function () {
        cc.log("ExpInstanceLayer _addScrollView");

        var scrollViewLayer = MarkLayer.create(this._expInstanceLayerFit.scrollViewLayerRect);

        this._subdueItems = [];
        this._tipLabels = [];
        this._openLvLabels = [];
        this._shadeLabels = [];

        var scrollViewHeight = 3 * 230;
        var table = outputTables.exp_instance_limit.rows;

        for (var i = 0; i < 3; i++) {
            var y = scrollViewHeight - 230 * i - 230;

            var bgLabel = cc.Sprite.create(main_scene_image.icon470);
            bgLabel.setAnchorPoint(cc.p(0.5, 0));
            bgLabel.setPosition(cc.p(320, y));
            scrollViewLayer.addChild(bgLabel);

            var difficultyIcon = cc.Sprite.create(main_scene_image["icon" + (473 + i)]);
            difficultyIcon.setAnchorPoint(cc.p(0, 0));
            difficultyIcon.setPosition(cc.p(35, 152));
            bgLabel.addChild(difficultyIcon);

            var maybeGetIcon = cc.Sprite.create(main_scene_image.icon472);
            maybeGetIcon.setAnchorPoint(cc.p(0, 0));
            maybeGetIcon.setPosition(cc.p(35, 60));
            bgLabel.addChild(maybeGetIcon);

            var tipLabel = ColorLabelTTF.create(
                {
                    iconName: "power",
                    scale: 0.8,
                    spacing: -2
                },
                {
                    string: "20",
                    fontName: "STHeitiTC-Medium",
                    fontSize: 22
                }
            );
            tipLabel.setAnchorPoint(cc.p(0, 0));
            tipLabel.setPosition(cc.p(480, 175));
            bgLabel.addChild(tipLabel);

            this._tipLabels[i] = tipLabel;

            var openLvLabel = StrokeLabel.create(table[i + 1].open_lv + "级开放", "STHeitiTC-Medium", 22);
            openLvLabel.setColor(cc.c3b(232, 48, 48));
            openLvLabel.setBgColor(cc.c3b(0, 0, 0));
            openLvLabel.setAnchorPoint(cc.p(0, 0));
            openLvLabel.setPosition(cc.p(480, 165));
            bgLabel.addChild(openLvLabel);

            this._openLvLabels[i] = openLvLabel;

            var descLabel = cc.LabelTTF.create("我的使命是：无私贡献！不求回报！", "STHeitiTC-Medium", 22);
            descLabel.setColor(cc.c3b(108, 48, 25));
            descLabel.setAnchorPoint(cc.p(0, 0));
            descLabel.setPosition(cc.p(30, 120));
            bgLabel.addChild(descLabel);

            var subdueItem = cc.MenuItemImage.createWithIcon(
                main_scene_image.button9,
                main_scene_image.button9s,
                main_scene_image.button9d,
                main_scene_image.icon471,
                this._onClickSubdue(i + 1),
                this
            );
            subdueItem.setAnchorPoint(cc.p(0, 0));
            subdueItem.setPosition(cc.p(450, 20));

            var menu = LazyMenu.create(subdueItem);
            menu.setPosition(cc.p(0, 0));
            bgLabel.addChild(menu);

            this._subdueItems[i] = subdueItem;

            var shadeLabel = cc.Sprite.create(main_scene_image.icon476);
            shadeLabel.setAnchorPoint(cc.p(0.5, 0));
            shadeLabel.setPosition(cc.p(320, y));
            scrollViewLayer.addChild(shadeLabel);

            this._shadeLabels[i] = shadeLabel;
        }

        var scrollView = cc.ScrollView.create(this._expInstanceLayerFit.scrollViewSize, scrollViewLayer);
        scrollView.setPosition(this._expInstanceLayerFit.scrollViewPoint);
        scrollView.setBounceable(false);
        scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        scrollView.updateInset();
        this.addChild(scrollView, 10);

        scrollView.setContentSize(cc.size(640, scrollViewHeight));
        scrollView.setContentOffset(scrollView.minContainerOffset());

    },

    _onClickBuyCount: function () {
        cc.log("ExpInstanceLayer _onClickBuyCount");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);
    },

    _onClickSubdue: function (id) {

        return function () {
            cc.log("ExpInstanceLayer _onClickSubdue: " + id);

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            var cb = function() {

            };

            gameData.dailyInstances.expInstance(id, function (battleLogId) {
                BattlePlayer.getInstance().play({
                    cb: cb,
                    id: battleLogId
                });
            });
        }
    }

});

ExpInstanceLayer.create = function () {
    cc.log("ExpInstanceLayer create");

    var ret = new ExpInstanceLayer();
    if (ret && ret.init()) {
        return ret;
    }
    return null;

};