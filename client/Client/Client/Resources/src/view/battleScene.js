// 位置
var own11 = cc.p(130, 400);
var own12 = cc.p(355, 400);
var own13 = cc.p(590, 400);

var own21 = cc.p(130, 200);
var own22 = cc.p(355, 200);
var own23 = cc.p(590, 200);

var enemy11 = cc.p(130, 700);
var enemy12 = cc.p(355, 700);
var enemy13 = cc.p(590, 700);

var enemy21 = cc.p(130, 900);
var enemy22 = cc.p(355, 900);
var enemy23 = cc.p(590, 900);


/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-4-21
 * Time: 下午4:06
 * To change this template use File | Settings | File Templates.
 */

var BattleScene = cc.Scene.extend({
    ctor : function() {
        this._super();
        cc.associateWithNative( this, cc.Scene );
    },

    onEnter : function() {
        this._super();

        var batterLayer = new BatterLayer();
        batterLayer.init();
        this.addChild(batterLayer);
    },

    init : function() {

    }
})