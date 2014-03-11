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

    'src/model/event.js',
    'src/model/entity.js',

    'src/model/lz.js',
    'src/model/um.js',
    'platform.js',
    'src/model/pomelo.js',
    'src/model/server.js',

    'src/model/singleton.js',
    'src/model/gameConfig.js',

    'src/model/gameFit.js',
    'src/model/clock.js',
    'user.js',
    'src/model/player.js',
    'src/model/card.js',
    'src/model/cardList.js',
    'src/model/lineUp.js',
    'src/model/task.js',
    'src/model/pass.js',
    'src/model/rank.js',
    'src/model/lottery.js',
    'src/model/treasureHunt.js',
    'src/model/cardLibrary.js',
    'src/model/message.js',
    'src/model/tournament.js',
    'src/model/sound.js',
    'src/model/speak.js',
    'src/model/spirit.js',
    'src/model/spiritPool.js',
    'src/model/friend.js',
    'src/model/shop.js',
    'src/model/signIn.js',
    'src/model/achievement.js',
    'src/model/exchange.js',
    'src/model/activity.js',
    'src/model/greeting.js',
    'src/model/boss.js',

    'payment.js',

    'src/model/battleLogPool.js',
    'src/model/battleLog.js',
    'src/model/battleStep.js',

    'src/model/gameCombo.js',
    'src/model/gameData.js',
    'src/model/gameMark.js',
    'src/model/gameGuide.js',
    'src/model/gameHelp.js',

    'src/controls/progress.js',
    'src/controls/lazyLayer.js',
    'src/controls/shyLayer.js',
    'src/controls/skyDialog.js',
    'src/controls/lazyMenu.js',
    'src/controls/markLayer.js',
    'src/controls/strokeLabel.js',
    'src/controls/LzMenuItem.js',
    'src/controls/tipLayer.js',
    'src/controls/colorLabelTTF.js',
    'src/controls/waitLayer.js',
    'src/controls/dialog.js',
    'src/controls/slideLayer.js',

    'src/view/loginModule/loginScene.js',
    'src/view/loginModule/loginBgLayer.js',
    'src/view/loginModule/updateLayer.js',
    'loginLayer.js',
    'src/view/loginModule/newPlayerLayer.js',
    'src/view/loginModule/registerLayer.js',
    'src/view/loginModule/selectAreaLayer.js',

    'src/view/startAnimationModule/startAnimationLayer.js',
    'src/view/startAnimationModule/startAnimationScene.js',

    'src/view/mainModule/cocosBuilderClass.js',
    'src/view/mainModule/abilityRankLayer.js',
    'src/view/mainModule/achievementLayer.js',
    'src/view/mainModule/addFriendsLayer.js',
    'src/view/mainModule/attackDetailsLayer.js',
    'src/view/mainModule/bossAppearLabel.js',
    'src/view/mainModule/bossHelpLabel.js',
    'src/view/mainModule/bossLayer.js',
    'src/view/mainModule/bossListLayer.js',
    'src/view/mainModule/rechargeLayer.js',
    'src/view/mainModule/powerRewardLayer.js',
    'src/view/mainModule/goldCardsLayer.js',
    'src/view/mainModule/goldRewardLayer.js',
    'src/view/mainModule/signInLayer.js',
    'src/view/mainModule/invitationLayer.js',
    'src/view/mainModule/newYearLayer.js',
    'src/view/mainModule/activityLayer.js',
    'src/view/mainModule/amountLayer.js',
    'src/view/mainModule/battleMessageLayer.js',
    'src/view/mainModule/bubbleLabel.js',
    'src/view/mainModule/cardDetails.js',
    'src/view/mainModule/cardEvolutionLabel.js',
    'src/view/mainModule/cardEvolutionLayer.js',
    'src/view/mainModule/cardFullNode.js',
    'src/view/mainModule/cardHalfNode.js',
    'src/view/mainModule/cardHeadNode.js',
    'src/view/mainModule/cardLabel.js',
    'src/view/mainModule/cardLibraryLayer.js',
    'src/view/mainModule/cardListFullTipLayer.js',
    'src/view/mainModule/cardListLayer.js',
    'src/view/mainModule/cardTrainLabel.js',
    'src/view/mainModule/cardUpgradeLabel.js',
    'src/view/mainModule/tipsLayer.js',
    'src/view/mainModule/configLayer.js',
    'src/view/mainModule/damageRankHelpLabel.js',
    'src/view/mainModule/damageRankLayer.js',
    'src/view/mainModule/elixirRankHelpLabel.js',
    'src/view/mainModule/elixirRankLayer.js',
    'src/view/mainModule/evolutionLayer.js',
    'src/view/mainModule/exchangeLayer.js',
    'src/view/mainModule/exploreLayer.js',
    'src/view/mainModule/extractTipLabel.js',
    'src/view/mainModule/friendLayer.js',
    'src/view/mainModule/friendMessageLayer.js',
    'src/view/mainModule/gameFrame.js',
    'src/view/mainModule/gameHelpLabel.js',
    'src/view/mainModule/giftBagLayer.js',
    'src/view/mainModule/goldLayer.js',
    'src/view/mainModule/goPaymentLayer.js',
    'src/view/mainModule/greetingLabel.js',
    'src/view/mainModule/instancesLayer.js',
    'src/view/mainModule/level9BoxLayer.js',
    'src/view/mainModule/lineUpDetail.js',
    'src/view/mainModule/lineUpDetailsLayer.js',
    'src/view/mainModule/lineUpLabel.js',
    'src/view/mainModule/lineUpLayer.js',
    'src/view/mainModule/lotteryCardLayer.js',
    'src/view/mainModule/lotteryLayer.js',
    'src/view/mainModule/lvRankLayer.js',
    'src/view/mainModule/messageLabel.js',
    'src/view/mainModule/messageLayer.js',
    'src/view/mainModule/monthLabel.js',
    'src/view/mainModule/passiveSkillAfreshLabel.js',
    'src/view/mainModule/passLayer.js',
    'src/view/mainModule/passRankLayer.js',
    'src/view/mainModule/paymentLayer.js',
    'src/view/mainModule/playerDetails.js',
    'src/view/mainModule/playerHeaderLabel.js',
    'src/view/mainModule/playerTournamentLabel.js',
    'src/view/mainModule/playerUpgradeLayer.js',
    'src/view/mainModule/propsLayer.js',
    'src/view/mainModule/rankLayer.js',
    'src/view/mainModule/readMessageLayer.js',
    'src/view/mainModule/removeCdTipLabel.js',
    'src/view/mainModule/sendMessageLayer.js',
    'src/view/mainModule/shopLayer.js',
    'src/view/mainModule/skillUpgradeLabel.js',
    'src/view/mainModule/speakerLayer.js',
    'src/view/mainModule/spiritDetails.js',
    'src/view/mainModule/spiritNode.js',
    'src/view/mainModule/spiritPoolLayer.js',
    'src/view/mainModule/spiritSideNode.js',
    'src/view/mainModule/starLabel.js',
    'src/view/mainModule/strengthenLayer.js',
    'src/view/mainModule/summonLayer.js',
    'src/view/mainModule/systemMessageLayer.js',
    'src/view/mainModule/taskLayer.js',
    'src/view/mainModule/tenLotteryCardLayer.js',
    'src/view/mainModule/tournamentDetails.js',
    'src/view/mainModule/tournamentLayer.js',
    'src/view/mainModule/tournamentLabel.js',
    'src/view/mainModule/tournamentRankLayer.js',
    'src/view/mainModule/tournamentTipLayer.js',
    'src/view/mainModule/treasureHuntLayer.js',
    'src/view/mainModule/useCardsTipLabel.js',
    'src/view/mainModule/vipLayer.js',
    'src/view/mainModule/vipPrivilegeLayer.js',
    'src/view/mainModule/mainBgLayer.js',
    'src/view/mainModule/mainLayer.js',
    'src/view/mainModule/mainMenuLayer.js',
    'src/view/mainModule/mandatoryTeachingLayer.js',
    'src/view/mainModule/noticeLayer.js',
    'src/view/mainModule/noviceTeachingLayer.js',
    'src/view/mainModule/mainScene.js',

    'src/view/battleModule/battleBeganLayer.js',
    'src/view/battleModule/battleCardNode.js',
    'src/view/battleModule/battleEndLayer.js',
    'src/view/battleModule/battleLayer.js',
    'src/view/battleModule/battlePlayer.js',
    'src/view/battleModule/battleScene.js',
    'src/view/battleModule/battleSpiritNode.js',
    'src/view/battleModule/cloudLayer.js',
    'src/view/battleModule/fragmentLayer.js',
    'src/view/battleModule/skillFactory.js'
];

cc.dumpConfig();

for (var i = 0; i < appFiles.length; ++i) {
    require(appFiles[i]);
}


var director = cc.Director.getInstance();
director.setDisplayStats(true);

// set FPS. the default value is 1.0/60 if you don't call this
director.setAnimationInterval(1.0 / 30);

// fit dev
gameFitAdapter();

// create a scene. it's an autorelease object
var loginScene = LoginScene.create();

// run
if (director.getRunningScene()) {
    director.replaceScene(loginScene);
} else {
    director.runWithScene(loginScene);
}
