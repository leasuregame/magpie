/**
 * Created by lujunyu on 14-3-4.
 */

var AttackDetailsLayer = LazyLayer.extend({
    _attackDetailsLayerFit: null,

    _bossId: null,

    onEnter: function () {
        cc.log("AttackDetailsLayer onEnter");

        this._super();
        this.update();
    },

    init: function (bossId) {
        cc.log("AttackDetailsLayer init");

        if (!this._super()) return false;

        this._attackDetailsLayerFit = gameFit.mainScene.attackDetailsLayer;

        this._bossId = bossId;

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 150), 720, 1136);
        bgLayer.setPosition(cc.p(0, 0));
        this.addChild(bgLayer);

        var bgSprite = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgSprite.setContentSize(this._attackDetailsLayerFit.bgSpriteSize);
        bgSprite.setAnchorPoint(cc.p(0.5, 0));
        bgSprite.setPosition(this._attackDetailsLayerFit.bgSpritePoint);
        this.addChild(bgSprite);

        var titleBgIcon = cc.Sprite.create(main_scene_image.icon371);
        titleBgIcon.setPosition(this._attackDetailsLayerFit.titleBgIconPoint);
        this.addChild(titleBgIcon);

        var titleIcon = cc.Sprite.create(main_scene_image.icon407);
        titleIcon.setPosition(this._attackDetailsLayerFit.titleIconPoint);
        this.addChild(titleIcon);

        var detailsBgIcon = cc.Scale9Sprite.create(main_scene_image.icon169);
        detailsBgIcon.setAnchorPoint(cc.p(0, 0));
        detailsBgIcon.setPosition(this._attackDetailsLayerFit.detailsBgIconPoint);
        detailsBgIcon.setContentSize(this._attackDetailsLayerFit.detailsBgIconSize);
        this.addChild(detailsBgIcon);

        var tipBgLabel = cc.Sprite.create(main_scene_image.icon169);
        tipBgLabel.setPosition(this._attackDetailsLayerFit.tipBgLabelPoint);
        tipBgLabel.setScaleX(1.2);
        tipBgLabel.setScaleY(0.15);
        this.addChild(tipBgLabel);

        var tipLabel = cc.LabelTTF.create("贡献奖励请在降魔礼包界面中查收", "STHeitiTC-Medium", 22);
        tipLabel.setPosition(this._attackDetailsLayerFit.tipLabelPoint);
        tipLabel.setColor(cc.c3b(255, 239, 197));
        this.addChild(tipLabel);

        var tipIcon = cc.Sprite.create(main_scene_image.icon408);
        tipIcon.setPosition(this._attackDetailsLayerFit.tipIconPoint);
        this.addChild(tipIcon);

        var closeItem = cc.MenuItemImage.create(
            main_scene_image.button37,
            main_scene_image.button37s,
            this._onClickClose,
            this
        );
        closeItem.setPosition(this._attackDetailsLayerFit.closeItemPoint);

        var menu = LazyMenu.create(closeItem);
        menu.setTouchPriority(LAZY_LAYER_HANDLER_PRIORITY - 1);
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        this._skyDialog = SkyDialog.create();
        this.addChild(this._skyDialog, 10);

        var skyLabel = cc.Scale9Sprite.create(main_scene_image.bg16);
        skyLabel.setContentSize(cc.size(216, 200));

        var sendMessageItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon119,
            this._onClickSendMessage,
            this
        );
        sendMessageItem.setPosition(cc.p(108, 150));

        var detailItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.icon120,
            this._onClickDetail,
            this
        );
        detailItem.setPosition(cc.p(108, 60));

        var skyMenu = cc.Menu.create(detailItem, sendMessageItem);
        skyMenu.setTouchPriority(LAZY_LAYER_HANDLER_PRIORITY - 2);
        skyMenu.setPosition(cc.p(0, 0));
        skyLabel.addChild(skyMenu);

        this._skyDialog.setLabel(skyLabel);
        this._skyDialog.setRect(this._attackDetailsLayerFit.skyDialogRect);

        this._tipLabel = StrokeLabel.create("当前没有记录信息", "STHeitiTC-Medium", 25);
        this._tipLabel.setColor(cc.c3b(255, 243, 163));
        this._tipLabel.setBgColor(cc.c3b(120, 12, 42));
        this._tipLabel.setPosition(this._attackDetailsLayerFit.tipLabel1Point);
        this._tipLabel.setVisible(false);
        this.addChild(this._tipLabel);

        return true;
    },

    update: function () {
        cc.log("AttackDetailsLayer update");

        var that = this;
        gameData.boss.getBossDetails(function (detailsList) {
            that._detailsList = detailsList;
            that._addScrollView();
        }, this._bossId);
    },

    _addScrollView: function () {
        cc.log("AttackDetailsLayer _addScrollView");

        if (this._scrollView) {
            this._scrollView.removeFromParent();
            this._scrollView = null;
        }

        var scrollViewLayer = MarkLayer.create(this._attackDetailsLayerFit.scrollViewLayerRect);
        scrollViewLayer.setTouchPriority(LAZY_LAYER_HANDLER_PRIORITY);

        var menu = LazyMenu.create();
        menu.setPosition(cc.p(0, 0));
        menu.setTouchPriority(LAZY_LAYER_HANDLER_PRIORITY);
        scrollViewLayer.addChild(menu);

        this._detailsItem = [];

        var len = this._detailsList.length;
        var scrollViewHeight = len * 150;
        if (scrollViewHeight < this._attackDetailsLayerFit.scrollViewHeight) {
            scrollViewHeight = this._attackDetailsLayerFit.scrollViewHeight;
        }

        this._tipLabel.setVisible(len == 0);

        for (var i = 0; i < len; i++) {
            var y = scrollViewHeight - 90 - 150 * i;
            var details = this._detailsList[i];

            if (details.playerId != gameData.player.get("id")) {
                var detailsItem = cc.MenuItemImage.create(
                    main_scene_image.button44,
                    main_scene_image.button44s,
                    this._onClickDetails(i),
                    this
                );
                detailsItem.setAnchorPoint(cc.p(0, 0));
                detailsItem.setPosition(cc.p(10, y));
                menu.addChild(detailsItem);
            } else {
                var detailsIcon = cc.Sprite.create(main_scene_image.button44);
                detailsIcon.setAnchorPoint(cc.p(0, 0));
                detailsIcon.setPosition(cc.p(10, y));
                scrollViewLayer.addChild(detailsIcon);
            }

            this._detailsItem[i] = detailsItem;

            var fightTimesLabel = cc.LabelTTF.create("第 " + (i + 1) + " 次战斗", "STHeitiTC-Medium", 22);
            fightTimesLabel.setAnchorPoint(cc.p(0, 0));
            fightTimesLabel.setPosition(cc.p(25, y + 52));
            fightTimesLabel.setColor(cc.c3b(255, 215, 111));
            scrollViewLayer.addChild(fightTimesLabel);

            var attackerLabel = cc.LabelTTF.create(details.attacker, "STHeitiTC-Medium", 22);
            attackerLabel.setAnchorPoint(cc.p(0, 0));
            attackerLabel.setPosition(cc.p(25, y + 5));
            scrollViewLayer.addChild(attackerLabel);

            var damageLabel = cc.LabelTTF.create("伤害: " + details.damage, "STHeitiTC-Medium", 22);
            damageLabel.setAnchorPoint(cc.p(0, 0));
            damageLabel.setPosition(cc.p(25, y - 40));
            scrollViewLayer.addChild(damageLabel);

            var moneyIcon = cc.Sprite.create(main_scene_image.icon149);
            moneyIcon.setAnchorPoint(cc.p(0, 0));
            moneyIcon.setPosition(cc.p(220, y - 5));
            moneyIcon.setScale(0.9);
            scrollViewLayer.addChild(moneyIcon);

            var moneyLabel = cc.LabelTTF.create(details.money + "", "STHeitiTC-Medium", 22);
            moneyLabel.setAnchorPoint(cc.p(0, 0));
            moneyLabel.setPosition(cc.p(270, y + 5));
            scrollViewLayer.addChild(moneyLabel);

            if (details.moneyAdd && details.moneyAdd > 0) {
                var x = 270 + moneyLabel.getContentSize().width;

                var leftBracket = cc.LabelTTF.create("（", "STHeitiTC-Medium", 22);
                leftBracket.setAnchorPoint(cc.p(0, 0));
                leftBracket.setPosition(cc.p(x - 5, y + 5));
                scrollViewLayer.addChild(leftBracket);

                var moneyAdd = cc.LabelTTF.create("贡献" + details.moneyAdd, "STHeitiTC-Medium", 22);
                moneyAdd.setAnchorPoint(cc.p(0, 0));
                moneyAdd.setPosition(cc.p(x + 15, y + 5));
                moneyAdd.setColor(cc.c3b(193, 224, 109));
                scrollViewLayer.addChild(moneyAdd);

                x += moneyAdd.getContentSize().width + 15;

                var rightBracket = cc.LabelTTF.create("）", "STHeitiTC-Medium", 22);
                rightBracket.setAnchorPoint(cc.p(0, 0));
                rightBracket.setPosition(cc.p(x, y + 5));
                scrollViewLayer.addChild(rightBracket);
            }

            var honorIcon = cc.Sprite.create(main_scene_image.icon405);
            honorIcon.setAnchorPoint(cc.p(0, 0));
            honorIcon.setPosition(cc.p(220, y - 48));
            honorIcon.setScale(0.9);
            scrollViewLayer.addChild(honorIcon);

            var honorLabel = cc.LabelTTF.create(details.honor + "", "STHeitiTC-Medium", 22);
            honorLabel.setAnchorPoint(cc.p(0, 0));
            honorLabel.setPosition(cc.p(270, y - 40));
            scrollViewLayer.addChild(honorLabel);

            if (details.honorAdd && details.honorAdd > 0) {
                var x = 270 + honorLabel.getContentSize().width;

                var leftBracket = cc.LabelTTF.create("（", "STHeitiTC-Medium", 22);
                leftBracket.setAnchorPoint(cc.p(0, 0));
                leftBracket.setPosition(cc.p(x - 5, y - 40));
                scrollViewLayer.addChild(leftBracket);

                var honorAdd = cc.LabelTTF.create("贡献" + details.honorAdd, "STHeitiTC-Medium", 22);
                honorAdd.setAnchorPoint(cc.p(0, 0));
                honorAdd.setPosition(cc.p(x + 15, y - 40));
                honorAdd.setColor(cc.c3b(193, 224, 109));
                scrollViewLayer.addChild(honorAdd);

                x += honorAdd.getContentSize().width + 15;

                var rightBracket = cc.LabelTTF.create("）", "STHeitiTC-Medium", 22);
                rightBracket.setAnchorPoint(cc.p(0, 0));
                rightBracket.setPosition(cc.p(x, y - 40));
                scrollViewLayer.addChild(rightBracket);
            }

            var playbackItem = cc.MenuItemImage.create(
                main_scene_image.button74,
                main_scene_image.button74s,
                this._onClickPlayback(i),
                this
            );
            playbackItem.setPosition(cc.p(540, y - 10));
            playbackItem.setScale(0.8);
            menu.addChild(playbackItem);
        }

        this._scrollView = cc.ScrollView.create(this._attackDetailsLayerFit.scrollViewSize, scrollViewLayer);
        this._scrollView.setPosition(this._attackDetailsLayerFit.scrollViewPoint);
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._scrollView.setTouchPriority(LAZY_LAYER_HANDLER_PRIORITY - 1);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);

        this._scrollView.setContentSize(cc.size(600, scrollViewHeight));
        this._scrollView.setContentOffset(this._scrollView.minContainerOffset());

    },

    _onClickDetails: function (index) {
        var that = this;
        return function () {
            cc.log("AttackDetailsLayer _onClickDetails: " + index);

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            var point = that._detailsItem[index].convertToWorldSpace(cc.p(200, 65));

            that._selectId = index;
            that._skyDialog.show(point);
        }
    },

    _onClickClose: function () {
        cc.log("AttackDetailsLayer _onClickClose");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this.removeFromParent();
    },

    _onClickPlayback: function (index) {
        var that = this;
        return function () {
            cc.log("AttackDetailsLayer _onClickPlayback: " + index);

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            var details = that._detailsList[index];

            if (details) {
                gameData.message.playback(details.battleLogId);
            } else {
                TipLayer.tip("找不到该战报");
            }
        }
    },

    _onClickDetail: function () {
        cc.log("AttackDetailsLayer _onClickDetail: " + this._selectId);

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var details = this._detailsList[this._selectId];

        if (details) {
            gameData.player.playerDetail(function (data) {
                cc.log(data);

                LineUpDetail.pop(data);
            }, details.playerId);
        } else {
            TipLayer.tip("找不到该玩家");
        }
    },

    _onClickSendMessage: function () {
        cc.log("AttackDetailsLayer _onClickSendMessage: " + this._selectId);

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var details = this._detailsList[this._selectId];

        if (details) {
            SendMessageLayer.pop(details.playerId, details.attacker);
        } else {
            TipLayer.tip("找不到该玩家");
        }
    }
});

AttackDetailsLayer.create = function (bossId) {
    cc.log("AttackDetailsLayer create");

    var ref = new AttackDetailsLayer();
    if (ref && ref.init(bossId)) {
        return ref;
    }

    return null;
};

AttackDetailsLayer.pop = function (bossId) {
    cc.log("AttackDetailsLayer pop");

    var attackDetailsLayer = AttackDetailsLayer.create(bossId);

    MainScene.getInstance().getLayer().addChild(attackDetailsLayer, 10);
};