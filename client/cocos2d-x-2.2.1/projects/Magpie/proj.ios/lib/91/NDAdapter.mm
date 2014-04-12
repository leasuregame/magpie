//
//  NDAdapter.cpp
//  Magpie
//
//  Created by lCeve on 14-4-11.
//
//

#include "cocos2d.h"
#include "ScriptingCore.h"
#include "NdComPlatform/NDComPlatform.h"
#include "NdComPlatform/NdComPlatformAPIResponse.h"
#include "NdComPlatform/NdCPNotifications.h"
#include "NdComPlatform/NdComPlatformError.h"
#include "NDAdapter.h"
#include "NDCallbackHandler.h"


#pragma mark    ---------------SDK API---------------
static NDAdapter * s_SharedNDAdapter = NULL;

NDAdapter::NDAdapter()
{
    
}

NDAdapter::~NDAdapter()
{
    
}

NDAdapter * NDAdapter::NDAdapterInstance()
{
    if (s_SharedNDAdapter == NULL)
    {
        s_SharedNDAdapter = new NDAdapter();
        
        // 初始化完成的通知
        [[NSNotificationCenter defaultCenter] addObserver : [NDCallbackHandler sharedHandler]
                                                 selector : @selector(SNSInitResult:)
                                                     name : (NSString *)kNdCPInitDidFinishNotification
                                                   object : nil];
        
        // 离开平台界面时，会发送该通知
        [[NSNotificationCenter defaultCenter] addObserver : [NDCallbackHandler sharedHandler]
                                                 selector : @selector(SNSLeavePlatform:)
                                                     name : (NSString *)kNdCPLeavePlatformNotification
                                                   object : nil];
        
        // 登录完成的通知
        [[NSNotificationCenter defaultCenter] addObserver : [NDCallbackHandler sharedHandler]
                                                 selector : @selector(SNSLoginResult:)
                                                     name : (NSString *)kNdCPLoginNotification
                                                   object : nil];
        
        // 暂停页退出的通知
        [[NSNotificationCenter defaultCenter] addObserver : [NDCallbackHandler sharedHandler]
                                                 selector : @selector(SNSPauseExit:)
                                                     name : (NSString *)kNdCPPauseDidExitNotification
                                                   object : nil];
        
        // 购买结果的通知,在购买结束时会发送该通知
        [[NSNotificationCenter defaultCenter] addObserver : [NDCallbackHandler sharedHandler]
                                                 selector : @selector(SNSBuyResult:)
                                                     name : kNdCPBuyResultNotification
                                                   object : nil];
        
        // 会话过期，会发送该通知
        [[NSNotificationCenter defaultCenter] addObserver : [NDCallbackHandler sharedHandler]
                                                 selector : @selector(SNSSessionInvalid:)
                                                     name : (NSString *)kNdCPSessionInvalidNotification
                                                   object : nil];

    }
    
    return s_SharedNDAdapter;
}

int NDAdapter::NDInit(int appId, const char * appKey, int versionCheckLevel)
{
    CCLOG("NDInit");
    
    NSString * NSAppKey = [NSString stringWithUTF8String : appKey];
    
    // 初始化平台
    NdInitConfigure * cfg = [[[NdInitConfigure alloc] init] autorelease];
    
    cfg.appid = appId;
    cfg.appKey = NSAppKey;
    cfg.versionCheckLevel = (ND_VERSION_CHECK_LEVEL)versionCheckLevel;
    
    return [[NdComPlatform defaultPlatform] NdInit : cfg];
}

void NDAdapter::NDSetDebugMode(int mode)
{
    CCLOG("NdSetDebugMode");
    
    [[NdComPlatform defaultPlatform] NdSetDebugMode : mode];
}

void NDAdapter::NDShowToolBar(int place)
{
    [[NdComPlatform defaultPlatform] NdShowToolBar : (NdToolBarPlace)place];
}

void NDAdapter::NDHideToolBar()
{
    CCLOG("NDHideToolBar");
    
    [[NdComPlatform defaultPlatform] NdHideToolBar];
}

void NDAdapter::NDSetScreenOrientation(int orientation)
{
    CCLOG("NDSetScreenOrientation");
    
    [[NdComPlatform defaultPlatform] NdSetScreenOrientation : orientation];
}

void NDAdapter::NDSetAutoRotation(bool isAutoRotate)
{
    CCLOG("NDSetAutoRotation");
    
    [[NdComPlatform defaultPlatform] NdSetAutoRotation : isAutoRotate];
}

int NDAdapter::NDLogin(int nFlag)
{
    CCLOG("NDLogin");
    
    return [[NdComPlatform defaultPlatform] NdLogin : nFlag];
}

int NDAdapter::NDLoginEx(int nFlag)
{
    CCLOG("NDLoginEx");
    
    return [[NdComPlatform defaultPlatform] NdLoginEx : nFlag];
}

void NDAdapter::NDGuestRegist(int nFlag)
{
    CCLOG("NDGuestRegist");
    
    [[NdComPlatform defaultPlatform] NdGuestRegist : nFlag];
}

bool NDAdapter::NDIsLogined()
{
    CCLOG("NDIsLogined");
    
    return [[NdComPlatform defaultPlatform] isLogined];
}

int NDAdapter::NDGetCurrentLoginState()
{
    CCLOG("NDGetCurrentLoginState");
    
    return [[NdComPlatform defaultPlatform] getCurrentLoginState];
}

void NDAdapter::NDSwitchAccount()
{
    CCLOG("NDSwitchAccount");
    
    [[NdComPlatform defaultPlatform] NdSwitchAccount];
}

int NDAdapter::NDEnterAccountManage()
{
    CCLOG("NDEnterAccountManage");
    
    return [[NdComPlatform defaultPlatform] NdEnterAccountManage];
}

const char * NDAdapter::NDLoginUin()
{
    CCLOG("NDLoginUin");
    
    return [[[NdComPlatform defaultPlatform] loginUin] UTF8String];
}

const char * NDAdapter::NDSessionId()
{
    CCLOG("NDSessionId");
    
    return [[[NdComPlatform defaultPlatform] sessionId] UTF8String];
}

const char * NDAdapter::NDNickName()
{
    CCLOG("NDNickName");
    
    return [[[NdComPlatform defaultPlatform] nickName] UTF8String];
}

int NDAdapter::NDLogout(int nFlag)
{
    CCLOG("NDLogout");

    return [[NdComPlatform defaultPlatform] NdLogout : nFlag];
}

int NDAdapter::NDUserFeedback()
{
    CCLOG("NDUserFeedback");
    
    return [[NdComPlatform defaultPlatform] NdUserFeedBack];
}

int NDAdapter::NDPause()
{
    CCLOG("NDPause");
    
    return [[NdComPlatform defaultPlatform] NdPause];
}

void NDAdapter::NDEnterPlatform(int nFlag)
{
    CCLOG("NDEnterPlatform");
    
    [[NdComPlatform defaultPlatform] NdEnterPlatform : nFlag];
}

int NDAdapter::NDUniPay(const char * cooOrderSerial,    // 合作商的订单号，必须保证唯一，双方对账的唯一标记（用GUID生成，32位）
           const char * productId,                      // 商品Id
           const char * productName,                    // 商品名字
           float productOrignalPrice,                   // 商品价格，两位小数
           float productPrice,                          // 商品原始价格，保留两位小数
           int productCount,                            // 购买商品个数
           const char * payDescription)                 // 购买描述，可选，没有为空
{
    CCLOG("NDUniPay");
    
    NSString * NSCooOrderSerial = [NSString stringWithUTF8String : cooOrderSerial];
    NSString * NSProductId = [NSString stringWithUTF8String : productId];
    NSString * NSProductName = [NSString stringWithUTF8String : productName];
    NSString * NSPayDescription = [NSString stringWithUTF8String : payDescription];
    
    NdBuyInfo * buyInfo = [[NdBuyInfo new] autorelease];
    
    buyInfo.cooOrderSerial = NSCooOrderSerial;
    buyInfo.productId = NSProductId;
    buyInfo.productName = NSProductName;
    buyInfo.productOrignalPrice = productOrignalPrice;
    buyInfo.productPrice = productPrice;
    buyInfo.payDescription = NSPayDescription;
    
    return [[NdComPlatform defaultPlatform] NdUniPay : buyInfo];
}

int NDAdapter::NDUniPayAsyn(const char * cooOrderSerial,           // 合作商的订单号，必须保证唯一，双方对账的唯一标记（用GUID生成，32位）
                 const char * productId,                // 商品Id
                 const char * productName,              // 商品名字
                 float productOrignalPrice,             // 商品价格，两位小数
                 float productPrice,                    // 商品原始价格，保留两位小数
                 int productCount,                      // 购买商品个数
                 const char * payDescription)           // 购买描述，可选，没有为空
{
    CCLOG("NDUniPayAsyn");

    NSString * NSCooOrderSerial = [NSString stringWithUTF8String : cooOrderSerial];
    NSString * NSProductId = [NSString stringWithUTF8String : productId];
    NSString * NSProductName = [NSString stringWithUTF8String : productName];
    NSString * NSPayDescription = [NSString stringWithUTF8String : payDescription];
    
    NdBuyInfo * buyInfo = [[NdBuyInfo new] autorelease];
    
    buyInfo.cooOrderSerial = NSCooOrderSerial;
    buyInfo.productId = NSProductId;
    buyInfo.productName = NSProductName;
    buyInfo.productOrignalPrice = productOrignalPrice;
    buyInfo.productPrice = productPrice;
    buyInfo.payDescription = NSPayDescription;
    
    return [[NdComPlatform defaultPlatform]  NdUniPayAsyn : buyInfo];
}


/******************************************************************************
 *
 *	Objective-C回调中调回C++同名函数
 *
 *****************************************************************************/
void NDAdapter::SNSInitResult()
{
    ScriptingCore::getInstance()->executeCallbackWithOwner(this, "SNSInitResult");
}

void NDAdapter::SNSLeavePlatform()
{
    ScriptingCore::getInstance()->executeCallbackWithOwner(this, "SNSLeavePlatform");
}

void NDAdapter::SNSLoginResult(bool result, int code)
{
    jsval v[] = {
        v[0] = BOOLEAN_TO_JSVAL(result),
        v[1] = INT_TO_JSVAL(code)
    };
    
    ScriptingCore::getInstance()->executeCallbackWithOwner(this, "SNSLoginResult", 2, v, NULL);
}

void NDAdapter::SNSPauseExit()
{
    ScriptingCore::getInstance()->executeCallbackWithOwner(this, "SNSPauseExit");
}

void NDAdapter::SNSBuyResult(bool result, int code, BuyInfo * buyInfo)
{
    JSContext* cx = ScriptingCore::getInstance()->getGlobalContext();
    
    JSObject* jsobj = JS_NewObject(cx, NULL, NULL, NULL);
    
    jsval jsCooOrderSerial = c_string_to_jsval(cx, buyInfo->cooOrderSerial);
    jsval jsProductId = c_string_to_jsval(cx, buyInfo->productId);
    jsval jsProductName = c_string_to_jsval(cx, buyInfo->productName);
    jsval jsProductOrignalPrice = DOUBLE_TO_JSVAL(buyInfo->productOrignalPrice);
    jsval jsProductPrice = DOUBLE_TO_JSVAL(buyInfo->productPrice);
    jsval jsProductCount = INT_TO_JSVAL(buyInfo->productCount);
    jsval jsPayDescription = c_string_to_jsval(cx, buyInfo->payDescription);
    
    JS_SetProperty(cx, jsobj, "cooOrderSerial", &jsCooOrderSerial);
    JS_SetProperty(cx, jsobj, "productId", &jsProductId);
    JS_SetProperty(cx, jsobj, "productName", &jsProductName);
    JS_SetProperty(cx, jsobj, "productOrignalPrice", &jsProductOrignalPrice);
    JS_SetProperty(cx, jsobj, "productPrice", &jsProductPrice);
    JS_SetProperty(cx, jsobj, "productCount", &jsProductCount);
    JS_SetProperty(cx, jsobj, "payDescription", &jsPayDescription);
    
    jsval v[] = {
        v[0] = BOOLEAN_TO_JSVAL(result),
        v[1] = INT_TO_JSVAL(code),
        v[2] = OBJECT_TO_JSVAL(jsobj)
    };
    
    ScriptingCore::getInstance()->executeCallbackWithOwner(this, "SNSBuyResult", 3, v, NULL);
}

void NDAdapter::SNSSessionInvalid()
{
    ScriptingCore::getInstance()->executeCallbackWithOwner(this, "SNSSessionInvalid");
}


#pragma mark    ---------------SDK CALLBACK OJC---------------
/******************************************************************************
 *
 *	消息、回调中转类
 *
 *  负责处理Objective-C原生回调、通知处理
 *
 *****************************************************************************/
static NDCallbackHandler * s_SharedNDCallbackHandler = NULL;

@implementation NDCallbackHandler

+ (NDCallbackHandler *)sharedHandler
{
    if (!s_SharedNDCallbackHandler)
    {
        s_SharedNDCallbackHandler = [[NDCallbackHandler alloc] init];
    }
    
    return s_SharedNDCallbackHandler;
}

- (void)SNSInitResult : (NSNotification *)notify
{
    CCLOG("SNSInitResult");
    
    NDAdapter::NDAdapterInstance()->SNSInitResult();
}


- (void)SNSLeavePlatform : (NSNotification *)notify
{
    CCLOG("SNSLeavePlatform");
    
    NDAdapter::NDAdapterInstance()->SNSLeavePlatform();
}

- (void)SNSLoginResult : (NSNotification *)notify
{
    CCLOG("SNSLoginResult");
    
    NSDictionary * dict = [notify userInfo];
    
    BOOL result = [[dict objectForKey : @"result"] boolValue];
    int code = [[dict objectForKey : @"error"] intValue];
    
    NDAdapter::NDAdapterInstance()->SNSLoginResult(result, code);
}

- (void)SNSPauseExit : (NSNotification *)notify {
    CCLOG("SNSPauseExit");
    
    NDAdapter::NDAdapterInstance()->SNSPauseExit();
}

- (void)SNSBuyResult : (NSNotification*)notify
{
    CCLOG("SNSBuyResult");
    
    NSDictionary * dict = [notify userInfo];
    
    bool result = [[dict objectForKey : @"result"] boolValue];
    int code = [[dict objectForKey : @"error"] intValue];
    NdBuyInfo * NSBuyInfo = (NdBuyInfo *)[dict objectForKey : @"buyInfo"];
    
    BuyInfo * buyInfo = new BuyInfo();
    
    buyInfo->cooOrderSerial = [[NSBuyInfo cooOrderSerial] UTF8String];
    buyInfo->productId = [[NSBuyInfo productId] UTF8String];
    buyInfo->productName = [[NSBuyInfo productName] UTF8String];
    buyInfo->productOrignalPrice = [NSBuyInfo productOrignalPrice];
    buyInfo->productPrice = [NSBuyInfo productPrice];
    buyInfo->productCount = [NSBuyInfo productCount];
    buyInfo->payDescription = [[NSBuyInfo payDescription] UTF8String];
    
    NDAdapter::NDAdapterInstance()->SNSBuyResult(result, code, buyInfo);
}

- (void)SNSSessionInvalid : (NSNotification *)notify
{
    CCLOG("SNSSessionInvalid");
    
	NDAdapter::NDAdapterInstance()->SNSSessionInvalid();
}

@end
