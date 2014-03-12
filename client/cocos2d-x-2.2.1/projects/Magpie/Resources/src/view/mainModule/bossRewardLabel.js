/**
 * Created by lujunyu on 14-3-12.
 */

var BossRewardLabel = LazyLayer.extend({

    init: function (args) {
        cc.log("BossRewardLabel init");

        if (!this._super()) return false;

        var total = args.data.total;
        this._rewardList = args.data.rewardList;
        var cb = args.cb;

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 230), 720, 1136);
        bgLayer.setPosition(cc.p(0, 0));
        this.addChild(bgLayer);

        this._frameLayer = cc.Layer.create();
        this._frameLayer.setPosition(gameFit.GAME_BOTTOM_LEFT_POINT);
        this.addChild(this._frameLayer);

        var bgSprite = cc.Scale9Sprite.create(main_scene_image.bg21);
        bgSprite.setPosition(cc.p(320, 472));
        this._frameLayer.addChild(bgSprite);

        var topBgIcon = cc.Sprite.create(main_scene_image.icon332);
        topBgIcon.setPosition(cc.p(328, 792));
        this._frameLayer.addChild(topBgIcon);

        var titleIcon = cc.Sprite.create(main_scene_image.icon388);
        titleIcon.setPosition(cc.p(320, 837));
        this._frameLayer.addChild(titleIcon);

        var tipLabel = StrokeLabel.create("好友累计贡献奖励", "STHeitiTC-Medium", 22);
        tipLabel.setColor(cc.c3b(255, 255, 255));
        tipLabel.setBgColor(cc.c3b(126, 43, 37));
        tipLabel.setPosition(cc.p(320, 770));
        this._frameLayer.addChild(tipLabel);

        var reward = ["honor", "money"];

        for (var i = 0; i < 2; i++) {
            var x = i * 255;
            var goods = giftBagGoods[reward[i]];

            var honorIcon = cc.Sprite.create(main_scene_image[goods.url]);
            honorIcon.setPosition(cc.p(110 + x, 690));
            this._frameLayer.addChild(honorIcon);

            var nameLabel = StrokeLabel.create(goods.name, "STHeitiTC-Medium", 20);
            nameLabel.setColor(cc.c3b(255, 255, 255));
            nameLabel.setBgColor(cc.c3b(126, 43, 37));
            nameLabel.setPosition(cc.p(180 + x, 715));
            this._frameLayer.addChild(nameLabel);

            var countBgLabel = cc.Sprite.create(main_scene_image.icon334);
            countBgLabel.setAnchorPoint(cc.p(0, 0.5));
            countBgLabel.setScaleX(0.6);
            countBgLabel.setPosition(cc.p(155 + x, 670));
            this._frameLayer.addChild(countBgLabel);

            var countLabel = cc.LabelTTF.create(total[reward[i]], "STHeitiTC-Medium", 22);
            countLabel.setAnchorPoint(cc.p(0, 0.5));
            countLabel.setPosition(cc.p(165 + x, 668));
            this._frameLayer.addChild(countLabel);
        }

        var getItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button10,
            main_scene_image.button10s,
            main_scene_image.icon123,
            function () {
                gameData.sound.playEffect(main_scene_image.click_button_sound, false);

                this.removeFromParent();
                if (cb) {
                    cb();
                }
            },
            this
        );
        getItem.setPosition(cc.p(320, 190));

        var closeItem = cc.MenuItemImage.create(
            main_scene_image.button75,
            main_scene_image.button75s,
            function () {
                gameData.sound.playEffect(main_scene_image.click_button_sound, false);

                this.removeFromParent();
            },
            this
        );
        closeItem.setPosition(cc.p(590, 832));

        var menu = cc.Menu.create(getItem, closeItem);
        menu.setTouchPriority(LAZY_LAYER_HANDLER_PRIORITY - 1);
        menu.setPosition(cc.p(0, 0));
        this._frameLayer.addChild(menu);

        this._addRankView();

        return true;
    },

    _addRankView: function () {

        var tipLabel = StrokeLabel.create("以下为近期部分好友贡献记录", "STHeitiTC-Medium", 22);
        tipLabel.setColor(cc.c3b(255, 255, 255));
        tipLabel.setBgColor(cc.c3b(126, 43, 37));
        tipLabel.setPosition(cc.p(320, 600));
        this._frameLayer.addChild(tipLabel);

        var bgLabel = cc.Scale9Sprite.create(main_scene_image.icon185);
        bgLabel.setContentSize(cc.size(520, 350));
        bgLabel.setAnchorPoint(cc.p(0, 0));
        bgLabel.setPosition(cc.p(60, 230));
        this._frameLayer.addChild(bgLabel);

        var playerLabel = cc.LabelTTF.create("玩家", "STHeitiTC-Medium", 20);
        playerLabel.setAnchorPoint(cc.p(0, 0));
        playerLabel.setPosition(cc.p(80, 545));
        this._frameLayer.addChild(playerLabel);

        var contributionLabel = cc.LabelTTF.create("贡献", "STHeitiTC-Medium", 20);
        contributionLabel.setAnchorPoint(cc.p(0, 0));
        contributionLabel.setPosition(cc.p(240, 545));
        this._frameLayer.addChild(contributionLabel);

        var scrollViewLayer = MarkLayer.create(cc.rect(60, 240, 520, 300));
        scrollViewLayer.setTouchPriority(LAZY_LAYER_HANDLER_PRIORITY);

        var len = this._rewardList.length;
        var scrollViewHeight = len * 60;
        if (scrollViewHeight < 320) {
            scrollViewHeight = 320;
        }

        for (var i = 0; i < len; i++) {
            var y = scrollViewHeight - 30 - i * 60;
            var reward = this._rewardList[i];

            var rewardLabel = cc.Sprite.create(main_scene_image.icon414);
            rewardLabel.setPosition(cc.p(380, y));
            scrollViewLayer.addChild(rewardLabel);

            var nameLabel = cc.LabelTTF.create(reward.name, "STHeitiTC-Medium", 20);
            nameLabel.setPosition(cc.p(200, y));
            scrollViewLayer.addChild(nameLabel);

            var honorIcon = cc.Sprite.create(main_scene_image.icon405);
            honorIcon.setPosition(cc.p(340, y));
            scrollViewLayer.addChild(honorIcon);

            var honorLabel = cc.LabelTTF.create(reward.honor, "STHeitiTC-Medium", 20);
            honorLabel.setAnchorPoint(cc.p(0, 0.5));
            honorLabel.setPosition(cc.p(370, y));
            scrollViewLayer.addChild(honorLabel);

            var moneyIcon = cc.Sprite.create(main_scene_image.icon149);
            moneyIcon.setPosition(cc.p(480, y));
            scrollViewLayer.addChild(moneyIcon);

            var moneyLabel = cc.LabelTTF.create(reward.money, "STHeitiTC-Medium", 20);
            moneyLabel.setAnchorPoint(cc.p(0, 0.5));
            moneyLabel.setPosition(cc.p(510, y));
            scrollViewLayer.addChild(moneyLabel);

        }

        var scrollView = cc.ScrollView.create(cc.size(520, 300), scrollViewLayer);
        scrollView.setContentSize(cc.size(640, scrollViewHeight));
        scrollView.setTouchPriority(LAZY_LAYER_HANDLER_PRIORITY - 1);
        scrollView.setPosition(cc.p(60, 240));
        scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        scrollView.updateInset();
        this._frameLayer.addChild(scrollView);

        scrollView.setContentOffset(scrollView.minContainerOffset());
    }

});

BossRewardLabel.create = function (args) {
    cc.log("BossRewardLabel create");

    var ref = new BossRewardLabel();
    if (ref && ref.init(args)) {
        return ref;
    }
    return null;
};

BossRewardLabel.pop = function (args) {
    cc.log("BossRewardLabel pop");

    var bossRewardLabel = BossRewardLabel.create(args);

    MainScene.getInstance().getLayer().addChild(bossRewardLabel, 10);
};