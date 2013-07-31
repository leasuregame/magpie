/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-31
 * Time: 下午4:55
 * To change this template use File | Settings | File Templates.
 */


/*
* card head node
* */


var CardHeadNode = CardNode.extend({
    init : function() {
        cc.log("CardHeadNode init");

        if(!this._super()) return false;

        this._frameSprite = cc.Sprite.create();
        this.addChild(this._frameSprite);

        this._heroSprite = cc.Sprite.create();
        this.addChild(this._heroSprite);

        this._iconSprite = cc.Sprite.create();
        this.addChild(iconSprite);

        return true;
    }
})


CardHeadNode.create = function(card) {
    var ret = new CardHeadNode(card);

    if(ret && ret.init(card)) {
        return ret;
    }

    return null;
}