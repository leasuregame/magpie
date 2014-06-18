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

var BOSS_NODE_SCALE = 1.3;

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
    _normalAtkId: 0,
    _effectId: 0,
    _isDie: false,
    _ccbNode: null,
    _animationManager: null,
    _hpProgress: null,
    _spiritHpProgress: null,
    _cb: null,

    init: function (data, index) {
        cc.log("BattleCardNode init");

        if (!this._super()) return false;

        this._index = index;
        this._tableId = data.tableId;

        this._spiritHp = data.spiritHp || 0;
        this._spiritAtk = data.spiritAtk || 0;
        this._maxHp = data.totalHp || data.hp;
        this._hp = this._maxHp - this._spiritHp;
        this._nowHp = data.hp - this._spiritHp;
        this._boss = data.boss || false;
        this._spirit = data.spirit || 0;
        this._isDie = false;

        this._load();

        if (this.isBossCard()) {
            this._ccbNode = cc.BuilderReader.load(main_scene_image[this._url], this);
        } else {
            this._ccbNode = cc.BuilderReader.load(main_scene_image.battleNode, this);

            if (this._boss) {
                this._ccbNode.setScale(BOSS_NODE_SCALE);
            }

            var frameSpriteTexture;
            var cardSpriteTexture;

            if (this.isLeadCard()) {
                frameSpriteTexture = lz.getTexture(main_scene_image["card_frame" + this._star]);
                var num = this._star > 2 ? Math.min(this._star - 2, 3) : 1;
                cardSpriteTexture = lz.getTexture(main_scene_image[this._url + "_half" + num]);
            } else if(this.isResourceCard()){
                frameSpriteTexture = lz.getTexture(main_scene_image["card_frame" + this._star]);
                cardSpriteTexture = lz.getTexture(main_scene_image[this._url + "_half1"]);
            } else if(this.isMonsterCard()) {
                frameSpriteTexture = lz.getTexture(main_scene_image["card_frame0"]);
                cardSpriteTexture = lz.getTexture(main_scene_image[this._url + "_half1"]);
            }

            var iconSpriteTexture = lz.getTexture(this.getCardIcon());

            this.ccbFrameSprite.setTexture(frameSpriteTexture);
            this.ccbCardSprite.setTexture(cardSpriteTexture);
            this.ccbIconSprite.setTexture(iconSpriteTexture);

            if (this.getCardSubscript()) {
                var subscriptSprite = cc.Sprite.create(this.getCardSubscript());
                subscriptSprite.setAnchorPoint(cc.p(0, 0));
                subscriptSprite.setPosition(cc.p(-1.8, -2.3));
                this.ccbIconSprite.addChild(subscriptSprite);
            }
        }

        this._hpProgress = Progress.create(
            main_scene_image.progress11,
            main_scene_image.progress12,
            this._nowHp,
            this._hp
        );
        this.ccbProgressNode.addChild(this._hpProgress);

        this._spiritHpProgress = Progress.create(
            null,
            main_scene_image.progress13,
            0,
            Math.floor(this._hp / 2)
        );
        this.ccbProgressNode.addChild(this._spiritHpProgress);

        this.addChild(this._ccbNode);

        this._animationManager = this._ccbNode.animationManager;

        return true;
    },

    _load: function () {
        cc.log("BattleCardNode _load");

        // 读取卡牌配置表
        var cardTable = outputTables.cards.rows[this._tableId];
        this._star = cardTable.star;
        this._skillId = cardTable.skill_id;
        this._normalAtkId = cardTable.normal_atk_id || 1;
        this._effectId = cardTable.effect_id || 1;
        this._skillName = cardTable.skill_name || "";
        this._url = "card" + cardTable.url;

        // 读取技能配置表
        if (this._skillId) {
            var skillTable = outputTables.skills.rows[this._skillId];
            this._skillType = skillTable.type || 0;
            this._skillType = this._skillType > 3 ? 3 : this._skillType;
        }
    },

    getSkillFn: function () {
        return ("skill" + this._effectId);
    },

    getNormalAtkFn: function () {
        return ("skill" + this._normalAtkId);
    },

    getSpiritHp: function () {
        return this._spiritHp;
    },

    getSpiritAtk: function () {
        return this._spiritAtk;
    },

    getCardIcon: function (type) {
        type = type != 2 ? 1 : 2;

        return main_scene_image[(skillIconMap[type][this._skillId] || skillIconMap[type][0])];
    },

    getCardSubscript: function () {
        return main_scene_image["card_subscript_" + this._star];
    },

    update: function (value) {
        cc.log(this._index + " BattleCardNode update: " + value);

        var time = 0.2;
        var differenceValue;
        var differenceTime;
        var absValue = Math.abs(value);

        this._nowHp += value;
        this._nowHp = Math.min(this._nowHp, this._maxHp);
        this._nowHp = Math.max(this._nowHp, 0);

        if (value > 0) {
            if (this._nowHp > this._hp) {
                differenceValue = this._hpProgress.getDifferenceValue();

                if (differenceValue > 0) {
                    differenceTime = time * differenceValue / absValue;

                    this._hpProgress.setValue(this._hp, differenceTime);

                    this.scheduleOnce(function () {
                        this._spiritHpProgress.setValue(this._nowHp - this._hp, time - differenceTime);
                    }, differenceTime);
                } else {
                    this._spiritHpProgress.setValue(this._nowHp - this._hp, time);
                }
            } else {
                this._hpProgress.setValue(this._nowHp, time);
            }
        } else if (value < 0) {
            if (this._nowHp < this._hp) {
                differenceValue = this._spiritHpProgress.getValue();

                if (differenceValue > 0) {
                    differenceTime = time * differenceValue / absValue;

                    this._spiritHpProgress.setValue(0, differenceTime);

                    this.scheduleOnce(function () {
                        this._hpProgress.setValue(this._nowHp, time - differenceTime);
                    }, differenceTime);
                } else {
                    this._hpProgress.setValue(this._nowHp, time);
                }
            } else {
                this._spiritHpProgress.setValue(this._nowHp - this._hp, time);
            }
        }
    },

    ccbFnCallback: function () {
        this.getParent().ccbFnCallback();
    },

    getSubtitleNode: function () {
        cc.log("BattleCardNode getSubtitleNode");

        if (!this._skillType || !this._skillName) {
            return null;
        }

        var ccbNode = null;

        if (this._index < 7) {
            ccbNode = cc.BuilderReader.load(main_scene_image.battleEffect4, this);
        } else {
            ccbNode = cc.BuilderReader.load(main_scene_image.battleEffect5, this);
        }

        if (ccbNode) {
            var len = this._skillName.length;
            for (var i = 0; i < len; ++i) {
                ccbNode.controller["ccbLabel" + i].setString(this._skillName[i]);
            }

            ccbNode.controller.ccbCard.setTexture(lz.getTexture(main_scene_image[this._url + "_skill"]));
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

        this._cb = function () {
            if (cb) {
                cb();
                cb = null;
            }
        };

        this._animationManager.runAnimationsForSequenceNamedTweenDuration(name, tweenDuration);
        this._animationManager.setCompletedAnimationCallback(this, this._cb);

        return this._animationManager.getSequenceDuration(name);
    },

    setProgressVisible: function (visible) {
        this._hpProgress.setVisible(visible);
        this._spiritHpProgress.setVisible(visible);
    },

    die: function () {
        cc.log("BattleCardNode die");

        if (!this._isDie) {
            if (this._nowHp <= 0) {
                this._isDie = true;

                this.runAnimations("die");

                if (this._spirit > 0) {
                    this.getParent().releaseSpirit(this._index, this._spirit);
                }
            } else {
                this.setProgressVisible(true);

                if (this._nowHp / this._hp < 0.05) {
                    if (this._animationManager.getRunningSequenceName() != "god") {
                        this.runAnimations("god");
                    }
                }
            }
        }
    },

    isLeadCard: function () {
        return this._tableId >= LEAD_CARD_TABLE_ID.begin && this._tableId <= LEAD_CARD_TABLE_ID.end;
    },

    isMonsterCard: function () {
        return this._tableId >= MONSTER_CARD_TABLE_ID.begin && this._tableId <= MONSTER_CARD_TABLE_ID.end;
    },

    isResourceCard: function () {
        return this._tableId >= RESOURCE_CARD_TABLE_ID.begin && this._tableId <= RESOURCE_CARD_TABLE_ID.end;
    },

    isBossCard: function () {
        cc.log(this._tableId);

        return (this._tableId >= BOSS_CARD_TABLE_ID.begin && this._tableId <= BOSS_CARD_TABLE_ID.end);
    }
});


BattleCardNode.create = function (data, index) {
    var ret = new BattleCardNode();

    if (ret && ret.init(data, index)) {
        return ret;
    }

    return null;
};
