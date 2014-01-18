/**
 * Created by lujunyu on 14-1-18.
 */

var giftItemIcon = ["icon354", "icon355", "icon276", "icon277", "icon281"];

var NewYearLayer = cc.Layer.extend({

    _giftItems: [],
    _dailyGetItem: null,

    onEnter: function () {
        cc.log("NewYearLayer onEnter");
        this._super();
        this.update();

        lz.dc.beginLogPageView("新春好礼界面");
    },

    onExit: function () {
        cc.log("NewYearLayer onExit");
        this._super();

        lz.dc.endLogPageView("新春好礼界面");
    },

    init: function () {
        cc.log("NewYearLayer init");

        if (!this._super())  return false;

        var bgSprite = cc.Sprite.create(main_scene_image.bg23);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(cc.p(8, 108));
        this.addChild(bgSprite);

        var topSprite = cc.Sprite.create(main_scene_image.icon349);
        topSprite.setPosition(cc.p(320, 828));
        this.addChild(topSprite);

        var dailyGetIcon = cc.Sprite.create(main_scene_image.icon351);
        dailyGetIcon.setPosition(cc.p(320, 678));
        this.addChild(dailyGetIcon);

        var lineIcon = cc.Sprite.create(main_scene_image.icon357);
        lineIcon.setPosition(cc.p(320, 540));
        this.addChild(lineIcon);

        var tipIcon = cc.Sprite.create(main_scene_image.icon350);
        tipIcon.setPosition(cc.p(320, 500));
        this.addChild(tipIcon);

        var arrowsIcon = cc.Sprite.create(main_scene_image.icon353);
        arrowsIcon.setPosition(cc.p(330, 320));
        this.addChild(arrowsIcon);

        var moneyIcon = cc.Sprite.create(main_scene_image.icon352);
        moneyIcon.setPosition(320, 240);
        this.addChild(moneyIcon);

        var menu = cc.Menu.create();
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        this._dailyGetItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            main_scene_image.icon123,
            this.onClickDailyReward,
            this
        );

        this._dailyGetItem.setPosition(cc.p(320, 610));
        menu.addChild(this._dailyGetItem);

        var point = [
            cc.p(100, 355),
            cc.p(200, 260),
            cc.p(310, 375),
            cc.p(430, 265),
            cc.p(550, 375)
        ];

        for (var i = 0; i < 5; i++) {
            var sprite = cc.Sprite.create(main_scene_image[giftItemIcon[i]]);
            this._giftItems[i] = cc.MenuItemLabel.create(
                sprite,
                this.onClickGift(i + 1),
                this
            );
            if (i > 1) {
                this._giftItems[i].setScale(0.7);
            }
            this._giftItems[i].setPosition(point[i]);
            menu.addChild(this._giftItems[i]);
        }

        return true;
    },

    update: function () {
        cc.log("NewYearLayer update");
    },

    onClickDailyReward: function () {
        cc.log("NewYearLayer onClickDailyReward");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

    },

    onClickGift: function (id) {

        var that = this;
        return function () {
            cc.log("NewYearLayer onClickGift: " + id);

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);
        }
    }
});

NewYearLayer.create = function () {
    cc.log("NewYearLayer create");

    var ref = new NewYearLayer();
    if (ref && ref.init()) {
        return ref;
    }
    return null;
};
