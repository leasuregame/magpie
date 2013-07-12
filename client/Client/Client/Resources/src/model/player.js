/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-18
 * Time: 下午6:54
 * To change this template use File | Settings | File Templates.
 */


/*
 * player
 * */


var Player = Entity.extend({
    _id : 0,
    _createTime: 0,
    _userId : 0,
    _areaId: 0,
    _name: "",          // 角色
    _power: 0,          // 体力
    _lv: 0,             // 等级
    _exp: 0,            // 经验
    _gold: 0,           // 元宝
    _money: 0,          // 金钱
    _skillPoint: 0,     // 技能点
    _lineUp : null,     // 阵容
    _ability : 0,       // 战力
    _energy: 0,         // 活力



    _playerLabel: null,

    init: function () {
        cc.log("Player init");


    },

    getPlayerLabel: function () {
//        if(this._playerLabel) {
//            this._playerLabel.removeFromParent();
//            return this._playerLabel;
//        }

        this._playerLabel = cc.LayerColor.create(cc.c4b(100, 0, 100, 100), GAME_WIDTH, 180);
        this._playerLabel.ignoreAnchorPointForPosition(false);
        this._playerLabel.setAnchorPoint(cc.p(0, 0));

        var roleLabel = cc.LayerColor.create(cc.c4b(100, 100, 100, 100), 180, 180);
        roleLabel.ignoreAnchorPointForPosition(false);
        roleLabel.setAnchorPoint(cc.p(0, 0));
        this._playerLabel.addChild(roleLabel);

        var label = cc.LabelTTF.create("头像", 'Times New Roman', 30);
        label.setFontSize(25);
        label.setAnchorPoint(cc.p(0.5, 0.5));
        label.setPosition(90, 90);
        roleLabel.addChild(label);

        var levelLabel = cc.LayerColor.create(cc.c4b(100, 50, 100, 100), 230, 60);
        levelLabel.ignoreAnchorPointForPosition(false);
        levelLabel.setAnchorPoint(cc.p(0, 0));
        levelLabel.setPosition(180, 120);
        this._playerLabel.addChild(levelLabel);

        label = cc.LabelTTF.create("等级：100", 'Times New Roman', 30);
        label.setFontSize(25);
        label.setAnchorPoint(cc.p(0.5, 0.5));
        label.setPosition(115, 30);
        levelLabel.addChild(label);

        var nameLabel = cc.LayerColor.create(cc.c4b(100, 100, 50, 100), 230, 60);
        nameLabel.ignoreAnchorPointForPosition(false);
        nameLabel.setAnchorPoint(cc.p(0, 0));
        nameLabel.setPosition(410, 120);
        this._playerLabel.addChild(nameLabel);

        label = cc.LabelTTF.create("名字：lCeve", 'Times New Roman', 30);
        label.setFontSize(25);
        label.setAnchorPoint(cc.p(0.5, 0.5));
        label.setPosition(115, 30);
        nameLabel.addChild(label);

        var ingotLabel = cc.LayerColor.create(cc.c4b(50, 100, 100, 100), 230, 60);
        ingotLabel.ignoreAnchorPointForPosition(false);
        ingotLabel.setAnchorPoint(cc.p(0, 0));
        ingotLabel.setPosition(180, 60);
        this._playerLabel.addChild(ingotLabel);

        label = cc.LabelTTF.create("元宝：100", 'Times New Roman', 30);
        label.setFontSize(25);
        label.setAnchorPoint(cc.p(0.5, 0.5));
        label.setPosition(115, 30);
        ingotLabel.addChild(label);

        var moneyLabel = cc.LayerColor.create(cc.c4b(50, 100, 50, 100), 230, 60);
        moneyLabel.ignoreAnchorPointForPosition(false);
        moneyLabel.setAnchorPoint(cc.p(0, 0));
        moneyLabel.setPosition(410, 60);
        this._playerLabel.addChild(moneyLabel);

        label = cc.LabelTTF.create("仙币：10000", 'Times New Roman', 30);
        label.setFontSize(25);
        label.setAnchorPoint(cc.p(0.5, 0.5));
        label.setPosition(115, 30);
        moneyLabel.addChild(label);

        var expLabel = cc.LayerColor.create(cc.c4b(100, 50, 50, 100), 230, 60);
        expLabel.ignoreAnchorPointForPosition(false);
        expLabel.setAnchorPoint(cc.p(0, 0));
        expLabel.setPosition(180, 0);
        this._playerLabel.addChild(expLabel);

        label = cc.LabelTTF.create("经验：500/10000", 'Times New Roman', 30);
        label.setFontSize(25);
        label.setAnchorPoint(cc.p(0.5, 0.5));
        label.setPosition(115, 30);
        expLabel.addChild(label);

        var powerLabel = cc.LayerColor.create(cc.c4b(50, 50, 100, 100), 230, 60);
        powerLabel.ignoreAnchorPointForPosition(false);
        powerLabel.setAnchorPoint(cc.p(0, 0));
        powerLabel.setPosition(410, 0);
        this._playerLabel.addChild(powerLabel);

        label = cc.LabelTTF.create("体力：20/200", 'Times New Roman', 30);
        label.setFontSize(25);
        label.setAnchorPoint(cc.p(0.5, 0.5));
        label.setPosition(115, 30);
        powerLabel.addChild(label);

        return this._playerLabel;
    }
})

/*
 * 单例
 * */
Player.getInstance = singleton(Player);