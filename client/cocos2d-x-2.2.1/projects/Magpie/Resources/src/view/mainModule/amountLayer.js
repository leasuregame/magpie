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
    _amountLayerFit: null,

    _cb: null,
    _price: 0,
    _obtain: 0,
    _count: 0,
    _maxCount: 0,
    _countLabel: null,
    _consumeLabel: null,
    _tip: null,
    _maxBuyTimes: 0,    //可购买最大次数
    _remainTimes: 0,    //剩余购买次数
    _consume_inc: 0,    //每次消耗增量
    _consume_max: 0,    //每次消耗最大值
    _discount_num: 100000000,   //可以打折数量
    _discount: 10,       //打几折

    onEnter: function () {
        cc.log("AmountLayer onEnter");

        this._super();
        this.update();
    },

    init: function (cb, data) {
        cc.log("AmountLayer init");

        if (!this._super()) return false;

        this._amountLayerFit = gameFit.mainScene.amountLayer;

        this._cb = cb || function () {
        };
        this._price = data.price || 0;
        this._obtain = data.obtain || 0;
        this._maxCount = data.count || 0;
        this._count = this._maxCount > 0 ? 1 : 0;
        this._tip = data.tip || "";
        this._maxBuyTimes = data.maxBuyTimes || 0;
        this._remainTimes = data.remainTimes || 0;
        this._consume_inc = data.consume_inc || 0;
        this._consume_max = data.consume_max || 0;
        this._discount_num = data.discount_num || 100000000;
        this._discount = data.discount || 10;

        var title = data.name || "";

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 150), 640, 1136);
        bgLayer.setPosition(this._amountLayerFit.bgLayerPoint);
        this.addChild(bgLayer);

        var bgSprite = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgSprite.setContentSize(this._amountLayerFit.bgSpriteContentSize);
        bgSprite.setPosition(this._amountLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        var titleLabel = StrokeLabel.create(title, "STHeitiTC-Medium", 30);
        titleLabel.setColor(cc.c3b(255, 252, 175));
        titleLabel.setPosition(this._amountLayerFit.titleLabelPoint);
        this.addChild(titleLabel);

        if (this._maxBuyTimes > 0) {
            var point = this._amountLayerFit.titleLabelPoint;
            var size = titleLabel.getContentSize();
            var halfTitle = "(" + this._remainTimes + "/" + this._maxBuyTimes + ")";
            var halfTitleLabel = StrokeLabel.create(halfTitle, "STHeitiTC-Medium", 20);
            halfTitleLabel.setColor(cc.c3b(255, 252, 175));
            halfTitleLabel.setAnchorPoint(cc.p(0, 0));
            halfTitleLabel.setPosition(cc.p(point.x + size.width / 2 + 5, point.y - size.height / 2));
            this.addChild(halfTitleLabel);
        }

        var consumeLabelIcon = cc.LabelTTF.create("消耗:", "STHeitiTC-Medium", 20);
        consumeLabelIcon.setColor(cc.c3b(255, 252, 175));
        consumeLabelIcon.setPosition(this._amountLayerFit.consumeLabelIconPoint);
        this.addChild(consumeLabelIcon);

        var consumeIcon = cc.Sprite.create(main_scene_image[gameGoodsIcon[data.consumeType]]);
        consumeIcon.setScale(0.7);
        consumeIcon.setPosition(this._amountLayerFit.consumeIconPoint);
        this.addChild(consumeIcon);

        this._consumeLabel = cc.LabelTTF.create(0, "STHeitiTC-Medium", 20);
        this._consumeLabel.setAnchorPoint(cc.p(0, 0.5));
        this._consumeLabel.setPosition(this._amountLayerFit.consumeLabelPoint);
        this.addChild(this._consumeLabel);

        var obtainLabelIcon = cc.LabelTTF.create("获得:", "STHeitiTC-Medium", 20);
        obtainLabelIcon.setColor(cc.c3b(255, 252, 175));
        obtainLabelIcon.setPosition(this._amountLayerFit.obtainLabelIconPoint);
        this.addChild(obtainLabelIcon);

        this._obtainLabel = cc.LabelTTF.create(0, "STHeitiTC-Medium", 20);
        this._obtainLabel.setPosition(this._amountLayerFit.obtainLabelPoint);
        this.addChild(this._obtainLabel);

        var obtainIcon = cc.LabelTTF.create(data.unit, "STHeitiTC-Medium", 20);
        obtainIcon.setColor(cc.c3b(255, 252, 175));
        obtainIcon.setPosition(this._amountLayerFit.obtainIconPoint);
        this.addChild(obtainIcon);


        var countIcon = cc.Sprite.create(main_scene_image.icon117);
        countIcon.setPosition(this._amountLayerFit.countIconPoint);
        this.addChild(countIcon);

        this._countLabel = cc.LabelTTF.create(this._count, "STHeitiTC-Medium", 30);
        this._countLabel.setPosition(this._amountLayerFit.countLabelPoint);
        this.addChild(this._countLabel);

        var addItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button39,
            main_scene_image.button39s,
            main_scene_image.icon178,
            this._onClickAdd,
            this
        );
        addItem.setPosition(this._amountLayerFit.addItemPoint);

        var addAddItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button39,
            main_scene_image.button39s,
            main_scene_image.icon179,
            this._onClickAddAdd,
            this
        );
        addAddItem.setPosition(this._amountLayerFit.addAddItemPoint);

        var subItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button39,
            main_scene_image.button39s,
            main_scene_image.icon180,
            this._onClickSub,
            this
        );
        subItem.setPosition(this._amountLayerFit.subItemPoint);

        var subSubItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button39,
            main_scene_image.button39s,
            main_scene_image.icon181,
            this._onClickSubSub,
            this
        );
        subSubItem.setPosition(this._amountLayerFit.subSubItemPoint);

        var okItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon21,
            this._onClickOk,
            this
        );
        okItem.setPosition(this._amountLayerFit.okItemPoint);

        var closeItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon36,
            this._onClickClose,
            this
        );
        closeItem.setPosition(this._amountLayerFit.closeItemPoint);

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

        if (this._count > this._maxCount) {
            TipLayer.tip(this._tip);

            this._count = this._maxCount;
        }

        this._countLabel.setString(this._count);

        var consume = 0;
        if (this._consume_inc != 0) {
            var usedCount = this._maxBuyTimes - this._remainTimes;
            for (var i = 1; i <= this._count; i++) {
                var tmpConsume = this._price + usedCount * this._consume_inc;
                if (tmpConsume > this._consume_max) {
                    tmpConsume = this._consume_max;
                }
                consume += tmpConsume;
                usedCount++;
            }
        } else if (this._count >= this._discount_num) {
            consume = this._price * (this._discount / 10) * this._count;
        } else {
            consume = this._price * this._count;
        }

        this._consumeLabel.setString(consume);

        var obtain = this._obtain * this._count;
        this._obtainLabel.setString(obtain);
    },

    _onClickAdd: function () {
        cc.log("AmountLayer _onClickAdd");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._count += 1;
        this.update();

    },

    _onClickAddAdd: function () {
        cc.log("AmountLayer _onClickAddAdd");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._count += 10;
        this.update();
    },

    _onClickSub: function () {
        cc.log("AmountLayer _onClickSub");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._count -= 1;
        this.update();
    },

    _onClickSubSub: function () {
        cc.log("AmountLayer _onClickSubSub");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._count -= 10;
        this.update();
    },

    _onClickOk: function () {
        cc.log("AmountLayer _onClickSend");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this._cb(this._count);

        this._onClickClose();
    },

    _onClickClose: function () {
        cc.log("AmountLayer _onClickClose");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

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

    return amountLayer;
};