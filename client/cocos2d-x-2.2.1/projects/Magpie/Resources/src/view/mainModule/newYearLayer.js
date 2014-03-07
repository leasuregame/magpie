/**
 * Created by lujunyu on 14-1-18.
 */

var giftItemIcon = ["icon354", "icon355", "icon276", "icon277", "icon281"];

var NewYearLayer = cc.Layer.extend({
    _newYearLayerFit: null,

    _giftItems: [],
    _dailyGetItem: null,
    _giftEffect: [],
    _flagIcon: [],

    onEnter: function () {
        cc.log("NewYearLayer onEnter");
        this._super();
        this.update();

        lz.um.beginLogPageView("新春好礼界面");
    },

    onExit: function () {
        cc.log("NewYearLayer onExit");
        this._super();

        lz.um.endLogPageView("新春好礼界面");
    },

    init: function () {
        cc.log("NewYearLayer init");

        if (!this._super())  return false;

        this._newYearLayerFit = gameFit.mainScene.newYearLayer;

        this._giftEffect = [];
        this._giftItems = [];
        this._flagIcon = [];
        this._dailyGetItem = null;

        var bgSprite = cc.Sprite.create(main_scene_image.bg23);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._newYearLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        var topSprite = cc.Sprite.create(main_scene_image.icon349);
        topSprite.setPosition(this._newYearLayerFit.topSpritePoint);
        this.addChild(topSprite, 2);

        var dailyGetIcon = cc.Sprite.create(main_scene_image.icon351);
        dailyGetIcon.setPosition(this._newYearLayerFit.dailyGetIconPoint);
        this.addChild(dailyGetIcon);

        var lineIcon = cc.Sprite.create(main_scene_image.icon357);
        lineIcon.setPosition(this._newYearLayerFit.lineIconPoint);
        this.addChild(lineIcon);

        var tipIcon = cc.Sprite.create(main_scene_image.icon350);
        tipIcon.setPosition(this._newYearLayerFit.tipIconPoint);
        this.addChild(tipIcon);

        var arrowsIcon = cc.Sprite.create(main_scene_image.icon353);
        arrowsIcon.setPosition(this._newYearLayerFit.arrowsIconPoint);
        this.addChild(arrowsIcon);

        var moneyIcon = cc.Sprite.create(main_scene_image.icon352);
        moneyIcon.setPosition(this._newYearLayerFit.moneyIconPoint);
        this.addChild(moneyIcon);

        var menu = cc.Menu.create();
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu, 2);

        this._dailyGetItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button10,
            main_scene_image.button10s,
            main_scene_image.button9d,
            main_scene_image.icon123,
            this.onClickDailyReward,
            this
        );

        this._dailyGetItem.setPosition(this._newYearLayerFit.dailyGetItemPoint);
        menu.addChild(this._dailyGetItem);

        var point = this._newYearLayerFit.giftItemsPoints;

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

            this._flagIcon[i] = cc.Sprite.create(main_scene_image.icon138);
            this._flagIcon[i].setPosition(point[i]);
            this._flagIcon[i].setVisible(false);
            this.addChild(this._flagIcon[i], 3);
        }

        return true;
    },

    update: function () {
        cc.log("NewYearLayer update");

        this._dailyGetItem.setEnabled(gameData.activity.get("hasLoginReward"));

        var point = this._newYearLayerFit.giftItemsPoints;
        var that = this;

        for (var i = 0; i < 5; i++) {
            (function (i) {
                var state = gameData.activity.getStateById(TYPE_RECHARGE_REWARD, i + 1);
                if (state == RECHARGE_REWARD) {
                    if (!that._giftEffect[i]) {
                        that._giftEffect[i] = cc.BuilderReader.load(main_scene_image.uiEffect77, this);
                        that._giftEffect[i].setPosition(point[i]);

                        if (i < 2) {
                            that._giftEffect[i].setScale(0.5 + i * 0.1);
                        } else {
                            that._giftEffect[i].setScale(0.7);
                        }

                        that.addChild(that._giftEffect[i]);
                    }
                } else {
                    if (that._giftEffect[i]) {
                        that._giftEffect[i].removeFromParent();
                        that._giftEffect[i] = null;
                    }

                    if (state == ALREADY_RECHARGE_REWARD) {
                        that._flagIcon[i].setVisible(true);
                    }
                }
            })(i);
        }

    },

    onClickDailyReward: function () {
        cc.log("NewYearLayer onClickDailyReward");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var that = this;

        gameData.activity.getNewYearReward(function () {
            lz.tipReward({"gold": 20});
            that.update();
        }, {
            type: RECEIVE_LOGIN_REWARD,
            args: {}
        });


    },

    onClickGift: function (id) {

        var that = this;
        return function () {
            cc.log("NewYearLayer onClickGift: " + id);

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            var data = outputTables.new_year_rechage.rows[id];
            var reward = {
                "money": data.money,
                "energy": data.energy,
                "fragments": data.fragments
            };
            var state = gameData.activity.getStateById(TYPE_RECHARGE_REWARD, id);
            cc.log(state);
            var type = state == RECHARGE_REWARD ? GET_GIFT_BAG : SHOW_GIFT_BAG;
            var cb = null;

            if (type == GET_GIFT_BAG) {
                cb = function () {
                    gameData.activity.getNewYearReward(function () {
                        lz.tipReward(reward);
                        that.update();
                    }, {
                        type: RECEIVE_GIFT_REWARD,
                        args: {id: id}
                    });
                };
            }

            GiftBagLayer.pop({
                reward: reward,
                type: type,
                cb: cb
            });

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
