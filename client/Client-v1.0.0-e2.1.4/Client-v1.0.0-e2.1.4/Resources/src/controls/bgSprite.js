/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-14
 * Time: 下午3:42
 * To change this template use File | Settings | File Templates.
 */


/*
* 背景精灵类，缓存图片
* */

cc.BgSprite = cc.Sprite.extend({
//    ctor : function() {
//        this._super();
//    },

    /**
     * Initializes a sprite with a texture's filename and a rect in texture
     * @param {String} filename
     * @param {cc.Rect} rect
     * @return {Boolean}
     * @example
     * var mySprite = new cc.Sprite();
     * mySprite.initWithFile("HelloHTML5World.png",cc.rect(0,0,480,320));
     */
    initWithFile:function (filename, rect) {
        // 重载原精灵类的方法
        cc.log("BgSprite initWithFile");
        cc.Assert(filename != null, "Sprite#initWithFile():Invalid filename for sprite");
        var selfPointer = this;

        var texture = cc.TextureCache.getInstance().textureForKey(cc.FileUtils.getInstance().fullPathForFilename(filename));
        if (!texture) {
            console.log("no");
            this._visible = false;
            var loadImg = new Image();
            loadImg.addEventListener("load", function () {
                if (!rect) {
                    rect = cc.rect(0, 0, loadImg.width, loadImg.height);
                }
                var texture2d = new cc.Texture2D();
                texture2d.initWithElement(loadImg);
                texture2d.handleLoadedTexture();
                selfPointer.initWithTexture(texture2d, rect);
                // 不缓存背景图，减少内存消耗
                // cc.TextureCache.getInstance().cacheImage(filename, loadImg);
                selfPointer._visible = true;
            });
            loadImg.addEventListener("error", function () {
                cc.log("load failure:" + filename);
            });
            loadImg.src = filename;
            return true;
        } else {
            if (texture) {
                if (!rect) {
                    var size = texture.getContentSize();
                    rect = cc.rect(0, 0, size.width, size.height);
                }
                return this.initWithTexture(texture, rect);
            }
        }
        return false;
    }
})

cc.BgSprite.create = function (fileName, rect) {
    var argnum = arguments.length;
    var sprite = new cc.BgSprite();
    if (argnum === 0) {
        if (sprite.init())
            return sprite;
    } else {
        /** Creates an sprite with an image filename.
         If the rect equal undefined, the rect used will be the size of the image.
         The offset will be (0,0).
         */
        if (sprite && sprite.init(fileName, rect))
            return sprite;
    }
    return null;
};