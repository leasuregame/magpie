/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-10-29
 * Time: 下午5:21
 * To change this template use File | Settings | File Templates.
 */

var GoldRewardLayer = cc.Layer.extend({
    _goldRewardLayerFit: null,

    _scrollView: null,
    _scrollViewElement: {},

    onEnter: function () {
        cc.log("GoldRewardLayer onEnter");

        this._super();
        this.update();

        lz.um.beginLogPageView("冲级奖励界面");
    },

    onExit: function () {
        cc.log("GoldRewardLayer onExit");

        this._super();

        lz.um.endLogPageView("冲级奖励界面");
    },

    init: function () {
        cc.log("GoldRewardLayer init");

        if (!this._super()) return false;
        this._goldRewardLayerFit = gameFit.mainScene.goldRewardLayer;

        var lineIcon = cc.Sprite.create(main_scene_image.icon18);
        lineIcon.setAnchorPoint(cc.p(0, 0));
        lineIcon.setPosition(this._goldRewardLayerFit.lineIconPoint);
        this.addChild(lineIcon);

        var headIcon = cc.Sprite.create(main_scene_image.icon271);
        headIcon.setAnchorPoint(cc.p(0, 0));
        headIcon.setPosition(this._goldRewardLayerFit.headIconPoint);
        this.addChild(headIcon);

        return true;
    },

    update: function () {
        cc.log("GoldRewardLayer update");

        if (this._scrollView != null) {
            this._scrollView.removeFromParent();
        }

        var scrollViewLayer = MarkLayer.create(this._goldRewardLayerFit.scrollViewLayerRect);
        var menu = LazyMenu.create();
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu, 1);

        //读配置表
        var goldRewards = gameData.activity.get("goldRewardList");
        var len = goldRewards.length;

        var scrollViewHeight = len * 135;
        if (scrollViewHeight < this._goldRewardLayerFit.scrollViewHeight) {
            scrollViewHeight = this._goldRewardLayerFit.scrollViewHeight;
        }

        this._scrollView = cc.ScrollView.create(this._goldRewardLayerFit.scrollViewSize, scrollViewLayer);
        this._scrollView.setPosition(this._goldRewardLayerFit.scrollViewPoint);
        this._scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this._scrollView.updateInset();
        this.addChild(this._scrollView);

        var playerLv = gameData.player.get('lv');
        var currentId = -1;

        for (var i = 0; i < len; ++i) {

            var y = scrollViewHeight - 135 - i * 135;
            var bgSprite = cc.Sprite.create(main_scene_image.button15);
            bgSprite.setAnchorPoint(cc.p(0, 0));
            bgSprite.setPosition(cc.p(20, y));
            bgSprite.setContentSize(cc.size(600, 135));
            scrollViewLayer.addChild(bgSprite);

            var iconSprite = cc.Sprite.create(main_scene_image.icon272);
            iconSprite.setAnchorPoint(cc.p(0, 0));
            iconSprite.setPosition(cc.p(40, y + 20));
            scrollViewLayer.addChild(iconSprite);

            var text = cc.LabelTTF.create('角色等级' + goldRewards[i].lv + '级', "STHeitiTC-Medium", 20);
            text.setAnchorPoint(cc.p(0, 0));
            text.setPosition(cc.p(160, y + 80));
            text.setColor(cc.c3b(97, 11, 9));
            scrollViewLayer.addChild(text);

            var goldIcon = cc.Sprite.create(main_scene_image[gameGoodsIcon["gold"]]);
            goldIcon.setAnchorPoint(cc.p(0, 0));
            goldIcon.setPosition(cc.p(160, y + 25));
            scrollViewLayer.addChild(goldIcon);

            var goldText = cc.LabelTTF.create(goldRewards[i].gold, "STHeitiTC-Medium", 30);
            goldText.setAnchorPoint(cc.p(0, 0));
            goldText.setPosition(cc.p(220, y + 32));
            goldText.setColor(cc.c3b(97, 11, 9));
            scrollViewLayer.addChild(goldText);


            var energyIcon = cc.Sprite.create(main_scene_image[gameGoodsIcon["energy"]]);
            energyIcon.setAnchorPoint(cc.p(0, 0));
            energyIcon.setPosition(cc.p(300, y + 25));
            scrollViewLayer.addChild(energyIcon);

            var energyText = cc.LabelTTF.create(goldRewards[i].energy, "STHeitiTC-Medium", 30);
            energyText.setAnchorPoint(cc.p(0, 0));
            energyText.setPosition(cc.p(360, y + 32));
            energyText.setColor(cc.c3b(97, 11, 9));
            scrollViewLayer.addChild(energyText);

            var type = gameData.activity.getStateById(TYPE_GOLD_REWARD, goldRewards[i].id);
            var btnGetReward = cc.MenuItemImage.createWithIcon(
                main_scene_image.button10,
                main_scene_image.button10s,
                main_scene_image.button9d,
                main_scene_image.icon123,
                this._onClickGetReward(goldRewards[i].id),
                this
            );
            btnGetReward.setEnabled(playerLv >= goldRewards[i].lv);
            btnGetReward.setPosition(cc.p(520, y + 68));
            var menu = cc.Menu.create(btnGetReward);
            menu.setPosition(cc.p(0, 0));
            scrollViewLayer.addChild(menu);
            btnGetReward.setVisible(type != GOLD_RECEIVE);

            if (currentId == -1 && playerLv >= goldRewards[i].lv && type != GOLD_RECEIVE) {
                currentId = i;
            }

            var hasBeenGainIcon = cc.Sprite.create(main_scene_image.icon138);
            hasBeenGainIcon.setPosition(cc.p(520, y + 68));
            scrollViewLayer.addChild(hasBeenGainIcon, 1);
            hasBeenGainIcon.setVisible(type == GOLD_RECEIVE);

            this._scrollViewElement[goldRewards[i].id] = {
                hasBeenGainIcon: hasBeenGainIcon,
                btnGetReward: btnGetReward
            };
        }

        this._scrollView.setContentSize(cc.size(600, scrollViewHeight));

        var size = this._goldRewardLayerFit.scrollViewSize;
        var offsetY;

        if (currentId > 0) {
            offsetY = -1 * (len - currentId) * 135 + size.height;
            offsetY = Math.max(this._scrollView.minContainerOffset().y, offsetY);
        } else {
            offsetY = this._scrollView.minContainerOffset().y;
        }

        this._scrollView.setContentOffset(cc.p(0, offsetY));

    },

    _onClickGetReward: function (id) {
        return function () {
            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            cc.log(id);
            var element = this._scrollViewElement[id];
            gameData.activity.getGoldReward(id, function (isOK) {
                if (isOK) {
                    element.btnGetReward.setVisible(false);
                    element.hasBeenGainIcon.setVisible(true);

                    gameMark.updateGoldRewardMark(false);
                }
            });
        };

    }
});

GoldRewardLayer.create = function () {
    var ret = new GoldRewardLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};