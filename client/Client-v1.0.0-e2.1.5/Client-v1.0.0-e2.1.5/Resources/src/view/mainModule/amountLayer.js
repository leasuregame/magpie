/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-10-22
 * Time: 上午10:44
 * To change this template use File | Settings | File Templates.
 */


/*
 * amount layer
 * */


var AmountLayer = LazyLayer.extend({
    _cb: null,
    _count: 0,
    _maxCount: 0,
    _countLabel: null,

    init: function (cb, tital, count, maxCount) {
        cc.log("AmountLayer init");

        if (!this._super()) return false;

        this._cb = cb || function () {
        };
        this._count = count || 1;
        this._maxCount = maxCount || 1;
        tital = tital || "购买";

        var bgSprite = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgSprite.setContentSize(cc.size(550, 300));
        bgSprite.setPosition(cc.p(360, 580));
        this.addChild(bgSprite);

        var titleLabel = StrokeLabel.create(tital, "STHeitiTC-Medium", 30);
        titleLabel.setColor(cc.c3b(255, 252, 175));
        titleLabel.setPosition(cc.p(360, 690));
        this.addChild(titleLabel);

        countIcom = cc.Sprite.create(main_scene_image.icon117);
        countIcom.setPosition(cc.p(360, 600));
        this.addChild(countIcom);

        this._countLabel = cc.LabelTTF.create(this._count, "STHeitiTC-Medium", 30);
        this._countLabel.setColor(cc.c3b(255, 252, 175));
        this._countLabel.setPosition(cc.p(360, 600));
        this.addChild(this._countLabel);

        var addItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button39,
            main_scene_image.button39s,
            main_scene_image.icon178,
            this._onClickAdd,
            this
        );
        addItem.setPosition(cc.p(480, 600));

        var addAddItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button39,
            main_scene_image.button39s,
            main_scene_image.icon179,
            this._onClickAddAdd,
            this
        );
        addAddItem.setPosition(cc.p(560, 600));

        var subItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button39,
            main_scene_image.button39s,
            main_scene_image.icon180,
            this._onClickSub,
            this
        );
        subItem.setPosition(cc.p(240, 600));

        var subSubItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button39,
            main_scene_image.button39s,
            main_scene_image.icon181,
            this._onClickSubSub,
            this
        );
        subSubItem.setPosition(cc.p(160, 600));

        var okItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon21,
            this._onClickOk,
            this
        );
        okItem.setPosition(cc.p(260, 500));

        var closeItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon36,
            this._onClickClose,
            this
        );
        closeItem.setPosition(cc.p(460, 500));

        var menu = cc.Menu.create(
            addItem,
            addAddItem,
            subItem,
            subSubItem,
            okItem,
            closeItem
        );
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        return true;
    },

    update: function () {
        this._count = Math.max(this._count, 0);
        this._count = Math.min(this._count, this._maxCount);
        this._countLabel.setString(this._count);
    },

    _onClickAdd: function () {
        cc.log("AmountLayer _onClickAdd");

        this._count += 1;
        this.update();

    },

    _onClickAddAdd: function () {
        cc.log("AmountLayer _onClickAddAdd");

        this._count += 10;
        this.update();
    },

    _onClickSub: function () {
        cc.log("AmountLayer _onClickSub");

        this._count -= 1;
        this.update();
    },

    _onClickSubSub: function () {
        cc.log("AmountLayer _onClickSubSub");

        this._count -= 10;
        this.update();
    },

    _onClickOk: function () {
        cc.log("AmountLayer _onClickSend");

        this._cb(this._count);

        this._onClickClose();
    },

    _onClickClose: function () {
        cc.log("AmountLayer _onClickClose");

        this.removeFromParent();
    }
});


AmountLayer.create = function (cb, tital, num, maxNum) {
    var ret = new AmountLayer();

    if (ret && ret.init(cb, tital, num, maxNum)) {
        return ret;
    }

    return null;
};


AmountLayer.pop = function (cb, tital, num, maxNum) {
    var amountLayer = AmountLayer.create(cb, tital, num, maxNum);

    MainScene.getInstance().getLayer().addChild(amountLayer, 10);
};