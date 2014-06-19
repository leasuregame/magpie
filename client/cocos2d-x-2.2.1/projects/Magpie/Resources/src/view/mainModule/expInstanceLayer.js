/**
 * Created by lujunyu on 14-6-14.
 */

var ExpInstanceLayer = cc.Layer.extend({
    _expInstanceLayerFit: null,

    _subdueItems: null,
    _tipLabels: null,
    _openLvLabels: null,
    _shadeLabels: null,

    onEnter: function () {
        cc.log("ExpInstanceLayer onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("ExpInstanceLayer init");

        if (!this._super()) return false;

        this._expInstanceLayerFit = gameFit.mainScene.expInstanceLayer;

        var bgSprite = cc.Sprite.create(main_scene_image.bg11);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._expInstanceLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        var topLabel = cc.Sprite.create(main_scene_image.icon60);
        topLabel.setPosition(this._expInstanceLayerFit.topLabelPoint);
        this.addChild(topLabel);

        var headIcon = cc.Sprite.create(main_scene_image.icon2);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(this._expInstanceLayerFit.headIconPoint);
        this.addChild(headIcon);

        var titleLabel = cc.Sprite.create(main_scene_image.icon469);
        titleLabel.setPosition(this._expInstanceLayerFit.titleLabelPoint);
        this.addChild(titleLabel);

        var powerIcon = cc.Sprite.create(main_scene_image.icon150);
        powerIcon.setPosition(this._expInstanceLayerFit.powerIconPoint);
        this.addChild(powerIcon);

        this._powerLabel = cc.LabelTTF.create("0/0", "STHeitiTC-Medium", 25);
        this._powerLabel.setAnchorPoint(cc.p(0, 0.5));
        this._powerLabel.setPosition(this._expInstanceLayerFit.powerLabelPoint);
        this.addChild(this._powerLabel);

        var timesBgLabel = cc.Sprite.create(main_scene_image.icon477);
        timesBgLabel.setPosition(this._expInstanceLayerFit.timesBgLabelPoint);
        this.addChild(timesBgLabel);

        var remainTimesLabel = cc.LabelTTF.create("今日剩余：    次", "STHeitiTC-Medium", 28);
        remainTimesLabel.setPosition(this._expInstanceLayerFit.remainTimesLabelPoint);
        this.addChild(remainTimesLabel);

        this._timesLabel = cc.LabelTTF.create("0", "STHeitiTC-Medium", 28);
        this._timesLabel.setPosition(this._expInstanceLayerFit.timesLabelPoint);
        this.addChild(this._timesLabel);

        var buyCountItem = cc.MenuItemImage.create(
            main_scene_image.button16,
            main_scene_image.button16s,
            this._onClickBuyCount,
            this
        );
        buyCountItem.setScale(1.3);
        buyCountItem.setPosition(this._expInstanceLayerFit.buyCountItemPoint);

        var backItem = cc.MenuItemImage.create(
            main_scene_image.button8,
            main_scene_image.button8s,
            this._onClickBack,
            this
        );
        backItem.setPosition(this._expInstanceLayerFit.backItemPoint);

        var menu = cc.Menu.create(buyCountItem, backItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        this._addScrollView();

        return true;
    },

    update: function () {
        cc.log("ExpInstanceLayer update");

        var player = gameData.player;
        this._powerLabel.setString(player.get("power") + "/" + player.get("maxPower"));

        this._timesLabel.setString(gameData.dailyInstances.get("expPassCount"));

        var lv = player.get("lv");
        var table = outputTables.exp_pass_config.rows;

        for (var key in table) {
            var limitLv = table[key].limit_lv;
            var id = table[key].id;
            this._tipLabels[id].setVisible(lv >= limitLv);
            this._subdueItems[id].setEnabled(lv >= limitLv);
            this._openLvLabels[id].setVisible(lv < limitLv);
            this._shadeLabels[id].setVisible(lv < limitLv);
        }

    },

    _addScrollView: function () {
        cc.log("ExpInstanceLayer _addScrollView");

        var scrollViewLayer = MarkLayer.create(this._expInstanceLayerFit.scrollViewLayerRect);

        this._subdueItems = [];
        this._tipLabels = [];
        this._openLvLabels = [];
        this._shadeLabels = [];

        var table = outputTables.exp_pass_config.rows;
        var len = Object.keys(table).length;

        var scrollViewHeight = len * 230;
        var index = 0;

        var slideLabel = [];

        for (var id in table) {
            var y = scrollViewHeight - 230 * index - 230;
            var config = table[id];

            slideLabel[index] = cc.Node.create();
            slideLabel[index].setPosition(cc.p(0, 0));

            var bgLabel = cc.Sprite.create(main_scene_image.icon470);
            bgLabel.setAnchorPoint(cc.p(0.5, 0));
            bgLabel.setPosition(cc.p(320, y));
            slideLabel[index].addChild(bgLabel);

            var difficultyIcon = cc.Sprite.create(main_scene_image["icon" + (472 + config.id)]);
            difficultyIcon.setAnchorPoint(cc.p(0, 0));
            difficultyIcon.setPosition(cc.p(35, 152));
            bgLabel.addChild(difficultyIcon);

            var maybeGetIcon = cc.Sprite.create(main_scene_image.icon472);
            maybeGetIcon.setAnchorPoint(cc.p(0, 0));
            maybeGetIcon.setPosition(cc.p(35, 60));
            bgLabel.addChild(maybeGetIcon);

            var tipLabel = ColorLabelTTF.create(
                {
                    iconName: "power",
                    scale: 0.8,
                    spacing: -2
                },
                {
                    string: config.power_consume,
                    fontName: "STHeitiTC-Medium",
                    fontSize: 22
                }
            );
            tipLabel.setAnchorPoint(cc.p(0, 0));
            tipLabel.setPosition(cc.p(480, 175));
            bgLabel.addChild(tipLabel);

            this._tipLabels[id] = tipLabel;

            var openLvLabel = StrokeLabel.create(config.limit_lv + "级开放", "STHeitiTC-Medium", 22);
            openLvLabel.setColor(cc.c3b(232, 48, 48));
            openLvLabel.setBgColor(cc.c3b(0, 0, 0));
            openLvLabel.setAnchorPoint(cc.p(0, 0));
            openLvLabel.setPosition(cc.p(480, y + 165));
            slideLabel[index].addChild(openLvLabel, 2);

            this._openLvLabels[id] = openLvLabel;

            var descLabel = cc.LabelTTF.create("我的使命是：无私贡献！不求回报！", "STHeitiTC-Medium", 22);
            descLabel.setColor(cc.c3b(108, 48, 25));
            descLabel.setAnchorPoint(cc.p(0, 0));
            descLabel.setPosition(cc.p(30, 120));
            bgLabel.addChild(descLabel);

            var cards = config.exp_card_stars.split(",");
            cc.log(cards);
            var len2 = cards.length;
            for (var j = 0; j < len2; j++) {
                var card = Card.create({
                    tableId: parseInt(cards[j]) + 50000,
                    lv: 1,
                    skillLv: 1
                });

                var cardIcon = CardHeadNode.create(card);
                cardIcon.setScale(0.75);
                cardIcon.setAnchorPoint(cc.p(0, 0));
                cardIcon.setPosition(cc.p(140 + j * 100, 30));
                bgLabel.addChild(cardIcon);
            }

            var subdueItem = cc.MenuItemImage.createWithIcon(
                main_scene_image.button9,
                main_scene_image.button9s,
                main_scene_image.button9d,
                main_scene_image.icon471,
                this._onClickSubdue(config.id),
                this
            );
            subdueItem.setAnchorPoint(cc.p(0, 0));
            subdueItem.setPosition(cc.p(450, 20));

            var menu = LazyMenu.create(subdueItem);
            menu.setPosition(cc.p(0, 0));
            bgLabel.addChild(menu);

            this._subdueItems[config.id] = subdueItem;

            var shadeLabel = cc.Sprite.create(main_scene_image.icon476);
            shadeLabel.setAnchorPoint(cc.p(0.5, 0));
            shadeLabel.setPosition(cc.p(320, y));
            slideLabel[index].addChild(shadeLabel);

            this._shadeLabels[config.id] = shadeLabel;

            scrollViewLayer.addChild(slideLabel[index]);

            index++;
        }

        var scrollView = cc.ScrollView.create(this._expInstanceLayerFit.scrollViewSize, scrollViewLayer);
        scrollView.setPosition(this._expInstanceLayerFit.scrollViewPoint);
        scrollView.setBounceable(false);
        scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        scrollView.updateInset();
        this.addChild(scrollView, 10);

        scrollView.setContentSize(cc.size(640, scrollViewHeight));
        scrollView.setContentOffset(scrollView.minContainerOffset());

        var slideLayer = SlideLayer.create({
            labels: slideLabel
        });

        slideLayer.showSlide();
    },

    _onClickBuyCount: function () {
        cc.log("ExpInstanceLayer _onClickBuyCount");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var vip = gameData.player.get("vip");

        var needVip = gameData.dailyInstances.buyExpCountNeedVip();

        if (vip < needVip) {
            AdvancedTipsLabel.pop(TYPE_EXP_INSTANCES_TIPS);
            return;
        }

        if (gameData.shop.get("expPassBuyCount") <= 0) {
            var tipVip = gameData.player.get("vip") + 1;

            tipVip = Math.max(tipVip, needVip);
            tipVip = Math.min(tipVip, 12);

            GoPaymentLayer.pop({
                title: "购买次数已用完",
                msg: "成为VIP" + tipVip + "，每日即可获得更多购买次数"
            });
            return;
        }

        var id = 9;
        var product = gameData.shop.getProduct(id);

        cc.log(product);

        var that = this;
        AmountLayer.pop(
            function (count) {
                that._buyCount(id, count);
            },
            product
        );
    },

    _buyCount: function (id, count) {
        cc.log("ExpInstanceLayer _buyCount");

        if (count > 0) {
            var that = this;
            gameData.shop.buyProduct(function (data) {
                that.update();

                lz.tipReward(data);
            }, id, count);
        }
    },

    _onClickSubdue: function (id) {

        var that = this;

        return function () {
            cc.log("ExpInstanceLayer _onClickSubdue: " + id);

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            if (gameData.cardList.isFull()) {
                CardListFullTipLayer.pop();
                return;
            }

            gameData.dailyInstances.expInstance(id, function (data) {
                cc.log(data);

                if (data) {
                    var battleLogId = data.battleLogId;
                    var upgradeReward = data.upgradeReward || null;
                    var level9Box = data.level9Box || null;
                    var isWin = false;
                    var next = function () {
                        gameCombo.next();
                    };

                    gameCombo.push([
                        function () {
                            isWin = BattlePlayer.getInstance().play({
                                cb: next,
                                id: battleLogId
                            });
                        },
                        function () {
                            that.update();
                        },
                        function () {
                            if (upgradeReward) {
                                PlayerUpgradeLayer.pop({
                                    cb: next,
                                    reward: upgradeReward
                                });
                            } else {
                                next();
                            }
                        },
                        function () {
                            if (level9Box) {
                                Level9BoxLayer.pop({
                                    cb: next,
                                    reward: level9Box
                                });
                            } else {
                                next();
                            }
                        },
                        function () {
                            if (upgradeReward) {
                                gameGuide.updateGuide();
                            }
                            next();
                        }
                    ]);
                } else {
                    that.update();
                }
            });
        }
    },

    _onClickBack: function () {
        cc.log("ExploreLayer _onClickBack");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        MainScene.getInstance().switchLayer(InstancesLayer);
    }
});

ExpInstanceLayer.create = function () {
    cc.log("ExpInstanceLayer create");

    var ret = new ExpInstanceLayer();
    if (ret && ret.init()) {
        return ret;
    }
    return null;

};