/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-10-29
 * Time: 下午4:04
 * To change this template use File | Settings | File Templates.
 */

var RechargeLayer = cc.Layer.extend({

    onEnter: function () {
        cc.log("PowerRewardLayer onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("PowerRewardLayer init");

        if (!this._super()) return false;

        return true;
    },

    update: function() {
        cc.log("PowerRewardLayer update");
        var sprite1 = cc.Sprite.create(main_scene_image.icon266);
        sprite1.setAnchorPoint(cc.p(0,0));
        sprite1.setPosition(cc.p(120,785));
        this.addChild(sprite1);

        var sprite2 = cc.Sprite.create(main_scene_image.icon267);
        sprite2.setAnchorPoint(cc.p(0,0));
        sprite2.setPosition(cc.p(80,195));
        this.addChild(sprite2);

        var itemText = cc.LabelTTF.create('时间：从XX时间---XX时间', "STHeitiTC-Medium", 20);
        itemText.setAnchorPoint(cc.p(0, 0));
        itemText.setPosition(cc.p(120,660));
        itemText.setColor(cc.c3b(97,11,9));
        this.addChild(itemText);

        var description = lz.format('奖励：任意充值，均可额外获得两倍魔石赠送。你还在犹豫什么呢，赶紧充值吧。', 14);
        for(var i = 0;i < description.length;i++) {
            var text = cc.LabelTTF.create(description[i],"STHeitiTC-Medium", 20);
            text.setAnchorPoint(cc.p(0, 0));
            text.setPosition(cc.p(120,615 - i * 30));
            text.setColor(cc.c3b(97,11,9));
            this.addChild(text);
        }



        var go2PaymentItem = cc.MenuItemImage.create(
            main_scene_image.button21,
            main_scene_image.button21s,
            this._onClickGo2Payment,
            this
        );

        go2PaymentItem.setScale(1.5,1.3);
        go2PaymentItem.setPosition(cc.p(360,300));

        var menu = cc.Menu.create(go2PaymentItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        var btnTitle = cc.Sprite.create(main_scene_image.icon268);
        btnTitle.setPosition(cc.p(360,300));
        this.addChild(btnTitle);
    },

    _onClickGo2Payment: function() {

        MainScene.getInstance().switchLayer(ShopLayer);
    }


});

RechargeLayer.create = function () {
    var ret = new RechargeLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};