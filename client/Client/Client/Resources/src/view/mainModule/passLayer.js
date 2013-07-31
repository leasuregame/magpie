/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-20
 * Time: 下午4:21
 * To change this template use File | Settings | File Templates.
 */


/*
 * pass layer
 * */


var PassLayer = cc.Layer.extend({
    _scrollView: null,
    _cardSprite: null,
    _towerSprite: null,
    _skillPointLabel: null,
    _skillPointObtainLabel: null,
    _expObtainLabel: null,
    _moneyObtainLabel: null,
    _passLabelList: [],
    _ladderList: [],
    _nowPassTop: 0,

    onEnter: function () {
        cc.log("PassLayer onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("PassLayer init");

        if (!this._super()) return false;

        this._nowPassTop = gameData.pass.get("passTop");

        var bgSprite = cc.Sprite.create(main_scene_image.bg5);
        bgSprite.setAnchorPoint(cc.p(0, 0));
        bgSprite.setPosition(GAME_BG_POINT);
        this.addChild(bgSprite);

        var scrollViewLayer = MarkLayer.create(cc.rect(100, 200, 330, 750));
        var menu = LazyMenu.create();
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu);

        for (var i = 1; i <= MAX_PASS_COUNT; ++i) {
            var passLabel = PassLabel.create(i);
            passLabel.setPosition(cc.p(20 + (i - 1) % 2 * 140, 20 + 185 * (i - 1)));
            scrollViewLayer.addChild(passLabel);

            if (i > 1) {
                var ladderSprite = cc.Sprite.create(main_scene_image["ladder" + ((i) % 2 + 1)]);
                ladderSprite.setAnchorPoint(cc.p(0, 0));
                ladderSprite.setPosition(cc.p(80, 110 + 185 * (i - 2)));
                if (i > this._nowPassTop + 1) {
                    ladderSprite.setVisible(false);
                }
                scrollViewLayer.addChild(ladderSprite);
                this._ladderList[i] = ladderSprite;
            }

            var numLabel = cc.LabelTTF.create("第" + i + "关", "Marker Felt", 25);
            numLabel.setAnchorPoint(cc.p(0, 0));
            numLabel.setPosition(cc.p((i - 1) % 2 * 240, 20 + 185 * (i - 1)));
            scrollViewLayer.addChild(numLabel);
        }

        this._cardSprite = cc.Sprite.create(main_scene_image.card0);
        this._cardSprite.setAnchorPoint(cc.p(0, 0));
        this._cardSprite.setPosition(this._getCardLocation(this._nowPassTop));
        if (this._nowPassTop < 1) {
            this._cardSprite.setVisible(false);
        }
        scrollViewLayer.addChild(this._cardSprite, 1);

        this._scrollView = cc.ScrollView.create(cc.size(330, 750), scrollViewLayer);
        this._scrollView.setContentSize(cc.size(300, 18620));
        this._scrollView.setPosition(cc.p(100, 200));
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);
        this._locate(this._nowPassTop);

        var tipLabel = cc.Sprite.create(main_scene_image.bg6);
        tipLabel.setAnchorPoint(cc.p(0, 0));
        tipLabel.setPosition(cc.p(GAME_HORIZONTAL_LACUNA, 873));
        this.addChild(tipLabel);

        var wipeOutItem = cc.MenuItemImage.create(main_scene_image.button9, main_scene_image.button9s, this._onClickWipeOut, this);
        wipeOutItem.setPosition(cc.p(543, 34));
        var wipeOutMenu = cc.Menu.create(wipeOutItem);
        wipeOutMenu.setPosition(cc.p(0, 0));
        tipLabel.addChild(wipeOutMenu);

        var iconSprite = cc.Sprite.create(main_scene_image.icon15);
        iconSprite.setPosition(cc.p(543, 34));
        tipLabel.addChild(iconSprite);

        var towerBgSprite = cc.Sprite.create(main_scene_image.tower1);
        towerBgSprite.setAnchorPoint(cc.p(0, 0));
        towerBgSprite.setPosition(cc.p(530, 260));
        this.addChild(towerBgSprite);

        var len = this._nowPassTop / MAX_PASS_COUNT * 209;
        this._towerSprite = cc.Sprite.create(main_scene_image.tower2, cc.rect(0, 209 - len, 94, len));
        this._towerSprite.setAnchorPoint(cc.p(0, 0));
        this._towerSprite.setPosition(cc.p(530, 260));
        this.addChild(this._towerSprite);

        return true;
    },

    update: function () {
        cc.log("PassLayer update");

        var passTop = gameData.pass.get("passTop");

        if (passTop != this._nowPassTop) {
            this._nowPassTop = passTop;

            this._locate(this._nowPassTop);

            var len = this._nowPassTop / MAX_PASS_COUNT * 209;
            this._towerSprite.setTextureRect(cc.rect(0, 209 - len * 209, 94, len));

            for (var i = 2; i <= MAX_PASS_COUNT; ++i) {
                if (i <= this._nowPassTop) {
                    this._ladderList[i].setVisible(true);
                } else {
                    this._ladderList[i].setVisible(false);
                }
            }
            this._defianceAnimation();
        }

    },

    _getOffset: function (index) {
        cc.log("PassLayer _getOffset");

        var len = 140 - 185 * (index - 1);

        len = len < 0 ? len : 0;
        len = len > -17870 ? len : -17870;

        return cc.p(0, len);
    },

    _locate: function (index, duration) {
        cc.log("PassLayer _locate");

        var offsetPoint = this._getOffset(index);

        if (duration) {
            var oldOffsetPoint = this._scrollView.getContentOffset();
            var nowOffsetPoint = cc.p(offsetPoint.x - oldOffsetPoint.x, offsetPoint.y - oldOffsetPoint.y);

            this._scrollView.setContentOffsetInDuration(offsetPoint, duration);
        } else {
            this._scrollView.setContentOffset(offsetPoint);
        }
    },

    _getCardLocation: function (index) {
        cc.log("PassLayer _getCardLocation");


        return cc.p(50 + (index - 1) % 2 * 140, 80 + 185 * (index - 1));
    },

    _cardWalk: function (index, duration) {
        cc.log("PassLayer _cardWalk");

        duration = duration || 2;

        var lowIndex = index > 1 ? index - 1 : 1;

        this._cardSprite.setPosition(this._getCardLocation(lowIndex));
        this._cardSprite.setVisible(true);

        var jumpAction = cc.JumpTo.create(duration, this._getCardLocation(index), 20, 5);
        this._cardSprite.runAction(jumpAction);

        this._locate(index, duration);
    },

    _showLadder: function (index) {
        cc.log("PassLayer _showLadder");

        var ladderSprite = this._ladderList[index];

        ladderSprite.stopAllActions();

        var showAction = cc.Show.create();
        var fadeInAction = cc.FadeIn.create(1.5);
        var blinkAction = cc.Blink.create(1, 3);
        var action = cc.Sequence.create(showAction, fadeInAction, blinkAction);
        ladderSprite.runAction(action);
    },

    _defianceAnimation: function () {
        cc.log("PassLayer _defianceAnimation");

        LazyLayer.showCloudLayer();

        this._cardWalk(this._nowPassTop);

        if(this._nowPassTop == 100) {
            this.scheduleOnce(function () {
                LazyLayer.closeCloudLayer();
            }, 2);
            return;
        }

        this.scheduleOnce(function () {
            this._showLadder(this._nowPassTop + 1);
        }, 2);
        this.scheduleOnce(function () {
            LazyLayer.closeCloudLayer();
        }, 4.5);
    },

    _wipeOutAnimation: function () {
        cc.log("PassLayer _wipeOutAnimation");

        LazyLayer.showCloudLayer();

        this._locate(1);

        this._cardWalk(1, 0.3);
        var index = 2;
        this.schedule(function () {
            if (index > this._nowPassTop) {
                LazyLayer.closeCloudLayer();
                return;
            }

            this._cardWalk(index, 0.3);
            index += 1;
        }, 0.4, this._nowPassTop);
    },

    _onClickWipeOut: function () {
        cc.log("PassLayer _onClickWipeOut");

        this._wipeOutAnimation();
        gameData.pass.wipeOut(function (data) {
            cc.log(data);
        });
    }
})

PassLayer.create = function () {
    var ret = new PassLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
}