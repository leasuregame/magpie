/**
 * Created by lujunyu on 14-2-13.
 */

var MOVING_X = 5;

var SpeakerLayer = cc.Layer.extend({
    _speakerLayerFit: null,

    _speaker: null,
    _msg: null,
    _startX: 0,
    _bgSize: null,
    _showWidth: 0,
    _msgSize: null,

    init: function () {
        cc.log("SpeakerLayer init");

        if (!this._super()) return false;
        this._speakerLayerFit = gameFit.mainScene.speakerLayer;
        this._showWidth = 0;

        var msgBgLabel = cc.Sprite.create(main_scene_image.icon370);
        msgBgLabel.setPosition(this._speakerLayerFit.msgBgLabelPoint);
        this.addChild(msgBgLabel);
        this._bgSize = msgBgLabel.getContentSize();

        var speakerIcon = cc.Sprite.create(main_scene_image.icon369);
        speakerIcon.setPosition(this._speakerLayerFit.speakerIconPoint);
        this.addChild(speakerIcon);
        //this.setVisible(false);
        return true;
    },

    push: function (msg) {
        cc.log("SpeakerLayer push");

        if(this._speaker) {
            this._speaker.removeFromParent();
            this._speaker = null;
        }

        if(this._msg) {
            this._msg.removeFromParent();
            this._msg = null;
        }

        this.unscheduleAllCallbacks();

        this._startX = 0;
        this._speaker = cc.LabelTTF.create(msg.name + ": ", "STHeitiTC-Medium", 26);
        this._msg = cc.LabelTTF.create(msg.content, "STHeitiTC-Medium", 26);

        var point = this._speakerLayerFit.speakerPoint;
        this._speaker.setAnchorPoint(cc.p(0, 0.5));
        this._speaker.setPosition(point);
        this._speaker.setColor(cc.c3b(255, 239, 131));

        this._msg.setAnchorPoint(cc.p(0, 0.5));
        var size = this._speaker.getContentSize();
        this._msgSize = this._msg.getContentSize();

        this._showWidth = this._bgSize.width - size.width - 65;
        this._msg.setPosition(cc.p(size.width + point.x, point.y));
        if (this._msgSize.width > this._showWidth) {
            this._msg.setTextureRect(cc.rect(0, 0, this._showWidth, this._msgSize.height));
            this.schedule(this._movingMsg, 1 / 30);
        }
        this.scheduleOnce(this._hiddenSpeaker, 3);
        this.addChild(this._speaker);
        this.addChild(this._msg);
        this.setVisible(true);
    },

    _movingMsg: function () {

        if (this._msgSize.width - this._startX < this._showWidth - 5) {
            this.unschedule(this._movingMsg);
            return;
        }
        var msgSize = this._msg.getContentSize();
        this._msg.setTextureRect(cc.rect(this._startX, 0, this._showWidth, msgSize.height));
        this._startX += MOVING_X;
    },

    _hiddenSpeaker: function () {
        this._speaker.removeFromParent();
        this._msg.removeFromParent();
        this._speaker = null;
        this._msg = null;
        this.setVisible(false);
    }
});

SpeakerLayer.create = function () {
    cc.log("SpeakerLayer create");
    var ref = new SpeakerLayer();
    if (ref && ref.init()) {
        return ref;
    }
    return null;
};

SpeakerLayer.pop = function () {

    var speakerLayer = SpeakerLayer.create();
    MainScene.getInstance().addChild(speakerLayer, 10);
    return speakerLayer;
};