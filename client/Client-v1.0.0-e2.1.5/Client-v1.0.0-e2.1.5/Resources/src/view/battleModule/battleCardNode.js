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
    _index: 0,
    _tableId: 0,
    _hp: 0,
    _maxHp: 0,
    _star: 0,
    _boss: false,
    _spirit: 0,
    _url: "",
    _skillId: 0,
    _skillType: 0,
    _ccbNode: null,
    _animationManager: null,
    _hpProgress: null,
    _tipLabel: null,

    init: function (data) {
        cc.log("BattleCardNode init");

        if (!this._super()) return false;

        this._index = data.index || 0;
        this._tableId = data.tableId;
        this._maxHp = data.hp;
        this._hp = this._maxHp;
        this._boss = data.boss || false;
        this._spirit = data.spirit || 0;

        this._load();

        this._ccbNode = cc.BuilderReader.load(main_scene_image.battleNode, this);

        var frameSpriteTexture = lz.getTexture(main_scene_image["card_frame" + this._star]);

        var index = Math.floor((this._star - 1) / 2) + 1;
        var cardSpriteTexture = lz.getTexture(main_scene_image[this._url + "_half" + index]);

        if (this._skillType > 3) {
            this._skillType = 3;
        }
        var iconSpriteTexture = lz.getTexture(main_scene_image["card_icon" + this._skillType]);

        this._animationManager = this._ccbNode.animationManager;

        cc.log(this);

        this._frameSprite.setTexture(frameSpriteTexture);
        this._cardSprite.setTexture(cardSpriteTexture);
        this._iconSprite.setTexture(iconSpriteTexture);

        this.addChild(this._ccbNode);

        this._hpProgress = Progress.create(
            main_scene_image.progress11,
            main_scene_image.progress12,
            this._hp,
            this._maxHp
        );
        this._hpProgress.setPosition(cc.p(0, -100));
        this.addChild(this._hpProgress);

        this._tipLabel = cc.LabelTTF.create("", "STHeitiTC-Medium", 60);
        this.addChild(this._tipLabel);

        return true;
    },

    _load: function () {
        cc.log("BattleCardNode _load");

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

    setOpacity: function (opacity) {
        this._frameSprite.setOpacity(opacity);
        this._cardSprite.setOpacity(opacity);
        this._iconSprite.setOpacity(opacity);
    },

    getColor: function () {
        return this._cardSprite.getColor();
    },

    setColor: function (color3) {
        this._frameSprite.setColor(color3);
        this._cardSprite.setColor(color3);
        this._iconSprite.setColor(color3);
    },

    getSkillType: function () {
        return this._skillType;
    },

    update: function (value, isCrit) {
        cc.log("BattleCardNode updateHp: " + value);

        this._hp += value;

        this._hp = Math.min(this._hp, this._maxHp);
        this._hp = Math.max(this._hp, 0);

        this._hpProgress.setAllValue(this._hp, this._maxHp, 0.3);

        this._tip(value, isCrit);
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

    callback: function () {
        cc.log("=========================");
        cc.log("回调成功");
        cc.log("=========================");

        this.getParent().callback();
    },

    runAnimations: function (name, tweenDuration, cb) {
        cc.log("BattleCardNode runAnimations: " + name);

        tweenDuration = tweenDuration || 0;
        cb = cb || function () {
        };

        this._animationManager.runAnimationsForSequenceNamedTweenDuration(name, tweenDuration);
        this._animationManager.setCompletedAnimationCallback(this, cb);
    },

    dead: function () {
        cc.log("BattleCardNode dead");

        if (this._hp <= 0) {
            this.stopAllActions();
            this._ccbNode.setVisible(false);
            this._hpProgress.setVisible(false);
            this._tipLabel.setVisible(false);

            var deadSprite = cc.Sprite.create(main_scene_image.icon248);
            deadSprite.setPosition(cc.p(0, 100));
            this.addChild(deadSprite);

            deadSprite.runAction(
                cc.MoveTo.create(0.1, cc.p(0, 0))
            );

            if (this._spirit > 0) {
                this.getParent().releaseSpirit(this._index, this._spirit);
            }
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
