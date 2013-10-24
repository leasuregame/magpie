/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-8-17
 * Time: 下午5:25
 * To change this template use File | Settings | File Templates.
 */


/*
 * spirit pool layer
 * */


var SpiritPoolLayer = cc.Layer.extend({
    _lvLabel: null,
    _expLabel: null,
    _countLabel: null,
    _expProgress: null,
    _spiritItem: null,
    _spiritPoolItem: null,
    _hook: null,
    _useGold: false,

    onEnter: function () {
        cc.log("SpiritPoolLayer onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("SpiritPoolLayer init");

        if (!this._super()) return false;

        var bgSprite = cc.Sprite.create(main_scene_image.bg11);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(GAME_BG_POINT);
        this.addChild(bgSprite);

        var headIcon = cc.Sprite.create(main_scene_image.icon2);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(cc.p(40, 968));
        this.addChild(headIcon);

        var titleIcon = cc.Sprite.create(main_scene_image.icon102);
        titleIcon.setPosition(cc.p(360, 1008));
        this.addChild(titleIcon);

        var spiritIcon = cc.Sprite.create(main_scene_image.icon101);
        spiritIcon.setPosition(cc.p(150, 845));
        this.addChild(spiritIcon);

        var countIcon = cc.Sprite.create(main_scene_image.icon98);
        countIcon.setPosition(cc.p(550, 870));
        this.addChild(countIcon);

        var lvIcon = cc.Sprite.create(main_scene_image.icon100);
        lvIcon.setPosition(cc.p(120, 290));
        this.addChild(lvIcon);

        var expIcon = cc.Sprite.create(main_scene_image.icon99);
        expIcon.setPosition(cc.p(480, 290));
        this.addChild(expIcon);

        this._lvLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 25);
        this._lvLabel.setAnchorPoint(cc.p(0, 0.5));
        this._lvLabel.setPosition(cc.p(190, 288));
        this.addChild(this._lvLabel);

        this._expLabel = cc.LabelTTF.create("0/0", "STHeitiTC-Medium", 25);
        this._expLabel.setAnchorPoint(cc.p(0, 0.5));
        this._expLabel.setPosition(cc.p(515, 288));
        this.addChild(this._expLabel);

        this._countLabel = cc.LabelTTF.create("0 次", "STHeitiTC-Medium", 25);
        this._countLabel.setAnchorPoint(cc.p(0, 0.5));
        this._countLabel.setPosition(cc.p(535, 850));
        this.addChild(this._countLabel);

        this._expProgress = Progress.create(
            main_scene_image.progress7,
            main_scene_image.progress8,
            0,
            0
        );
        this._expProgress.setPosition(cc.p(360, 250));
        this.addChild(this._expProgress);

        this._spiritItem = SpiritNode.getSpiritItem();
        this._spiritItem.setPosition(150, 890);

        this._spiritPoolItem = cc.MenuItemImage.create(
            main_scene_image.icon97,
            main_scene_image.icon97,
            this._onClickSpiritPool,
            this
        );
        this._spiritPoolItem.setPosition(cc.p(360, 650));

        var useGoldItem = cc.MenuItemImage.create(
            main_scene_image.button34,
            main_scene_image.button34,
            this._onClickUseGold,
            this
        );
        useGoldItem.setPosition(cc.p(360, 380));

        var menu = cc.Menu.create(this._spiritItem, this._spiritPoolItem, useGoldItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        this._hook = cc.Sprite.create(main_scene_image.icon20);
        this._hook.setPosition(cc.p(235, 382));
        this.addChild(this._hook);
        this._hook.setVisible(this._useGold);

        return true;
    },

    update: function () {
        cc.log("SpiritPoolLayer update");

        var spiritPool = gameData.spiritPool;

        this._lvLabel.setString(spiritPool.get("lv"));
        this._expLabel.setString(spiritPool.get("exp") + " / " + spiritPool.get("maxExp"));
        this._expProgress.setAllValue(spiritPool.get("exp"), spiritPool.get("maxExp"));
        this._countLabel.setString(spiritPool.get("collectCount") + " 次");
    },

    _collectSpirit: function (data) {
        cc.log("SpiritPoolLayer collectSpirit");

        var spirit = cc.Sprite.create(main_scene_image.icon247);
        spirit.setPosition(cc.p(360, 650));
        this.addChild(spirit);

        var str = "灵气: " + data.spirit_obtain;

        if (data.isDouble) {
            str = "天降甘霖,灵气爆发: " + data.spirit_obtain;
            spirit.setScale(1.5);
        }

        var point1 = cc.p(360, 650);
        var point2 = cc.p(150, 890);

        var pointArray = [
            point1,
            cc.p(lz.random(point1.x, point2.x), lz.random(point1.y, point2.y)),
            point2
        ];

        spirit.runAction(cc.Sequence.create(
            cc.Spawn.create(
                cc.CardinalSplineTo.create(2, pointArray, 0),
                cc.Sequence.create(
                    cc.DelayTime.create(1.5),
                    cc.CallFunc.create(function () {
                        this._spiritItem.runAction(
                            cc.Sequence.create(
                                cc.ScaleTo.create(0.5, 1.2, 1.24),
                                cc.ScaleTo.create(0.3, 1, 1)
                            )
                        );
                    }, this),
                    cc.ScaleTo.create(0.5, 0.3, 0.3)
                )
            ),
            cc.Hide.create()
        ));

        this.scheduleOnce(function () {
            spirit.removeFromParent();
            TipLayer.tipNoBg(str);
            this.update();
            LazyLayer.closeCloudLayer();
        }, 2);
    },

    _onClickSpiritPool: function () {
        cc.log("SpiritPoolLayer _onClickSoulTable");

        var spiritPool = gameData.spiritPool;

        if (!spiritPool.canCollect()) {
            TipLayer.tip("今日已完成采集 明天再来吧");
            return;
        }

        LazyLayer.showCloudLayer();

        var that = this;
        spiritPool.collect(function (data) {
            cc.log(data);

            if (data) {
                that._collectSpirit(data);
            } else {
                that.update();
                LazyLayer.closeCloudLayer();
            }
        }, this._useGold);
    },

    _onClickUseGold: function () {
        cc.log("SpiritPoolLayer _onClickUseGold");

        this._useGold = !this._useGold;
        this._hook.setVisible(this._useGold);
    }
});


SpiritPoolLayer.create = function () {
    var ret = new SpiritPoolLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};