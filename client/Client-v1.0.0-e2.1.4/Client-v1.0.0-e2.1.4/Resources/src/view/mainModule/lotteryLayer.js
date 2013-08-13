/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-18
 * Time: 下午10:30
 * To change this template use File | Settings | File Templates.
 */


/*
 * 抽卡
 * */


var LotteryLayer = cc.Layer.extend({
    init: function () {
        cc.log("LotteryLayer init");

        if (!this._super())  return false;

        this.label = cc.LabelTTF.create("抽奖结果：", '黑体', 32);
        this.label.setPosition(cc.p(120, 650));
        this.addChild(this.label);

        var textLabel = cc.LabelTTF.create("元宝抽卡", '黑体', 32);
        textLabel.setPosition(GAME_WIDTH_MIDPOINT, 980);
        this.addChild(textLabel);

        var textLabel = cc.LabelTTF.create("初级抽卡", '黑体', 32);
        textLabel.setPosition(GAME_WIDTH_MIDPOINT - 200, 900);
        this.addChild(textLabel);

        var textLabel = cc.LabelTTF.create("可获得1,2,3星", '黑体', 25);
        textLabel.setPosition(GAME_WIDTH_MIDPOINT - 200, 850);
        this.addChild(textLabel);

        var textLabel = cc.LabelTTF.create("中级抽卡", '黑体', 32);
        textLabel.setPosition(GAME_WIDTH_MIDPOINT, 900);
        this.addChild(textLabel);

        var textLabel = cc.LabelTTF.create("可获得2,3,4星", '黑体', 25);
        textLabel.setPosition(GAME_WIDTH_MIDPOINT, 850);
        this.addChild(textLabel);

        var textLabel = cc.LabelTTF.create("高级抽卡", '黑体', 32);
        textLabel.setPosition(GAME_WIDTH_MIDPOINT + 200, 900);
        this.addChild(textLabel);

        var textLabel = cc.LabelTTF.create("可获得3,4,5星", '黑体', 25);
        textLabel.setPosition(GAME_WIDTH_MIDPOINT + 200, 850);
        this.addChild(textLabel);

        var lotteryItem1 = cc.MenuItemFont.create("抽奖", this._onClickLottery1, this);
        lotteryItem1.setPosition(GAME_WIDTH_MIDPOINT - 200, 800);

        var lotteryItem2 = cc.MenuItemFont.create("抽奖", this._onClickLottery2, this);
        lotteryItem2.setPosition(GAME_WIDTH_MIDPOINT, 800);

        var lotteryItem3 = cc.MenuItemFont.create("抽奖", this._onClickLottery3, this);
        lotteryItem3.setPosition(GAME_WIDTH_MIDPOINT + 200, 800);

        var menu = cc.Menu.create(lotteryItem1, lotteryItem2, lotteryItem3);
        menu.setPosition(0, 0);

        this.addChild(menu);


        var textLabel = cc.LabelTTF.create("活力抽卡", '黑体', 32);
        textLabel.setPosition(GAME_WIDTH_MIDPOINT, 500);
        this.addChild(textLabel);

        var textLabel = cc.LabelTTF.create("初级抽卡", '黑体', 32);
        textLabel.setPosition(GAME_WIDTH_MIDPOINT - 200, 400);
        this.addChild(textLabel);

        var textLabel = cc.LabelTTF.create("10活力/次", '黑体', 25);
        textLabel.setPosition(GAME_WIDTH_MIDPOINT - 200, 350);
        this.addChild(textLabel);

        var textLabel = cc.LabelTTF.create("中级抽卡", '黑体', 32);
        textLabel.setPosition(GAME_WIDTH_MIDPOINT, 400);
        this.addChild(textLabel);

        var textLabel = cc.LabelTTF.create("70活力/次", '黑体', 25);
        textLabel.setPosition(GAME_WIDTH_MIDPOINT, 350);
        this.addChild(textLabel);

        var textLabel = cc.LabelTTF.create("高级抽卡", '黑体', 32);
        textLabel.setPosition(GAME_WIDTH_MIDPOINT + 200, 400);
        this.addChild(textLabel);

        var textLabel = cc.LabelTTF.create("100活力/次", '黑体', 25);
        textLabel.setPosition(GAME_WIDTH_MIDPOINT + 200, 350);
        this.addChild(textLabel);

        var lotteryItem1 = cc.MenuItemFont.create("抽奖", this._onClickEnergyLottery1, this);
        lotteryItem1.setPosition(GAME_WIDTH_MIDPOINT - 200, 300);

        var lotteryItem2 = cc.MenuItemFont.create("抽奖", this._onClickEnergyLottery2, this);
        lotteryItem2.setPosition(GAME_WIDTH_MIDPOINT, 300);

        var lotteryItem3 = cc.MenuItemFont.create("抽奖", this._onClickEnergyLottery3, this);
        lotteryItem3.setPosition(GAME_WIDTH_MIDPOINT + 200, 300);

        var menu = cc.Menu.create(lotteryItem1, lotteryItem2, lotteryItem3);
        menu.setPosition(0, 0);

        this.addChild(menu);

        var textLabel = cc.LabelTTF.create("祝福好友，每日登陆，升级，均可获得活力值", '黑体', 25);
        textLabel.setPosition(GAME_WIDTH_MIDPOINT, 220);
        this.addChild(textLabel);

        return true;
    },

    _onClickLottery1: function () {
        cc.log("LotteryLayer _onClickLottery1");
        this._lottery(LOTTERY_BY_GOLD, 1);
    },

    _onClickLottery2: function () {
        cc.log("LotteryLayer _onClickLottery2");
        this._lottery(LOTTERY_BY_GOLD, 2);
    },

    _onClickLottery3: function () {
        cc.log("LotteryLayer _onClickLottery3");
        this._lottery(LOTTERY_BY_GOLD, 3);
    },

    _onClickEnergyLottery1: function () {
        cc.log("LotteryLayer _onClickEnergyLottery1");
        this._lottery(LOTTERY_BY_ENERGY, 1);
    },

    _onClickEnergyLottery2: function () {
        cc.log("LotteryLayer _onClickEnergyLottery2");
        this._lottery(LOTTERY_BY_ENERGY, 2);
    },

    _onClickEnergyLottery3: function () {
        cc.log("LotteryLayer _onClickEnergyLottery3");
        this._lottery(LOTTERY_BY_ENERGY, 3);
    },

    _lottery: function (type, level) {
        cc.log("LotteryLayer _lottery");
        gameData.lottery.lottery(function (data) {
            cc.log(data);
        }, type, level);
    }
})


LotteryLayer.create = function () {
    var ret = new LotteryLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
}