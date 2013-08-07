/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-14
 * Time: 下午3:41
 * To change this template use File | Settings | File Templates.
 */


/*
*
* */

cc.Sprite.createNoCache = function(filename, rect) {
    var sprite = new cc.Sprite();
    var loadImg = new Image();
    loadImg.addEventListener("load", function () {
        if (!rect) {
            rect = cc.rect(0, 0, loadImg.width, loadImg.height);
        }
        var texture2d = new cc.Texture2D();
        texture2d.initWithElement(loadImg);
        texture2d.handleLoadedTexture();
        sprite.initWithTexture(texture2d, rect);
    });
    loadImg.addEventListener("error", function () {
        cc.log("load failure:" + filename);
    });
    loadImg.src = filename;

    return sprite;
}

//Number.method('integer', function() {
//    return Math[this < 0 ? 'ceiling' : 'floor'](this);
//});
//
//String.method('trim', function() {
//    return this.replace(/^\s+|\s+$/g, '');
//})

// 获取不大于原数的随机数
Number.prototype.getRandom = function() {
    return Math.floor(Math.random() * this);
}
