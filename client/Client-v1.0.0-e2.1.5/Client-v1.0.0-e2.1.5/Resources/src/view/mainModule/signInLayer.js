/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-9-6
 * Time: 下午4:23
 * To change this template use File | Settings | File Templates.
 */


/*
 * sign in layer
 * */


var rewardGoodsUrl = {
    power: "icon106",
    money: "icon108",
    energy: "icon110",
    skillPoint: "icon109",
    elixir: "icon107",
    lottery_free_count: "icon182",
    spirit: "icon111",
    gold: "icon112",
    card: "icon146"
};

var SignInLayer = LazyLayer.extend({
    _turnLeftItem: null,
    _turnRightItem: null,
    _scrollView: null,
    _montyLabel: [],
    _elementList: null,
    _signInCountLabel: null,
    _signInItem: null,
    _remedySignInItem: null,
    _index: 0,

    onEnter: function () {
        cc.log("SignInLayer onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("SignInLayer init");

        if (!this._super()) return false;

        this._index = 0;

        var bgSprite = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgSprite.setContentSize(cc.size(600, 720));
        bgSprite.setPosition(cc.p(362, 565));
        this.addChild(bgSprite);

        var titleLabel = cc.Sprite.create(main_scene_image.icon187);
        titleLabel.setPosition(cc.p(360, 885));
        this.addChild(titleLabel);

//        var closeItem = cc.MenuItemImage.create(
//            main_scene_image.button37,
//            main_scene_image.button37s,
//            this._onClickClose,
//            this
//        );
//        closeItem.setPosition(cc.p(645, 940));

        this._turnLeftItem = cc.MenuItemImage.create(
            main_scene_image.icon37,
            main_scene_image.icon37,
            this._onClickTurnLeft,
            this
        );
        this._turnLeftItem.setRotation(180);
        this._turnLeftItem.setScale(0.8);
        this._turnLeftItem.setPosition(cc.p(87, 680));

        this._turnRightItem = cc.MenuItemImage.create(
            main_scene_image.icon37,
            main_scene_image.icon37,
            this._onClickTurnRight,
            this
        );
        this._turnRightItem.setScale(0.8);
        this._turnRightItem.setPosition(cc.p(631, 680));

        this._signInItem = cc.MenuItemImage.create(
            main_scene_image.button10,
            main_scene_image.button10s,
            main_scene_image.button9d,
            this._onClickSignIn,
            this
        );
        this._signInItem.setScale(0.8);
        this._signInItem.setPosition(cc.p(560, 455));

        this._remedySignInItem = cc.MenuItemImage.create(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            this._onClickRemedySignIn,
            this
        );
        this._remedySignInItem.setScale(0.8);
        this._remedySignInItem.setPosition(cc.p(435, 455));

        var specialOfferIcon = cc.LayerColor.create(cc.c4b(66, 31, 28, 255), 108, 30);
        specialOfferIcon.setPosition(cc.p(380, 403));
        this.addChild(specialOfferIcon);

        var sprite = cc.Sprite.create(main_scene_image.icon148);
        sprite.setScale(0.7);
        sprite.setPosition(cc.p(405, 418));
        this.addChild(sprite);

        var spend = cc.LabelTTF.create('20/次', "STHeitiTC-Medium", 20);
        spend.setPosition(cc.p(448, 418));
        this.addChild(spend);

        var menu = cc.Menu.create(
//            closeItem,
            this._turnLeftItem,
            this._turnRightItem,
            this._signInItem,
            this._remedySignInItem
        );
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        var signInIcon = cc.Sprite.create(main_scene_image.icon183);
        signInIcon.setPosition(cc.p(560, 455));
        this.addChild(signInIcon);

        var remedySignInIcon = cc.Sprite.create(main_scene_image.icon184);
        remedySignInIcon.setPosition(cc.p(435, 455));
        this.addChild(remedySignInIcon);

        var scrollViewLayer = MarkLayer.create(cc.rect(105, 510, 510, 366));

        this._montyLabel = [];
        for (var i = 0; i < MAX_SIGN_IN_HISTORY; ++i) {
            var monthLabel = MonthLabel.create(i);
            monthLabel.setPosition(cc.p((MAX_SIGN_IN_HISTORY - i - 1) * 510, 0));
            scrollViewLayer.addChild(monthLabel);

            this._montyLabel[i] = monthLabel;
        }

        this._scrollView = cc.ScrollView.create(cc.size(510, 366), scrollViewLayer);
        this._scrollView.setTouchPriority(-300);
        this._scrollView.setPosition(cc.p(105, 490));
        this._scrollView.setBounceable(false);
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_HORIZONTAL);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);

        this._scrollView.setContentSize(cc.size(MAX_SIGN_IN_HISTORY * 510, 366));
        this._scrollView.setContentOffset(this._scrollView.minContainerOffset());

        var signInCountIcon = cc.Sprite.create(main_scene_image.icon188);
        signInCountIcon.setPosition(cc.p(235, 455));
        this.addChild(signInCountIcon);

        this._signInCountLabel = cc.LabelTTF.create(0, "STHeitiTC-Medium", 20);
        this._signInCountLabel.setPosition(cc.p(330, 455));
        this.addChild(this._signInCountLabel);

        var rewardList = gameData.signIn.getRewardList();
        var len = rewardList.length;

        this._elementList = [];

        for (var i = 0; i < len; ++i) {
            var point = cc.p(160 + 100 * i, 370);

            var rewardItem = cc.MenuItemImage.create(
                main_scene_image.button40,
                main_scene_image.button40s,
                main_scene_image.button40d,
                this._onClickReceiveReward(i),
                this
            );
            rewardItem.setPosition(point);
            menu.addChild(rewardItem);

            var rewardIcon = cc.Sprite.create(main_scene_image["icon" + (189 + i)]);
            rewardIcon.setPosition(point);
            this.addChild(rewardIcon);

            var readyRewardItem = cc.MenuItemImage.createWithIcon(
                main_scene_image.button61,
                main_scene_image.button61s,
                main_scene_image.icon274,
                this._onClickReceiveReward(i),
                this
            );
            readyRewardItem.setPosition(point);
            menu.addChild(readyRewardItem);
            readyRewardItem.setVisible(false);

//            var readyRewardIcon = cc.Sprite.create(main_scene_image.icon274);
//            readyRewardIcon.setPosition(point);
//            this.addChild(readyRewardIcon);
//            readyRewardIcon.setVisible(false);

            var alreadyRewardIcon = cc.Sprite.create(main_scene_image.icon194);
            alreadyRewardIcon.setPosition(point);
            this.addChild(alreadyRewardIcon);
            alreadyRewardIcon.setVisible(false);

            var rewardLabel = cc.Node.create();
            rewardLabel.setPosition(cc.p(360, 290));
            this.addChild(rewardLabel);
            rewardLabel.setVisible(i == 0);

            var rewardBgSprite = cc.Scale9Sprite.create(main_scene_image.icon185);
            rewardBgSprite.setContentSize(cc.size(512, 96));
            rewardLabel.addChild(rewardBgSprite);

            var offset = cc.p(-209, 0);
            for (var key in rewardList[i]) {
                if (rewardGoodsUrl[key] != undefined && rewardList[i][key] > 0) {
                    var goodsSprite = cc.Sprite.create(main_scene_image[rewardGoodsUrl[key]]);
                    goodsSprite.setPosition(offset);
                    rewardLabel.addChild(goodsSprite);

                    var valueLabel = cc.LabelTTF.create("+" + rewardList[i][key], "STHeitiTC-Medium", 16);
                    valueLabel.setAnchorPoint(cc.p(1, 0));
                    valueLabel.setPosition(cc.p(offset.x + 31, offset.y - 33));
                    rewardLabel.addChild(valueLabel);

                    offset.x += 84;
                }
            }

            this._elementList[i] = {
                rewardItem: rewardItem,
                rewardIcon: rewardIcon,
                readyRewardItem: readyRewardItem,
                alreadyRewardIcon:alreadyRewardIcon,
                rewardLabel: rewardLabel
            };

        }

        return true;
    },

    update: function () {
        cc.log("SignInLayer update");

        var signIn = gameData.signIn;

        var offset = this._scrollView.minContainerOffset();
        offset.x += this._index * 510;
        this._scrollView.setContentOffset(offset, true);

        this._montyLabel[this._index].update();

        this._turnRightItem.setVisible(this._index != 0);
        this._turnLeftItem.setVisible(this._index != MAX_SIGN_IN_HISTORY - 1);

        this._signInItem.setEnabled(signIn.canSignIn(this._index));
        this._remedySignInItem.setEnabled(signIn.canRemedySignIn(this._index));

        var monthMark = signIn.getMonthMark(this._index);
        var count = monthMark.count;

        this._signInCountLabel.setString(count);

        for (var i = 0; i < 5; ++i) {
            var visible = signIn.canReceive(this._index, i);
            this._elementList[i].rewardIcon.setVisible(visible);
            this._elementList[i].alreadyRewardIcon.setVisible(!visible);

            var monthMark = gameData.signIn.getMonthMark(0);
            var table = outputTables.signIn_rewards.rows[i + 1];
            var count = table.count != -1 ? table.count : monthMark.days;
            if(monthMark.count >= count) {
                this._elementList[i].readyRewardItem.setVisible(visible);
                this._elementList[i].rewardIcon.setVisible(!visible);
                this._elementList[i].alreadyRewardIcon.setVisible(!visible);
                this._elementList[i].rewardItem.setVisible(!visible);
            }
        }


    },

    _onClickClose: function () {
        cc.log("SignInLayer _onClickClose");

        this.removeFromParent();
    },

    _onClickSignIn: function () {
        cc.log("SignInLayer _onClickSignIn");

        var that = this;
        gameData.signIn.signIn(function (data) {
            cc.log(data);

            that.update();

            lz.tipReward(data);
        });
    },

    _onClickRemedySignIn: function () {
        cc.log("SignInLayer _onClickRemedySignIn");

        var that = this;
        gameData.signIn.remedySignIn(function (data) {
            cc.log(data);

            that.update();

            lz.tipReward(data);
        });
    },

    _onClickReceiveReward: function (id) {
        return function () {
            cc.log("SignInLayer _onClickReward: " + id);

            var len = this._elementList.length;
            for (var i = 0; i < len; ++i) {
                var element = this._elementList[i];
                element.rewardItem.setEnabled(i != id);
                element.rewardLabel.setVisible(i == id);
            }
            var signIn = gameData.signIn;

            if (this._index == 0) {
                var monthMark = gameData.signIn.getMonthMark(0);
                var table = outputTables.signIn_rewards.rows[id + 1];
                var count = table.count != -1 ? table.count : monthMark.days;

                if (monthMark.count >= count && signIn.canReceive(this._index, id)) {
                    var that = this;
                    signIn.receiveReward(function (data) {
                        cc.log(data);

                        that.update();

                        lz.tipReward(data);
                    }, id + 1);
                }
            }
        }
    },

    _onClickTurnLeft: function () {
        cc.log("SignInLayer _onClickTurnLeft");

        this._index = Math.min(this._index + 1, MAX_SIGN_IN_HISTORY - 1);
        this.update();
    },

    _onClickTurnRight: function () {
        cc.log("SignInLayer _onClickTurnRight");

        this._index = Math.max(this._index - 1, 0);
        this.update();
    },

    /**
     * callback when a touch event finished
     * @param {cc.Touch} touch
     * @param {event} event
     */
    onTouchEnded: function (touch, event) {
        cc.log("SignInLayer onTouchEnded");

        this._scrollView.unscheduleAllCallbacks();
        this._scrollView.stopAllActions();

        var beganOffset = this._scrollView.minContainerOffset();
        var endOffset = this._scrollView.getContentOffset();
        beganOffset.x += this._index * 510;

        if (beganOffset.x - endOffset.x > 80) {
            this._index = MAX_SIGN_IN_HISTORY + Math.floor(endOffset.x / 510) - 1;
        } else if (beganOffset.x - endOffset.x < -80) {
            this._index = MAX_SIGN_IN_HISTORY + Math.ceil(endOffset.x / 510) - 1;
        }

        this.update();
    },

    /**
     * @param {cc.Touch} touch
     * @param {event} event
     */
    onTouchCancelled: function (touch, event) {
        cc.log("SignInLayer onTouchCancelled");

        this.onTouchEnded(touch, event);
    }
});


SignInLayer.create = function () {
    var ret = new SignInLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return ret;
};