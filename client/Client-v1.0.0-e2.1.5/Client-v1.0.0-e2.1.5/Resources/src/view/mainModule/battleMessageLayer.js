/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-8-28
 * Time: 下午6:43
 * To change this template use File | Settings | File Templates.
 */


/*
 * battle message layer
 * */


var BattleMessageLayer = cc.Layer.extend({
    init: function () {
        cc.log("BattleMessageLayer init");

        if (!this._super()) return false;

        var cardLibrary = gameData.cardLibrary.get("cardLibrary");
        var len = cardLibrary.length;

        var scrollViewLayer = MarkLayer.create(cc.rect(40, 194, 640, 733));
        var menu = LazyMenu.create();
        menu.setPosition(cc.p(0, 0));
        scrollViewLayer.addChild(menu);
        var scrollViewHeight = Math.ceil(len / 4) * 143 + 35;

        for (var i = 0; i < len; ++i) {
            var row = Math.floor(i / 4);
            var index = i % 4;
        }

        var scrollView = cc.ScrollView.create(cc.size(640, 733), scrollViewLayer);
        scrollView.setContentSize(cc.size(640, scrollViewHeight));
        scrollView.setPosition(GAME_BG_POINT);
        scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        scrollView.updateInset();
        this.addChild(scrollView);
        scrollView.setContentOffset(scrollView.minContainerOffset());

        return true;
    }
});


BattleMessageLayer.create = function () {
    var ret = new BattleMessageLayer();

    if (ret && ret.init()) {
        return ret;
    }

    return null;
}