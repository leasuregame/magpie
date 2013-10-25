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
    _price: 0,
    _count: 0,
    _maxCount: 0,
    _countLabel: null,
    _consumeLabel: null,

    onEnter: function () {
        cc.log("AmountLayer onEnter");

        this._super();
        this.update();
    },

    init: function (cb, data) {
        cc.log("AmountLayer init");

        if (!this._super()) return false;

        this._cb = cb || function () {
        };
        this._price = data.price || 0;
        this._count = 1;
        this._maxCount = data.count || 0;
        tital = "购买" + data.name || "";

        var bgSprite = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgSprite.setContentSize(cc.size(550, 300));
        bgSprite.setPosition(cc.p(360, 580));
        this.addChild(bgSprite);

        var titleLabel = StrokeLabel.create(tital, "STHeitiTC-Medium", 30);
        titleLabel.setColor(cc.c3b(255, 252, 175));
        titleLabel.setPosition(cc.p(360, 690));
        this.addChild(titleLabel);

        var consumeLabelIcon = StrokeLabel.create("消耗:", "STHeitiTC-Medium", 20);
        consumeLabelIcon.setColor(cc.c3b(255, 252, 175));
        consumeLabelIcon.setPosition(cc.p(300, 630));
        this.addChild(consumeLabelIcon);

        var consumeIcon = cc.Sprite.create(main_scene_image[gameGoodsIcon[data.type]]);
        consumeIcon.setPosition(cc.p(360, 630));
        this.addChild(consumeIcon);

        this._consumeLabel = StrokeLabel.create(0, "STHeitiTC-Medium", 20);
        this._consumeLabel.setColor(cc.c3b(255, 252, 175));
        this._consumeLabel.setAnchorPoint(cc.p(0, 0.5));
        this._consumeLabel.setPosition(cc.p(400, 627));
        this.addChild(this._consumeLabel);

        countIcom = cc.Sprite.create(main_scene_image.icon117);
        countIcom.setPosition(cc.p(360, 570));
        this.addChild(countIcom);

        this._countLabel = cc.LabelTTF.create(this._count, "STHeitiTC-Medium", 30);
        this._countLabel.setColor(cc.c3b(255, 252, 175));
        this._countLabel.setPosition(cc.p(360, 568));
        this.addChild(this._countLabel);

        var addItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button39,
            main_scene_image.button39s,
            main_scene_image.icon178,
            this._onClickAdd,
            this
        );
        addItem.setPosition(cc.p(480, 570));

        var addAddItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button39,
            main_scene_image.button39s,
            main_scene_image.icon179,
            this._onClickAddAdd,
            this
        );
        addAddItem.setPosition(cc.p(560, 570));

        var subItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button39,
            main_scene_image.button39s,
            main_scene_image.icon180,
            this._onClickSub,
            this
        );
        subItem.setPosition(cc.p(240, 570));

        var subSubItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button39,
            main_scene_image.button39s,
            main_scene_image.icon181,
            this._onClickSubSub,
            this
        );
        subSubItem.setPosition(cc.p(160, 570));

        var okItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon21,
            this._onClickOk,
            this
        );
        okItem.setPosition(cc.p(260, 490));

        var closeItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon36,
            this._onClickClose,
            this
        );
        closeItem.setPosition(cc.p(460, 490));

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
        var consume = this._price * this._count;
        this._consumeLabel.setString(consume);
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


AmountLayer.create = function (cb, data) {
    var ret = new AmountLayer();

    if (ret && ret.init(cb, data)) {
        return ret;
    }

    return null;
};


AmountLayer.pop = function (cb, data) {
    var amountLayer = AmountLayer.create(cb, data);

    MainScene.getInstance().getLayer().addChild(amountLayer, 10);
};