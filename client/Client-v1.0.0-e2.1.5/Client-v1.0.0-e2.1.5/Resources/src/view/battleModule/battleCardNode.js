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
    _nowHp: 0,
    _spiritHp: 0,
    _spiritAtk: 0,
    _hp: 0,
    _maxHp: 0,
    _star: 0,
    _boss: false,
    _spirit: 0,
    _url: "",
    _skillId: 0,
    _skillType: 0,
    _skillName: "",
    _isDie: false,
    _ccbNode: null,
    _animationManager: null,
    _hpProgress: null,
    _spiritHpProgress: null,
    _tipLabel: null,

    init: function (data, index) {
        cc.log("BattleCardNode init");

        if (!this._super()) return false;

        this._index = index;
        this._tableId = data.tableId;

        this._spiritHp = data.spiritHp || 0;
        this._spiritAtk = data.spiritAtk || 0;
        this._maxHp = data.hp;
        this._hp = this._maxHp - this._spiritHp;
        this._nowHp = this._hp;
        this._boss = data.boss || false;
        this._spirit = data.spirit || 0;
        this._skillId = data.skillId || 0;
        this._isDie = false;

        this._load();

        this._ccbNode = cc.BuilderReader.load(main_scene_image.battleNode, this);

        var frameSpriteTexture = lz.getTexture(main_scene_image["card_frame" + this._star]);

        var num = this._star > 2 ? this._star - 2 : 1;
        var cardSpriteTexture = lz.getTexture(main_scene_image[this._url + "_half" + num]);

        if (this._skillType > 3) {
            this._skillType = 3;
        }
        var iconSpriteTexture = lz.getTexture(main_scene_image["card_icon" + this._skillType]);

        this._animationManager = this._ccbNode.animationManager;

        this._frameSprite.setTexture(frameSpriteTexture);
        this._cardSprite.setTexture(cardSpriteTexture);
        this._iconSprite.setTexture(iconSpriteTexture);

        this._hpProgress = Progress.create(
            main_scene_image.progress11,
            main_scene_image.progress12,
            this._nowHp,
            this._hp
        );
        this._hpProgress.setPosition(cc.p(0, -100));
        this.addChild(this._hpProgress);

        this._spiritHpProgress = Progress.create(
            null,
            main_scene_image.progress13,
            0,
            Math.floor(this._hp / 2)
        );
        this._spiritHpProgress.setPosition(cc.p(0, -100));
        this.addChild(this._spiritHpProgress);

        this.addChild(this._ccbNode);

        this._tipLabel = cc.LabelTTF.create("", "STHeitiTC-Medium", 60);
        this.addChild(this._tipLabel);

        return true;
    },

    _load: function () {
        cc.log("BattleCardNode _load");

        // 读取卡牌配置表
        var cardTable = outputTables.cards.rows[this._tableId];
        this._star = cardTable.star;
        this._skillId = cardTable.skill_id || 0;
        this._skillName = cardTable.skill_name || "";
        this._url = "card" + cardTable.url;

        // 读取技能配置表
        if (this._skillId) {
            var skillTable = outputTables.skills.rows[this._skillId];
            this._skillType = skillTable.type || 0;
        }
    },

    getSkillId: function () {
        return this._skillId;
    },

    getSpiritHp: function () {
        return this._spiritHp;
    },

    getSpiritAtk: function () {
        return this._spiritAtk;
    },

    update: function (value) {
        cc.log(this._index + " BattleCardNode update: " + value);

        var time = 0.3;
        var differenceValue;
        var differenceTime;
        var absValue = Math.abs(value);

        this._nowHp += value;
        this._nowHp = Math.min(this._nowHp, this._maxHp);
        this._nowHp = Math.max(this._nowHp, 0);

        if (value > 0) {
            if (this._nowHp > this._hp) {
                differenceValue = this._hpProgress.getDifferenceValue();
                differenceTime = time * differenceValue / absValue;

                this._hpProgress.setValue(this._hp, differenceTime);

                this.scheduleOnce(function () {
                    this._spiritHpProgress.setValue(this._nowHp - this._hp, time - differenceTime);
                }, differenceTime);
            } else {
                this._hpProgress.setValue(this._nowHp, time);
            }
        } else if (value < 0) {
            if (this._nowHp < this._hp) {
                differenceValue = this._spiritHpProgress.getValue();
                differenceTime = time * differenceValue / absValue;

                this._spiritHpProgress.setValue(0, differenceTime);

                this.scheduleOnce(function () {
                    this._hpProgress.setValue(this._nowHp, time - differenceTime);
                }, differenceTime);
            } else {
                this._spiritHpProgress.setValue(this._nowHp - this._hp, time);
            }
        }
    },

    callback: function () {
        this.getParent().callback();
    },

    getSubtitleNode: function () {
        cc.log("BattleCardNode getSubtitleNode");

        if (!this._skillType || !this._skillName) {
            return null;
        }

        var ccbNode = null;

        if (this._index < 7) {
            ccbNode = cc.BuilderReader.load(main_scene_image.effect11, this);
        } else {
            ccbNode = cc.BuilderReader.load(main_scene_image.effect12, this);
        }

        if (ccbNode) {
            cc.log(ccbNode);

            var len = this._skillName.length;
            for (var i = 0; i < len; ++i) {
                ccbNode.controller["label" + i].setString(this._skillName[i]);
            }

            ccbNode.controller.card.setTexture(lz.getTexture(main_scene_image[this._url + "_skill"]));
        }

        return ccbNode;
    },

    runAnimations: function (name, tweenDuration, cb) {
        cc.log("BattleCardNode runAnimations: " + name);

        if (this._animationManager.getRunningSequenceName()) {
            if (this._cb) {
                this._cb();
            }
        }

        tweenDuration = tweenDuration || 0;
        this._cb = cb || function () {
        };

        this._animationManager.runAnimationsForSequenceNamedTweenDuration(name, tweenDuration);
        this._animationManager.setCompletedAnimationCallback(this, this._cb);
    },

    die: function () {
        cc.log("BattleCardNode die");

        if (!this._isDie) {
            if (this._nowHp <= 0) {
                this._isDie = true;

                this.runAnimations("die_1");

                this._hpProgress.setVisible(false);
                this._spiritHpProgress.setVisible(false);

                if (this._spirit > 0) {
                    this.getParent().releaseSpirit(this._index, this._spirit);
                }
            } else if (this._nowHp / this._hp < 0.05) {
                if (this._animationManager.getRunningSequenceName() != "god_1") {
                    this.runAnimations("god_1");
                }
            }
        }
    }
});


BattleCardNode.create = function (data, index) {
    var ret = new BattleCardNode();

    if (ret && ret.init(data, index)) {
        return ret;
    }

    return null;
};
