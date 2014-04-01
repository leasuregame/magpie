/**
 * Created by lujunyu on 14-3-24.
 */

var PassiveSkillLabel = LazyLayer.extend({

    _frameLayer: null,
    _groupLayer: null,
    _selectId: null,

    onEnter: function () {
        cc.log("PassiveSkillLabel onEnter");

        this._super();
        this.update();
    },

    init: function (args) {
        cc.log("PassiveSkillLabel init");

        if (!this._super()) return false;

        this._card = args.card;
        this._cb = args.cb;

        this.setTouchPriority(CARD_DETAILS_LAYER_HANDLER_PRIORITY);

        this._selectId = args.id || this._card.getActivePassiveSkillId();

        var bgLayer = cc.LayerColor.create(cc.c4b(25, 18, 18, 150), 720, 1136);
        bgLayer.setPosition(cc.p(0, 0));
        this.addChild(bgLayer);

        this._frameLayer = cc.Layer.create();
        this._frameLayer.setPosition(gameFit.GAME_MIDPOINT);
        this.addChild(this._frameLayer);

        var bgSprite = cc.Scale9Sprite.create(main_scene_image.bg16);
        bgSprite.setContentSize(cc.size(600, 815));
        bgSprite.setPosition(cc.p(0, 0));
        this._frameLayer.addChild(bgSprite);

        var groupsLabel = cc.Scale9Sprite.create(main_scene_image.icon169);
        groupsLabel.setPosition(cc.p(0, 0));
        groupsLabel.setContentSize(cc.size(560, 660));
        this._frameLayer.addChild(groupsLabel);

        var titleLabel = cc.LabelTTF.create("选择被动组合", "STHeitiTC-Medium", 26);
        titleLabel.setColor(cc.c3b(255, 239, 182));
        titleLabel.setPosition(cc.p(0, 365));
        this._frameLayer.addChild(titleLabel);

        var OKItem = cc.MenuItemImage.createWithIcon(
            main_scene_image.button9,
            main_scene_image.button9s,
            main_scene_image.button9d,
            main_scene_image.icon21,
            this._onClickOK,
            this
        );

        OKItem.setPosition(cc.p(0, -360));

        var menu = cc.Menu.create(OKItem);
        menu.setTouchPriority(CARD_DETAILS_LAYER_HANDLER_PRIORITY);
        menu.setPosition(cc.p(0, 0));
        this._frameLayer.addChild(menu);

        return true;
    },


    update: function () {
        cc.log("PassiveSkillLabel update");

        if (this._groupLayer) {
            this._groupLayer.removeFromParent();
            this._groupLayer = null;
        }

        var passiveSkills = this._card.get("passiveSkill");

        this._groupLayer = cc.Layer.create();
        this._frameLayer.addChild(this._groupLayer);

        var menu = cc.Menu.create();
        menu.setPosition(cc.p(0, 0));
        menu.setTouchPriority(CARD_DETAILS_LAYER_HANDLER_PRIORITY);
        this._groupLayer.addChild(menu);

        this._selectIcon = cc.Sprite.create(main_scene_image.icon422);
        this._groupLayer.addChild(this._selectIcon, 1);

        this._selectIcon2 = cc.Sprite.create(main_scene_image.icon275);
        this._selectIcon2.setPosition(cc.p(-236, 0));
        this._groupLayer.addChild(this._selectIcon2, 3);

        var index = 0;
        var y = 320 - 38;

        this._groupItems = [];

        for (var key in passiveSkills) {
            var passiveSkill = passiveSkills[key];
            var groupItem = cc.MenuItemImage.create(
                main_scene_image.button77,
                main_scene_image.button77s,
                this._onClickGroup(passiveSkill.id),
                this
            );

            groupItem.setPosition(cc.p(0, y));
            menu.addChild(groupItem);
            this._groupItems[passiveSkill.id] = groupItem;

            var openIcon = cc.Sprite.create(main_scene_image.button25);
            openIcon.setPosition(cc.p(-236, y + 1));
            this._groupLayer.addChild(openIcon, 2);

            var items = passiveSkill.items;
            var x = -170;
            for (var kk in items) {
                var item = items[kk];
                var star = this._card.get("star");
                var table = outputTables.passive_skill_config.rows[star];
                var value = item.value.toFixed(1);
                var str = "+ " + value + "%";
                var color;

                if (value >= table.yellow_attribute) {
                    color = cc.c3b(255, 248, 69);
                } else if (value >= table.blue_attribute) {
                    color = cc.c3b(105, 218, 255);
                } else {
                    color = cc.c3b(118, 238, 60);
                }

                var skillLabel = ColorLabelTTF.create(
                    {
                        string: item.description + " ",
                        fontName: "STHeitiTC-Medium",
                        fontSize: 22
                    },
                    {
                        string: str,
                        fontName: "STHeitiTC-Medium",
                        fontSize: 22,
                        color: color
                    }
                );
                skillLabel.setAnchorPoint(cc.p(0, 0));
                skillLabel.setPosition(cc.p(x, y));
                this._groupLayer.addChild(skillLabel, 2);

                x += 145;
            }

            if (passiveSkill.id == this._selectId) {
                this._selectIcon.setPosition(cc.p(0, y));
                this._selectIcon2.setPosition(cc.p(-236, y + 1));
            }

            index++;
            y -= 80;
        }

        for (; index < 8; index++) {

            var lockItem = cc.MenuItemImage.create(
                main_scene_image.button77,
                main_scene_image.button77s,
                this._onClickLock,
                this
            );

            lockItem.setPosition(cc.p(0, y));
            menu.addChild(lockItem);

            var lockIcon = cc.Sprite.create(main_scene_image.icon423);
            lockIcon.setPosition(cc.p(-236, y + 1));
            this._groupLayer.addChild(lockIcon, 2);
            y -= 80;
        }
    },

    _onClickOK: function () {
        cc.log("PassiveSkillLabel _onClickOK");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        this.removeFromParent();

        if (this._cb) {
            this._cb(this._selectId);
        }
    },

    _onClickLock: function () {
        cc.log("PassiveSkillLabel _onClickLock");

        gameData.sound.playEffect(main_scene_image.click_button_sound, false);

        var that = this;
        var cb = function () {
            that._card.openPassiveSkill(function () {
                that.update();
            });
        };

        AdvancedTipsLabel.pop(TYPE_PASSIVE_SKILL_OPEN_TIPS, cb, {card: this._card});
    },

    _onClickGroup: function (id) {

        var that = this;

        return function () {
            cc.log("PassiveSkillLabel _onClickGroup: " + id);

            gameData.sound.playEffect(main_scene_image.click_button_sound, false);

            that._selectId = id;
            var point = that._groupItems[id].getPosition();
            that._selectIcon.setPosition(point);
            that._selectIcon2.setPosition(cc.p(-236, point.y + 1));
        }
    }

});

PassiveSkillLabel.create = function (args) {
    cc.log("PassiveSkillLabel create");

    var ref = new PassiveSkillLabel();
    if (ref && ref.init(args)) {
        return ref;
    }
    return null;
};

PassiveSkillLabel.pop = function (args) {
    cc.log("PassiveSkillLabel pop");

    var passiveSkillLabel = PassiveSkillLabel.create(args);
    cc.Director.getInstance().getRunningScene().addChild(passiveSkillLabel, 5);
};