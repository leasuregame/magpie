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
    _scrollView: null,

    onEnter: function () {
        cc.log("BattleMessageLayer onEnter");

        this._super();
        this.update();
    },

    init: function () {
        cc.log("BattleMessageLayer init");

        if (!this._super()) return false;

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

        var scrollViewLayer = MarkLayer.create(cc.rect(57, 207, 605, 742));
        var menu = LazyMenu.create();
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu, 1);

        var scrollViewHeight = len * 127 - 20;
        if (scrollViewHeight < 742) {
            scrollViewHeight = 742;
        }

        for (var i = 0; i < len; ++i) {
            var y = scrollViewHeight - 107 - 127 * i;

            var msgBgSprite = cc.Sprite.create(main_scene_image.icon127);
            msgBgSprite.setAnchorPoint(cc.p(0, 0));
            msgBgSprite.setPosition(cc.p(0, y));
            scrollViewLayer.addChild(msgBgSprite);

            var msgLabel = cc.LabelTTF.create(battleMessageList[i].content, "黑体", 22);
            msgLabel.setAnchorPoint(cc.p(0, 0.5));
            msgLabel.setPosition(cc.p(20, y + 60));
            scrollViewLayer.addChild(msgLabel);

            var timeLabel = cc.LabelTTF.create(this._getTimeStr(battleMessageList[i].createTime), "黑体", 16);
            timeLabel.setAnchorPoint(cc.p(1, 0));
            timeLabel.setPosition(cc.p(580, y + 13));
            scrollViewLayer.addChild(timeLabel);

            var playbackItem = cc.MenuItemImage.create(
                main_scene_image.button20,
                main_scene_image.button20s,
                this._onClickPlayback(battleMessageList[i].id),
                this
            );
            playbackItem.setPosition(cc.p(530, y + 60));
            menu.addChild(playbackItem);

            var playbackIcon = cc.Sprite.create(main_scene_image.icon135);
            playbackIcon.setPosition(cc.p(530, y + 60));
            scrollViewLayer.addChild(playbackIcon, 1);

        }

        this._scrollView = cc.ScrollView.create(cc.size(605, 742), scrollViewLayer);
        this._scrollView.setPosition(cc.p(57, 207));
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);

        this._scrollView.setContentSize(cc.size(640, scrollViewHeight));
        this._scrollView.setContentOffset(cc.p(0, this._scrollView.minContainerOffset().y));
    },

    _onClickPlayback: function (id) {
        return function () {
            cc.log("BattleMessageLayer onClickPlayback: " + id);

            gameData.message.playback(id);
        }
    },

    _getTimeStr: function (time) {
        cc.log("BattleMessageLayer _getTimeStr");

        var date = new Date(time);
        var today = new Date();
        var timeStr = "";

        if (today.toDateString() === date.toDateString()) {
            timeStr = date.getHours() + " : " + date.getMinutes() + " : " + date.getSeconds();
        } else {
            timeStr = date.getFullYear() + " . " + date.getMonth() + " . " + date.getDay();
        }

        return timeStr;
    }
});


BattleMessageLayer.create = function () {
    var ret = new BattleMessageLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};