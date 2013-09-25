/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-9-23
 * Time: 上午10:40
 * To change this template use File | Settings | File Templates.
 */


/*
 * speak
 * */


var Speak = Entity.extend({
    _isSpeak: false,
    _spiritSpeakText: [],
    _passWinSpiritSpeakText: [],
    _passFailSpiritSpeakText: [],

    init: function () {
        cc.log("Speak init");

        var key;

        this._isSpeak = false;
        this._spiritSpeakText = [];
        this._passWinSpiritSpeakText = [];
        this._passFailSpiritSpeakText = [];

        var spiritSpeakTable = outputTables.spiritSpeak.rows;
        for (key in spiritSpeakTable) {
            this._spiritSpeakText.push(spiritSpeakTable[key].text);
        }

        var passWinSpiritSpeakTable = outputTables.passWinSpiritSpeak.rows;
        for (key in passWinSpiritSpeakTable) {
            this._passWinSpiritSpeakText.push(passWinSpiritSpeakTable[key].text);
        }

        var passFailSpiritSpeakTable = outputTables.passFailSpiritSpeak.rows;
        for (key in passFailSpiritSpeakTable) {
            this._passFailSpiritSpeakText.push(passFailSpiritSpeakTable[key].text);
        }
    },

    getSpiritSpeak: function () {
        cc.log("Speak getSpiritSpeak");

        if (this._isSpeak) {
            return null;
        }

        this._isSpeak = true;

        var len = this._spiritSpeakText.length;
        var index = lz.randomInt(len);

        return this._spiritSpeakText[index];
    },

    getPassWinSpiritSpeak: function () {
        cc.log("Spirit getPassWinSpiritSpeak");

        var len = this._passWinSpiritSpeakText.length;
        var index = lz.randomInt(len);

        return this._passWinSpiritSpeakText[index];
    },

    getPassFailSpiritSpeak: function () {
        cc.log("Spirit getPassFailSpiritSpeak");

        var len = this._passFailSpiritSpeakText.length;
        var index = lz.randomInt(len);

        return this._passFailSpiritSpeakText[index];
    }
});


Speak.create = function () {
    var ret = new Speak();

    if (ret) {
        return ret;
    }

    return null;
}