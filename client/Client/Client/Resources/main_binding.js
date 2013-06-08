/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org

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

// boot code needed for cocos2d + JS bindings.
// Not needed by cocos2d-html5

require('jsb_cocos2d.js');

var appFiles = [
    'src/resource.js',
    'src/view/actionFactory.js',
    'src/view/effectsFactory.js',
    'src/view/skillFactory.js',
    'src/model/config.js',
    'src/model/singleton.js',
    'src/model/base.js',
    'src/model/gameConfig.js',
    'src/model/player.js',
    'src/model/battleStep.js',
    'src/model/battleLog.js',
    'src/model/battleLogNote.js',
    'src/controls/cloudLayer.js',
    'src/controls/progress.js',
    'src/controls/bgSprite.js',
    'src/controls/dialog.js',
    //'src/controls/lazyMenu.js',
    'src/view/cardDetails.js',
    'src/view/cardNode.js',
    'src/view/battleLayer.js',
    'src/view/battleScene.js',
    'src/view/battlePlayer.js',
    'src/view/testLayer.js',
    'src/view/testScene.js',
    'src/view/mainMenuLayer.js',
    'src/view/mainBgLayer.js',
    'src/view/mainLayer.js',
    'src/view/shopLayer.js',
    'src/view/cardLibraryLayer.js',
    'src/view/rankingLayer.js',
    'src/view/friendLayer.js',
    'src/view/otherLayer.js',

    'src/view/taskLayer.js',
    'src/view/lotteryLayer.js',
    'src/view/barriersLayer.js',
    'src/view/tournamentLayer.js',
    'src/view/strengthenLayer.js',

    'src/view/mainScene.js'
];

cc.dumpConfig();

for( var i=0; i < appFiles.length; i++) {
    require( appFiles[i] );
}

var director = cc.Director.getInstance();
director.setDisplayStats(true);

// set FPS. the default value is 1.0/60 if you don't call this
director.setAnimationInterval(1.0 / 60);

//var test = lz.HttpClientPackage.getInstance();

// create a scene. it's an autorelease object
//var myScene = new BattleScene();
var myScene = new MainScene();
//var myScene = new testScene();

// run
director.runWithScene(myScene);