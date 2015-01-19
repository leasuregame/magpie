/**
 * Created by Arthur on 2015/1/18.
 */
var ActiveRechargeLayer = cc.Layer.extend({
    _cardObj: {
        labels: [],
        effects: [],
        cards: []
    },

    onEnter: function () {
        cc.log("ActiveRechargeLayer onEnter");

        this._super();

        lz.um.beginLogPageView("充值送卡界面");
    },

    onExit: function () {
        cc.log("ActiveRechargeLayer onExit");

        this._super();

        lz.um.endLogPageView("充值送卡界面");
    },

    init: function() {
        cc.log("ActiveRechargeLayer init");

        if (!this._super()) return false;

        // 标题
        this._achievementLayerFit = gameFit.mainScene.achievementLayer;

        var bgSprite = cc.Sprite.create(main_scene_image.bg11);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(this._achievementLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        var headIcon = cc.Sprite.create(main_scene_image.icon2);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(this._achievementLayerFit.headIconPoint);
        this.addChild(headIcon);

        var titleIcon = cc.Sprite.create(main_scene_image.icon489);
        titleIcon.setPosition(this._achievementLayerFit.titleIconPoint);
        this.addChild(titleIcon);

        var backItem = cc.MenuItemImage.create(
            main_scene_image.button8,
            main_scene_image.button8s,
            this._onClickBack,
            this
        );
        backItem.setPosition(this._achievementLayerFit.backItemPoint);
        var menu = cc.Menu.create(backItem);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu, 1);

        var size = cc.Director.getInstance().getWinSize();
        var center_width = size.width/2;
        var h_scale = size.height/1136;

        // 活动时间
        var timesBgLabel = cc.Sprite.create(main_scene_image.icon147);
        timesBgLabel.setAnchorPoint(cc.p(0, 0));
        timesBgLabel.setPosition(cc.p(0, headIcon.getPositionY() -
            timesBgLabel.getContentSize().height));
        this.addChild(timesBgLabel);

        var rechargeCard = gameData.activity.get("rechargeCardData");

        var startDate = lz.getTimeStr({
            time: rechargeCard.startDate,
            fmt: "yyyy-MM-dd hh:mm"
        });

        var endDate = lz.getTimeStr({
            time: rechargeCard.endDate,
            fmt: "yyyy-MM-dd hh:mm"
        });

        var desc = "活动时间：" + startDate + " 至 " + endDate;

        var timeLabel = StrokeLabel.create(desc, "STHeitiTC-Medium", 25);
        timeLabel.setColor(cc.c3b(85, 255, 1));
        timeLabel.setBgColor(cc.c3b(0, 0, 0));
        timeLabel.setAnchorPoint(cc.p(0.5, 0.5));
        timeLabel.setPosition(cc.p(size.width/2, headIcon.getPositionY() -
            timesBgLabel.getContentSize().height/2));
        this.addChild(timeLabel);

        // 活动内容
        var head_y = timesBgLabel.getPositionY();

        var titleSprite = cc.Sprite.create(main_scene_image.icon487);
        titleSprite.setPosition(cc.p(center_width, head_y - 70));
        this.addChild(titleSprite, 2);
        var valueSprite = cc.Sprite.create(main_scene_image.icon488);
        valueSprite.setPosition(cc.p(center_width, head_y - 140));
        this.addChild(valueSprite, 4);

        var dayLabel = cc.LabelTTF.create(rechargeCard.data.days+'', null, 28);
        dayLabel.setColor(cc.c3b(0, 255, 54, 255));
        dayLabel.enableStroke(cc.c3b(0, 0, 0), 2);
        dayLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        dayLabel.setPosition(cc.p(valueSprite.getPositionX() - 40,
            valueSprite.getPositionY()));
        this.addChild(dayLabel, 4);

        var goldLabel = cc.LabelTTF.create(rechargeCard.data.gold + '钻', null, 28);
        goldLabel.setAnchorPoint(cc.p(0, 0.5));
        goldLabel.enableStroke(cc.c3b(0, 0, 0), 2);
        goldLabel.setColor(cc.c3b(0, 255, 54, 255));
        goldLabel.setPosition(cc.p(valueSprite.getPositionX() + 118,
            valueSprite.getPositionY()));
        goldLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this.addChild(goldLabel, 2);

        var cardSprite = cc.Sprite.create(main_scene_image.card42_full2);
        cardSprite.setScale(h_scale*0.9);
        cardSprite.setPosition(cc.p(center_width, head_y - 370*h_scale));
        this.addChild(cardSprite, 3);

        var sitSprite = cc.Sprite.create(main_scene_image.icon482);
        sitSprite.setScale(h_scale*0.85);
        sitSprite.setPosition(cc.p(center_width, head_y - 600*h_scale));
        this.addChild(sitSprite, 2);

        var cardCount = 4;
        var y = 230*h_scale;
        var menu = cc.Menu.create();
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu, 3);

        var textArray = [
            '储值6元\n可翻牌\n10000仙丹',
            '储值12元\n可翻牌\n5卡魂',
            '储值18元\n可翻牌\n5精元',
            '储值24元\n可翻牌\n10精元'
        ]

        for (var i = 0; i < cardCount; i++) {
            var boxItem = rechargeCard.data.box[i];

            var cardItem = this._cardObj.cards[i] = cc.MenuItemImage.create(
                main_scene_image.card_back,
                main_scene_image.card_back,
                this._onClickCard.bind(this, i),
                this);
            var w = cardItem.getContentSize().width;
            var x = (size.width - w * 4 - 60)/2 + i*(w+20);
            cardItem.setAnchorPoint(cc.p(0, 0));
            cardItem.setPosition(cc.p(x, y));
            cardItem.setScale(1, 1.5);
            menu.addChild(cardItem, 3);

            var textLabel = this._cardObj.labels[i] = cc.LabelTTF.create(textArray[i], null, 18);
            textLabel.setColor(cc.c3b(0, 255, 54));
            textLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            textLabel.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
            textLabel.setPosition(cc.p(x + cardItem.getContentSize().width / 2,
                    y + cardItem.getContentSize().height / 2 + 27));
            textLabel.enableStroke(cc.c3b(0, 0, 0), 2);
            this.addChild(textLabel, 3);

            if (boxItem) {
                if (boxItem.isGot) {
                    cardItem.setEnabled(false);
                } else {
                    var ccbNode = this._cardObj.effects[i] = cc.BuilderReader.load(main_scene_image.uiEffect19, this);
                    ccbNode.setAnchorPoint(cc.p(0, 0));
                    ccbNode.setPosition(cc.p(x + 54, y + 83));
                    ccbNode.setScale(1, 1.5);
                    this.addChild(ccbNode, 3);
                }

            } else {
                cardItem.setEnabled(false);
            }
        }

        var rechargeBtn = this._rechargeBtn = cc.MenuItemImage.createWithIcon(
            main_scene_image.button21,
            main_scene_image.button21s,
            main_scene_image.button21d,
            main_scene_image.icon159,
            this._onClickRecharge.bind(this),
            this
        );
        rechargeBtn.setAnchorPoint(cc.p(0.5, 0));
        rechargeBtn.setPosition(cc.p(center_width, 146*h_scale));

        var receiveCardBtn = this._receiveBtn = cc.MenuItemImage.createWithIcon(
            main_scene_image.button10,
            main_scene_image.button10s,
            main_scene_image.button9d,
            main_scene_image.icon123,
            this._onClickReceiveCard.bind(this),
            this
        );
        receiveCardBtn.setAnchorPoint(cc.p(0.5, 0));
        receiveCardBtn.setPosition(cc.p(center_width, 146*h_scale));

        if (rechargeCard.isCanReceive) {
            rechargeBtn.setVisible(false);
            if (rechargeCard.data.isGot) {
                receiveCardBtn.setEnabled(false);
            }
        } else {
            receiveCardBtn.setVisible(false);
            if (rechargeCard.data.cash >= 24) {
                rechargeBtn.setEnabled(false);
            }
        }

        var menu = cc.Menu.create(rechargeBtn, receiveCardBtn);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu, 4);

        return true;
    },

    _onClickCard: function(index) {
        cc.log('click card to get reward');
        gameData.sound.playEffect(main_scene_image.click_button_sound, false);
        this._cardObj.effects[index].removeFromParent();
        this._cardObj.effects.splice(index, 1);
        this._cardObj.cards[index].setEnabled(false);
    },

    _onClickRecharge: function() {
        cc.log("click recharge button");
        gameData.sound.playEffect(main_scene_image.click_button_sound, false);
    },

    _onClickReceiveCard: function() {
        cc.log("click _onClickReceiveCard button");
        gameData.sound.playEffect(main_scene_image.click_button_sound, false);
        this._receiveBtn.setEnabled(false);
    },

    _onClickBack: function () {
        cc.log("AchievementLayer _onClickBack");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        MainScene.getInstance().switchLayer(MainLayer);
    }
});

ActiveRechargeLayer.create = function () {
    var ret = new ActiveRechargeLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};