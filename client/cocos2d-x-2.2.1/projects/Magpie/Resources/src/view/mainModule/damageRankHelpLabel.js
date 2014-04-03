/**
 * Created by lujunyu on 14-3-7.
 */

var DamageRankHelpLabel = LazyLayer.extend({

    init: function () {
        cc.log("DamageRankHelpLabel init");

        if (!this._super()) return false;

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 150), 720, 1136);
        bgLayer.setPosition(cc.p(0, 0));
        this.addChild(bgLayer);

        this._frameLayer = cc.Layer.create();
        this._frameLayer.setPosition(gameFit.GAME_BOTTOM_LEFT_POINT);
        this.addChild(this._frameLayer);

        var bgSprite = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgSprite.setContentSize(cc.size(650, 809));
        bgSprite.setAnchorPoint(cc.p(0.5, 0));
        bgSprite.setPosition(cc.p(323, 100));
        this._frameLayer.addChild(bgSprite);

        var titleBgIcon = cc.Sprite.create(main_scene_image.icon371);
        titleBgIcon.setPosition(cc.p(320, 904));
        this._frameLayer.addChild(titleBgIcon);

        var titleIcon = cc.Sprite.create(main_scene_image.icon404);
        titleIcon.setPosition(cc.p(320, 912));
        this._frameLayer.addChild(titleIcon);

        var rankBgIcon = cc.Scale9Sprite.create(main_scene_image.icon169);
        rankBgIcon.setPosition(cc.p(320, 580));
        rankBgIcon.setContentSize(cc.size(600, 455));
        this._frameLayer.addChild(rankBgIcon);

        var tipBgIcon = cc.Scale9Sprite.create(main_scene_image.icon169);
        tipBgIcon.setPosition(cc.p(320, 245));
        tipBgIcon.setContentSize(cc.size(600, 150));
        this._frameLayer.addChild(tipBgIcon);

        var tips = [
            "1、该排行榜只显示前5名的奖励。",
            "2、本周排名奖励，下周可领取，领取时间只存在一周。",
            "3、未进榜者，会根据排名发放奖励，排名越高奖励越高。",
            "4、若本周对BOSS伤害记录为0，则没有奖励。"
        ];

        var len = tips.length;
        var point = cc.p(25, 320);

        for (var i = 0; i < len; i++) {
            var y = point.y - 40 - 32 * i;
            var tipLabel = cc.LabelTTF.create(tips[i], "STHeitiTC-Medium", 22);
            tipLabel.setAnchorPoint(cc.p(0, 0));
            tipLabel.setPosition(cc.p(point.x, y));
            tipLabel.setColor(cc.c3b(255, 239, 197));
            this._frameLayer.addChild(tipLabel);
        }

        var closeItem = cc.MenuItemImage.create(
            main_scene_image.button37,
            main_scene_image.button37s,
            this._onClickClose,
            this
        );
        closeItem.setPosition(cc.p(610, 879));

        var menu = cc.Menu.create(closeItem);
        menu.setPosition(cc.p(0, 0));
        this._frameLayer.addChild(menu);

        this._addRankView();

        return true;
    },

    _addRankView: function () {
        cc.log("DamageRankHelpLabel _addRankView");

        var rankView = cc.Layer.create();
        rankView.setPosition(cc.p(20, 350));
        this._frameLayer.addChild(rankView);

        var tipIcon = cc.Sprite.create(main_scene_image.icon384);
        tipIcon.setPosition(cc.p(318, 775));
        this._frameLayer.addChild(tipIcon);

        var rewardList = outputTables.boss_rank_reward.rows;
        var len = Object.keys(rewardList).length;
        var layerHeight = len * 75;

        for (var i = 0; i < len; i++) {
            var y = layerHeight - 55 - 75 * i;
            var reward = rewardList[i + 1];

            var bgIcon = cc.Sprite.create(main_scene_image.button6);
            bgIcon.setAnchorPoint(cc.p(0, 0));
            bgIcon.setPosition(cc.p(5, y));
            rankView.addChild(bgIcon);

            if (i < 3) {
                var rankIcon = cc.Sprite.create(main_scene_image["icon" + (201 + i)]);
                rankIcon.setPosition(cc.p(42, y + 30));
                rankView.addChild(rankIcon);
            } else {
                var rankLabel = StrokeLabel.create(i + 1, "Arial", 55);
                rankLabel.setColor(cc.c3b(255, 252, 175));
                rankLabel.setPosition(cc.p(42, y + 32));
                rankView.addChild(rankLabel);
            }

            var moneyIcon = cc.Sprite.create(main_scene_image.icon149);
            moneyIcon.setAnchorPoint(cc.p(0, 0.5));
            moneyIcon.setPosition(cc.p(105, y + 30));
            rankView.addChild(moneyIcon);

            var moneyLabel = cc.LabelTTF.create(reward.money, "STHeitiTC-Medium", 22);
            moneyLabel.setAnchorPoint(cc.p(0, 0.5));
            moneyLabel.setColor(cc.c3b(123, 76, 65));
            moneyLabel.setPosition(cc.p(155, y + 28));
            rankView.addChild(moneyLabel);

            var energyIcon = cc.Sprite.create(main_scene_image.icon154);
            energyIcon.setAnchorPoint(cc.p(0, 0.5));
            energyIcon.setPosition(cc.p(255, y + 30));
            rankView.addChild(energyIcon);

            var energyLabel = cc.LabelTTF.create(reward.energy, "STHeitiTC-Medium", 22);
            energyLabel.setAnchorPoint(cc.p(0, 0.5));
            energyLabel.setColor(cc.c3b(123, 76, 65));
            energyLabel.setPosition(cc.p(305, y + 28));
            rankView.addChild(energyLabel);

            var honorIcon = cc.Sprite.create(main_scene_image.icon405);
            honorIcon.setAnchorPoint(cc.p(0, 0.5));
            honorIcon.setPosition(cc.p(405, y + 30));
            rankView.addChild(honorIcon);

            var honorLabel = cc.LabelTTF.create(reward.honor, "STHeitiTC-Medium", 22);
            honorLabel.setAnchorPoint(cc.p(0, 0.5));
            honorLabel.setColor(cc.c3b(123, 76, 65));
            honorLabel.setPosition(cc.p(455, y + 28));
            rankView.addChild(honorLabel);
        }

    },

    _onClickClose: function () {
        cc.log("DamageRankHelpLabel _onClickClose");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this.removeFromParent();
    }

});

DamageRankHelpLabel.create = function () {
    cc.log("DamageRankHelpLabel create");

    var ref = new DamageRankHelpLabel();
    if (ref && ref.init()) {
        return ref;
    }

    return null;
};

DamageRankHelpLabel.pop = function () {
    cc.log("DamageRankHelpLabel pop");

    var damageRankHelpLabel = DamageRankHelpLabel.create();

    MainScene.getInstance().getLayer().addChild(damageRankHelpLabel, 10);
};