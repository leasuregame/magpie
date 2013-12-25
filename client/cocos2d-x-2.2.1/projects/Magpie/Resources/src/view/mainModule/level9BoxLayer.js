/**
 * Created by lcc3536 on 13-12-6.
 */


/*
 * level 9 box
 * */


var Level9BoxLayer = LazyLayer.extend({
    _level9BoxLayerFit: null,

    _reward: null,
    _cb: null,

    onEnter: function () {
        cc.log("Level9BoxLayer onEnter");

        this._super();

        lz.dc.beginLogPageView("九级礼包界面");
    },

    onExit: function () {
        cc.log("Level9BoxLayer onExit");

        this._super();

        lz.dc.endLogPageView("九级礼包界面");
    },

    init: function (data) {
        cc.log("Level9BoxLayer init");

        if (!this._super()) return false;

        this._reward = data.reward;
        this._cb = data.cb || null;

        this._level9BoxLayerFit = gameFit.mainScene.level9BoxLayer;
        this.setTouchPriority(MAIN_MENU_LAYER_HANDLER_PRIORITY);

        this._ccbNode = cc.BuilderReader.load(main_scene_image.uiEffect55, this);
        this._ccbNode.setPosition(this._level9BoxLayerFit.bgSpritePoint);
        this.addChild(this._ccbNode);

        this._ccbNode.controller.ccbMenu.setTouchPriority(MAIN_MENU_LAYER_HANDLER_PRIORITY);

        this._tipLabel = cc.Node.create();
        this.addChild(this._tipLabel);

        var bgSprite = cc.Scale9Sprite.create(main_scene_image.bg21);
       // bgSprite.setContentSize(cc.size(550, 550));
        bgSprite.setPosition(this._level9BoxLayerFit.bgSpritePoint);
        this._tipLabel.addChild(bgSprite);

        var topBgIcon = cc.Sprite.create(main_scene_image.icon332);
        topBgIcon.setPosition(this._level9BoxLayerFit.topBgIconPoint);
        this._tipLabel.addChild(topBgIcon);

        var titleIcon = cc.Sprite.create(main_scene_image.icon333);
        titleIcon.setPosition(this._level9BoxLayerFit.titleIconPoint);
        this._tipLabel.addChild(titleIcon);

        var keys = Object.keys(this._reward);
        var len = keys.length;

        var scrollViewLayer = MarkLayer.create(this._level9BoxLayerFit.scrollViewLayerRect2);

        var total = 0;
        for (var key in this._reward) {
            if (rewardGoodsUrl[key] != undefined && this._reward[key] > 0) {
                total++;
            }
        }

        var scrollViewHeight = total * 120;
        if (scrollViewHeight < 480) {
            scrollViewHeight = 480;
        }

        var index = 0;
        var x = 140;

        for (var i = 0; i < len; i++) {
            var key = keys[i];

            if (rewardGoodsUrl[key] != undefined && this._reward[key] > 0) {

                var y = scrollViewHeight - index * 120 - 60;
                var goodName = lz.getNameByKey(key);
                var goodIcon = rewardGoodsUrl[key];

                var goodsSprite = cc.Sprite.create(main_scene_image[goodIcon]);
                goodsSprite.setPosition(cc.p(x - 10, y));
                scrollViewLayer.addChild(goodsSprite);

                var nameLabel = StrokeLabel.create(goodName.name, "STHeitiTC-Medium", 25);
                nameLabel.setColor(cc.c3b(255, 252, 175));
                nameLabel.setAnchorPoint(cc.p(0, 0.5));
                nameLabel.setPosition(cc.p(x + 50, y + 20));
                scrollViewLayer.addChild(nameLabel);

                var countBgIcon = cc.Sprite.create(main_scene_image.icon334);
                countBgIcon.setPosition(cc.p(x + 170, y - 20));
                scrollViewLayer.addChild(countBgIcon);

                var countLabel = StrokeLabel.create("数量    " + this._reward[key], "STHeitiTC-Medium", 25);
                countLabel.setAnchorPoint(cc.p(0, 0.5));
                countLabel.setPosition(cc.p(x + 50, y - 20));
                scrollViewLayer.addChild(countLabel);
                index++;

            }
        }

        var scrollView = cc.ScrollView.create(cc.size(500, 480), scrollViewLayer);
        scrollView.setTouchPriority(-300);
        scrollView.setPosition(this._level9BoxLayerFit.scrollViewPoint2);
        scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        scrollView.updateInset();
        this._tipLabel.addChild(scrollView);

        scrollView.setContentSize(cc.size(500, scrollViewHeight));
        scrollView.setContentOffset(scrollView.minContainerOffset());
        this._tipLabel.setVisible(false);

        var okItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon21,
            this._onClickOk,
            this
        );
        okItem.setPosition(this._level9BoxLayerFit.okItemPoint);

        var menu = cc.Menu.create(okItem);
        menu.setTouchPriority(MAIN_MENU_LAYER_HANDLER_PRIORITY);
        menu.setPosition(cc.p(0, 0));
        this._tipLabel.addChild(menu);

        return true;
    },

    ccbFnBox: function () {
        cc.log("Level9Box ccbFnBox");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._ccbNode.controller.ccbBoxItem.setEnabled(false);
        this._ccbNode.animationManager.runAnimationsForSequenceNamedTweenDuration("animation_3", 0);
    },

    ccbFnShowBox: function () {
        cc.log("Level9Box ccbFnShowBox");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._tipLabel.setVisible(true);
    },

    _onClickOk: function () {
        cc.log("Level9BoxLayer _onClickOk");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this.removeFromParent();

        lz.tipReward(this._reward);

        if (this._cb) {
            this._cb();
        }
    }
});


Level9BoxLayer.create = function (data) {
    var ret = new Level9BoxLayer();

    if (ret && ret.init(data)) {
        return ret;
    }

    return null;
};

Level9BoxLayer.pop = function (data) {
    var level9BoxLayer = Level9BoxLayer.create(data);

    MainScene.getInstance().addChild(level9BoxLayer, 10);
};
