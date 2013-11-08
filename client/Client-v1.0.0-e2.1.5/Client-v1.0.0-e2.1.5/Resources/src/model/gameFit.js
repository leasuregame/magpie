/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-11-5
 * Time: 下午4:48
 * To change this template use File | Settings | File Templates.
 */


var fit4Iphone4 = {
    "gameFrame": {
        "frame1Point": cc.p(0, 480),
        "frame2Point": cc.p(680, 480)
    },

    "battleScene": {
        "battleEndLayer": {
            "bgLayerPoint": cc.p(40, 0),
            "winBgSpritePoint": cc.p(360, 492),
            "obtainSpritePoint": cc.p(360, 638),
            "failBgSpritePoint": cc.p(360, 492),
            "rewardLabelPointX": 360,
            "offsetYHeight": 567,
            "okItemPoint": cc.p(360, 327)
        },

        "batterLayer": {
            "bgSpritePoint": cc.p(40, 0),
            "locatePoints": {
                1: cc.p(160, 352),
                2: cc.p(360, 352),
                3: cc.p(560, 352),
                4: cc.p(160, 152),
                5: cc.p(360, 152),
                6: cc.p(560, 152),
                7: cc.p(160, 652),
                8: cc.p(360, 652),
                9: cc.p(560, 652),
                10: cc.p(160, 852),
                11: cc.p(360, 852),
                12: cc.p(560, 852)
            },
            "backItemPoint": cc.p(250, -460),
            "effect15NodePoint": cc.p(360, 480),
            "ccbNodePoint": cc.p(360, 480)
        }
    },

    "loginScene": {
        "loginLayer": {
            "accountLabelPoint": cc.p(150, 500),
            "passwordLabelPoint": cc.p(150, 400),
            "accountEditBoxPoint": cc.p(380, 500),
            "passwordEditBoxPoint": cc.p(380, 400),
            "loginButtonPoint": cc.p(260, 250),
            "registerButtonPoint": cc.p(460, 250)
        },
        "logoutLayer": {
            "bgLayerPoint": cc.p(40, 0),
            "bgSpritePoint": cc.p(363, 600),
            "msgLabelPoint": cc.p(360, 620),
            "cancelItemPoint": cc.p(360, 500)
        }

    },

    "mainScene": {
        "abilityRankLayer": {
            "scrollViewHeight": 700,
            "scrollViewLayerSize": cc.rect(54, 228, 609, 700),
            "scrollViewSize": cc.size(609, 700),
            "scrollViewPoint": cc.p(54, 228),
            "labelSize": cc.size(216, 300),
            "detailItemPoint": cc.p(108, 240),
            "sendMessageItemPoint": cc.p(108, 150),
            "addFriendItemPoint": cc.p(108, 60),
            "skyDialogRect": cc.rect(40, 198, 640, 768)
        },
        "activityLayer": {
            "bgSpritePoint": cc.p(40, 106),
            "headSpritePoint": cc.p(680, 960),
            "itemBasePoint": cc.p(65, 862),
            "itemOffsetX": 107
        },
        "cardEvolutionLayer": {
            "cardItemBgSpritePoint": cc.p(359, 539),
            "helpBgSpritePoint": cc.p(360, 292),
            "resLabelPoint": cc.p(360, 482),
            "tipLabelPoint": cc.p(360, 292),
            "helpLabelPoint": cc.p(360, 292),
            "selectLeadCardItemPoint": cc.p(360, 597),
            "evolutionItemPoint": cc.p(260, 182),
            "selectRetinueCardItemPoint": cc.p(460, 182),
            "selectLeadCardIconPoint": cc.p(360, 597),
            "leadCardHalfNodePoint": cc.p(360, 597)
        },
        "cardListLayer": {
            "bgSpritePoint": cc.p(40, 106),
            "headIconPoint": cc.p(40, 880),
            "lineIconPoint": cc.p(360, 805),
            "scrollViewLayerRect": cc.rect(67, 266, 586, 620),
            "scrollViewSize": cc.size(594, 620),
            "scrollViewPoint": cc.p(67, 178),
            "sortItemPoint": cc.p(130, 142),
            "onSelectAllLowItemPoint": cc.p(300, 142),
            "selectAllLowHookIconPoint": cc.p(235, 142),
            "titleLabelPoint": cc.p(360, 920),
            "lineUpItemPoint": cc.p(120, 838),
            "sellItemPoint": cc.p(600, 838),
            "okItemPoint": cc.p(600, 838),
            "backItemPoint": cc.p(100, 920),
            "tipLabelPoint": cc.p(100, 838),
            "countLabelPoint": cc.p(247, 838),
            "expLabelPoint": cc.p(425, 838),
            "rateLabelPoint": cc.p(425, 838),
            "moneyLabelPoint": cc.p(425, 838)
        },
        "cardTrainLabel": {
            "cardItemBgSpritePoint": cc.p(364, 525),
            "elixirIconPoint": cc.p(510, 667),
            "elixirLabelPoint": cc.p(605, 665),
            "needElixirIconPoint": cc.p(510, 636),
            "needElixirLabelPoint": cc.p(605, 634),
            "resLabelPoint": cc.p(360, 422),
            "tipLabelPoint": cc.p(360, 292),
            "helpLabelPoint": cc.p(360, 292),
            "selectLeadCardItemPoint": cc.p(360, 597),
            "trainItemPoint": cc.p(360, 182),
            "selectLeadCardIconPoint": cc.p(360, 597),
            "leadCardHalfNodePoint": cc.p(360, 597)
        },
        "cardUpgradeLabel": {
            "cardItemBgSpritePoint": cc.p(365, 512),
            "resLabelPoint": cc.p(360, 422),
            "helpBgSpritePoint": cc.p(360, 292),
            "tipLabelPoint": cc.p(360, 292),
            "helpLabelPoint": cc.p(360, 292),
            "selectLeadCardItemPoint": cc.p(360, 597),
            "upgradeItemPoint": cc.p(260, 182),
            "selectRetinueCardItemPoint": cc.p(460, 182),
            "selectLeadCardIconPoint": cc.p(360, 597),
            "leadCardHalfNodePoint": cc.p(360, 597)
        },
        "evolutionLayer": {
            "bgSpritePoint": cc.p(40, 106),
            "playerHeaderLabelPoint": cc.p(40, 802),
            "cardEvolutionItemPoint": cc.p(110, 756),
            "cardEvolutionItemOffset": cc.p(-7, -2),
            "cardTrainItemPoint": cc.p(254, 756),
            "cardTrainItemOffset": cc.p(0, -2)
        },
        "goldRewardLayer": {
            "lineIconPoint": cc.p(40, 787),
            "headIconPoint": cc.p(40, 787),
            "scrollViewLayerRect": cc.rect(10, 80, 740, 700),
            "scrollViewHeight": 135,
            "scrollViewSize": cc.size(620, 620),
            "scrollViewPoint": cc.p(40, 140)
        },
        "lotteryLayer": {
            "bgSpritePoint": cc.p(40, 0),
            "headIconPoint": cc.p(40, 880),
            "titleIconPoint": cc.p(360, 920),
            "backItemPoint": cc.p(100, 920),
            "lotteryLabelPoint": cc.p(360, 512),
            "headLabelPoint": cc.p(360, 850),
            "energyIconPoint": cc.p(80, 850),
            "goldIconPoint": cc.p(220, 850),
            "fragmentIconPoint": cc.p(450, 850),
            "energyLabelPoint": cc.p(110, 850),
            "goldLabelPoint": cc.p(250, 850),
            "fragmentLabelPoint": cc.p(480, 850),
            "exchangeItemPoint": cc.p(600, 850),
            "goldLotteryItemBasePoint": cc.p(233, 382),
            "energyLotteryItemBasePoint": cc.p(233, 462),
            "tipBgSpritePoint": cc.p(360, 132),
            "tipLabelPoint": cc.p(360, 132)
        },
        "mainBgLayer": {
            "messagesLabelPoint": cc.p(40, 926)
        },
        "mainLayer": {
            "bgSpritePoint": cc.p(40, 106),
            "playerHeaderLabelPoint": cc.p(40, 802),
            "abilityLabelPoint": cc.p(300, 608),
            "rankingLabelPoint": cc.p(530, 608),
            "lineUpLabelPoint": cc.p(40, 712),
            "spiritLayerItemPoint": cc.p(360, 412),
            "lotteryLayerItemPoint": cc.p(165, 512),
            "treasureHuntLayerItemPoint": cc.p(165, 322),
            "strengthenLayerItemPoint": cc.p(555, 512),
            "evolutionLayerItemPoint": cc.p(555, 322),
            "activityLayerItemPoint": cc.p(93, 157),
            "cardLibraryLayerItemPoint": cc.p(200, 157),
            "rankLayerItemPoint": cc.p(307, 157),
            "achievementLayerItemPoint": cc.p(414, 157),
            "friendLayerItemPoint": cc.p(521, 157),
            "otherItemPoint": cc.p(628, 157),
            "messageItemPoint": cc.p(521, 234),
            "configLayerItemPoint": cc.p(628, 234)
        },
        "mainMenuLayer": {
            "bgSpritePoint": cc.p(40, 0),
            "itemBasePoint": cc.p(93, 54),
            "itemOffsetX": 107,
            "markSpriteBasePoint": cc.p(93, 54),
            "markSpriteOffsetX": 107
        },
        "messageLabel": {
            "messageLabelPoint": cc.p(640, 18),
            "offsetXWidth": 640
        },
        "passiveSkillAfreshLabel": {
            "cardItemBgSpritePoint": cc.p(328, 637),
            "nameLabelPoint": cc.p(243, 654),
            "lvLabelPoint": cc.p(245, 620),
            "resLabelPoint": cc.p(133, 212),
            "basePointY": 308,
            "offsetPointY": 78,
            "stopTypeLabelPoint": cc.p(106, 292),
            "selectLeadCardIconPoint": cc.p(189, 636),
            "selectLeadCardItemPoint": cc.p(191, 636),
            "afreshItemPoint": cc.p(260, 182),
            "repeatAfreshItemPoint": cc.p(460, 182),
            "startItemPoint": cc.p(260, 182),
            "cancelItemPoint": cc.p(460, 182),
            "stopItemPoint": cc.p(360, 182),
            "leadCardHeadNodePoint": cc.p(137, 582)
        },
        "passLayer": {
            "bgSpritePoint": cc.p(40, 106),
            "headIconPoint": cc.p(40, 880),
            "titleIconPoint": cc.p(360, 920),
            "mysticalItemPoint": cc.p(580, 522),
            "scrollViewLayerRect": cc.rect(40, 194, 640, 774),
            "scrollViewSize": cc.size(640, 774),
            "scrollViewContentSize": cc.size(640, 18700),
            "scrollViewPoint": cc.p(40, 106),
            "tipLabelPoint": cc.p(40, 812),
            "topLabelPoint": cc.p(190, 846),
            "skillPointLabelPoint": cc.p(583, 749),
            "towerSpritePoint": cc.p(524, 138),
            "towerBgSpritePoint": cc.p(510, 132),
            "wipeOutItemPoint": cc.p(580, 846),
            "resetItemPoint": cc.p(580, 846),
            "bgLayerPoint": cc.p(40, 0),
            "bgSprite2Point": cc.p(360, 492),
            "rewardLabelPoint": cc.p(360, 562),
            "okItemPoint": cc.p(260, 442),
            "closeItemPoint": cc.p(460, 442),
            "obtainSpritePoint": cc.p(360, 630),
            "rewardLabelBasePoint": cc.p(360, 567),
            "rewardLabelOffsetY" : 45,
            "okItem2Point": cc.p(360, 327)
        },
        "playerHeaderLabel": {
            "nameLabelPoint": cc.p(130, 83),
            "expBgPoint": cc.p(210, 36),
            "expProgressPoint": cc.p(214, 36),
            "lvBgPoint": cc.p(60, 60),
            "lvLabelPoint": cc.p(57, 58),
            "goldLabelPoint": cc.p(580, 83),
            "moneyLabelPoint": cc.p(580, 36),
            "powerLabelPoint": cc.p(427, 36),
            "vipSpritePoint": cc.p(410, 83)
        },
        "powerRewardLayer": {
            "lineIconPoint": cc.p(40, 787),
            "headTextPoint": cc.p(165, 812),
            "tipIconPoint": cc.p(120, 587),
            "powerBgIconPoint": cc.p(125, 202),
            "textOffsetX": 270,
            "itemText1BasePoint": cc.p(200, 682),
            "itemText2BasePoint": cc.p(160, 642),
            "timeText1BasePoint": cc.p(155, 642),
            "timeText2BasePoint": cc.p(240, 642),
            "itemText3BasePoint": cc.p(170, 602),
            "btnGetRewardPoint": cc.p(355, 182)
        },
        "propsLayer": {
            "bgSpritePoint": cc.p(40, 106),
            "headLabelPoint": cc.p(40, 817),
            "goldIconPoint": cc.p(280, 846),
            "moneyIconPoint": cc.p(410, 846),
            "goldLabelPoint": cc.p(310, 844),
            "moneyLabelPoint": cc.p(435, 844),
            "paymentItemPoint": cc.p(600, 846),
            "scrollViewLayerRect": cc.rect(40, 194, 640, 711),
            "scrollViewSize": cc.size(640, 680),
            "scrollViewPoint": cc.p(40, 122)
        },
        "rechargeLayer": {
            "headIconPoint": cc.p(120, 697),
            "midIconPoint": cc.p(80, 107),
            "itemTextPoint": cc.p(120, 572),
            "textBasePoint": cc.p(120, 527),
            "textOffsetY": 35,
            "go2PaymentItemPoint": cc.p(360, 212),
            "btnTitlePoint": cc.p(360, 212)
        },
        "shopLayer": {
            "headIconPoint": cc.p(40, 874),
            "vipLayerItemPoint": cc.p(111, 917),
            "propsLayerItemPoint": cc.p(254, 917)
        },
        "signInLayer": {
            "bgSpriteSize": cc.size(600, 720),
            "bgSpritePoint": cc.p(362, 477),
            "titleLabelPoint": cc.p(360, 797),
            "turnLeftItemPoint": cc.p(87, 592),
            "turnRightItemPoint": cc.p(631, 592),
            "signInItemPoint": cc.p(560, 367),
            "remedySignInItemPoint": cc.p(435, 367),
            "specialOfferIconPoint": cc.p(380, 315),
            "spritePoint": cc.p(405, 330),
            "spendPoint": cc.p(448, 330),
            "signInIconPoint": cc.p(560, 367),
            "remedySignInIconPoint": cc.p(435, 367),
            "scrollViewLayerRect": cc.rect(105, 510, 510, 366),
            "monthLabelOffsetX": 510,
            "scrollViewSize": cc.size(510, 366),
            "scrollViewPoint": cc.p(105, 402),
            "signInCountIconPoint": cc.p(235, 367),
            "signInCountLabelPoint": cc.p(330, 367),
            "pointBasePoint": cc.p(160, 282),
            "pointOffsetX": 100,
            "rewardLabelPoint": cc.p(360, 202),
            "rewardBgSpriteSize": cc.size(512, 96)
        },
        "skillUpgradeLabel": {
            "cardItemBgSpritePoint": cc.p(366, 544),
            "skillPointIconPoint": cc.p(535, 672),
            "skillPointLabelPoint": cc.p(585, 670),
            "resLabelPoint": cc.p(360, 422),
            "helpBgSpritePoint": cc.p(360, 292),
            "tipLabelPoint": cc.p(360, 292),
            "helpLabelPoint": cc.p(360, 292),
            "selectLeadCardItemPoint": cc.p(360, 597),
            "upgradeItemPoint": cc.p(360, 182),
            "selectLeadCardIconPoint": cc.p(360, 597),
            "leadCardHalfNodePoint": cc.p(360, 597),
            "effectPoint": cc.p(360, 422)

        },
        "spiritPoolLayer": {
            "bgSpritePoint": cc.p(40, 106),
            "headIconPoint": cc.p(40, 880),
            "titleIconPoint": cc.p(360, 920),
            "backItemPoint": cc.p(100, 920),
            "spiritIconPoint": cc.p(130, 792),
            "countIconPoint": cc.p(550, 842),
            "countLabelIconPoint": cc.p(450, 842),
            "countLabelPoint": cc.p(600, 842),
            "perObtainIconPoint": cc.p(550, 792),
            "perObtainLabelIconPoint": cc.p(450, 792),
            "preObtainLabelPoint": cc.p(600, 792),
            "lvIconPoint": cc.p(190, 200),
            "lvLabelPoint": cc.p(270, 200),
            "expLabelPoint": cc.p(400, 200),
            "tipLabelPoint": cc.p(360, 142),
            "spiritItemPoint": cc.p(130, 792),
            "spiritPoolItemPoint": cc.p(360, 542),
            "useGoldItemPoint": cc.p(360, 282),
            "hookPoint": cc.p(235, 282),
            "spiritPoint": cc.p(360, 542)
        },
        "strengthenLayer": {
            "bgSpritePoint": cc.p(40, 106),
            "playerHeaderLabelPoint": cc.p(40, 802),
            "cardUpgradeItemPoint": cc.p(110, 756),
            "cardUpgradeItemOffset": cc.p(-7, -2),
            "skillUpgradeItemPoint": cc.p(254, 756),
            "skillUpgradeItemOffset": cc.p(0, -2),
            "passiveSkillUpgradeItemPoint": cc.p(404, 756),
            "passiveSkillUpgradeItemOffset": cc.p(0, -2)

        },
        "taskLayer": {
            "locatePoints":  [
                cc.p(160, 550),
                cc.p(200, 270),
                cc.p(440, 440),
                cc.p(480, 260),
                cc.p(360, 70),

                cc.p(160, 550),
                cc.p(200, 270),
                cc.p(440, 470),
                cc.p(480, 260),
                cc.p(340, 70),

                cc.p(160, 550),
                cc.p(210, 315),
                cc.p(415, 480),
                cc.p(480, 260),
                cc.p(360, 70),

                cc.p(160, 550),
                cc.p(200, 290),
                cc.p(420, 470),
                cc.p(480, 260),
                cc.p(360, 70),

                cc.p(155, 550),
                cc.p(200, 270),
                cc.p(420, 470),
                cc.p(480, 260),
                cc.p(360, 70),

                cc.p(160, 550),
                cc.p(200, 290),
                cc.p(440, 470),
                cc.p(480, 260),
                cc.p(360, 70),

                cc.p(160, 550),
                cc.p(200, 270),
                cc.p(440, 450),
                cc.p(480, 260),
                cc.p(360, 70),

                cc.p(160, 550),
                cc.p(200, 270),
                cc.p(440, 440),
                cc.p(480, 260),
                cc.p(360, 70),

                cc.p(140, 550),
                cc.p(200, 270),
                cc.p(420, 470),
                cc.p(480, 260),
                cc.p(360, 70),

                cc.p(140, 550),
                cc.p(200, 270),
                cc.p(430, 460),
                cc.p(480, 260),
                cc.p(360, 70)
            ],
            "headIconPoint": cc.p(40, 880),
            "titleIconPoint": cc.p(360, 920),
            "wipeOutItemPoint": cc.p(595, 142),
            "turnLeftSpritePoint": cc.p(80, 462),
            "turnRightSpritePoint": cc.p(640, 462),
            "scrollViewLayerRect": cc.rect(40, 198, 640, 744),
            "scrollViewSize": cc.size(640, 774),
            "scrollViewContentSize": cc.size(6400, 774),
            "scrollViewPoint": cc.p(40, 106),
            "titlePointY": 745
        },
        "tournamentLayer": {
            "bgSpritePoint": cc.p(40, 106),
            "playerLabelPoint": cc.p(40, 828),
            "nameLabelPoint": cc.p(150, 925),
            "expBgPoint": cc.p(210, 887),
            "expProgressPoint": cc.p(214, 887),
            "lvBgPoint": cc.p(90, 907),
            "lvLabelPoint": cc.p(87, 905),
            "countLabelPoint": cc.p(530, 925),
            "rankingLabelPoint": cc.p(430, 885),
            "elixirLabelPoint": cc.p(605, 885),
            "rewardIconPoint": cc.p(360, 812),
            "rewardLabelPoint": cc.p(360, 812),
            "buyCountItemPoint": cc.p(575, 927),
            "rewardItemPoint": cc.p(160, 812),
            "labelContentSize": cc.size(216, 300),
            "detailItemPoint": cc.p(108, 240),
            "sendMessageItemPoint": cc.p(108, 150),
            "addFriendItemPoint": cc.p(108, 60),
            "skyDialogRect": cc.rect(40, 110, 640, 700),
            "scrollViewLayerRect": cc.rect(40, 110, 621, 670),
            "scrollViewSize": cc.size(621, 670),
            "scrollViewContentSizeWidth": 640,
            "scrollViewPoint": cc.p(50, 110)
        },
        "treasureHuntLayer": {
            "locatePoints": [
                cc.p(110, 765),
                cc.p(235, 765),
                cc.p(360, 765),
                cc.p(485, 765),
                cc.p(610, 765),
                cc.p(610, 665),
                cc.p(610, 565),
                cc.p(610, 465),
                cc.p(610, 365),
                cc.p(610, 265),
                cc.p(610, 165),
                cc.p(485, 165),
                cc.p(360, 165),
                cc.p(235, 165),
                cc.p(110, 165),
                cc.p(110, 265),
                cc.p(110, 365),
                cc.p(110, 465),
                cc.p(110, 565),
                cc.p(110, 665)
            ],
            "bgSpritePoint": cc.p(40, 106),
            "headIconPoint": cc.p(40, 880),
            "titleIconPoint": cc.p(360, 920),
            "backItemPoint": cc.p(100, 920),
            "headLabelPoint": cc.p(360, 850),
            "goldIconPoint": cc.p(570, 850),
            "goldLabelPoint": cc.p(600, 850),
            "treasureHuntBgPoint": cc.p(360, 500),
            "treasureHuntItemPoint": cc.p(360, 452),
            "treasureHuntIcon1Point": cc.p(355, 457),
            "treasureHuntIcon2Point": cc.p(355, 457),
            "freeCountLabelPoint": cc.p(420, 342),
            "countLabelPoint": cc.p(420, 282)
        },
        "vipLayer": {
            "bgSpritePoint": cc.p(40, 106),
            "headLabelPoint": cc.p(40, 817),
            "goldIconPoint": cc.p(280, 846),
            "moneyIconPoint": cc.p(410, 846),
            "goldLabelPoint": cc.p(310, 844),
            "moneyLabelPoint": cc.p(435, 844),
            "paymentItemPoint": cc.p(600, 846),
            "scrollViewLayerRect": cc.rect(40, 194, 640, 711),
            "scrollViewSize": cc.size(640, 680),
            "scrollViewPoint": cc.p(40, 122),
            "bgSprite2Point": cc.p(360, 492),
            "okItemPoint": cc.p(360, 272),
            "failLabelPoint": cc.p(360, 572),
            "tipLabelPoint": cc.p(360, 512),
            "paymentItem2Point": cc.p(260, 432),
            "closeItemPoint": cc.p(460, 432)
        }
    }
};

var fit4Iphone5 = {
    "gameFrame": {
        "frame1Point": cc.p(0, 568),
        "frame2Point": cc.p(680, 568)
    },

    "battleScene": {
        "battleEndLayer": {
            "bgLayerPoint": cc.p(0, 0),
            "winBgSpritePoint": cc.p(320, 580),
            "obtainSpritePoint": cc.p(320, 718),
            "failBgSpritePoint": cc.p(320, 580),
            "rewardLabelPointX": 320,
            "offsetYHeight": 655,
            "okItemPoint": cc.p(320, 415)
        },
        "batterLayer": {
            "bgSpritePoint": cc.p(0, 0),
            "locatePoints": {
                1: cc.p(120, 380),
                2: cc.p(320, 380),
                3: cc.p(520, 380),
                4: cc.p(120, 180),
                5: cc.p(320, 180),
                6: cc.p(520, 180),
                7: cc.p(120, 800),
                8: cc.p(320, 800),
                9: cc.p(520, 800),
                10: cc.p(120, 1000),
                11: cc.p(320, 1000),
                12: cc.p(520, 1000)
            },
            "backItemPoint": cc.p(210, -520),
            "effect15NodePoint": cc.p(320, 568),
            "ccbNodePoint": cc.p(320, 568)
        }
    },

    "loginScene": {
        "loginLayer": {
            "accountLabelPoint": cc.p(110, 500),
            "passwordLabelPoint": cc.p(110, 400),
            "accountEditBoxPoint": cc.p(340, 500),
            "passwordEditBoxPoint": cc.p(340, 400),
            "loginButtonPoint": cc.p(220, 250),
            "registerButtonPoint": cc.p(420, 250)
        },
        "logoutLayer": {
            "bgLayerPoint": cc.p(0, 0),
            "bgSpritePoint": cc.p(323, 600),
            "msgLabelPoint": cc.p(320, 620),
            "cancelItemPoint": cc.p(320, 500)
        }

    },

    "mainScene": {
        "abilityRankLayer": {
            "scrollViewHeight": 800,
            "scrollViewLayerSize": cc.rect(14, 175, 609, 800),
            "scrollViewSize": cc.size(609, 800),
            "scrollViewPoint": cc.p(14, 175),
            "labelSize": cc.size(216, 300),
            "detailItemPoint": cc.p(68, 240),
            "sendMessageItemPoint": cc.p(68, 150),
            "addFriendItemPoint": cc.p(68, 60),
            "skyDialogRect": cc.rect(40, 198, 640, 768)
        },
        "activityLayer": {
            "bgSpritePoint": cc.p(0, 194),
            "headSpritePoint": cc.p(640, 1136),
            "itemBasePoint": cc.p(25, 1038),
            "itemOffsetX": 107
        },
        "cardEvolutionLayer": {
            "cardItemBgSpritePoint": cc.p(319, 627),
            "helpBgSpritePoint": cc.p(320, 307),
            "resLabelPoint": cc.p(320, 430),
            "tipLabelPoint": cc.p(320, 307),
            "helpLabelPoint": cc.p(320, 307),
            "selectLeadCardItemPoint": cc.p(320, 695),
            "evolutionItemPoint": cc.p(220, 197),
            "selectRetinueCardItemPoint": cc.p(420, 197),
            "selectLeadCardIconPoint": cc.p(320, 695),
            "leadCardHalfNodePoint": cc.p(320, 695)
        },
        "cardListLayer": {
            "bgSpritePoint": cc.p(0, 106),
            "headIconPoint": cc.p(0, 1056),
            "lineIconPoint": cc.p(320, 981),
            "scrollViewLayerRect": cc.rect(67, 178, 586, 752),
            "scrollViewSize": cc.size(594, 752),
            "scrollViewPoint": cc.p(27, 200),
            "sortItemPoint": cc.p(90, 152),
            "onSelectAllLowItemPoint": cc.p(260, 230),
            "selectAllLowHookIconPoint": cc.p(195, 230),
            "titleLabelPoint": cc.p(320, 1096),
            "lineUpItemPoint": cc.p(80, 1014),
            "sellItemPoint": cc.p(560, 1014),
            "okItemPoint": cc.p(560, 1014),
            "backItemPoint": cc.p(60, 1096),
            "tipLabelPoint": cc.p(60, 1014),
            "countLabelPoint": cc.p(207, 1014),
            "expLabelPoint": cc.p(385, 1014),
            "rateLabelPoint": cc.p(385, 1014),
            "moneyLabelPoint": cc.p(385, 1014)
        },
        "cardTrainLabel": {
            "cardItemBgSpritePoint": cc.p(324, 613),
            "elixirIconPoint": cc.p(470, 795),
            "elixirLabelPoint": cc.p(565, 793),
            "needElixirIconPoint": cc.p(470, 764),
            "needElixirLabelPoint": cc.p(565, 762),
            "resLabelPoint": cc.p(320, 430),
            "tipLabelPoint": cc.p(320, 307),
            "helpLabelPoint": cc.p(320, 307),
            "selectLeadCardItemPoint": cc.p(320, 695),
            "trainItemPoint": cc.p(320, 197),
            "selectLeadCardIconPoint": cc.p(320, 695),
            "leadCardHalfNodePoint": cc.p(320, 695)
        },
        "cardUpgradeLabel": {
            "cardItemBgSpritePoint": cc.p(325, 610),
            "resLabelPoint": cc.p(320, 430),
            "helpBgSpritePoint": cc.p(320, 307),
            "tipLabelPoint": cc.p(320, 307),
            "helpLabelPoint": cc.p(320, 307),
            "selectLeadCardItemPoint": cc.p(320, 695),
            "upgradeItemPoint": cc.p(220, 197),
            "selectRetinueCardItemPoint": cc.p(420, 197),
            "selectLeadCardIconPoint": cc.p(320, 695),
            "leadCardHalfNodePoint": cc.p(320, 695)
        },
        "evolutionLayer": {
            "bgSpritePoint": cc.p(0, 247),
            "playerHeaderLabelPoint": cc.p(0, 978),
            "cardEvolutionItemPoint": cc.p(70, 897),
            "cardEvolutionItemOffset": cc.p(-7, -2),
            "cardTrainItemPoint": cc.p(214, 897),
            "cardTrainItemOffset": cc.p(0, -2)
        },
        "goldRewardLayer": {
            "lineIconPoint": cc.p(0, 963),
            "headIconPoint": cc.p(0, 963),
            "scrollViewLayerRect": cc.rect(10, 194, 740, 741),
            "scrollViewHeight": 135,
            "scrollViewSize": cc.size(620, 780),
            "scrollViewPoint": cc.p(0, 160)
        },
        "lotteryLayer": {
            "bgSpritePoint": cc.p(0, 106),
            "headIconPoint": cc.p(0, 1056),
            "titleIconPoint": cc.p(320, 1096),
            "backItemPoint": cc.p(60, 1096),
            "lotteryLabelPoint": cc.p(320, 600),
            "headLabelPoint": cc.p(320, 1026),
            "energyIconPoint": cc.p(40, 1026),
            "goldIconPoint": cc.p(180, 1026),
            "fragmentIconPoint": cc.p(410, 1026),
            "energyLabelPoint": cc.p(70, 1026),
            "goldLabelPoint": cc.p(210, 1026),
            "fragmentLabelPoint": cc.p(440, 1026),
            "exchangeItemPoint": cc.p(560, 1026),
            "goldLotteryItemBasePoint": cc.p(193, 470),
            "energyLotteryItemBasePoint": cc.p(193, 550),
            "tipBgSpritePoint": cc.p(320, 220),
            "tipLabelPoint": cc.p(320, 220)
        },
        "mainBgLayer": {
            "messagesLabelPoint": cc.p(0, 1102)
        },
        "mainLayer": {
            "bgSpritePoint": cc.p(0, 282),
            "playerHeaderLabelPoint": cc.p(0, 968),
            "abilityLabelPoint": cc.p(260, 749),
            "rankingLabelPoint": cc.p(490, 749),
            "lineUpLabelPoint": cc.p(0, 853),
            "spiritLayerItemPoint": cc.p(320, 500),
            "lotteryLayerItemPoint": cc.p(125, 653),
            "treasureHuntLayerItemPoint": cc.p(125, 357),
            "strengthenLayerItemPoint": cc.p(515, 653),
            "evolutionLayerItemPoint": cc.p(515, 357),
            "activityLayerItemPoint": cc.p(53, 167),
            "cardLibraryLayerItemPoint": cc.p(160, 167),
            "rankLayerItemPoint": cc.p(267, 167),
            "achievementLayerItemPoint": cc.p(374, 167),
            "friendLayerItemPoint": cc.p(481, 167),
            "otherItemPoint": cc.p(588, 167),
            "messageItemPoint": cc.p(481, 259),
            "configLayerItemPoint": cc.p(588, 259)
        },
        "mainMenuLayer": {
            "bgSpritePoint": cc.p(0, 0),
            "itemBasePoint": cc.p(53, 54),
            "itemOffsetX": 107,
            "markSpriteBasePoint": cc.p(53, 54),
            "markSpriteOffsetX": 107
        },
        "messageLabel": {
            "messageLabelPoint": cc.p(600, 18),
            "offsetXWidth": 640
        },
        "passiveSkillAfreshLabel": {
            "cardItemBgSpritePoint": cc.p(288, 725),
            "nameLabelPoint": cc.p(203, 742),
            "lvLabelPoint": cc.p(205, 708),
            "resLabelPoint": cc.p(93, 270),
            "basePointY": 308,
            "offsetPointY": 78,
            "stopTypeLabelPoint": cc.p(66, 380),
            "selectLeadCardIconPoint": cc.p(149, 724),
            "selectLeadCardItemPoint": cc.p(151, 724),
            "afreshItemPoint": cc.p(220, 197),
            "repeatAfreshItemPoint": cc.p(420, 197),
            "startItemPoint": cc.p(220, 197),
            "cancelItemPoint": cc.p(420, 197),
            "stopItemPoint": cc.p(320, 197),
            "leadCardHeadNodePoint": cc.p(97, 670)
        },
        "passLayer": {
            "bgSpritePoint": cc.p(0, 106),
            "headIconPoint": cc.p(0, 1056),
            "titleIconPoint": cc.p(320, 1096),
            "mysticalItemPoint": cc.p(540, 610),
            "scrollViewLayerRect": cc.rect(0, 106, 640, 848),
            "scrollViewSize": cc.size(640, 848),
            "scrollViewContentSize": cc.size(640, 18700),
            "scrollViewPoint": cc.p(0, 120),
            "tipLabelPoint": cc.p(0, 988),
            "topLabelPoint": cc.p(150, 1022),
            "skillPointLabelPoint": cc.p(543, 837),
            "towerSpritePoint": cc.p(484, 138),
            "towerBgSpritePoint": cc.p(470, 132),
            "wipeOutItemPoint": cc.p(540, 1022),
            "resetItemPoint": cc.p(540, 1022),
            "bgLayerPoint": cc.p(0, 88),
            "bgSprite2Point": cc.p(320, 580),
            "rewardLabelPoint": cc.p(320, 650),
            "okItemPoint": cc.p(220, 530),
            "closeItemPoint": cc.p(420, 530),
            "obtainSpritePoint": cc.p(320, 718),
            "rewardLabelBasePoint": cc.p(320, 655),
            "rewardLabelOffsetY" : 45,
            "okItem2Point": cc.p(320, 415)
        },
        "playerHeaderLabel": {
            "nameLabelPoint": cc.p(130, 83),
            "expBgPoint": cc.p(210, 36),
            "expProgressPoint": cc.p(214, 36),
            "lvBgPoint": cc.p(60, 60),
            "lvLabelPoint": cc.p(57, 58),
            "goldLabelPoint": cc.p(540, 83),
            "moneyLabelPoint": cc.p(580, 36),
            "powerLabelPoint": cc.p(427, 36),
            "vipSpritePoint": cc.p(410, 83)
        },
        "powerRewardLayer": {
            "lineIconPoint": cc.p(0, 963),
            "headTextPoint": cc.p(125, 988),
            "tipIconPoint": cc.p(80, 715),
            "powerBgIconPoint": cc.p(85, 290),
            "textOffsetX": 270,
            "itemText1BasePoint": cc.p(160, 810),
            "itemText2BasePoint": cc.p(120, 770),
            "timeText1BasePoint": cc.p(115, 770),
            "timeText2BasePoint": cc.p(200, 770),
            "itemText3BasePoint": cc.p(130, 730),
            "btnGetRewardPoint": cc.p(315, 210)
        },
        "propsLayer": {
            "bgSpritePoint": cc.p(0, 106),
            "headLabelPoint": cc.p(0, 993),
            "goldIconPoint": cc.p(240, 1022),
            "moneyIconPoint": cc.p(370, 1022),
            "goldLabelPoint": cc.p(270, 1020),
            "moneyLabelPoint": cc.p(395, 1020),
            "paymentItemPoint": cc.p(560, 1022),
            "scrollViewLayerRect": cc.rect(40, 106, 640, 843),
            "scrollViewSize": cc.size(640, 822),
            "scrollViewPoint": cc.p(0, 144)
        },
        "rechargeLayer": {
            "headIconPoint": cc.p(80, 785),
            "midIconPoint": cc.p(40, 195),
            "itemTextPoint": cc.p(80, 660),
            "textBasePoint": cc.p(80, 615),
            "textOffsetY": 35,
            "go2PaymentItemPoint": cc.p(320, 300),
            "btnTitlePoint": cc.p(320, 300)
        },
        "shopLayer": {
            "headIconPoint": cc.p(0, 1050),
            "vipLayerItemPoint": cc.p(71, 1093),
            "propsLayerItemPoint": cc.p(214, 1093)
        },
        "signInLayer": {
            "bgSpriteSize": cc.size(560, 720),
            "bgSpritePoint": cc.p(322, 565),
            "titleLabelPoint": cc.p(320, 885),
            "turnLeftItemPoint": cc.p(47, 680),
            "turnRightItemPoint": cc.p(591, 680),
            "signInItemPoint": cc.p(520, 455),
            "remedySignInItemPoint": cc.p(395, 455),
            "specialOfferIconPoint": cc.p(340, 403),
            "spritePoint": cc.p(365, 418),
            "spendPoint": cc.p(408, 418),
            "signInIconPoint": cc.p(520, 455),
            "remedySignInIconPoint": cc.p(395, 455),
            "scrollViewLayerRect": cc.rect(105, 510, 510, 366),
            "monthLabelOffsetX": 510,
            "scrollViewSize": cc.size(510, 366),
            "scrollViewPoint": cc.p(65, 490),
            "signInCountIconPoint": cc.p(195, 455),
            "signInCountLabelPoint": cc.p(290, 455),
            "pointBasePoint": cc.p(120, 370),
            "pointOffsetX": 100,
            "rewardLabelPoint": cc.p(320, 290),
            "rewardBgSpriteSize": cc.size(512, 96)
        },
        "skillUpgradeLabel": {
            "cardItemBgSpritePoint": cc.p(326, 622),
            "skillPointIconPoint": cc.p(495, 780),
            "skillPointLabelPoint": cc.p(545, 778),
            "resLabelPoint": cc.p(320, 430),
            "helpBgSpritePoint": cc.p(320, 307),
            "tipLabelPoint": cc.p(320, 307),
            "helpLabelPoint": cc.p(320, 307),
            "selectLeadCardItemPoint": cc.p(320, 695),
            "upgradeItemPoint": cc.p(320, 197),
            "selectLeadCardIconPoint": cc.p(320, 695),
            "leadCardHalfNodePoint": cc.p(320, 695),
            "effectPoint": cc.p(320, 510)

        },
        "spiritPoolLayer": {
            "bgSpritePoint": cc.p(0, 194),
            "headIconPoint": cc.p(0, 1056),
            "titleIconPoint": cc.p(320, 1096),
            "backItemPoint": cc.p(60, 1096),
            "spiritIconPoint": cc.p(90, 933),
            "countIconPoint": cc.p(510, 963),
            "countLabelIconPoint": cc.p(410, 963),
            "countLabelPoint": cc.p(560, 963),
            "perObtainIconPoint": cc.p(510, 913),
            "perObtainLabelIconPoint": cc.p(410, 913),
            "preObtainLabelPoint": cc.p(560, 913),
            "lvIconPoint": cc.p(150, 258),
            "lvLabelPoint": cc.p(230, 258),
            "expLabelPoint": cc.p(360, 258),
            "tipLabelPoint": cc.p(320, 200),
            "spiritItemPoint": cc.p(90, 933),
            "spiritPoolItemPoint": cc.p(320, 600),
            "useGoldItemPoint": cc.p(320, 340),
            "hookPoint": cc.p(195, 342),
            "spiritPoint": cc.p(320, 630)
        },
        "strengthenLayer": {
            "bgSpritePoint": cc.p(0, 247),
            "playerHeaderLabelPoint": cc.p(0, 968),
            "cardUpgradeItemPoint": cc.p(70, 897),
            "cardUpgradeItemOffset": cc.p(-7, -2),
            "skillUpgradeItemPoint": cc.p(214, 897),
            "skillUpgradeItemOffset": cc.p(0, -2),
            "passiveSkillUpgradeItemPoint": cc.p(364, 897),
            "passiveSkillUpgradeItemOffset": cc.p(0, -2)

        },
        "taskLayer": {
            "locatePoints":  [
                cc.p(160, 706),
                cc.p(200, 356),
                cc.p(440, 572),
                cc.p(480, 326),
                cc.p(360, 70),

                cc.p(160, 706),
                cc.p(200, 356),
                cc.p(440, 602),
                cc.p(480, 326),
                cc.p(340, 70),

                cc.p(160, 706),
                cc.p(210, 396),
                cc.p(415, 612),
                cc.p(480, 326),
                cc.p(360, 70),

                cc.p(160, 706),
                cc.p(200, 376),
                cc.p(420, 602),
                cc.p(480, 326),
                cc.p(360, 70),

                cc.p(155, 706),
                cc.p(200, 356),
                cc.p(420, 602),
                cc.p(480, 326),
                cc.p(360, 70),

                cc.p(160, 706),
                cc.p(200, 376),
                cc.p(440, 602),
                cc.p(480, 326),
                cc.p(360, 70),

                cc.p(160, 706),
                cc.p(200, 356),
                cc.p(440, 582),
                cc.p(480, 326),
                cc.p(360, 70),

                cc.p(160, 706),
                cc.p(200, 356),
                cc.p(440, 572),
                cc.p(480, 326),
                cc.p(360, 70),

                cc.p(140, 706),
                cc.p(200, 356),
                cc.p(420, 602),
                cc.p(480, 326),
                cc.p(360, 70),

                cc.p(140, 706),
                cc.p(200, 356),
                cc.p(430, 592),
                cc.p(480, 326),
                cc.p(360, 70)
            ],
            "headIconPoint": cc.p(0, 1056),
            "titleIconPoint": cc.p(320, 1096),
            "wipeOutItemPoint": cc.p(555, 142),
            "turnLeftSpritePoint": cc.p(40, 550),
            "turnRightSpritePoint": cc.p(600, 550),
            "scrollViewLayerRect": cc.rect(0, 106, 640, 950),
            "scrollViewSize": cc.size(640, 950),
            "scrollViewContentSize": cc.size(6400, 950),
            "scrollViewPoint": cc.p(0, 106),
            "titlePointY": 920
        },
        "tournamentLayer": {
            "bgSpritePoint": cc.p(0, 194),
            "playerLabelPoint": cc.p(0, 1004),
            "nameLabelPoint": cc.p(110, 1101),
            "expBgPoint": cc.p(170, 1063),
            "expProgressPoint": cc.p(174, 1063),
            "lvBgPoint": cc.p(50, 1083),
            "lvLabelPoint": cc.p(47, 1083),
            "countLabelPoint": cc.p(490, 1101),
            "rankingLabelPoint": cc.p(390, 1061),
            "elixirLabelPoint": cc.p(565, 1061),
            "rewardIconPoint": cc.p(320, 988),
            "rewardLabelPoint": cc.p(320, 988),
            "buyCountItemPoint": cc.p(535, 1103),
            "rewardItemPoint": cc.p(120, 988),
            "labelContentSize": cc.size(216, 300),
            "detailItemPoint": cc.p(108, 240),
            "sendMessageItemPoint": cc.p(108, 150),
            "addFriendItemPoint": cc.p(108, 60),
            "skyDialogRect": cc.rect(40, 198, 640, 700),
            "scrollViewLayerRect": cc.rect(40, 154, 621, 758),
            "scrollViewSize": cc.size(621, 758),
            "scrollViewContentSizeWidth": 640,
            "scrollViewPoint": cc.p(10, 154)
        },
        "treasureHuntLayer": {
            "locatePoints": [
                cc.p(70, 895),
                cc.p(195, 895),
                cc.p(320, 895),
                cc.p(445, 895),
                cc.p(570, 895),
                cc.p(570, 788),
                cc.p(570, 681),
                cc.p(570, 574),
                cc.p(570, 467),
                cc.p(570, 360),
                cc.p(570, 253),
                cc.p(445, 253),
                cc.p(320, 253),
                cc.p(195, 253),
                cc.p(70, 253),
                cc.p(70, 360),
                cc.p(70, 467),
                cc.p(70, 574),
                cc.p(70, 681),
                cc.p(70, 788)
            ],
            "bgSpritePoint": cc.p(0, 194),
            "headIconPoint": cc.p(0, 1056),
            "titleIconPoint": cc.p(320, 1096),
            "backItemPoint": cc.p(60, 1096),
            "headLabelPoint": cc.p(320, 1026),
            "goldIconPoint": cc.p(530, 1026),
            "goldLabelPoint": cc.p(560, 1026),
            "treasureHuntBgPoint": cc.p(320, 588),
            "treasureHuntItemPoint": cc.p(320, 540),
            "treasureHuntIcon1Point": cc.p(315, 545),
            "treasureHuntIcon2Point": cc.p(315, 545),
            "freeCountLabelPoint": cc.p(380, 430),
            "countLabelPoint": cc.p(380, 370)
        },
        "vipLayer": {
            "bgSpritePoint": cc.p(0, 106),
            "headLabelPoint": cc.p(0, 993),
            "goldIconPoint": cc.p(240, 1022),
            "moneyIconPoint": cc.p(370, 1022),
            "goldLabelPoint": cc.p(270, 1020),
            "moneyLabelPoint": cc.p(395, 1020),
            "paymentItemPoint": cc.p(560, 1022),
            "scrollViewLayerRect": cc.rect(40, 106, 640, 843),
            "scrollViewSize": cc.size(640, 822),
            "scrollViewPoint": cc.p(0, 144),
            "bgSprite2Point": cc.p(320, 580),
            "okItemPoint": cc.p(320, 360),
            "failLabelPoint": cc.p(320, 660),
            "tipLabelPoint": cc.p(320, 600),
            "paymentItem2Point": cc.p(220, 520),
            "closeItemPoint": cc.p(420, 520)
        }
    }
};


var gameFit = null;
var gameDevice = "Unknown";

var gameFitAdapter = function () {
    cc.log("gameFitAdapter");

    var size = cc.Director.getInstance().getWinSize();
    var height = size.height;

    cc.log("宽度: " + size.width + " | 高度: " + size.height);

    if (height == 1136) {
        gameFit = fit4Iphone5;
        gameDevice = "Iphone5";
    } else {
        gameFit = fit4Iphone4;
        gameDevice = "Other";
    }
};