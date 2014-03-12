/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-8-28
 * Time: 下午6:43
 * To change this template use File | Settings | File Templates.
 */


/*
 * battle message layer
 * */


var BattleMessageLayer = cc.Layer.extend({
    _battleMessageLayerFit: null,

    _scrollView: null,

    onEnter: function () {
        cc.log("BattleMessageLayer onEnter");

        this._super();
        this.update();

        lz.um.beginLogPageView("战斗消息界面");
    },

    onExit: function () {
        cc.log("BattleMessageLayer onExit");

        this._super();

        lz.um.endLogPageView("战斗消息界面");
    },

    init: function () {
        cc.log("BattleMessageLayer init");

        if (!this._super()) return false;
        this._battleMessageLayerFit = gameFit.mainScene.battleMessageLayer;

        return true;
    },

    update: function () {
        cc.log("BattleMessageLayer update");

        var battleMessageList = gameData.message.get("battleMessage");

        cc.log(battleMessageList);

        var len = battleMessageList.length;

        if (this._scrollView != null) {
            this._scrollView.removeFromParent();
        }

        var scrollViewLayer = MarkLayer.create(this._battleMessageLayerFit.scrollViewLayerRect);
        var menu = LazyMenu.create();
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu, 1);

        var scrollViewHeight = len * 127 - 20;
        if (scrollViewHeight < this._battleMessageLayerFit.scrollViewHeight) {
            scrollViewHeight = this._battleMessageLayerFit.scrollViewHeight;
        }

        for (var i = 0; i < len; ++i) {
            var y = scrollViewHeight - 107 - 127 * i;

            var msgBgSprite = cc.Sprite.create(main_scene_image.icon127);
            msgBgSprite.setAnchorPoint(cc.p(0, 0));
            msgBgSprite.setPosition(cc.p(0, y));
            scrollViewLayer.addChild(msgBgSprite);

            var msgLabel = cc.LabelTTF.create(battleMessageList[i].content, "STHeitiTC-Medium", 22);
            msgLabel.setAnchorPoint(cc.p(0, 0.5));
            msgLabel.setPosition(cc.p(20, y + 60));
            scrollViewLayer.addChild(msgLabel);

            var timeLabel = cc.LabelTTF.create(
                lz.getTimeStr({
                    time: battleMessageList[i].createTime,
                    fmt: "yyyy.MM.dd hh:mm"
                }),
                "STHeitiTC-Medium",
                16
            );
            timeLabel.setAnchorPoint(cc.p(1, 0));
            timeLabel.setPosition(cc.p(580, y + 13));
            scrollViewLayer.addChild(timeLabel);

            var playbackItem = cc.MenuItemImage.createWithIcon(
                main_scene_image.button9,
                main_scene_image.button9s,
                main_scene_image.icon135,
                this._onClickPlayback(battleMessageList[i].options.battleLogId),
                this
            );
            playbackItem.setPosition(cc.p(520, y + 62));
            menu.addChild(playbackItem);
        }

        this._scrollView = cc.ScrollView.create(this._battleMessageLayerFit.scrollViewSize, scrollViewLayer);
        this._scrollView.setPosition(this._battleMessageLayerFit.scrollViewPoint);
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);

        this._scrollView.setContentSize(cc.size(640, scrollViewHeight));
        this._scrollView.setContentOffset(cc.p(0, this._scrollView.minContainerOffset().y));
    },

    _onClickPlayback: function (id) {
        return function () {
            cc.log("BattleMessageLayer onClickPlayback: " + id);

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            gameData.message.playback(id);
        }
    }
});


BattleMessageLayer.create = function () {
    var ret = new BattleMessageLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};