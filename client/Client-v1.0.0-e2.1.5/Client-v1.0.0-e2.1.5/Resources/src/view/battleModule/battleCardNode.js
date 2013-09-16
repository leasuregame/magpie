/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-6-3
 * Time: 下午3:10
 * To change this template use File | Settings | File Templates.
 */


/*
 * battle card node
 * */


var BattleCardNode = cc.Node.extend({
    _tableId: 0,
    _hp: 0,
    _maxHp: 0,
    _star: 0,
    _boss: false,
    _url: "",
    _skillId: 0,
    _skillType: 0,
    _frameSprite: null,
    _heroSprite: null,
    _iconSprite: null,
    _hpProgress: null,
    _tipLabel: null,

    init: function (data) {
        cc.log("BattleCardNode init");

        if (!this._super()) return false;

        this._tableId = data.tableId;
        this._maxHp = data.hp;
        this._hp = this._maxHp;
        this._boss = data.boss || false;

        this._loadTable();

        this._frameSprite = cc.Sprite.create(main_scene_image["card_frame" + this._star]);
        this.addChild(this._frameSprite, -1);

        var index = Math.floor((this._star - 1) / 2) + 1;
        this._heroSprite = cc.Sprite.create(main_scene_image[this._url + "_half" + index]);
        this.addChild(this._heroSprite);

        if (this._skillType > 3) {
            this._skillType = 3;
        }

        if (this._skillType) {
            this._iconSprite = cc.Sprite.create(main_scene_image["card_icon" + this._skillType]);
            this._iconSprite.setPosition(cc.p(47, -60));
            this.addChild(this._iconSprite, 1);
        }

        this._hpProgress = Progress.create(
            main_scene_image.progress11,
            main_scene_image.progress12,
            this._hp,
            this._maxHp
        );
        this._hpProgress.setPosition(cc.p(0, -100));
        this.addChild(this._hpProgress);

        this._tipLabel = cc.LabelTTF.create("", '黑体', 60);
        this.addChild(this._tipLabel);

        this._hpLabel = cc.LabelTTF.create(this._hp, '黑体', 25);
        this._hpLabel.setColor(cc.c3b(255, 0, 0));
        this._hpLabel.setPosition(cc.p(-40, -100));
        this.addChild(this._hpLabel);

        this._atkLabel = cc.LabelTTF.create(data.atk, '黑体', 25);
        this._atkLabel.setColor(cc.c3b(105, 218, 255));
        this._atkLabel.setPosition(cc.p(40, -100));
        this.addChild(this._atkLabel);

        return true;
    },

    _loadTable: function () {
        cc.log("BattleCardNode _loadTable");

        // 读取卡牌配置表
        var cardTable = outputTables.cards.rows[this._tableId];
        this._star = cardTable.star;
        this._skillId = cardTable.skill_id;
        this._url = "card" + (cardTable.number % 6 + 1);

        // 读取技能配置表
        if (this._skillId) {
            var skillTable = outputTables.skills.rows[this._skillId];
            this._skillType = skillTable.type;
        }
    },

    _updateHp: function (value) {
        cc.log("BattleCardNode updateHp: " + value);

        this._hp += value;

        if (this._hp < 0) {
            this._hp = 0;
        }

        this._hpProgress.setAllValue(this._maxHp, this._hp, 0.5);

        this._hpLabel.setString(this._hp);
    },

    setOpacity: function (opacity) {
        this._frameSprite.setOpacity(opacity);
        this._heroSprite.setOpacity(opacity);
        if(this._iconSprite) this._iconSprite.setOpacity(opacity);
    },

    getColor: function () {
        return this._heroSprite.getColor();
    },

    setColor: function (color3) {
        this._frameSprite.setColor(color3);
        this._heroSprite.setColor(color3);
        if(this._iconSprite)this._iconSprite.setColor(color3);
    },

    _tip: function (value, isCrit) {
        cc.log("BattleCardNode _tip");

        this._tipLabel.stopAllActions();

        var a1 = cc.FadeIn.create(0.5);
        var a2 = cc.ScaleTo.create(0.2, 1.5);
        var a3 = cc.ScaleTo.create(0.1, 1.0);
        var a4 = cc.FadeOut.create(1);

        var a = cc.Sequence.create(a1, a2, a3, a4);

        var str = "MISS";

        if (value == 0) {
            this._tipLabel.setColor(cc.c3b(0, 0, 255));
        } else {
            str = isCrit ? "暴" + value : value;

            if (isCrit) {
                this._tipLabel.setFontSize(75);
            } else {
                this._tipLabel.setFontSize(60);
            }

            if (value > 0) {
                this._tipLabel.setColor(cc.c3b(0, 255, 0));
            } else {
                this._tipLabel.setColor(cc.c3b(255, 0, 0));
            }
        }

        this._tipLabel.setOpacity(0);
        this._tipLabel.setString(str);
        this._tipLabel.runAction(a);
    },

    atk: function () {
        cc.log("BattleCardNode atk");

        this.stopAllActions();

        var a1 = cc.RotateBy.create(0.3 / GAME_COMBAT_SPEED, 30);
        var a2 = cc.RotateBy.create(0.4 / GAME_COMBAT_SPEED, -60);
        var a3 = cc.RotateBy.create(0.3 / GAME_COMBAT_SPEED, 30);
        var a = cc.Sequence.create(a1, a2, a3);

        var b1 = cc.ScaleTo.create(0.3 / GAME_COMBAT_SPEED, 1.2);
        var b2 = cc.ScaleTo.create(0.3 / GAME_COMBAT_SPEED, 1.0);
        var b = cc.Sequence.create(b1, b2);

        this.runAction(cc.Spawn.create(a, b));
    },

    defend: function (value, isCrit) {
        cc.log("BattleCardNode defend");

        this.scheduleOnce(function () {
            this._tip(value, isCrit);

            if (value == 0) {
                this.miss();
            } else {
                this._updateHp(value);
                this.hit();
            }
        }, 0.5 / GAME_COMBAT_SPEED);
    },

    miss: function () {
        cc.log("BattleCardNode miss");

        var a1 = cc.MoveBy.create(0.5 / GAME_COMBAT_SPEED, cc.p(-20, 0));
        var a2 = cc.MoveBy.create(0.5 / GAME_COMBAT_SPEED, cc.p(20, 0));
        var a = cc.Sequence.create(a1, a2);

        var b1 = cc.FadeOut.create(0.3 / GAME_COMBAT_SPEED);
        var b2 = cc.FadeIn.create(0.5 / GAME_COMBAT_SPEED);
        var b = cc.Sequence.create(b1, b2);

        this.runAction(cc.Spawn.create(a, b));
    },

    hit: function () {
        cc.log("BattleCardNode updateHp");

        this.stopAllActions();

        var callFuncAction = cc.CallFunc.create(this._dead, this);

        var a1 = cc.TintTo.create(0.5 / GAME_COMBAT_SPEED, 0, 255, 255);
        var a2 = cc.TintTo.create(0.5 / GAME_COMBAT_SPEED, 255, 255, 255);
        var a = cc.Sequence.create(a1, a2);

        var b1 = cc.MoveBy.create(0.01 / GAME_COMBAT_SPEED, cc.p(3, 0));
        var b2 = cc.MoveBy.create(0.02 / GAME_COMBAT_SPEED, cc.p(-6, 0));
        var b3 = cc.MoveBy.create(0.02 / GAME_COMBAT_SPEED, cc.p(6, 0));
        var b4 = cc.MoveBy.create(0.01 / GAME_COMBAT_SPEED, cc.p(-3, 0));
        var b = cc.Sequence.create(b1, b2, b3, b4);

        var d = cc.Sequence.create(cc.Spawn.create(a, b), callFuncAction);

        this.runAction(d);
    },

    _dead: function () {
        cc.log("BattleCardNode dead");

        if (this._hp <= 0) {
            this.setVisible(false);
        }
    }
});


BattleCardNode.create = function (data) {
    var ret = new BattleCardNode();

    if (ret && ret.init(data)) {
        return ret;
    }

    return null;
};
