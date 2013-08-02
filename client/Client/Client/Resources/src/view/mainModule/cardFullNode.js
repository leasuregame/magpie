/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-31
 * Time: 下午6:14
 * To change this template use File | Settings | File Templates.
 */


/*
 * card full node
 * */


var CardFullNode = CardNode.extend({
    init : function(card) {
        cc.log("CardFullNode init");

        if(!this._super(card)) return false;

        var url = this._card.get("url");
        var star = this._card.get("star");
        var index = Math.floor((star - 1) / 2) + 1;

        this._heroSprite = cc.Sprite.create(main_scene_image[url + "_full1"]);
        this.addChild(this._heroSprite);

        if(index > 1) {
            this._iconSprite = cc.Sprite.create(main_scene_image[url + "_full" + index]);
            this.addChild(this._iconSprite);
        }

        return true;
    }
})


CardFullNode.create = function(card) {
    var ret = new CardFullNode();

    if(ret && ret.init(card)) {
        return ret;
    }

    return null;
}