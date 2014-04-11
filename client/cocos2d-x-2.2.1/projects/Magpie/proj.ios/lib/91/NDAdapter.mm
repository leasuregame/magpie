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
    cfg.versionCheckLevel = ND_VERSION_CHECK_LEVEL_STRICT;
    
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

void NDAdapter::NDLogin(int nFlag)
{
    CCLOG("NDLogin");
    
    [[NdComPlatform defaultPlatform] NdLogin : nFlag];
}

void NDAdapter::NDLoginEx(int nFlag)
{
    CCLOG("NDLoginEx");
    
    [[NdComPlatform defaultPlatform] NdLoginEx : nFlag];
}

void NDAdapter::NDGuestRegist(int nFlag)
{
    CCLOG("NDGuestRegist");
    
    [[NdComPlatform defaultPlatform] NdGuestRegist : nFlag];
}

bool NDAdapter::NDIsLogined()
{
    CCLOG("NDIsLogined");
    
    [[NdComPlatform defaultPlatform] isLogined];
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
    
    [[NdComPlatform defaultPlatform] NdPause];
}

void NDAdapter::NDEnterPlatform(int nFlag)
{
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

int NDUniPayAsyn(const char * cooOrderSerial,           // 合作商的订单号，必须保证唯一，双方对账的唯一标记（用GUID生成，32位）
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
}


- (void)SNSLeavePlatform : (NSNotification *)notify
{
    CCLOG("SNSLeavePlatform");
}

- (void)SNSLoginResult : (NSNotification *)notify
{
    CCLOG("SNSLoginResult");
    
    NSDictionary *dict = [notify userInfo];
    BOOL success = [[dict objectForKey:@"result"] boolValue];
    NdGuestAccountStatus* guestStatus = (NdGuestAccountStatus*)[dict
                                                                objectForKey:@"NdGuestAccountStatus"]; //登录成功后处理
    if([[NdComPlatform defaultPlatform] isLogined] && success) { //也可以通过[[NdComPlatform defaultPlatform] getCurrentLoginState]判断是否游客登录状态
        if (guestStatus) {
            if ([guestStatus isGuestLogined]) { //游客账号登录成功;
            }
            else if ([guestStatus isGuestRegistered]) {
                //游客成功注册为普通账号
            } }
        else {
            //普通账号登录成功!
        } }
    //登录失败处理和相应提示
    else {
        int error = [[dict objectForKey:@"error"] intValue];
        NSString* strTip = [NSString stringWithFormat:@"登录失败, error=%d", error]; switch (error) {
            case ND_COM_PLATFORM_ERROR_USER_CANCEL://用户取消登录
                if (([[NdComPlatform defaultPlatform] getCurrentLoginState] ==
                     ND_LOGIN_STATE_GUEST_LOGIN)) {
                    strTip = @"当前仍处于游客登录状态";
                }
                else {
                    strTip = @"用户未登录"; }
                break;
            case ND_COM_PLATFORM_ERROR_APP_KEY_INVALID://appId未授权接入, 或appKey 无效
                strTip = @"登录失败, 请检查appId/appKey";
                break;
            case ND_COM_PLATFORM_ERROR_CLIENT_APP_ID_INVALID://无效的应用ID
                strTip = @"登录失败, 无效的应用ID";
                break;
            case ND_COM_PLATFORM_ERROR_HAS_ASSOCIATE_91:
                strTip = @"有关联的91账号,不能以游客方式登录";
                break;
            default:
                //其他类型的错误提示
            break; }
    }
}

- (void)SNSPauseExit : (NSNotification *)notify {
    //do what you want
}

- (void)SNSBuyResult : (NSNotification*)notify
{
    NSDictionary* dic = [notify userInfo];
    BOOL bSuccess = [[dic objectForKey:@"result"] boolValue]; NSString* str = bSuccess ? @"购买成功" : @"购买失败";
    if (!bSuccess) {
        //TODO: 购买失败处理
        NSString* strError = nil;
        int nErrorCode = [[dic objectForKey:@"error"] intValue]; switch (nErrorCode) {
            case ND_COM_PLATFORM_ERROR_USER_CANCEL: strError = @"用户取消操作";
                break;
            case ND_COM_PLATFORM_ERROR_NETWORK_FAIL: strError = @"网络连接错误";
                break;
            case ND_COM_PLATFORM_ERROR_SERVER_RETURN_ERROR: strError = @"服务端处理失败";
                break;
            case ND_COM_PLATFORM_ERROR_ORDER_SERIAL_SUBMITTED: //!!!: 异步支付,用户进入充值界面了
                strError = @"支付订单已提交";
                break;
            default:
                strError = @"购买过程发生错误"; break;
        }
        str = [str stringByAppendingFormat:@"\n%@", strError];
    }
    else {
        //TODO: 购买成功处理
    }
    //本次购买的请求参数
    NdBuyInfo* buyInfo = (NdBuyInfo*)[dic objectForKey:@"buyInfo"];
    str = [str stringByAppendingFormat:@"\n<productId = %@, productCount = %d, cooOrderSerial = %@>",
           buyInfo.productId, buyInfo.productCount, buyInfo.cooOrderSerial];
    NSLog(@"NdUiPayAsynResult: %@", str);
}

@end
