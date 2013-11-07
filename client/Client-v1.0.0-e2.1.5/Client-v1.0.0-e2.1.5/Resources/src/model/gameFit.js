/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-11-5
 * Time: 下午4:48
 * To change this template use File | Settings | File Templates.
 */

var gameFit = null;

var fit4Iphone4 = {

    "gameFrame": {
        "frame1Point": cc.p(0, 568),
        "frame2Point": cc.p(680, 568)
    },

    "battleScene": {
        "batterLayer": {
            "bgSpritePoint": cc.p(40, 0),
            "locatePoints": {
                1: cc.p(160, 440),
                2: cc.p(360, 440),
                3: cc.p(560, 440),
                4: cc.p(160, 240),
                5: cc.p(360, 240),
                6: cc.p(560, 240),
                7: cc.p(160, 740),
                8: cc.p(360, 740),
                9: cc.p(560, 740),
                10: cc.p(160, 940),
                11: cc.p(360, 940),
                12: cc.p(560, 940)
            },
            "backItemPoint": cc.p(250, -460),
            "effect15NodePoint": cc.p(360, 568),
            "ccbNodePoint": cc.p(360, 568)
        },
        "battleEndLayer": {
            "bgLayerPoint": cc.p(40, 0),
            "winBgSpritePoint": cc.p(360, 580),
            "obtainSpritePoint": cc.p(360, 718),
            "failBgSpritePoint": cc.p(360, 580),
            "offsetYHeight": 655,
            "okItemPoint": cc.p(360, 415)
        }
    },

    "loginScene": {
        "loginLayer": {
            "accountLabelPoint": cc.p(150, 500),
            "passwordLabelPoint": cc.p(150, 400),
            "accountEditBoxPoint": cc.p(380, 500),
            "passwordEditBoxPoint": cc.p(380, 400),
            "loginButtonPoint": cc.p(260, 250),
            "registerButton": cc.p(460, 250)
        },
        "LogoutLayer": {
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
            "bgSpritePoint": cc.p(40, 194),
            "headSpritePoint": cc.p(680, 1048),
            "itemBasePoint": cc.p(65, 950),
            "itemOffsetX": 107
        },
        "cardEvolutionLayer": {
            "cardItemBgSpritePoint": cc.p(359, 627),
            "helpBgSpritePoint": cc.p(360, 380),
            "resLabelPoint": cc.p(360, 510),
            "nameLabelPoint": cc.p(0, 25),
            "evolutionRateIconPoint": cc.p(-30, -25),
            "evolutionRateLabelPoint": cc.p(30, -27),
            "tipLabelPoint": cc.p(360, 380),
            "tipLabel1Point": cc.p(0, 20),
            "tipLabel2Point": cc.p(0, -20),
            "helpLabelPoint": cc.p(360, 380),
            "moneyIconPoint": cc.p(-160, 0),
            "cardCountIconPoint": cc.p(120, 0),
            "moneyLabelPoint": cc.p(-100, -2),
            "cardCountLabelPoint": cc.p(180, -2),
            "selectLeadCardItemPoint": cc.p(360, 685),
            "evolutionItemPoint": cc.p(260, 270),
            "selectRetinueCardItemPoint": cc.p(460, 270),
            "selectLeadCardIconPoint": cc.p(360, 685),
            "leadCardHalfNodePoint": cc.p(360, 685)
        },
        "cardTrainLabel": {
            "cardItemBgSpritePoint": cc.p(364, 613),
            "elixirIconPoint": cc.p(510, 755),
            "elixirLabelPoint": cc.p(605, 753),
            "needElixirIconPoint": cc.p(510, 724),
            "needElixirLabelPoint": cc.p(605, 722),
            "resLabelPoint": cc.p(360, 510),
            "nameLabelPoint": cc.p(0, 40),
            "hpIconPoint": cc.p(-85, 2),
            "hpLabelPoint": cc.p(0, 0),
            "hpAdditionLabelPoint": cc.p(85, 0),
            "atkIconPoint": cc.p(-85, -33),
            "atkAdditionLabelPoint": cc.p(85, -35),
            "tipLabelPoint": cc.p(360, 380),
            "tipLabelBgSpritePoint": cc.p(0, 0),
            "tipLabel1Point": cc.p(0, 20),
            "tipLabel2Point": cc.p(0, -20),
            "helpLabelPoint": cc.p(360, 380),
            "trainTypeLabelPoint": cc.p(0, 25),
            "trainCountLabelPoint": cc.p(0, -25),
            "trainHpIconPoint": cc.p(-130, 25),
            "trainAtkIconPoint": cc.p(110, 25),
            "trainOneIconPoint": cc.p(-130, -25),
            "trainTenIconPoint": cc.p(110, -25),
            "trainHpItemPoint": cc.p(-160, 25),
            "trainAtkItemPoint": cc.p(80, 25),
            "trainOneItemPoint": cc.p(-160, -25),
            "trainTenItemPoint": cc.p(80, -25),
            "selectLeadCardItemPoint": cc.p(360, 685),
            "trainItemPoint": cc.p(360, 270),
            "selectLeadCardIconPoint": cc.p(360, 685),
            "leadCardHalfNodePoint": cc.p(360, 685)
        },
        "cardUpgradeLabel": {
            "cardItemBgSpritePoint": cc.p(365, 600),
            "resLabelPoint": cc.p(360, 510),
            "hpIconPoint": cc.p(-85, 40),
            "hpLabelPoint": cc.p(0, 38),
            "hpAdditionLabelPoint": cc.p(85, 38),
            "atkIconPoint": cc.p(-85, 5),
            "atkLabelPoint": cc.p(0, 3),
            "atkAdditionLabelPoint": cc.p(85, 3),
            "lvLabelPoint": cc.p(-85, -35),
            "progressPoint": cc.p(30, -35),
            "helpBgSpritePoint": cc.p(360, 380),
            "tipLabelPoint": cc.p(360, 380),
            "helpLabelPoint": cc.p(360, 380),
            "expIconPoint": cc.p(-160, 20),
            "moneyIconPoint": cc.p(-160, -20),
            "cardCountIconPoint": cc.p(120, -20),
            "expLabelPoint": cc.p(-100, 18),
            "moneyLabelPoint": cc.p(-100, -22),
            "cardCountLabelPoint": cc.p(180, -22),
            "selectLeadCardItemPoint": cc.p(360, 685),
            "upgradeItemPoint": cc.p(260, 270),
            "selectRetinueCardItemPoint": cc.p(460, 270),
            "selectLeadCardIconPoint": cc.p(360, 685),
            "leadCardHalfNodePoint": cc.p(360, 685)
        },
        "evolutionLayer": {
            "bgSpritePoint": cc.p(40, 194),
            "playerHeaderLabelPoint": cc.p(40, 890),
            "cardEvolutionItemPoint": cc.p(110, 844),
            "cardEvolutionItemOffset": cc.p(-7, -2),
            "cardTrainItemPoint": cc.p(254, 844),
            "cardTrainItemOffset": cc.p(0, -2)
        },
        "lotteryLayer": {
            "bgSpritePoint": cc.p(40, 0),
            "headIconPoint": cc.p(40, 968),
            "titleIconPoint": cc.p(360, 1008),
            "backItemPoint": cc.p(100, 1008),
            "lotteryLabelPoint": cc.p(360, 600),
            "headLabelPoint": cc.p(360, 938),
            "energyIconPoint": cc.p(80, 938),
            "goldIconPoint": cc.p(220, 938),
            "fragmentIconPoint": cc.p(450, 938),
            "energyLabelPoint": cc.p(110, 938),
            "goldLabelPoint": cc.p(250, 938),
            "fragmentLabelPoint": cc.p(480, 938),
            "exchangeItemPoint": cc.p(600, 938),
            "goldLotteryItemBasePoint": cc.p(233, 470),
            "energyLotteryItemBasePoint": cc.p(233, 550),
            "tipBgSpritePoint": cc.p(360, 220),
            "tipLabelPoint": cc.p(360, 220)
        },
        "mainBgLayer": {
            "messagesLabelPoint": cc.p(40, 1014)
        },
        "mainLayer": {
            "bgSpritePoint": cc.p(40, 194),
            "playerHeaderLabelPoint": cc.p(40, 890),
            "abilityLabelPoint": cc.p(300, 696),
            "rankingLabelPoint": cc.p(530, 696),
            "lineUpLabelPoint": cc.p(40, 800),
            "spiritLayerItemPoint": cc.p(360, 500),
            "lotteryLayerItemPoint": cc.p(165, 600),
            "treasureHuntLayerItemPoint": cc.p(165, 410),
            "strengthenLayerItemPoint": cc.p(555, 600),
            "evolutionLayerItemPoint": cc.p(555, 410),
            "activityLayerItemPoint": cc.p(93, 245),
            "cardLibraryLayerItemPoint": cc.p(200, 245),
            "rankLayerItemPoint": cc.p(307, 245),
            "achievementLayerItemPoint": cc.p(414, 245),
            "friendLayerItemPoint": cc.p(521, 245),
            "otherItemPoint": cc.p(628, 245),
            "messageItemPoint": cc.p(521, 322),
            "configLayerItemPoint": cc.p(628, 322)
        },
        "mainMenuLayer": {
            "bgSpritePoint": cc.p(40, 88),
            "itemBasePoint": cc.p(93, 142),
            "itemOffsetX": 107,
            "markSpriteBasePoint": cc.p(93, 142),
            "markSpriteOffsetX": 107
        },
        "messageLabel": {
            "messageLabelPoint": cc.p(640, 18),
            "offsetXWidth": 640
        },
        "passiveSkillAfreshLabel": {
            "cardItemBgSpritePoint": cc.p(328, 725),
            "nameLabelPoint": cc.p(243, 742),
            "lvLabelPoint": cc.p(245, 708),
            "resLabelPoint": cc.p(133, 300),
            "tipLabelPoint": cc.p(380, 349),
            "tipLabel2Point": cc.p(227, 45),
            "basePointY": 308,
            "offsetPointY": 78,
            "passiveSkillBgSpritePointX": 0,
            "nameLabelPointX": 80,
            "valueLabelPointX": 190,
            "lockIconPointX": 310,
            "lockItemPointX": 385,
            "hookLabelPointX": 360,
            "useMoneyItemPoint": cc.p(60, 92),
            "useGoldItemPoint": cc.p(280, 92),
            "moneyIconPoint": cc.p(100, 92),
            "moneyLabelPoint": cc.p(130, 90),
            "goldIconPoint": cc.p(325, 92),
            "goldLabelPoint": cc.p(350, 90),
            "stopTypeLabelPoint": cc.p(106, 380),
            "stopUntilBlueIconPoint": cc.p(80, 178),
            "stopUntilYellowIconPoint": cc.p(80, 96),
            "stopUntilBlueItemPoint": cc.p(60, 178),
            "stopUntilYellowItemPoint": cc.p(60, 96),
            "selectLeadCardIconPoint": cc.p(189, 724),
            "selectLeadCardItemPoint": cc.p(191, 724),
            "afreshItemPoint": cc.p(260, 270),
            "repeatAfreshItemPoint": cc.p(460, 270),
            "startItemPoint": cc.p(260, 270),
            "cancelItemPoint": cc.p(460, 270),
            "stopItemPoint": cc.p(360, 270),
            "leadCardHeadNodePoint": cc.p(137, 670)
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
        "skillUpgradeLabel": {
            "cardItemBgSpritePoint": cc.p(366, 632),
            "skillPointIconPoint": cc.p(535, 760),
            "skillPointLabelPoint": cc.p(585, 758),
            "resLabelPoint": cc.p(360, 510),
            "nameLabelPoint": cc.p(0, 40),
            "skillLvIconPoint": cc.p(-85, 2),
            "skillLvLabelPoint": cc.p(0, 0),
            "nextSkillLvLabelPoint": cc.p(100, 0),
            "skillHarmIconPoint": cc.p(-85, -33),
            "skillHarmLabelPoint": cc.p(0, -35),
            "nextSkillHarmLabelPoint": cc.p(100, -35),
            "arrowLabel1Point": cc.p(50, 0),
            "arrowLabel2Point": cc.p(50, -35),
            "helpBgSpritePoint": cc.p(360, 380),
            "tipLabelPoint": cc.p(360, 380),
            "tipLabel1Point": cc.p(0, 20),
            "tipLabel2Point": cc.p(0, -20),
            "helpLabelPoint": cc.p(360, 380),
            "needSkillPointIconPoint": cc.p(-44, 0),
            "needSkillPointLabelPoint": cc.p(44, -2),
            "selectLeadCardItemPoint": cc.p(360, 685),
            "upgradeItemPoint": cc.p(360, 270),
            "selectLeadCardIconPoint": cc.p(360, 685),
            "leadCardHalfNodePoint": cc.p(360, 685),
            "effectPoint": cc.p(360, 510)

        },
        "spiritPoolLayer": {
            "bgSpritePoint": cc.p(40, 194),
            "headIconPoint": cc.p(40, 968),
            "titleIconPoint": cc.p(360, 1008),
            "backItemPoint": cc.p(100, 1008),
            "spiritIconPoint": cc.p(130, 880),
            "countIconPoint": cc.p(550, 930),
            "countLabelIconPoint": cc.p(450, 930),
            "countLabelPoint": cc.p(600, 930),
            "perObtainIconPoint": cc.p(550, 880),
            "perObtainLabelIconPoint": cc.p(450, 880),
            "preObtainLabelPoint": cc.p(600, 880),
            "lvIconPoint": cc.p(190, 288),
            "lvLabelPoint": cc.p(270, 288),
            "expLabelPoint": cc.p(400, 288),
            "tipLabelPoint": cc.p(360, 230),
            "spiritItemPoint": cc.p(130, 880),
            "spiritPoolItemPoint": cc.p(360, 630),
            "useGoldItemPoint": cc.p(360, 370),
            "hookPoint": cc.p(235, 372),
            "spiritPoint": cc.p(360, 630)
        },
        "strengthenLayer": {
            "bgSpritePoint": cc.p(40, 194),
            "playerHeaderLabelPoint": cc.p(40, 890),
            "cardUpgradeItemPoint": cc.p(110, 844),
            "cardUpgradeItemOffset": cc.p(-7, -2),
            "skillUpgradeItemPoint": cc.p(254, 844),
            "skillUpgradeItemOffset": cc.p(0, -2),
            "passiveSkillUpgradeItemPoint": cc.p(404, 844),
            "passiveSkillUpgradeItemOffset": cc.p(0, -2)

        },
        "treasureHuntLayer": {
            "locatePoints": [
                cc.p(110, 853),
                cc.p(235, 853),
                cc.p(360, 853),
                cc.p(485, 853),
                cc.p(610, 853),
                cc.p(610, 753),
                cc.p(610, 653),
                cc.p(610, 553),
                cc.p(610, 453),
                cc.p(610, 353),
                cc.p(610, 253),
                cc.p(485, 253),
                cc.p(360, 253),
                cc.p(235, 253),
                cc.p(110, 253),
                cc.p(110, 353),
                cc.p(110, 453),
                cc.p(110, 553),
                cc.p(110, 653),
                cc.p(110, 753)
            ],
            "bgSpritePoint": cc.p(40, 194),
            "headIconPoint": cc.p(40, 968),
            "titleIconPoint": cc.p(360, 1008),
            "backItemPoint": cc.p(100, 1008),
            "headLabelPoint": cc.p(360, 938),
            "goldIconPoint": cc.p(570, 938),
            "goldLabelPoint": cc.p(600, 938),
            "treasureHuntBgPoint": cc.p(360, 588),
            "treasureHuntItemPoint": cc.p(360, 540),
            "treasureHuntIcon1Point": cc.p(355, 545),
            "treasureHuntIcon2Point": cc.p(355, 545),
            "freeCountLabelPoint": cc.p(420, 430),
            "countLabelPoint": cc.p(420, 370)
        }
    }
};

var fit4Iphone5 = {

    "gameFrame": {
        "frame1Point": cc.p(0, 568),
        "frame2Point": cc.p(680, 568)
    },

    "battleScene": {
        "batterLayer": {
            "bgSpritePoint": cc.p(40, 0),
            "locatePoints": {
                1: cc.p(160, 380),
                2: cc.p(360, 380),
                3: cc.p(560, 380),
                4: cc.p(160, 180),
                5: cc.p(360, 180),
                6: cc.p(560, 180),
                7: cc.p(160, 800),
                8: cc.p(360, 800),
                9: cc.p(560, 800),
                10: cc.p(160, 1000),
                11: cc.p(360, 1000),
                12: cc.p(560, 1000)
            },
            "backItemPoint": cc.p(250, -520),
            "effect15NodePoint": cc.p(360, 568),
            "ccbNodePoint": cc.p(360, 568)
        },
        "battleEndLayer": {
            "bgLayerPoint": cc.p(40, 0),
            "winBgSpritePoint": cc.p(360, 580),
            "obtainSpritePoint": cc.p(360, 718),
            "failBgSpritePoint": cc.p(360, 580),
            "offsetYHeight": 655,
            "okItemPoint": cc.p(360, 415)
        }
    },

    "loginScene": {
        "loginLayer": {
            "accountLabelPoint": cc.p(150, 500),
            "passwordLabelPoint": cc.p(150, 400),
            "accountEditBoxPoint": cc.p(380, 500),
            "passwordEditBoxPoint": cc.p(380, 400),
            "loginButtonPoint": cc.p(260, 250),
            "registerButton": cc.p(460, 250)
        },
        "LogoutLayer": {
            "bgLayerPoint": cc.p(40, 0),
            "bgSpritePoint": cc.p(363, 600),
            "msgLabelPoint": cc.p(360, 620),
            "cancelItemPoint": cc.p(360, 500)
        }

    },

    "mainScene": {
        "abilityRankLayer": {
            "scrollViewHeight": 800,
            "scrollViewLayerSize": cc.rect(54, 175, 609, 800),
            "scrollViewSize": cc.size(609, 800),
            "scrollViewPoint": cc.p(54, 175),
            "labelSize": cc.size(216, 300),
            "detailItemPoint": cc.p(108, 240),
            "sendMessageItemPoint": cc.p(108, 150),
            "addFriendItemPoint": cc.p(108, 60),
            "skyDialogRect": cc.rect(40, 198, 640, 768)
        },
        "activityLayer": {
            "bgSpritePoint": cc.p(40, 194),
            "headSpritePoint": cc.p(680, 1136),
            "itemBasePoint": cc.p(65, 1038),
            "itemOffsetX": 107
        },
        "cardEvolutionLayer": {
            "cardItemBgSpritePoint": cc.p(359, 627),
            "helpBgSpritePoint": cc.p(360, 307),
            "resLabelPoint": cc.p(360, 430),
            "nameLabelPoint": cc.p(0, 25),
            "evolutionRateIconPoint": cc.p(-30, -25),
            "evolutionRateLabelPoint": cc.p(30, -27),
            "tipLabelPoint": cc.p(360, 307),
            "tipLabel1Point": cc.p(0, 20),
            "tipLabel2Point": cc.p(0, -20),
            "helpLabelPoint": cc.p(360, 307),
            "moneyIconPoint": cc.p(-160, 0),
            "cardCountIconPoint": cc.p(120, 0),
            "moneyLabelPoint": cc.p(-100, -2),
            "cardCountLabelPoint": cc.p(180, -2),
            "selectLeadCardItemPoint": cc.p(360, 695),
            "evolutionItemPoint": cc.p(260, 197),
            "selectRetinueCardItemPoint": cc.p(460, 197),
            "selectLeadCardIconPoint": cc.p(360, 695),
            "leadCardHalfNodePoint": cc.p(360, 695)
        },
        "cardTrainLabel": {
            "cardItemBgSpritePoint": cc.p(364, 613),
            "elixirIconPoint": cc.p(510, 795),
            "elixirLabelPoint": cc.p(605, 793),
            "needElixirIconPoint": cc.p(510, 764),
            "needElixirLabelPoint": cc.p(605, 762),
            "resLabelPoint": cc.p(360, 430),
            "nameLabelPoint": cc.p(0, 40),
            "hpIconPoint": cc.p(-85, 2),
            "hpLabelPoint": cc.p(0, 0),
            "hpAdditionLabelPoint": cc.p(85, 0),
            "atkIconPoint": cc.p(-85, -33),
            "atkAdditionLabelPoint": cc.p(85, -35),
            "tipLabelPoint": cc.p(360, 307),
            "tipLabelBgSpritePoint": cc.p(0, 0),
            "tipLabel1Point": cc.p(0, 20),
            "tipLabel2Point": cc.p(0, -20),
            "helpLabelPoint": cc.p(360, 307),
            "trainTypeLabelPoint": cc.p(0, 25),
            "trainCountLabelPoint": cc.p(0, -25),
            "trainHpIconPoint": cc.p(-130, 25),
            "trainAtkIconPoint": cc.p(110, 25),
            "trainOneIconPoint": cc.p(-130, -25),
            "trainTenIconPoint": cc.p(110, -25),
            "trainHpItemPoint": cc.p(-160, 25),
            "trainAtkItemPoint": cc.p(80, 25),
            "trainOneItemPoint": cc.p(-160, -25),
            "trainTenItemPoint": cc.p(80, -25),
            "selectLeadCardItemPoint": cc.p(360, 695),
            "trainItemPoint": cc.p(360, 197),
            "selectLeadCardIconPoint": cc.p(360, 695),
            "leadCardHalfNodePoint": cc.p(360, 695)
        },
        "cardUpgradeLabel": {
            "cardItemBgSpritePoint": cc.p(365, 610),
            "resLabelPoint": cc.p(360, 430),
            "hpIconPoint": cc.p(-85, 40),
            "hpLabelPoint": cc.p(0, 38),
            "hpAdditionLabelPoint": cc.p(85, 38),
            "atkIconPoint": cc.p(-85, 5),
            "atkLabelPoint": cc.p(0, 3),
            "atkAdditionLabelPoint": cc.p(85, 3),
            "lvLabelPoint": cc.p(-85, -35),
            "progressPoint": cc.p(30, -35),
            "helpBgSpritePoint": cc.p(360, 307),
            "tipLabelPoint": cc.p(360, 307),
            "helpLabelPoint": cc.p(360, 307),
            "expIconPoint": cc.p(-160, 20),
            "moneyIconPoint": cc.p(-160, -20),
            "cardCountIconPoint": cc.p(120, -20),
            "expLabelPoint": cc.p(-100, 18),
            "moneyLabelPoint": cc.p(-100, -22),
            "cardCountLabelPoint": cc.p(180, -22),
            "selectLeadCardItemPoint": cc.p(360, 695),
            "upgradeItemPoint": cc.p(260, 197),
            "selectRetinueCardItemPoint": cc.p(460, 197),
            "selectLeadCardIconPoint": cc.p(360, 695),
            "leadCardHalfNodePoint": cc.p(360, 695)
        },
        "evolutionLayer": {
            "bgSpritePoint": cc.p(40, 247),
            "playerHeaderLabelPoint": cc.p(40, 978),
            "cardEvolutionItemPoint": cc.p(110, 897),
            "cardEvolutionItemOffset": cc.p(-7, -2),
            "cardTrainItemPoint": cc.p(254, 897),
            "cardTrainItemOffset": cc.p(0, -2)
        },
        "lotteryLayer": {
            "bgSpritePoint": cc.p(40, 106),
            "headIconPoint": cc.p(40, 1056),
            "titleIconPoint": cc.p(360, 1096),
            "backItemPoint": cc.p(100, 1096),
            "lotteryLabelPoint": cc.p(360, 600),
            "headLabelPoint": cc.p(360, 1026),
            "energyIconPoint": cc.p(80, 1026),
            "goldIconPoint": cc.p(220, 1026),
            "fragmentIconPoint": cc.p(450, 1026),
            "energyLabelPoint": cc.p(110, 1026),
            "goldLabelPoint": cc.p(250, 1026),
            "fragmentLabelPoint": cc.p(480, 1026),
            "exchangeItemPoint": cc.p(600, 1026),
            "goldLotteryItemBasePoint": cc.p(233, 470),
            "energyLotteryItemBasePoint": cc.p(233, 550),
            "tipBgSpritePoint": cc.p(360, 220),
            "tipLabelPoint": cc.p(360, 220)
        },
        "mainBgLayer": {
            "messagesLabelPoint": cc.p(40, 1102)
        },
        "mainLayer": {
            "bgSpritePoint": cc.p(40, 282),
            "playerHeaderLabelPoint": cc.p(40, 968),
            "abilityLabelPoint": cc.p(300, 749),
            "rankingLabelPoint": cc.p(530, 749),
            "lineUpLabelPoint": cc.p(40, 853),
            "spiritLayerItemPoint": cc.p(360, 500),
            "lotteryLayerItemPoint": cc.p(165, 653),
            "treasureHuntLayerItemPoint": cc.p(165, 357),
            "strengthenLayerItemPoint": cc.p(555, 653),
            "evolutionLayerItemPoint": cc.p(555, 357),
            "activityLayerItemPoint": cc.p(93, 167),
            "cardLibraryLayerItemPoint": cc.p(200, 167),
            "rankLayerItemPoint": cc.p(307, 167),
            "achievementLayerItemPoint": cc.p(414, 167),
            "friendLayerItemPoint": cc.p(521, 167),
            "otherItemPoint": cc.p(628, 167),
            "messageItemPoint": cc.p(521, 259),
            "configLayerItemPoint": cc.p(628, 259)
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
            "cardItemBgSpritePoint": cc.p(328, 725),
            "nameLabelPoint": cc.p(243, 742),
            "lvLabelPoint": cc.p(245, 708),
            "resLabelPoint": cc.p(133, 270),
            "tipLabelPoint": cc.p(380, 349),
            "tipLabel2Point": cc.p(227, 45),
            "basePointY": 308,
            "offsetPointY": 78,
            "passiveSkillBgSpritePointX": 0,
            "nameLabelPointX": 80,
            "valueLabelPointX": 190,
            "lockIconPointX": 310,
            "lockItemPointX": 385,
            "hookLabelPointX": 360,
            "useMoneyItemPoint": cc.p(60, 92),
            "useGoldItemPoint": cc.p(280, 92),
            "moneyIconPoint": cc.p(100, 92),
            "moneyLabelPoint": cc.p(130, 90),
            "goldIconPoint": cc.p(325, 92),
            "goldLabelPoint": cc.p(350, 90),
            "stopTypeLabelPoint": cc.p(106, 380),
            "stopUntilBlueIconPoint": cc.p(80, 178),
            "stopUntilYellowIconPoint": cc.p(80, 96),
            "stopUntilBlueItemPoint": cc.p(60, 178),
            "stopUntilYellowItemPoint": cc.p(60, 96),
            "selectLeadCardIconPoint": cc.p(189, 724),
            "selectLeadCardItemPoint": cc.p(191, 724),
            "afreshItemPoint": cc.p(260, 197),
            "repeatAfreshItemPoint": cc.p(460, 197),
            "startItemPoint": cc.p(260, 197),
            "cancelItemPoint": cc.p(460, 197),
            "stopItemPoint": cc.p(360, 197),
            "leadCardHeadNodePoint": cc.p(137, 670)
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
        "skillUpgradeLabel": {
            "cardItemBgSpritePoint": cc.p(366, 622),
            "skillPointIconPoint": cc.p(535, 780),
            "skillPointLabelPoint": cc.p(585, 778),
            "resLabelPoint": cc.p(360, 430),
            "nameLabelPoint": cc.p(0, 40),
            "skillLvIconPoint": cc.p(-85, 2),
            "skillLvLabelPoint": cc.p(0, 0),
            "nextSkillLvLabelPoint": cc.p(100, 0),
            "skillHarmIconPoint": cc.p(-85, -33),
            "skillHarmLabelPoint": cc.p(0, -35),
            "nextSkillHarmLabelPoint": cc.p(100, -35),
            "arrowLabel1Point": cc.p(50, 0),
            "arrowLabel2Point": cc.p(50, -35),
            "helpBgSpritePoint": cc.p(360, 307),
            "tipLabelPoint": cc.p(360, 307),
            "tipLabel1Point": cc.p(0, 20),
            "tipLabel2Point": cc.p(0, -20),
            "helpLabelPoint": cc.p(360, 307),
            "needSkillPointIconPoint": cc.p(-44, 0),
            "needSkillPointLabelPoint": cc.p(44, -2),
            "selectLeadCardItemPoint": cc.p(360, 695),
            "upgradeItemPoint": cc.p(360, 197),
            "selectLeadCardIconPoint": cc.p(360, 695),
            "leadCardHalfNodePoint": cc.p(360, 695),
            "effectPoint": cc.p(360, 510)

        },
        "spiritPoolLayer": {
            "bgSpritePoint": cc.p(40, 194),
            "headIconPoint": cc.p(40, 1056),
            "titleIconPoint": cc.p(360, 1096),
            "backItemPoint": cc.p(100, 1096),
            "spiritIconPoint": cc.p(130, 933),
            "countIconPoint": cc.p(550, 963),
            "countLabelIconPoint": cc.p(450, 963),
            "countLabelPoint": cc.p(600, 963),
            "perObtainIconPoint": cc.p(550, 913),
            "perObtainLabelIconPoint": cc.p(450, 913),
            "preObtainLabelPoint": cc.p(600, 913),
            "lvIconPoint": cc.p(190, 258),
            "lvLabelPoint": cc.p(270, 258),
            "expLabelPoint": cc.p(400, 258),
            "tipLabelPoint": cc.p(360, 200),
            "spiritItemPoint": cc.p(130, 933),
            "spiritPoolItemPoint": cc.p(360, 600),
            "useGoldItemPoint": cc.p(360, 340),
            "hookPoint": cc.p(235, 342),
            "spiritPoint": cc.p(360, 630)
        },
        "strengthenLayer": {
            "bgSpritePoint": cc.p(40, 247),
            "playerHeaderLabelPoint": cc.p(40, 968),
            "cardUpgradeItemPoint": cc.p(110, 897),
            "cardUpgradeItemOffset": cc.p(-7, -2),
            "skillUpgradeItemPoint": cc.p(254, 897),
            "skillUpgradeItemOffset": cc.p(0, -2),
            "passiveSkillUpgradeItemPoint": cc.p(404, 897),
            "passiveSkillUpgradeItemOffset": cc.p(0, -2)

        },
        "treasureHuntLayer": {
            "locatePoints": [
                cc.p(110, 895),
                cc.p(235, 895),
                cc.p(360, 895),
                cc.p(485, 895),
                cc.p(610, 895),
                cc.p(610, 788),
                cc.p(610, 681),
                cc.p(610, 574),
                cc.p(610, 467),
                cc.p(610, 360),
                cc.p(610, 253),
                cc.p(485, 253),
                cc.p(360, 253),
                cc.p(235, 253),
                cc.p(110, 253),
                cc.p(110, 360),
                cc.p(110, 467),
                cc.p(110, 574),
                cc.p(110, 681),
                cc.p(110, 788)
            ],
            "bgSpritePoint": cc.p(40, 194),
            "headIconPoint": cc.p(40, 1056),
            "titleIconPoint": cc.p(360, 1096),
            "backItemPoint": cc.p(100, 1096),
            "headLabelPoint": cc.p(360, 1026),
            "goldIconPoint": cc.p(570, 1026),
            "goldLabelPoint": cc.p(600, 1026),
            "treasureHuntBgPoint": cc.p(360, 588),
            "treasureHuntItemPoint": cc.p(360, 540),
            "treasureHuntIcon1Point": cc.p(355, 545),
            "treasureHuntIcon2Point": cc.p(355, 545),
            "freeCountLabelPoint": cc.p(420, 430),
            "countLabelPoint": cc.p(420, 370)
        }
    }

};

gameFit = fit4Iphone5;