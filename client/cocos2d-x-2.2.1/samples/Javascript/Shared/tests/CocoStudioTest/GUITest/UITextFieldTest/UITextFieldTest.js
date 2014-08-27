/****************************************************************************
 Copyright (c) 2013 cocos2d-x.org

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var UITextFieldTest = UIScene.extend({
    init: function () {
        if (this._super()) {
            var widgetRect = this._widget.getRect();
            //init text
            this._topDisplayLabel.setText("No Event");
            this._bottomDisplayLabel.setText("TextField");

            // Create the textfield
            var textField = ccs.UITextField.create();
            textField.setTouchEnable(true);
            textField.setFontName("Marker Felt");
            textField.setFontSize(30);
            textField.setPlaceHolder("input words here");
            textField.setPosition(cc.p(widgetRect.width / 2.0, widgetRect.height / 2.0));
            textField.addEventListenerTextField(this.textFieldEvent, this);
            this._uiLayer.addWidget(textField);

            return true;
        }
        return false;
    },

    textFieldEvent: function (sender, type) {
        switch (type) {
            case ccs.TextFiledEventType.attach_with_me:
                var textField = sender;
                var widgetRect = this._widget.getRect();
                textField.runAction(cc.MoveTo.create(0.225,
                    cc.p(widgetRect.width / 2, widgetRect.height / 2 + textField.getContentSize().height / 2)));
                this._topDisplayLabel.setText("attach with IME");
                break;
            case ccs.TextFiledEventType.detach_with_ime:
                var textField = sender;
                var widgetRect = this._widget.getRect();
                textField.runAction(cc.MoveTo.create(0.175, cc.p(widgetRect.width / 2.0, widgetRect.height / 2.0)));
                this._topDisplayLabel.setText("detach with IME");
                break;
            case ccs.TextFiledEventType.insert_text:
                this._topDisplayLabel.setText("insert words");
                break;
            case ccs.TextFiledEventType.delete_backward:
                this._topDisplayLabel.setText("delete word");
                break;
            default:
                break;
        }
    }
});

var UITextFieldTest_MaxLength = UIScene.extend({
    init: function () {
        if (this._super()) {
            var widgetRect = this._widget.getRect();
            //init text
            this._topDisplayLabel.setText("No Event");
            this._bottomDisplayLabel.setText("TextField max length");

            // Create the textfield
            var textField = ccs.UITextField.create();
            textField.setMaxLengthEnabled(true);
            textField.setMaxLength(3);
            textField.setTouchEnable(true);
            textField.setFontName("Marker Felt");
            textField.setFontSize(30);
            textField.setPlaceHolder("input words here");
            textField.setPosition(cc.p(widgetRect.width / 2.0, widgetRect.height / 2.0));
            textField.addEventListenerTextField(this.textFieldEvent, this);
            this._uiLayer.addWidget(textField);

            return true;
        }
        return false;
    },

    textFieldEvent: function (sender, type) {
        var textField = sender;
        var widgetRect = this._widget.getRect();
        switch (type) {
            case ccs.TextFiledEventType.attach_with_me:
                textField.runAction(cc.MoveTo.create(0.225,
                    cc.p(widgetRect.width / 2, widgetRect.height / 2 + textField.getContentSize().height / 2)));
                this._topDisplayLabel.setText("attach with IME max length:" + textField.getMaxLength());
                break;
            case ccs.TextFiledEventType.detach_with_ime:
                textField.runAction(cc.MoveTo.create(0.175, cc.p(widgetRect.width / 2.0, widgetRect.height / 2.0)));
                this._topDisplayLabel.setText("detach with IME max length:" + textField.getMaxLength());
                break;
            case ccs.TextFiledEventType.insert_text:
                this._topDisplayLabel.setText("insert with IME max length:" + textField.getMaxLength());
                break;
            case ccs.TextFiledEventType.delete_backward:
                this._topDisplayLabel.setText("delete with IME max length:" + textField.getMaxLength());
                break;
            default:
                break;
        }
    }
});

var UITextFieldTest_Password = UIScene.extend({
    init: function () {
        if (this._super()) {
            var widgetRect = this._widget.getRect();
            //init text
            this._topDisplayLabel.setText("No Event");
            this._bottomDisplayLabel.setText("TextField max length");

            // Create the textfield
            var textField = ccs.UITextField.create();
            textField.setPasswordEnabled(true);
            textField.setPasswordStyleText("*");
            textField.setTouchEnable(true);
            textField.setFontName("Marker Felt");
            textField.setFontSize(30);
            textField.setPlaceHolder("input password here");
            textField.setPosition(cc.p(widgetRect.width / 2.0, widgetRect.height / 2.0));
            textField.addEventListenerTextField(this.textFieldEvent, this);
            this._uiLayer.addWidget(textField);

            return true;
        }
        return false;
    },

    textFieldEvent: function (sender, type) {
        switch (type) {
            case ccs.TextFiledEventType.attach_with_me:
                var textField = sender;
                var widgetRect = this._widget.getRect();
                textField.runAction(cc.MoveTo.create(0.225,
                    cc.p(widgetRect.width / 2, widgetRect.height / 2 + textField.getContentSize().height / 2)));
                this._topDisplayLabel.setText("attach with IME IME password");
                break;
            case ccs.TextFiledEventType.detach_with_ime:
                var textField = sender;
                var widgetRect = this._widget.getRect();
                textField.runAction(cc.MoveTo.create(0.175, cc.p(widgetRect.width / 2.0, widgetRect.height / 2.0)));
                this._topDisplayLabel.setText("detach with IME password");
                break;
            case ccs.TextFiledEventType.insert_text:
                this._topDisplayLabel.setText("insert with IME password");
                break;
            case ccs.TextFiledEventType.delete_backward:
                this._topDisplayLabel.setText("delete with IME password");
                break;
            default:
                break;
        }
    }
});