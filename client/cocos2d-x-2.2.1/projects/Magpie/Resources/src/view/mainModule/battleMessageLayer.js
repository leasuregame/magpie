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


var winResultTips = [
    "被你连环鞭尸啦",
    "连根脚毛都没碰到",
    "真是有眼不识泰山啊",
    "被你的实力深深的折服",
    "也不看看对手是谁呀"
];

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

        var scrollViewHeight = len * 127;
        if (scrollViewHeight < this._battleMessageLayerFit.scrollViewHeight) {
            scrollViewHeight = this._battleMessageLayerFit.scrollViewHeight;
        }

        for (var i = 0; i < len; ++i) {
            var y = scrollViewHeight - 127 - 127 * i;
            var message = battleMessageList[i];

            var msgBgLabel = cc.Sprite.create(main_scene_image.icon449);
            msgBgLabel.setAnchorPoint(cc.p(0, 0));
            msgBgLabel.setPosition(cc.p(0, y));
            scrollViewLayer.addChild(msgBgLabel);

            var battleIcon = cc.Sprite.create(main_scene_image.icon450);
            battleIcon.setAnchorPoint(cc.p(0, 0.5));
            battleIcon.setPosition(cc.p(10, 57));
            msgBgLabel.addChild(battleIcon);

            var nameIcon = cc.Scale9Sprite.create(main_scene_image.icon29);
            nameIcon.setContentSize(cc.size(200, 30));
            nameIcon.setAnchorPoint(cc.p(0, 0.5));
            nameIcon.setPosition(cc.p(115, 85));
            msgBgLabel.addChild(nameIcon);

            var nameLabel = cc.LabelTTF.create(message.defier, "STHeitiTC-Medium", 22);
            nameLabel.setAnchorPoint(cc.p(0, 0.5));
            nameLabel.setPosition(cc.p(130, 85));
            msgBgLabel.addChild(nameLabel);

            var desc = "";
            var url = "icon453";

            if (!message.isWin) {
                url = "icon454";
                desc = "在竞技场战胜了你";
            } else {
                desc = "在竞技场挑战了你";
            }

            var descLabel1 = cc.LabelTTF.create(desc, "STHeitiTC-Medium", 22);
            descLabel1.setAnchorPoint(cc.p(0, 0.5));
            descLabel1.setPosition(cc.p(120, 52));
            descLabel1.setColor(cc.c3b(138, 85, 23));
            msgBgLabel.addChild(descLabel1);

            var descLabel2 = null;

            if (message.isWin) {
                var id = parseInt(Math.random() * winResultTips.length);
                descLabel2 = cc.LabelTTF.create(winResultTips[id], "STHeitiTC-Medium", 22);
                descLabel2.setColor(cc.c3b(36, 117, 20));
                descLabel2.setAnchorPoint(cc.p(0, 0.5));
                descLabel2.setPosition(cc.p(120, 22));
            } else {
                if (message.rank) {
                    descLabel2 = ColorLabelTTF.create(
                        {
                            string: "你的排名降至",
                            fontName: "STHeitiTC-Medium",
                            fontSize: 22,
                            color: cc.c3b(123, 61, 56)
                        },
                        {
                            string: message.rank,
                            fontName: "STHeitiTC-Medium",
                            fontSize: 22,
                            color: cc.c3b(255, 29, 29)
                        }

                    );
                }
                descLabel2.setAnchorPoint(cc.p(0, 0));
                descLabel2.setPosition(cc.p(120, 22));
            }

            msgBgLabel.addChild(descLabel2);

            var resultIcon = cc.Sprite.create(main_scene_image[url]);
            resultIcon.setVisible(cc.p(0, 0.5));
            resultIcon.setPosition(cc.p(350, 82));
            msgBgLabel.addChild(resultIcon);

            var timeLabel = cc.LabelTTF.create(
                lz.getTimeStr({
                    time: message.createTime,
                    fmt: "yyyy.MM.dd hh:mm"
                }),
                "STHeitiTC-Medium",
                16
            );
            timeLabel.setAnchorPoint(cc.p(1, 0));
            timeLabel.setPosition(cc.p(580, y + 13));
            timeLabel.setColor(cc.c3b(138, 85, 23));
            scrollViewLayer.addChild(timeLabel);

            var playbackItem = cc.MenuItemImage.createWithIcon(
                main_scene_image.button9,
                main_scene_image.button9s,
                main_scene_image.icon135,
                this._onClickPlayback(message.battleLogId),
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