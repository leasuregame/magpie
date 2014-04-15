/**
 * Created by lcc3536 on 13-12-30.
 */


/*
 * PP platform
 * */


var lz = lz || {};

lz.platformConfig = {
    OS: "IOS",
    PLATFORM: "PP",
    VERSION: "1.4.0",
    APP_ID: 3183,
    APP_KEY: "27c09e4ed7f6c03851e26945a99d1c3f",
    GATE_SERVER_HOST: "124.238.236.33",
    GATE_SERVER_PORT: "3009",
    UPDATE_PACKAGE_URL: "http://124.238.236.33:9090/api/app/update/",
    UPDATE_VERSION_URL: "http://124.238.236.33:9090/api/app/version",
    GAME_NOTICE_URL: "http://124.238.236.33:9090/api/app/notice",
    UM_APP_KEY: "534c98bf56240b227310f320"
};


(function () {
    if (!lz.TARGET_PLATFORM_IS_BROWSER) {
        // 程序到后台时调用
        cc.Application.getInstance().jsApplicationDidEnterBackground = function () {
            cc.log("*************************************************************");
            cc.log("cc.Application.getInstance().jsApplicationDidEnterBackground");
            cc.log("*************************************************************");

            if (typeof(lz.NotificationHelp) != "undefined") {
                lz.NotificationHelp.end();
            }

            lz.um.applicationDidEnterBackground();
        };

        // 程序回复运行时调用
        cc.Application.getInstance().jsApplicationWillEnterForeground = function () {
            cc.log("*************************************************************");
            cc.log("cc.Application.getInstance().jsApplicationWillEnterForeground");
            cc.log("*************************************************************");

            if (typeof(lz.NotificationHelp) != "undefined") {
                lz.NotificationHelp.start();
            }

            lz.um.applicationWillEnterForeground();
        };
    }
})();


(function jsApplicationDidFinishLaunching() {
    cc.log("*************************************************************");
    cc.log("jsApplicationDidFinishLaunching");
    cc.log("*************************************************************");

    if (typeof(lz.NotificationHelp) != "undefined") {
        lz.NotificationHelp.start();
    }

    lz.um.startWithAppKey(lz.platformConfig.UM_APP_KEY);
})();


var PP_WEB_VIEW_CODE_RECHARGE = 1;                  // 返回充值页面
var PP_WEB_VIEW_CODE_RECHARGE_AND_EXCHANGE = 2;     // 返回充值并且兑换页面
var PP_WEB_VIEW_CODE_OTHER = 3;                     // WEB其他页面关闭

var PP_LOGIN_VIEW_PAGE_CODE = 1;                    // 关闭接口为登录页面
var PP_REGISTER_VIEW_PAGE_CODE = 2;                 // 关闭接口为注册
var PP_OTHER_VIEW_PAGE_CODE = 3;                    // 其他页面退出

var PP_PAY_RESULT_CODE_SUCCEED = 0;                 // 购买成功
var PP_PAY_RESULT_CODE_FOR_BIDDEN = 1;              // 禁止访问
var PP_PAY_RESULT_CODE_USER_NOT_EXIST = 2;          // 该用户不存在
var PP_PAY_RESULT_CODE_PARAM_LOST = 3;              // 必选参数丢失
var PP_PAY_RESULT_CODE_NOT_SUFFICIENT_FUNDS = 4;    // PP币余额不足
var PP_PAY_RESULT_CODE_GAME_DATA_NOT_EXIST = 5;     // 该游戏数据不存在
var PP_PAY_RESULT_CODE_DEVELOPER_NOT_EXIST = 6;     // 开发者数据不存在
var PP_PAY_RESULT_CODE_ZONE_NOT_EXIST = 7;          // 该区数据不存在
var PP_PAY_RESULT_CODE_SYSTEM_ERROR = 8;            // 系统错误
var PP_PAY_RESULT_CODE_FAIL = 9;                    // 购买失败
var PP_PAY_RESULT_CODE_COMMUNICATION_FAIL = 10;     // 与开发商服务器通信失败
var PP_PAY_RESULT_CODE_UNTREATED_BILL_NO = 11;      // 开发商服务器未成功处理该订单
var PP_PAY_RESULT_CODE_CANCEL = 12;                 // 用户中途取消
var PP_PAY_RESULT_CODE_USER_OFF_LINE = 88;          // 非法访问，可能用户已经下线

// 初始化PP平台
var ppAdapter = pp.PPAdapter.PPAdapterInstance();
ppAdapter.PPInit(lz.platformConfig.APP_ID, lz.platformConfig.APP_KEY);
ppAdapter.PPSetIsNSlogData(false);
ppAdapter.PPSetRechargeAmount(30);
ppAdapter.PPSetIsLongComet(true);
ppAdapter.PPSetIsLogOutPushLoginView(false);
ppAdapter.PPSetIsOpenRecharge(true);
ppAdapter.PPSetCloseRechargeAlertMessage("当前关闭充值功能哦");
ppAdapter.PPCheckGameUpdate();

ppAdapter.token = "";
ppAdapter._PPCurrentUserId = ppAdapter.PPCurrentUserId;
ppAdapter.PPCurrentUserId = function () {
    return parseInt(ppAdapter._PPCurrentUserId());
};

// 充值回调
ppAdapter.PPPayResultCallBack = function (code) {
    cc.log("ppAdapter PPPayResultCallBack");
    cc.log("code: " + code);

    gameData.payment._closeWaitLayer();

    switch (code) {
        case PP_PAY_RESULT_CODE_SUCCEED:
            Dialog.pop("充值成功，请稍候");
            gameData.payment.buyGoodsSuccess();
            break;
        case PP_PAY_RESULT_CODE_FOR_BIDDEN:
            Dialog.pop("充值失败，禁止访问");
            break;
        case PP_PAY_RESULT_CODE_USER_NOT_EXIST:
            Dialog.pop("充值失败，用户不存在");
            break;
        case PP_PAY_RESULT_CODE_PARAM_LOST:
            Dialog.pop("充值失败，参数丢失");
            break;
        case PP_PAY_RESULT_CODE_NOT_SUFFICIENT_FUNDS:
            Dialog.pop("充值失败，余额不足");
            break;
        case PP_PAY_RESULT_CODE_GAME_DATA_NOT_EXIST:
            Dialog.pop("充值失败，游戏不存在");
            break;
        case PP_PAY_RESULT_CODE_DEVELOPER_NOT_EXIST:
            Dialog.pop("充值失败，开发者不存在");
            break;
        case PP_PAY_RESULT_CODE_ZONE_NOT_EXIST:
            Dialog.pop("充值失败，区数据不存在");
            break;
        case PP_PAY_RESULT_CODE_SYSTEM_ERROR:
            Dialog.pop("充值失败，系统错误");
            break;
        case PP_PAY_RESULT_CODE_FAIL:
            Dialog.pop("充值失败");
            break;
        case PP_PAY_RESULT_CODE_COMMUNICATION_FAIL:
            Dialog.pop("充值失败，通信失败");
            break;
        case PP_PAY_RESULT_CODE_UNTREATED_BILL_NO:
            Dialog.pop("充值失败，订单处理失败");
            break;
        case PP_PAY_RESULT_CODE_CANCEL:
            Dialog.pop("充值失败，用户取消");
            break;
        case PP_PAY_RESULT_CODE_USER_OFF_LINE:
            Dialog.pop("充值失败，非法访问");
            break;
        default :
            Dialog.pop("充值失败，未知错误");
    }
};

// 验证更新后回调
ppAdapter.PPVerifyingUpdatePassCallBack = function () {
    cc.log("ppAdapter PPVerifyingUpdatePassCallBack");
};

// 登录成功回调
ppAdapter.PPLoginStrCallBack = function (token) {
    cc.log("ppAdapter PPLoginStrCallBack");
    cc.log("token: " + token);

    ppAdapter.token = token;

    ppAdapter.PPGetUserInfoSecurity();
    ppAdapter.PPLoginCallBack();
};

ppAdapter.PPLoginCallBack = function () {
    cc.log("ppAdapter PPLoginCallBack");
};

// 关闭web页面后回调
ppAdapter.PPCloseWebViewCallBack = function (code) {
    cc.log("ppAdapter PPCloseWebViewCallBack");
    cc.log("code: " + code);

    switch (code) {
        case PP_WEB_VIEW_CODE_RECHARGE:
            break;
        case PP_WEB_VIEW_CODE_RECHARGE_AND_EXCHANGE:
            break;
        case PP_WEB_VIEW_CODE_OTHER:
            break;
        default:
            break;
    }

    gameData.payment._closeWaitLayer();
};

// 关闭界面回调
ppAdapter.PPClosePageViewCallBack = function (code) {
    cc.log("ppAdapter PPClosePageViewCallBack");
    cc.log("code: " + code);
};

// 注销后回调
ppAdapter.PPLogOffCallBack = function () {
    cc.log("ppAdapter PPLogOffCallBack");

    ppAdapter.token = "";

    MainScene.destroy();
    cc.Director.getInstance().replaceScene(LoginScene.create());
};


lz.platformIsLogin = function () {
    cc.log("ppAdapter token: " + ppAdapter.token);
    cc.log(ppAdapter.PPCurrentUserId());
    cc.log(ppAdapter.PPCurrentUserName());

    return (ppAdapter.PPCurrentUserId() && ppAdapter.PPCurrentUserName());
};

lz.platformLogout = function () {
    cc.log("ppAdapter PPLogout");

    ppAdapter.PPLogout();
};

lz.platformShowCenter = function () {
    cc.log("ppAdapter PPShowCenter");

    ppAdapter.PPShowCenter();
};