/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-8-17
 * Time: 下午5:25
 * To change this template use File | Settings | File Templates.
 */


/*
 * soul layer
 * */


var SoulLayer = cc.Layer.extend({
    _lvLabel: null,
    _expLabel: null,
    _countLabel: null,
    _expProgress: null,
    _soulTableItem: null,
    _hook: null,
    _useGold: false,

    onEnter: function () {
        cc.log("SoulLayer onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("SoulLayer init");

        if (!this._super()) return false;

        var bgSprite = cc.Sprite.create(main_scene_image.bg11);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(GAME_BG_POINT);
        this.addChild(bgSprite);

        var headIcon = cc.Sprite.create(main_scene_image.icon2);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(cc.p(40, 962));
        this.addChild(headIcon);

        var titleIcon = cc.Sprite.create(main_scene_image.icon102);
        titleIcon.setPosition(cc.p(360, 1000));
        this.addChild(titleIcon);

        var soulIcon = cc.Sprite.create(main_scene_image.icon101);
        soulIcon.setPosition(cc.p(150, 855));
        this.addChild(soulIcon);

        var countIcon = cc.Sprite.create(main_scene_image.icon98);
        countIcon.setPosition(cc.p(550, 880));
        this.addChild(countIcon);

        var lvIcon = cc.Sprite.create(main_scene_image.icon100);
        lvIcon.setPosition(cc.p(120, 290));
        this.addChild(lvIcon);

        var expIcon = cc.Sprite.create(main_scene_image.icon99);
        expIcon.setPosition(cc.p(480, 290));
        this.addChild(expIcon);

        this._lvLabel = cc.LabelTTF.create("0", "黑体", 25);
        this._lvLabel.setAnchorPoint(cc.p(0, 0.5));
        this._lvLabel.setPosition(cc.p(190, 288));
        this.addChild(this._lvLabel);

        this._expLabel = cc.LabelTTF.create("0/0", "黑体", 25);
        this._expLabel.setAnchorPoint(cc.p(0, 0.5));
        this._expLabel.setPosition(cc.p(515, 288));
        this.addChild(this._expLabel);

        this._countLabel = cc.LabelTTF.create("0 次", "黑体", 25);
        this._countLabel.setAnchorPoint(cc.p(0, 0.5));
        this._countLabel.setPosition(cc.p(535, 860));
        this.addChild(this._countLabel);

        this._expProgress = Progress.create(
            main_scene_image.progress7,
            main_scene_image.progress8,
            1,
            1
        );
        this._expProgress.setPosition(cc.p(360, 250));
        this.addChild(this._expProgress);

        this._soulTableItem = cc.MenuItemImage.create(
            main_scene_image.icon97,
            main_scene_image.icon97,
            this._onClickSoulTable,
            this
        );
        this._soulTableItem.setPosition(cc.p(360, 650));

        var useGoldItem = cc.MenuItemImage.create(
            main_scene_image.button34,
            main_scene_image.button34,
            this._onClickUseGold,
            this
        );
        useGoldItem.setPosition(cc.p(360, 380));

        var menu = cc.Menu.create(this._soulTableItem, useGoldItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        this._hook = cc.Sprite.create(main_scene_image.icon20);
        this._hook.setPosition(cc.p(235, 382));
        this.addChild(this._hook);
        this._hook.setVisible(this._useGold);

        return true;
    },

    update: function () {
        cc.log("SoulLayer update");


    },

    _onClickSoulTable: function () {
        cc.log("SoulLayer _onClickSoulTable");

    },

    _onClickUseGold: function () {
        cc.log("SoulLayer _onClickUseGold");

        this._useGold = !this._useGold;
        this._hook.setVisible(this._useGold);
    }
});


SoulLayer.create = function () {
    var ret = new SoulLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};