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
    _preObtainLabel: null,
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

        var titleIcon = cc.Sprite.create(main_scene_image.icon100);
        titleIcon.setPosition(cc.p(360, 1008));
        this.addChild(titleIcon);

        var spiritIcon = cc.Sprite.create(main_scene_image.icon99);
        spiritIcon.setPosition(cc.p(130, 880));
        this.addChild(spiritIcon);

        var countIcon = cc.Sprite.create(main_scene_image.icon98);
        countIcon.setPosition(cc.p(550, 930));
        this.addChild(countIcon);

        var countLabelIcon = cc.LabelTTF.create("今日可采集次数:", "STHeitiTC-Medium", 20);
        countLabelIcon.setAnchorPoint(cc.p(0, 0.5));
        countLabelIcon.setPosition(cc.p(450, 930));
        this.addChild(countLabelIcon);

        this._countLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 20);
        this._countLabel.setAnchorPoint(cc.p(0, 0.5));
        this._countLabel.setPosition(cc.p(600, 930));
        this.addChild(this._countLabel);

        var perObtainIcon = cc.Sprite.create(main_scene_image.icon98);
        perObtainIcon.setPosition(cc.p(550, 880));
        this.addChild(perObtainIcon);

        var perObtainLabelIcon = cc.LabelTTF.create("每次可获得灵气:", "STHeitiTC-Medium", 20);
        perObtainLabelIcon.setAnchorPoint(cc.p(0, 0.5));
        perObtainLabelIcon.setPosition(cc.p(450, 880));
        this.addChild(perObtainLabelIcon);

        this._preObtainLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 20);
        this._preObtainLabel.setAnchorPoint(cc.p(0, 0.5));
        this._preObtainLabel.setPosition(cc.p(600, 880));
        this.addChild(this._preObtainLabel);

        var lvIcon = cc.LabelTTF.create("灵气池", "STHeitiTC-Medium", 30);
        lvIcon.setColor(cc.c3b(255, 248, 69));
        lvIcon.setPosition(cc.p(190, 288));
        this.addChild(lvIcon);

        this._lvLabel = cc.LabelTTF.create("LV.  0", "STHeitiTC-Medium", 22);
        this._lvLabel.setAnchorPoint(cc.p(0, 0.5));
        this._lvLabel.setPosition(cc.p(270, 288));
        this.addChild(this._lvLabel);

        this._expLabel = cc.LabelTTF.create("经验  0 / 0", "STHeitiTC-Medium", 22);
        this._expLabel.setAnchorPoint(cc.p(0, 0.5));
        this._expLabel.setPosition(cc.p(400, 288));
        this.addChild(this._expLabel);

        var tipLabel = cc.LabelTTF.create("灵气池等级越高，可获得的灵气越多", "STHeitiTC-Medium", 20);
        tipLabel.setPosition(cc.p(360, 230));
        this.addChild(tipLabel);

        this._spiritItem = SpiritNode.getSpiritItem();
        this._spiritItem.setPosition(130, 880);

        this._spiritPoolItem = cc.MenuItemImage.create(
            main_scene_image.icon97,
            main_scene_image.icon97,
            this._onClickSpiritPool,
            this
        );
        this._spiritPoolItem.setPosition(cc.p(360, 630));

        var useGoldItem = cc.MenuItemImage.create(
            main_scene_image.button34,
            main_scene_image.button34,
            this._onClickUseGold,
            this
        );
        useGoldItem.setPosition(cc.p(360, 370));

        var menu = cc.Menu.create(this._spiritItem, this._spiritPoolItem, useGoldItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        this._hook = cc.Sprite.create(main_scene_image.icon20);
        this._hook.setPosition(cc.p(235, 372));
        this.addChild(this._hook);
        this._hook.setVisible(this._useGold);

        return true;
    },

    update: function () {
        cc.log("SpiritPoolLayer update");

        var spiritPool = gameData.spiritPool;

        this._lvLabel.setString("LV.  " + spiritPool.get("lv"));
        this._expLabel.setString("经验  " + spiritPool.get("exp") + " / " + spiritPool.get("maxExp"));
        this._countLabel.setString(spiritPool.get("collectCount"));
        this._preObtainLabel.setString(spiritPool.get("perObtain") + (this._useGold ? " x2" : ""));
    },

    _collectSpirit: function (data) {
        cc.log("SpiritPoolLayer collectSpirit");

        var spirit = cc.Sprite.create(main_scene_image.icon247);
        spirit.setPosition(cc.p(360, 630));
        this.addChild(spirit);

        var str = "灵气: " + data.spirit_obtain;

        if (data.isDouble) {
            str = "天降甘霖 灵气爆发: " + data.spirit_obtain;
            spirit.setScale(1.5);
        }

        var point1 = cc.p(360, 630);
        var point2 = cc.p(130, 880);

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
                        this._spiritItem.stopAllActions();

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
            if(NoviceTeachingLayer.getInstance().isNoviceTeaching()) {
                NoviceTeachingLayer.getInstance().next();
            }
        }, 2);
    },

    _onClickSpiritPool: function () {
        cc.log("SpiritPoolLayer _onClickSoulTable");

        if(NoviceTeachingLayer.getInstance().isNoviceTeaching()) {
            NoviceTeachingLayer.getInstance().clearAndSave();
        }

        var spiritPool = gameData.spiritPool;

        if (!spiritPool.canCollect(this._useGold)) {
            return;
        }

        LazyLayer.showCloudLayer();

        var that = this;
        spiritPool.collect(function (data) {
            cc.log(data);

            LazyLayer.closeCloudLayer();

            if (data) {
                that._collectSpirit(data);
            } else {
                that.update();
            }
        }, this._useGold);
    },

    _onClickUseGold: function () {
        cc.log("SpiritPoolLayer _onClickUseGold");

        this._useGold = !this._useGold;
        this._hook.setVisible(this._useGold);

        this.update();
    }
});


SpiritPoolLayer.create = function () {
    var ret = new SpiritPoolLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};