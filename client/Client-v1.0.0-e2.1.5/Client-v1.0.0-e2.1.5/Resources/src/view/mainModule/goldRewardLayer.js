/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-10-29
 * Time: 下午5:21
 * To change this template use File | Settings | File Templates.
 */

var GoldRewardLayer = cc.Layer.extend({

    onEnter: function () {
        cc.log("GoldRewardLayer onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("GoldRewardLayer init");

        if (!this._super()) return false;

        return true;
    },

    update: function() {
        cc.log("GoldRewardLayer update");
        var lineIcon = cc.Sprite.create(main_scene_image.icon18);
        lineIcon.setAnchorPoint(cc.p(0,0));
        lineIcon.setPosition(cc.p(40, 875));
        this.addChild(lineIcon);

        var sprite1 = cc.Sprite.create(main_scene_image.icon271);
        sprite1.setAnchorPoint(cc.p(0,0));
        sprite1.setPosition(cc.p(40, 875));
        this.addChild(sprite1);

        var scrollViewLayer = MarkLayer.create(cc.rect(10, 194, 740, 711));
        var menu = LazyMenu.create();
        menu.setTouchPriority(-200);
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu, 1);

        var scrollViewHeight = 10 * 135;

        var scrollView = cc.ScrollView.create(cc.size(620, 700), scrollViewLayer);
        scrollView.setTouchPriority(-300);
        scrollView.setPosition(cc.p(40, 160));
        scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        scrollView.updateInset();
        this.addChild(scrollView);

        var bgSpriteUrl = main_scene_image.button15;
        var iconSpriteUrl = main_scene_image.icon272;
        var goldIconUrl = main_scene_image.icon148;
        for (var i = 0; i < 10; ++i) {
            var y = scrollViewHeight - 135 - i * 135;
            var bgSprite = cc.Sprite.create(bgSpriteUrl);
            bgSprite.setAnchorPoint(cc.p(0, 0));
            bgSprite.setPosition(cc.p(0, y));
            bgSprite.setContentSize(cc.size(600, 135));
            scrollViewLayer.addChild(bgSprite);

            var iconSprite = cc.Sprite.create(iconSpriteUrl);
            iconSprite.setAnchorPoint(cc.p(0, 0));
            iconSprite.setPosition(cc.p(20, y + 20));
            scrollViewLayer.addChild(iconSprite);

            var text = cc.LabelTTF.create('角色等级10级', "STHeitiTC-Medium", 20);
            text.setAnchorPoint(cc.p(0, 0));
            text.setPosition(cc.p(140, y + 80));
            text.setColor(cc.c3b(97,11,9));
            scrollViewLayer.addChild(text);

            var goldText = cc.LabelTTF.create('10', "STHeitiTC-Medium", 30);
            goldText.setAnchorPoint(cc.p(0, 0));
            goldText.setPosition(cc.p(150, y + 30));
            goldText.setColor(cc.c3b(97,11,9));
            scrollViewLayer.addChild(goldText);

            var goldIcon = cc.Sprite.create(goldIconUrl);
            goldIcon.setAnchorPoint(cc.p(0, 0));
            goldIcon.setPosition(cc.p(190, y + 25));
            scrollViewLayer.addChild(goldIcon);
        }

        scrollView.setContentSize(cc.size(600, scrollViewHeight));
        scrollView.setContentOffset(scrollView.minContainerOffset());


    },

    _onClickGo2Payment: function() {

        MainScene.getInstance().switchLayer(ShopLayer);
    }


});

GoldRewardLayer.create = function () {
    var ret = new GoldRewardLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};