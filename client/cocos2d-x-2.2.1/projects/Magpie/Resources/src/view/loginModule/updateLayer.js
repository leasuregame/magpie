/**
 * Created by lcc3536 on 13-12-24.
 */


/*
 * update layer
 * */


var UPDATE_CREATE_FILE_ERROR = 0;
var UPDATE_NETWORK_ERROR = 1;
var UPDATE_NO_NEW_VERSION_ERROR = 2;
var UPDATE_UN_COMPRESS_ERROR = 3;

var UPDATE_DIR = "update_dir";

var UPDATE_TIP_LIST = [
    "元神可以为你上阵卡牌提供巨额属性加成。",
    "卡牌星级不同，等级上限不同，基本属性不同。",
    "竞技场可获得仙丹，仙丹可提升卡牌基本属性。",
    "参与抽卡和修炼，均有概率获得卡魂，卡魂可兑换高星级卡牌。",
    "祝福好友可以获得抽卡所消耗的活力点，好友多多益善。",
    "天道里产出技能点，技能点可用来提升卡牌的技能等级。",
    "1星，2星卡是没有技能的，3星，4星，5星卡才有技能。",
    "3-5星卡除了主动技能外，还拥有不同的被动属性。",
    "卡牌技能类型包括单体攻击，群体攻击，治疗，你可以自由搭配。",
    "你可以进入卡牌界面，打开阵型界面，调整你卡牌的战位。",
    "VIP真不贵，VIP1只需要6块钱，不到一碗拉面的钱。",
    "每天中午和晚上，你都可以免费领取一次体力值。",
    "寻宝很刺激，因为一不小心，你就可能中大奖。",
    "首次充值无论多少，你可获得3倍的魔石奖励，整整3倍哟，亲！",
    "级的卡牌，都可以提升星级，所有属性均可获得100%传承。",
    "元神通过吞噬灵气提升等级，等级越高，其提供的加成效果越猛。",
    "每张卡都有1-5个星级，但你同时只可上阵其中一张。",
    "成为VIP，不仅可以享受众多特权，还可以购买VIP独享的礼包。",
    "修炼需要消耗体力，每次探索固定消耗5点。",
    "参与天道无任何消耗，只要你够猛，就可一直挑战下去，直至通关。",
    "天道已通的关，第二天都可以免费扫荡一次。"
];

var UpdateLayer = cc.Layer.extend({
    _updateLayerFit: null,

    _ccbNode: null,
    _updateProgress: null,
    _isJump: false,

    init: function () {
        cc.log("UpdateLayer init");

        if (!this._super()) return false;

        this._updateLayerFit = gameFit.loginScene.updateLayer;

        this._ccbNode = cc.BuilderReader.load(main_scene_image.uiEffect68, this);
        this._ccbNode.setPosition(this._updateLayerFit.updateFramePoint);
        this.addChild(this._ccbNode);

        var index = lz.randomInt(0, UPDATE_TIP_LIST.length);
        this.ccbTipLabel.setString(UPDATE_TIP_LIST[index]);

        this._updateProgress = Progress.create(
            null,
            main_scene_image.progress7,
            0,
            100
        );
        this._updateProgress.setPosition(this._updateLayerFit.updateProgressPoint);
        this.addChild(this._updateProgress);

        this._assetsManager = cc.AssetsManager.create(
            "",
            lz.platformConfig.UPDATE_VERSION_URL,
            UPDATE_DIR,
            this,
            this.errorCallback,
            this.progressCallback,
            this.successCallback
        );

        this._assetsManager.setPackageUrl(lz.platformConfig.UPDATE_PACKAGE_URL + (this._assetsManager.getVersion() || ""));

        return true;
    },

    errorCallback: function (errorCode) {
        cc.log("UpdateLayer errorCallback: " + errorCode);

        var that = this;
        var cb = (function () {
            return function () {
                that.update();
            }
        })();

        switch (errorCode) {
            case UPDATE_CREATE_FILE_ERROR:
                Dialog.pop("创建文件出错，点击重试", cb);
                break;
            case UPDATE_NETWORK_ERROR:
                Dialog.pop("网络不给力，点击重试", cb);
                break;
            case UPDATE_NO_NEW_VERSION_ERROR:
                this.noNewVersionCallback();
                break;
            case UPDATE_UN_COMPRESS_ERROR:
                Dialog.pop("解析文件出错，点击重试", cb);
                break;
            default:
                Dialog.pop("未知错误，点击重试", cb);
                break;
        }
    },

    progressCallback: function (percent) {
        percent = Math.min(percent, 100);

        cc.log("UpdateLayer progressCallback: " + percent);

        this.ccbLabel.setString(percent + "%");
        this._updateProgress.setValue(percent);

        var x1 = -256;
        var x2 = 200;
        var x3 = 256;
        var y = this.ccbSprite.getPosition().y;

        if (percent < 90) {
            var x = percent / 90 * (x2 - x1) + x1;
            this.ccbSprite.setPosition(cc.p(x, y));
        } else {
            if (!this._isJump) {
                this._isJump = true;

                this.ccbSprite.setPosition(cc.p(x2, y));

                this._ccbNode.animationManager.runAnimationsForSequenceNamedTweenDuration("animation_2", 0);

                this.ccbSprite.runAction(
                    cc.MoveTo.create(
                        this._ccbNode.animationManager.getSequenceDuration("animation_2"),
                        cc.p(x3, y)
                    )
                );
            }
        }
    },

    successCallback: function () {
        cc.log("UpdateLayer successCallback");

        require("game.jsc");
    },

    update: function () {
        cc.log("UpdateLayer update");

        this._assetsManager.update();
    },

    noNewVersionCallback: function () {
        cc.log("UpdateLayer noNewVersionCallback");

        this.getParent().switchLayer(LoginLayer);
    },

    getVersion: function () {
        return (this._assetsManager.getVersion() || "");
    }
});


UpdateLayer.create = function () {
    var ret = new UpdateLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
};

