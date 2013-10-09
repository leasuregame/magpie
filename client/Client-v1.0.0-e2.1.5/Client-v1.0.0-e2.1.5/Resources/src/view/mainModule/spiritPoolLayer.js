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
        titleIcon.setPosition(cc.p(360, 1000));
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

        var spiritItem = SpiritNode.getSpiritItem();
        spiritItem.setPosition(150, 890);

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

        var menu = cc.Menu.create(spiritItem, this._spiritPoolItem, useGoldItem);
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

    _onClickSpiritPool: function () {
        cc.log("SpiritPoolLayer _onClickSoulTable");

        var that = this;
        gameData.spiritPool.collect(function (data) {
            cc.log(data);
            that.update();
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