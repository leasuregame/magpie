/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-18
 * Time: 上午11:58
 * To change this template use File | Settings | File Templates.
 */


/*
 * CardLibraryLayer
 * */

var CardLibraryLayer = cc.Layer.extend({
    init: function () {
        cc.log("CardLibraryLayer init");

        if (!this._super()) return false;

//        var winSize = cc.Director.getInstance().getWinSize();

//        var size = cc.Director.getInstance().getWinSize();
//
//        var sprite = cc.Sprite.create(s_card_library_bg);
//        sprite.setPosition(size.width / 2, size.height / 2);
//        this.addChild(sprite);
//
//        var menu = cc.Menu.create();
//        menu.setPosition(cc.p(0, 0));
//        for (var i = 1; i <= 6; ++i) {
//
//            var fun = function (i) {
//                return function () {
//                    var layer = CardDetails.create(i);
//                    layer.setPosition(size.width / 2, size.height / 2);
//                    this.addChild(layer, 2);
//                }
//            }(i);
//
//            var item = cc.MenuItemImage.create(s_path + "h" + i + ".png", s_path + "h" + i + ".png", fun, this);
//
//            item.setPosition(i * 90 + 45, 750);
//            menu.addChild(item);
//
//            var sprite = cc.Sprite.create(s_frame1);
//            sprite.setPosition(i * 90 + 45, 750);
//            this.addChild(sprite);
//        }
//
//        for (var i = 1; i <= 6; ++i) {
//            var sprite = cc.Sprite.create(s_frame1);
//            sprite.setPosition(i * 90 + 45, 600);
//            this.addChild(sprite);
//
//            sprite = cc.Sprite.create(s_path + "hg" + i + ".png");
//            sprite.setPosition(i * 90 + 45, 600);
//            this.addChild(sprite);
//
//
//        }
//
//        this.addChild(menu);

        return true;
    }
})

CardLibraryLayer.create = function () {
    var res = new CardLibraryLayer();

    if (res && res.init()) {
        return res;
    }

    return null;
}