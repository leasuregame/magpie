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
        "mainBgLayer": {
            "messagesLabelPoint": cc.p(40, 1014)
        },
        "messageLabel": {
            "messageLabelPoint": cc.p(640, 18),
            "offsetXWidth": 640
        },
        "mainMenuLayer": {
            "bgSpritePoint": cc.p(40, 88),
            "itemBasePoint": cc.p(93, 142),
            "itemOffsetX": 107,
            "markSpriteBasePoint": cc.p(93, 142),
            "markSpriteOffsetX": 107
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
            "useGoldItemPoint": cc.p(360, 370),
            "hookPoint": cc.p(235, 372),
            "spiritPoint": cc.p(360, 630),
            "actionStartPoint": cc.p(360, 630),
            "actionEndPoint": cc.p(130, 880)
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

    }

};

gameFit = fit4Iphone4;