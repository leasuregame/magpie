/**
 * Created by lujunyu on 14-7-5.
 */

var FlashLotteryLayer = cc.Layer.extend({
    _flashLotteryLayerFit: null,

    _starIcons: [],
    _starBgIcons: [],
    _btnNode1: null,
    _btnNode2: null,

    init: function () {
        cc.log("FlashLottery init");

        if (!this._super()) return false;

        this._flashLotteryLayerFit = gameFit.mainScene.flashLotteryLayer;

        var timesBgLabel = cc.Sprite.create(main_scene_image.icon147);
        timesBgLabel.setPosition(this._flashLotteryLayerFit.timesBgLabelPoint);
        this.addChild(timesBgLabel);

        var luckCard = gameData.activity.get("luckyCard");

        var startDate = lz.getTimeStr({
            time: luckCard.startDate,
            fmt: "yyyy-MM-dd hh:mm"
        });

        var endDate = lz.getTimeStr({
            time: luckCard.endDate,
            fmt: "yyyy-MM-dd hh:mm"
        });

        var desc = "活动时间：" + startDate + " 至 " + endDate;

        var timeLabel = StrokeLabel.create(desc, "STHeitiTC-Medium", 25);
        timeLabel.setColor(cc.c3b(85, 255, 1));
        timeLabel.setBgColor(cc.c3b(0, 0, 0));
        timeLabel.setPosition(this._flashLotteryLayerFit.timeLabelPoint);
        this.addChild(timeLabel);

        var titleLabel = cc.Sprite.create(main_scene_image.icon481);
        titleLabel.setPosition(this._flashLotteryLayerFit.titleLabelPoint);
        this.addChild(titleLabel, 2);

        var baseSprite = cc.Sprite.create(main_scene_image.icon482);
        baseSprite.setPosition(this._flashLotteryLayerFit.baseSpritePoint);
        this.addChild(baseSprite);

        var cardLabel = CardFullNode.create(
            Card.create({
                tableId: luckCard.info.tableId,
                skillLv: 1,
                lv: 1
            })
        );
        cardLabel.setPosition(this._flashLotteryLayerFit.cardLabelPoint);
        this.addChild(cardLabel);

        var points = this._flashLotteryLayerFit.starPoints;
        for (var i = 0; i < 5; i++) {

            this._starBgIcons[i] = cc.Sprite.create(main_scene_image.star4);
            this._starBgIcons[i].setScale(1.2);
            this._starBgIcons[i].setPosition(points[i]);
            this.addChild(this._starBgIcons[i]);

            this._starIcons[i] = cc.Sprite.create(main_scene_image.star2);
            this._starIcons[i].setScale(1.2);
            this._starIcons[i].setPosition(points[i]);
            this._starIcons[i].setVisible(i < luckCard.info.star);
            this.addChild(this._starIcons[i]);
        }

        this._lotteryCardItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            main_scene_image.icon483,
            this._onClickLottery,
            this
        );
        this._lotteryCardItem.setPosition(this._flashLotteryLayerFit.lotteryCardItemPoint);

        var rateLabel1 = StrokeLabel.create("3%点亮星星", "STHeitiTC-Medium", 22);
        rateLabel1.setColor(cc.c3b(85, 255, 1));
        rateLabel1.setBgColor(cc.c3b(0, 0, 0));
        rateLabel1.setPosition(this._flashLotteryLayerFit.rateLabel1Point);
        this.addChild(rateLabel1);

        var costLabel1 = cc.Sprite.create(main_scene_image.icon331);
        costLabel1.setPosition(this._flashLotteryLayerFit.costLabel1Point);
        this.addChild(costLabel1);

        var goldLotteryIcon = cc.Sprite.create(main_scene_image.icon140);
        goldLotteryIcon.setScale(0.9);
        goldLotteryIcon.setPosition(this._flashLotteryLayerFit.goldLotteryIconPoint);
        this.addChild(goldLotteryIcon);

        this._tenLotteryCardItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            main_scene_image.icon484,
            this._onClickTenLottery,
            this
        );
        this._tenLotteryCardItem.setPosition(this._flashLotteryLayerFit.tenLotteryCardItemPoint);

        var rateLabel2 = StrokeLabel.create("50%点亮星星", "STHeitiTC-Medium", 22);
        rateLabel2.setColor(cc.c3b(85, 255, 1));
        rateLabel2.setBgColor(cc.c3b(0, 0, 0));
        rateLabel2.setPosition(this._flashLotteryLayerFit.rateLabel2Point);
        this.addChild(rateLabel2);

        var costLabel2 = cc.Sprite.create(main_scene_image.icon331);
        costLabel2.setPosition(this._flashLotteryLayerFit.costLabel2Point);
        this.addChild(costLabel2);

        var goldTenLotteryIcon = cc.Sprite.create(main_scene_image.icon313);
        goldTenLotteryIcon.setScale(0.9);
        goldTenLotteryIcon.setPosition(this._flashLotteryLayerFit.goldTenLotteryIconPoint);
        this.addChild(goldTenLotteryIcon);

        var menu = cc.Menu.create(this._lotteryCardItem, this._tenLotteryCardItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        var tipLabel = ColorLabelTTF.create(
            {
                string: "每日首次10连召唤必得",
                fontName: "STHeitiTC-Medium",
                fontSize: 22
            },
            {
                string: "5星",
                fontName: "STHeitiTC-Medium",
                fontSize: 22,
                color: cc.c3b(85, 255, 1)
            }
        );
        tipLabel.setPosition(this._flashLotteryLayerFit.tipLabelPoint);
        this.addChild(tipLabel);

        this.update(luckCard.info.star);

        return true;
    },

    _update: function (data) {
        cc.log(data);
        if (data.isLightStar) {
            var starEffect = cc.BuilderReader.load(main_scene_image.uiEffect119, this);
            starEffect.setPosition(this._flashLotteryLayerFit.cardLabelPoint);
            this.addChild(starEffect);

            var that = this;

            var animationManager = starEffect.animationManager;
            var time = animationManager.getSequenceDuration("animation_2");
            var point = this._flashLotteryLayerFit.starPoints[data.lightStar - 1];

            var fn3 = function () {
                animationManager.runAnimationsForSequenceNamedTweenDuration("animation_3", 0);
                animationManager.setCompletedAnimationCallback(that, function () {
                    starEffect.removeFromParent();
                    var scaleToAction = cc.Sequence.create(
                        cc.FadeIn.create(0.2),
                        cc.ScaleTo.create(0.3, 1.4),
                        cc.ScaleTo.create(0.2, 1.2)
                    );

                    that._starIcons[data.lightStar - 1].runAction(scaleToAction);
                    that._starIcons[data.lightStar - 1].setVisible(true);
                });
            };

            var fn2 = function () {
                animationManager.runAnimationsForSequenceNamedTweenDuration("animation_2", 0);
                starEffect.runAction(
                    cc.Sequence.create(
                        cc.MoveTo.create(time, point)
                    )
                );
                animationManager.setCompletedAnimationCallback(that, fn3);
            };

            var fn1 = function () {
                animationManager.runAnimationsForSequenceNamedTweenDuration("animation_1", 0);
                animationManager.setCompletedAnimationCallback(that, fn2);
            };

            fn1();
        }
    },

    update: function (lightStar) {

        if (lightStar == 5) {
            this._btnNode1 = cc.BuilderReader.load(main_scene_image.uiEffect33, this);
            this._btnNode1.setPosition(cc.p(75, 35));
            this._lotteryCardItem.getNormalImage().addChild(this._btnNode1);

            this._btnNode2 = cc.BuilderReader.load(main_scene_image.uiEffect33, this);
            this._btnNode2.setPosition(cc.p(75, 35));
            this._tenLotteryCardItem.getNormalImage().addChild(this._btnNode2);
        }

        if (lightStar == 0) {
            for (var i = 0; i < 5; i++) {
                this._starIcons[i].setVisible(false);
            }

            if (this._btnNode1) {
                this._btnNode1.removeFromParent();
                this._btnNode1 = null;
            }

            if (this._btnNode2) {
                this._btnNode2.removeFromParent();
                this._btnNode2 = null;
            }
        }
    },

    _onClickLottery: function () {
        cc.log("FlashLotteryLayer _onClickLottery");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        if (gameData.cardList.isFull()) {
            CardListFullTipLayer.pop();
            return;
        }

        var lottery = gameData.lottery;

        if (!lottery.canFlashLottery(1)) {
            return;
        }

        var that = this;
        lottery.flashLottery(function (data) {

            var cb = function () {
                that._update(data);
                that.update(data.lightStar);
            };

            LotteryCardLayer.pop({
                card: data.card,
                fragment: data.fragment,
                cb: cb
            });
        }, 1);

    },

    _onClickTenLottery: function () {
        cc.log("FlashLotteryLayer _onClickTenLottery");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        if (gameData.cardList.isFull()) {
            CardListFullTipLayer.pop();
            return;
        }

        var lottery = gameData.lottery;

        if (!lottery.canFlashLottery(10)) {
            return;
        }

        var that = this;
        var next = function () {
            lottery.flashLottery(function (data) {
                var cb = function () {
                    that._update(data);
                    that.update(data.lightStar);
                };

                TenLotteryCardLayer.pop({
                    card: data.card,
                    fragment: data.fragment,
                    cb: cb
                });
            }, 10);
        };

        var goldLuckyCard10 = lottery.get("goldLuckyCard10");
        var key = gameData.player.get("uid") + "_goldLuckyCard10";
        if (goldLuckyCard10.got && lz.load(key)) {
            AdvancedTipsLabel.pop(TYPE_GOLD_TEN_LOTTERY_TIPS, function () {
                next();
            });
        } else {
            next();
        }
    }
});

FlashLotteryLayer.create = function () {
    cc.log("FlashLotteryLayer create");

    var ret = new FlashLotteryLayer();
    if (ret && ret.init()) {
        return ret;
    }

    return null;
};

