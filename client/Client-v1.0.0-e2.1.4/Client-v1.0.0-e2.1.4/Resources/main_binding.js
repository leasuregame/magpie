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

require('jsb.js');

var appFiles = [
    'src/resource.js',

    'src/table/table.js',

    'src/model/pomeloWebsocketClient.js',
    'src/model/serverAPI.js',

    'src/model/singleton.js',
    'src/model/base.js',
    'src/model/gameConfig.js',

    'src/model/entity.js',
    'src/model/user.js',
    'src/model/player.js',
    'src/model/card.js',
    'src/model/cardList.js',
    'src/model/lineUp.js',
    'src/model/task.js',
    'src/model/pass.js',
    'src/model/rank.js',
    'src/model/lottery.js',
    'src/model/cardLibrary.js',
    'src/model/message.js',
    'src/model/tournament.js',
    'src/model/spirit.js',
    'src/model/spiritPool.js',

    'src/model/battleLogPool.js',
    'src/model/battleLog.js',
    'src/model/battleStep.js',

    'src/model/gameData.js',

    'src/controls/cloudLayer.js',
    'src/controls/progress.js',
    'src/controls/bgSprite.js',
    'src/controls/dialog.js',
    'src/controls/lazyMenu.js',
    'src/controls/lazyLayer.js',
    'src/controls/markLayer.js',

    'src/view/loginModule/signInScene.js',
    'src/view/loginModule/signInLayer.js',
    'src/view/loginModule/signUpScene.js',
    'src/view/loginModule/signUpLayer.js',


    'src/view/mainModule/activityLayer.js',
    'src/view/mainModule/cardDetails.js',
    'src/view/mainModule/cardEvolutionLabel.js',
    'src/view/mainModule/cardNode.js',
    'src/view/mainModule/cardFullNode.js',
    'src/view/mainModule/cardHalfNode.js',
    'src/view/mainModule/cardHeadNode.js',
    'src/view/mainModule/cardLabel.js',
    'src/view/mainModule/cardLibraryLayer.js',
    'src/view/mainModule/cardListLayer.js',
    'src/view/mainModule/cardTrainLabel.js',
    'src/view/mainModule/cardUpgradeLabel.js',
    'src/view/mainModule/configLayer.js',
    'src/view/mainModule/evolutionLayer.js',
    'src/view/mainModule/exploreLayer.js',
    'src/view/mainModule/friendLayer.js',
    'src/view/mainModule/gamblingLayer.js',
    'src/view/mainModule/lineUpLabel.js',
    'src/view/mainModule/lineUpLayer.js',
    'src/view/mainModule/lotteryLayer.js',
    'src/view/mainModule/mainBgLayer.js',
    'src/view/mainModule/mainLayer.js',
    'src/view/mainModule/mainMenuLayer.js',
    'src/view/mainModule/mainScene.js',
    'src/view/mainModule/messageLabel.js',
    'src/view/mainModule/messageLayer.js',
    'src/view/mainModule/passiveSkillAfreshLabel.js',
    'src/view/mainModule/passLabel.js',
    'src/view/mainModule/passLayer.js',
    'src/view/mainModule/playerDetails.js',
    'src/view/mainModule/playerHeaderLabel.js',
    'src/view/mainModule/playerTournamentLabel.js',
    'src/view/mainModule/pveLayer.js',
    'src/view/mainModule/rankLayer.js',
    'src/view/mainModule/shopLayer.js',
    'src/view/mainModule/skillUpgradeLabel.js',
    'src/view/mainModule/spiritDetails.js',
    'src/view/mainModule/spiritNode.js',
    'src/view/mainModule/spiritPoolLayer.js',
    'src/view/mainModule/starLabel.js',
    'src/view/mainModule/strengthenLayer.js',
    'src/view/mainModule/taskLayer.js',
    'src/view/mainModule/tournamentLayer.js',
    'src/view/mainModule/tournamentLabel.js',
    'src/view/mainModule/tournamentMessageLabel.js',
    'src/view/mainModule/treasureHuntLayer.js',

    'src/view/battleModule/actionFactory.js',
    'src/view/battleModule/effectsFactory.js',
    'src/view/battleModule/skillFactory.js',
    'src/view/battleModule/battleCardNode.js',
    'src/view/battleModule/battleSpiritNode.js',
    'src/view/battleModule/battleLayer.js',
    'src/view/battleModule/battleScene.js',
    'src/view/battleModule/battlePlayer.js',

    'src/myApp.js'                   //add your own files in order here
];

cc.dumpConfig();

for (var i = 0; i < appFiles.length; ++i) {
    require(appFiles[i]);
}


var director = cc.Director.getInstance();
director.setDisplayStats(true);

// set FPS. the default value is 1.0/60 if you don't call this
director.setAnimationInterval(1.0 / 60);

//var test = lz.HttpClientPackage.getInstance();

// create a scene. it's an autorelease object
var myScene = SignInScene.create();

// run
//director.runWithScene(myScene);
director.replaceScene(myScene);