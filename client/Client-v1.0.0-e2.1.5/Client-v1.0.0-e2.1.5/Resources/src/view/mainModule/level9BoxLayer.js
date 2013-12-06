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
        this._cb = data.cb;

        this._level9BoxLayerFit = gameFit.mainScene.level9BoxLayer;
        this.setTouchPriority(MAIN_MENU_LAYER_HANDLER_PRIORITY);

        this._ccbNode = cc.BuilderReader.load(main_scene_image.uiEffect55, this);
        this._ccbNode.setPosition(this._level9BoxLayerFit.bgSpritePoint);
        this.addChild(this._ccbNode);

        this._ccbNode.controller.menu.setTouchPriority(MAIN_MENU_LAYER_HANDLER_PRIORITY);

        this._tipLabel = cc.Node.create();
        this.addChild(this._tipLabel);

        var bgSprite = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgSprite.setContentSize(cc.size(550, 550));
        bgSprite.setPosition(this._level9BoxLayerFit.bgSpritePoint);
        this._tipLabel.addChild(bgSprite);

        for (var key in this._reward) {
            if (rewardGoodsUrl[key] != undefined && this._reward[key] > 0) {
                var goodName = lz.getNameByKey(key);
                var goodIcon = rewardGoodsUrl[key];
                var point = this._level9BoxLayerFit.boxGoodsPoints[key];

                var goodsSprite = cc.Sprite.create(main_scene_image[goodIcon]);
                goodsSprite.setPosition(point);
                this._tipLabel.addChild(goodsSprite);

                var nameLabel = StrokeLabel.create(goodName.name, "STHeitiTC-Medium", 25);
                nameLabel.setColor(cc.c3b(255, 252, 175));
                nameLabel.setAnchorPoint(cc.p(0, 0.5));
                nameLabel.setPosition(cc.p(point.x + 50, point.y + 20));
                this._tipLabel.addChild(nameLabel);

                var countLabel = StrokeLabel.create(this._reward[key], "STHeitiTC-Medium", 25);
                countLabel.setAnchorPoint(cc.p(0, 0.5));
                countLabel.setPosition(cc.p(point.x + 50, point.y - 20));
                this._tipLabel.addChild(countLabel);
            }
        }

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

    _onClickBox: function () {
        cc.log("Level9Box _onClickBox");

        this._ccbNode.controller.boxItem.setEnabled(false);
        this._ccbNode.animationManager.runAnimationsForSequenceNamedTweenDuration("animation_3", 0);
    },

    _showBox: function () {
        cc.log("Level9Box _showBox");

        this._tipLabel.setVisible(true);
    },

    _onClickOk: function () {
        cc.log("Level9BoxLayer _onClickOk");

        if(this._cb) {
            this._cb();
        }

        this.removeFromParent();

        lz.tipReward(this._reward);
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
