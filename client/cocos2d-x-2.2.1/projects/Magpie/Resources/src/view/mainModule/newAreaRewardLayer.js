/**
 * Created by lujunyu on 14-4-16.
 */

var NewAreaRewardLayer = cc.Layer.extend({
    _newAreaRewardLayerFit: null,

    _scrollViewElement: null,

    init: function () {
        cc.log("NewAreaRewardLayer init");

        if (!this._super()) return false;

        this._newAreaRewardLayerFit = gameFit.mainScene.newAreaRewardLayer;
        this._scrollViewElement = [];

        var tipLabel = cc.Sprite.create(main_scene_image.icon430);
        tipLabel.setPosition(this._newAreaRewardLayerFit.tipLabelPoint);
        this.addChild(tipLabel);

        var scrollViewLayer = MarkLayer.create(this._newAreaRewardLayerFit.scrollViewLayerRect);

        var table = outputTables.login_count_reward.rows;

        var len = Object.keys(table).length;
        var scrollViewHeight = len * 153;

        var cardMenu = cc.Menu.create();
        cardMenu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(cardMenu, 2);

        var activity = gameData.activity;
        var index = 0;

        var currentId;

        for (var id in table) {
            var y = scrollViewHeight - 153 - index * 153;
            var bgSprite = cc.Sprite.create(main_scene_image.button19);
            bgSprite.setAnchorPoint(cc.p(0, 0));
            bgSprite.setPosition(cc.p(15, y));
            scrollViewLayer.addChild(bgSprite);

            var str = "登陆第" + lz.getNumberStr(id) + "天";
            var dayLabel = cc.LabelTTF.create(str, "STHeitiTC-Medium", 20);
            dayLabel.setAnchorPoint(cc.p(0, 0));
            dayLabel.setPosition(cc.p(35, y + 120));
            scrollViewLayer.addChild(dayLabel);

            var x = 60;
            var rewards = table[id];
            for (var key in rewards) {

                if (key == "id") {
                    continue;
                }

                if (key == "card_id") {
                    var card = Card.create({
                        tableId: rewards[key],
                        lv: 1,
                        skillLv: 1
                    });
                    var cardItem = CardHeadNode.getCardHeadItem(card);
                    cardItem.setAnchorPoint(cc.p(0, 0));
                    cardItem.setScale(0.8);
                    cardItem.setPosition(cc.p(x, y + 20));
                    cardMenu.addChild(cardItem);
                } else {
                    var goods = giftBagGoods[key];
                    var goodsSprite = cc.Sprite.create(main_scene_image[goods.url]);
                    goodsSprite.setAnchorPoint(cc.p(0, 0));
                    goodsSprite.setPosition(cc.p(x, y + 20));
                    scrollViewLayer.addChild(goodsSprite);

                    var goodsLabel = cc.LabelTTF.create("+" + rewards[key], "STHeitiTC-Medium", 16);
                    goodsLabel.setAnchorPoint(cc.p(1, 0));
                    goodsLabel.setPosition(cc.p(73, 8));
                    goodsSprite.addChild(goodsLabel);
                }
                x += 100;
            }
            var btnGetReward = cc.MenuItemImage.createWithIcon(
                main_scene_image.button10,
                main_scene_image.button10s,
                main_scene_image.button9d,
                main_scene_image.icon123,
                this._onClickGetReward(id),
                this
            );

            btnGetReward.setPosition(cc.p(510, y + 60));

            var state = activity.getStateById(TYPE_LOGIN_COUNT_REWARD, id);
            btnGetReward.setEnabled(state == NOT_GOT_REWARD);
            btnGetReward.setVisible(!(state == ALREADY_GOT_REWARD));

            if (state != ALREADY_GOT_REWARD && currentId == undefined) {
                currentId = (0 == index) ? index : index - 1;
            }

            var menu = cc.Menu.create(btnGetReward);
            menu.setPosition(cc.p(0, 0));
            scrollViewLayer.addChild(menu);

            var hasBeenGainIcon = cc.Sprite.create(main_scene_image.icon138);
            hasBeenGainIcon.setPosition(cc.p(510, y + 60));
            hasBeenGainIcon.setVisible(state == ALREADY_GOT_REWARD);
            scrollViewLayer.addChild(hasBeenGainIcon, 1);

            this._scrollViewElement[id] = {
                hasBeenGainIcon: hasBeenGainIcon,
                btnGetReward: btnGetReward
            };

            index++;
        }

        var scrollView = cc.ScrollView.create(this._newAreaRewardLayerFit.scrollViewSize, scrollViewLayer);
        scrollView.setPosition(this._newAreaRewardLayerFit.scrollViewPoint);
        scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        scrollView.updateInset();
        scrollView.setContentSize(cc.size(640, scrollViewHeight));

        this.addChild(scrollView);

        var offsetY = Math.min(scrollView.minContainerOffset().y + 153 * (currentId || 0), 0);

        scrollView.setContentOffset(cc.p(0, offsetY));

        return true;
    },

    _onClickGetReward: function (id) {
        var that = this;
        return function () {
            cc.log("NewAreaRewardLayer _onClickGetReward: " + id);

            var element = that._scrollViewElement[id];
            gameData.activity.getLoginCountReward(function (rewards) {
                element.hasBeenGainIcon.setVisible(true);
                element.btnGetReward.setVisible(false);

                lz.tipReward(rewards);
            }, id);
        }
    }

});

NewAreaRewardLayer.create = function () {
    cc.log("NewAreaRewardLayer create");

    var ret = new NewAreaRewardLayer();
    if (ret && ret.init()) {
        return ret;
    }
    return null;
};