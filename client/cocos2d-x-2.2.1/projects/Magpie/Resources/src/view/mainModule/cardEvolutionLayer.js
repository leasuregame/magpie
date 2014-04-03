/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-12-3
 * Time: 下午4:13
 * To change this template use File | Settings | File Templates.
 */

var CardEvolutionLayer = LazyLayer.extend({

    _card: null,
    _index: null,
    _evolutionEffect: null,

    onEnter: function () {
        cc.log("CardEvolutionLayer onEnter");

        this._super();

        lz.um.beginLogPageView("星级进阶卡牌界面");
    },

    onExit: function () {
        cc.log("CardEvolutionLayer onExit");

        this._super();

        lz.um.endLogPageView("星级进阶卡牌界面");
    },

    init: function (data) {

        cc.log("CardEvolutionLayer init");

        if (!this._super()) return false;

        cc.log(data);
        this._card = data.card;
        var state = data.state;

        this.setTouchPriority(MAIN_MENU_LAYER_HANDLER_PRIORITY);

        this._evolutionEffect = cc.BuilderReader.load(main_scene_image.uiEffect73, this);

        var point = gameFit.GAME_MIDPOINT;
        this._evolutionEffect.setPosition(point);
        this._setCard();
        this.ccbFnChangeCardFrame();
        this.addChild(this._evolutionEffect);

        var that = this;

        var next = function () {
            that._evolutionEffect.animationManager.setCompletedAnimationCallback(this, function () {
                that._end();
            });
        };

        this._evolutionEffect.animationManager.setCompletedAnimationCallback(this, function () {
            if (state == EVOLUTION_SUCCESS) {
                var star = that._card.get("star");
                that._card.set("star", star + 1);
                that._setCard();
                that._evolutionEffect.animationManager.runAnimationsForSequenceNamedTweenDuration("animation_2", 0);
                next();

            } else {
                that._evolutionEffect.animationManager.runAnimationsForSequenceNamedTweenDuration("animation_3", 0);
                next();
            }
        });

        return true;
    },

    _setCard: function () {
        cc.log("CardEvolutionLayer _setCard");

        var url = this._card.get("url");
        var star = this._card.get("star");
        var index = star > 2 ? Math.min(star - 2, 3) : 1;

        var controller = this._evolutionEffect.controller;

        controller["ccbCardHalf"].setTexture(lz.getTexture(main_scene_image[url + "_half" + index]));
        controller["ccbCardIcon"].setTexture(lz.getTexture(this._card.getCardIcon()));
    },

    ccbFnChangeCardFrame: function () {
        cc.log("CardEvolutionLayer ccbFnChangeCardFrame");

        var star = this._card.get("star");
        var controller = this._evolutionEffect.controller;
        controller["ccbCardFrame"].setTexture(lz.getTexture(main_scene_image["card_frame" + star]));
    },

    ccbFnStartSetStar: function () {
        cc.log("CardEvolutionLayer ccbFnStartSetStar");
        this._index = 0;
        this._setStar();
    },

    _setStar: function () {
        cc.log("CardEvolutionLayer _setStar");

        var star = this._card.get("star");
        var offset = 60;

        if (this._index < star) {
            var starNode = cc.BuilderReader.load(main_scene_image.uiEffect31, this);
            starNode.setPosition(cc.p(this._index * offset - offset * (star - 1) / 2, -350));
            this._evolutionEffect.addChild(starNode, 10);

            starNode.animationManager.setCompletedAnimationCallback(this, function () {
                var time = 0;
                if (this._index == star - 1) {
                    time = 0.5;
                }
                this.scheduleOnce(function () {
                    this._setStar();
                }, time);

            });

            this._index += 1;
        }
    },

    _end: function () {
        this.removeFromParent();
    }

});

CardEvolutionLayer.create = function (data) {
    var ret = new CardEvolutionLayer();

    if (ret && ret.init(data)) {
        return ret;
    }

    return null;
};


CardEvolutionLayer.pop = function (data) {
    var lotteryCardLayer = CardEvolutionLayer.create(data);

    MainScene.getInstance().addChild(lotteryCardLayer, 10);
};

