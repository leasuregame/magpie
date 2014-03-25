/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-11-6
 * Time: 下午3:23
 * To change this template use File | Settings | File Templates.
 */

var ColorLabelTTF = cc.Node.extend({
    _size: null,

    init: function (args) {
        cc.log("ColorLabelTTF init");

        if (!this._super()) return false;

        this._size = cc.size(0, 0);

        this.setAnchorPoint(cc.p(0.5, 0.5));

        for (var i = 0; i < args.length; i++) {
            var arg = args[i];
            if (arg.goodsName) {
                var scale = arg.scale || 1.0;
                var spacing = arg.spacing || 5;

                this.createIcon(arg.goodsName, scale, spacing);
            } else {
                var string = arg.string;
                var color = arg.color || cc.c3b(255, 255, 255);
                var fontName = arg.fontName || "STHeitiTC-Medium";
                var fontSize = arg.fontSize || 20;
                var isStroke = arg.isStroke || false;
                var dimensions = arg.dimensions || cc.size(0, 0);
                var alignment = arg.alignment || cc.TEXT_ALIGNMENT_LEFT;

                this.createLabel(string, color, fontName, fontSize, isStroke, dimensions, alignment);
            }
        }

        this.setContentSize(this._size);

        return true;
    },

    createLabel: function (string, color, fontName, fontSize, isStroke, dimensions, alignment) {
        cc.log("ColorLabelTTF createLabel");

        var label = null;
        if (isStroke) {
            label = StrokeLabel.create(string, fontName, fontSize, dimensions, alignment);
        } else {
            label = cc.LabelTTF.create(string, fontName, fontSize, dimensions, alignment);
        }

        label.setColor(color);
        label.setAnchorPoint(cc.p(0, 0.5));
        label.setPosition(cc.p(this._size.width, 0));
        this.addChild(label);

        var size = label.getContentSize();
        this._size.width += size.width;
        this._size.height = Math.max(this._size.height, size.height);
    },

    createIcon: function (goodsName, scale, spacing) {
        cc.log("IconLabel createIcon");

        if (!gameGoodsIcon[goodsName]) {
            cc.log("图片资源不存在");
            return;
        }

        var icon = cc.Sprite.create(main_scene_image[gameGoodsIcon[goodsName]]);
        icon.setAnchorPoint(cc.p(0, 0.5));
        icon.setScale(scale);
        icon.setPosition(cc.p(this._size.width + spacing, 0));
        this.addChild(icon);

        var size = icon.getContentSize();
        this._size.width += size.width * scale + spacing * 2;
        this._size.height = Math.max(this._size.height, size.height);
    }

});

ColorLabelTTF.create = function (/* Multi arguments */) {
    var ret = new ColorLabelTTF();

    if (ret && ret.init(arguments)) {
        return ret;
    }

    return null;
};