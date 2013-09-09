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
    money: "icon108",
    energy: "icon110",
    skillPoint: "icon109",
    spirit: "icon111",
    lottery_free_count: "icon182",
    gold: "icon112"
};

var SignInLayer = LazyLayer.extend({
    _turnLeftItem: null,
    _turnRightItem: null,
    _scrollView: null,
    _thisMonty: null,
    _elementList: null,
    _signInCountLabel: null,
    _signInItem: null,
    _remedySignInItem: null,
    _page: 0,

    onEnter: function () {
        cc.log("SignInLayer onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("SignInLayer init");

        if (!this._super()) return false;

        var bgSprite = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgSprite.setContentSize(cc.size(600, 750));
        bgSprite.setPosition(cc.p(362, 580));
        this.addChild(bgSprite);

        var titleLabel = cc.Sprite.create(main_scene_image.icon187);
        titleLabel.setPosition(cc.p(360, 920));
        this.addChild(titleLabel);

        var closeItem = cc.MenuItemImage.create(
            main_scene_image.button37,
            main_scene_image.button37s,
            this._onClickClose,
            this
        );
        closeItem.setPosition(cc.p(645, 940));

        this._turnLeftItem = cc.MenuItemImage.create(
            main_scene_image.icon37,
            main_scene_image.icon37,
            this._onClickTurnLeft,
            this
        );
        this._turnLeftItem.setRotation(180);
        this._turnLeftItem.setScale(0.8);
        this._turnLeftItem.setPosition(cc.p(87, 700));

        this._turnRightItem = cc.MenuItemImage.create(
            main_scene_image.icon37,
            main_scene_image.icon37,
            this._onClickTurnRight,
            this
        );
        this._turnRightItem.setScale(0.8);
        this._turnRightItem.setPosition(cc.p(631, 700));

        this._signInItem = cc.MenuItemImage.create(
            main_scene_image.button41,
            main_scene_image.button41s,
            main_scene_image.button20d,
            this._onClickSignIn,
            this
        );
        this._signInItem.setPosition(cc.p(560, 470));

        this._remedySignInItem = cc.MenuItemImage.create(
            main_scene_image.button20,
            main_scene_image.button20s,
            main_scene_image.button20d,
            this._onClickRemedySignIn,
            this
        );
        this._remedySignInItem.setPosition(cc.p(435, 470));

        var menu = cc.Menu.create(
            closeItem,
            this._turnLeftItem,
            this._turnRightItem,
            this._signInItem,
            this._remedySignInItem
        );
        menu.setPosition(cc.p(0, 0));
        this.addChild(menu);

        var signInIcon = cc.Sprite.create(main_scene_image.icon183);
        signInIcon.setPosition(cc.p(560, 470));
        this.addChild(signInIcon);

        var remedySignInIcon = cc.Sprite.create(main_scene_image.icon184);
        remedySignInIcon.setPosition(cc.p(435, 470));
        this.addChild(remedySignInIcon);

        this.effectTest1(1, 0.1, cc.p(560, 470));
        this.effectTest1(2, 0.1, cc.p(435, 470));

        var scrollViewLayer = MarkLayer.create(cc.rect(105, 510, 510, 366));

        for (var i = 0; i < MAX_SIGN_IN_HISTORY; ++i) {
            var monthLabel = MonthLabel.create(i);
            monthLabel.setPosition(cc.p((MAX_SIGN_IN_HISTORY - i - 1) * 510, 0));
            scrollViewLayer.addChild(monthLabel);

            if (i == 0) this._thisMonty = monthLabel;
        }

        this._scrollView = cc.ScrollView.create(cc.size(510, 366), scrollViewLayer);
        this._scrollView.setTouchPriority(-300);
        this._scrollView.setPosition(cc.p(105, 510));
        this._scrollView.setBounceable(false);
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_HORIZONTAL);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);

        this._scrollView.setContentSize(cc.size(MAX_SIGN_IN_HISTORY * 510, 366));
        this._scrollView.setContentOffset(this._scrollView.minContainerOffset());

        var signInCountIcon = cc.Sprite.create(main_scene_image.icon188);
        signInCountIcon.setPosition(cc.p(235, 470));
        this.addChild(signInCountIcon);

        this._signInCountLabel = cc.LabelTTF.create(30, "黑体", 20);
        this._signInCountLabel.setPosition(cc.p(330, 470));
        this.addChild(this._signInCountLabel);

        var rewardList = gameData.signIn.getRewardList();
        var len = rewardList.length;

        this._elementList = [];

        for (var i = 0; i < len; ++i) {
            var point = cc.p(160 + 100 * i, 380);

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

            var alreadyRewardLabel = cc.Sprite.create(main_scene_image.icon194);
            alreadyRewardLabel.setPosition(point);
            this.addChild(alreadyRewardLabel);
            alreadyRewardLabel.setVisible(false);

            var rewardLabel = cc.Node.create();
            rewardLabel.setPosition(cc.p(360, 300));
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

                    var valueLabel = cc.LabelTTF.create("+" + rewardList[i][key], "黑体", 16);
                    valueLabel.setAnchorPoint(cc.p(1, 0));
                    valueLabel.setPosition(cc.p(offset.x + 31, offset.y - 33));
                    rewardLabel.addChild(valueLabel);

                    offset.x += 84;
                }
            }

            this._elementList[i] = {
                rewardItem: rewardItem,
                rewardIcon: rewardIcon,
                alreadyRewardLabel: alreadyRewardLabel,
                rewardLabel: rewardLabel
            };

            this.effectTest(i % 4, 0.1, point);
        }

        return true;
    },

    update: function () {
        cc.log("SignInLayer update");

        var signIn = gameData.signIn;

        var offset = this._scrollView.minContainerOffset();
        offset.x += this._page * 510;
        this._scrollView.setContentOffset(offset, true);

        this._turnRightItem.setVisible(this._page != 0);
        this._turnLeftItem.setVisible(this._page != MAX_SIGN_IN_HISTORY - 1);

        this._signInItem.setEnabled(signIn.canSignIn(this._page));
        this._remedySignInItem.setEnabled(signIn.canRemedySignIn(this._page));

        var monthMark = signIn.getMonthMark(this._page);
        var rewardCount = [5, 10, 18, 25, monthMark.days];
        var len = rewardCount.length;
        var count = monthMark.count;
        var isThisMonth = (this._page == 0);

        this._signInCountLabel.setString(count);

        for (var i = 0; i < len; ++i) {
            if (count < rewardCount[i]) {
                break;
            }

            if (!isThisMonth || !signIn.canReceive(i)) {
                this._elementList[i].rewardIcon.setVisible(false);
                this._elementList[i].alreadyRewardLabel.setVisible(true);
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
        });
    },

    _onClickRemedySignIn: function () {
        cc.log("SignInLayer _onClickRemedySignIn");


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

            if (this._page == 0) {
                var that = this;
                gameData.signIn.receiveReward(function (data) {
                    cc.log(data);

                    that.update();
                }, id + 1);
            }
        }
    },

    _onClickTurnLeft: function () {
        cc.log("SignInLayer _onClickTurnLeft");

        this._page = Math.min(this._page + 1, MAX_SIGN_IN_HISTORY - 1);
        this.update();
    },

    _onClickTurnRight: function () {
        cc.log("SignInLayer _onClickTurnRight");

        this._page = Math.max(this._page - 1, 0);
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
        beganOffset.x += this._page * 510;

        if (beganOffset.x - endOffset.x > 80) {
            this._page = MAX_SIGN_IN_HISTORY + Math.floor(endOffset.x / 510) - 1;
        } else if (beganOffset.x - endOffset.x < -80) {
            this._page = MAX_SIGN_IN_HISTORY + Math.ceil(endOffset.x / 510) - 1;
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
    },

    effectTest: function (id, time, point) {
        cc.log("LotteryLayer update");

        var frames = [];

        for (var i = 0; i < effectConfig[id]; ++i) {
            var frame = cc.SpriteFrame.create(
                main_scene_image["effect" + id + "_frame" + i],
                cc.rect(0, 0, 124, 60)
            );

            frames.push(frame);
        }

        var animation = cc.Animation.create(frames, time);
        var animate = cc.Animate.create(animation);

        var testSprite = cc.Sprite.createWithSpriteFrame(frames[0]);
        testSprite.setPosition(point);
        this.addChild(testSprite);
        testSprite.setScaleX(0.85);

        testSprite.runAction(cc.RepeatForever.create(animate));
    },

    effectTest1: function (id, time, point) {
        cc.log("LotteryLayer update");

        var frames = [];

        for (var i = 0; i < effectConfig[id]; ++i) {
            var frame = cc.SpriteFrame.create(
                main_scene_image["effect" + id + "_frame" + i],
                cc.rect(0, 0, 124, 60)
            );

            frames.push(frame);
        }

        var animation = cc.Animation.create(frames, time);
        var animate = cc.Animate.create(animation);

        var testSprite = cc.Sprite.createWithSpriteFrame(frames[0]);
        testSprite.setPosition(point);
        this.addChild(testSprite);

        testSprite.runAction(cc.RepeatForever.create(animate));
    }
});


SignInLayer.create = function () {
    var ret = new SignInLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return ret;
};