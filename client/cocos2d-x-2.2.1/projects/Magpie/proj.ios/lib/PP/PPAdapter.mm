//
//  PPAdapter.cpp
//  Magpie
//
//  Created by lCeve on 14-4-4.
//
//

#include "cocos2d.h"
#include "ScriptingCore.h"
#include "PPAppPlatformKit/PPAppPlatformKit.h"
#include "PPAdapter.h"
#include "PPCallbackHandler.h"

#pragma mark    ---------------SDK API---------------
static PPAdapter * s_SharedPPAdapter = NULL;

PPAdapter::PPAdapter()
{
    
}

PPAdapter::~PPAdapter()
{
    
}

PPAdapter * PPAdapter::PPAdapterInstance()
{
    if (s_SharedPPAdapter == NULL)
    {
        s_SharedPPAdapter = new PPAdapter();
        
        [[PPAppPlatformKit sharedInstance] setDelegate : [PPCallbackHandler sharedHandler]];
    }
    
    return s_SharedPPAdapter;
}

void PPAdapter::PPShowLogin()
{
    CCLOG("PPShowLogin");
    
    [[PPAppPlatformKit sharedInstance] showLogin];
}

void PPAdapter::PPShowCenter()
{
     CCLOG("PPShowCenter");
    
    [[PPAppPlatformKit sharedInstance] showCenter];
}

void PPAdapter::PPExchangeGoods(int paramPrice, const char * paramBillNo, const char * paramBillTitle, const char * paramRoleId, int paramZoneId)
{
     CCLOG("PPExchangeGoods");
    
    NSString * billNo = [NSString stringWithUTF8String : paramBillNo];
    NSString * billTitle = [NSString stringWithUTF8String : paramBillTitle];
    NSString * roleId = [NSString stringWithUTF8String : paramRoleId];
    
    [[PPAppPlatformKit sharedInstance] exchangeGoods : paramPrice BillNo : billNo BillTitle : billTitle RoleId : roleId ZoneId : paramZoneId];
}

void PPAdapter::PPSetCloseRechargeAlertMessage(const char * paramCloseRechargeAlertMessage)
{
     CCLOG("PPSetCloseRechargeAlertMessage");
    
    NSString * closeRechargeAlertMessage = [NSString stringWithUTF8String : paramCloseRechargeAlertMessage];
    
    [[PPAppPlatformKit sharedInstance] setCloseRechargeAlertMessage : closeRechargeAlertMessage];
}

void PPAdapter::PPSetIsOpenRecharge(bool paramIsOpenRecharge)
{
     CCLOG("PPSetIsOpenRecharge");
    
    [[PPAppPlatformKit sharedInstance] setIsOpenRecharge : paramIsOpenRecharge];
}

void PPAdapter::PPLogout()
{
     CCLOG("PPLogout");
    
    [[PPAppPlatformKit sharedInstance] PPlogout];
}

void PPAdapter::PPSetRechargeAmount(int paramAmount)
{
     CCLOG("PPSetRechargeAmount");
    
    [[PPAppPlatformKit sharedInstance] setRechargeAmount : paramAmount];
}

const char * PPAdapter::PPCurrentUserName()
{
     CCLOG("PPCurrentUserName");
    
    NSString * NSUserName = [[PPAppPlatformKit sharedInstance] currentUserName];
    const char * userName = [NSUserName UTF8String];
    
    return userName;
}

uint64_t PPAdapter::PPCurrentUserId()
{
     CCLOG("PPCurrentUserId");
    
    return [[PPAppPlatformKit sharedInstance] currentUserId];
}

void PPAdapter::PPSetIsNSlogData(bool paramIsNSlogData)
{
     CCLOG("PPSetIsNSlogData");
    
    [[PPAppPlatformKit sharedInstance] setIsNSlogData : paramIsNSlogData];
}

void PPAdapter::PPInit(int paramAppId, const char * paramAppKey)
{
     CCLOG("PPInit");
    
    NSString * appKey = [NSString stringWithUTF8String : paramAppKey];
    
    [[PPAppPlatformKit sharedInstance] setAppId : paramAppId AppKey : appKey];
}

void PPAdapter::PPSetIsLogOutPushLoginView(bool paramIsLogOutPushLoginView)
{
     CCLOG("PPSetIsLogOutPushLoginView");
    
    [[PPAppPlatformKit sharedInstance] setIsLogOutPushLoginView : paramIsLogOutPushLoginView];
}

void PPAdapter::PPSetIsLongComet(bool paramIsLongComet)
{
     CCLOG("PPSetIsLongComet");
    
    [[PPAppPlatformKit sharedInstance] setIsLongComet : paramIsLongComet];
}

void PPAdapter::PPGetUserInfoSecurity()
{
     CCLOG("PPGetUserInfoSecurity");
    
    [[PPAppPlatformKit sharedInstance] getUserInfoSecurity];
}

void PPAdapter::PPCheckGameUpdate()
{
     CCLOG("PPCheckGameUpdate");
    
    [[PPUIKit sharedInstance] checkGameUpdate];
}

void PPAdapter::PPSetIsDeviceOrientationPortrait(bool paramDeviceOrientationPortrait)
{
     CCLOG("PPSetIsDeviceOrientationPortrait");
    
    [PPUIKit setIsDeviceOrientationPortrait : paramDeviceOrientationPortrait];
}

void PPAdapter::PPSetIsDeviceOrientationPortraitUpsideDown(bool paramDeviceOrientationPortraitUpsideDown)
{
     CCLOG("PPSetIsDeviceOrientationPortraitUpsideDown");
    
    [PPUIKit setIsDeviceOrientationPortraitUpsideDown : paramDeviceOrientationPortraitUpsideDown];
}

void PPAdapter::PPSetIsDeviceOrientationLandscapeLeft(bool paramDeviceOrientationLandscapeLeft)
{
     CCLOG("PPSetIsDeviceOrientationLandscapeLeft");
    
    [PPUIKit setIsDeviceOrientationLandscapeLeft : paramDeviceOrientationLandscapeLeft];
}

void PPAdapter::PPSetIsDeviceOrientationLandscapeRight(bool paramDeviceOrientationLandscapeRight)
{
     CCLOG("PPSetIsDeviceOrientationLandscapeRight");
    
    [PPUIKit setIsDeviceOrientationLandscapeRight : paramDeviceOrientationLandscapeRight];
}


#pragma mark    ---------------SDK CALLBACK---------------
/******************************************************************************
 *
 *	Objective-C回调中调回C++同名函数
 *
 *****************************************************************************/
void PPAdapter::PPPayResultCallBack(int paramPPPayResultCode)
{
    jsval v[] = {
        v[0] = INT_TO_JSVAL(paramPPPayResultCode)
    };
    
    ScriptingCore::getInstance()->executeCallbackWithOwner(this, "PPPayResultCallBack", 1, v, NULL);
}

void PPAdapter::PPVerifyingUpdatePassCallBack()
{
    ScriptingCore::getInstance()->executeCallbackWithOwner(this, "PPVerifyingUpdatePassCallBack");
}

void PPAdapter::PPLoginStrCallBack(const char * paramStrToKenKey)
{
    JSContext* cx = ScriptingCore::getInstance()->getGlobalContext();
    jsval v[] = {
        v[0] = c_string_to_jsval(cx, paramStrToKenKey),
    };
    
    ScriptingCore::getInstance()->executeCallbackWithOwner(this, "PPLoginStrCallBack", 1, v, NULL);
}

void PPAdapter::PPCloseWebViewCallBack(int paramPPWebViewCode)
{
    jsval v[] = {
        v[0] = INT_TO_JSVAL(paramPPWebViewCode)
    };
    
    ScriptingCore::getInstance()->executeCallbackWithOwner(this, "PPCloseWebViewCallBack", 1, v, NULL);
}

void PPAdapter::PPClosePageViewCallBack(int paramPPPageCode)
{
    jsval v[] = {
        v[0] = INT_TO_JSVAL(paramPPPageCode)
    };
    
    ScriptingCore::getInstance()->executeCallbackWithOwner(this, "PPClosePageViewCallBack", 1, v, NULL);
}

void PPAdapter::PPLogOffCallBack()
{
    ScriptingCore::getInstance()->executeCallbackWithOwner(this, "PPLogOffCallBack");
}


#pragma mark    ---------------SDK CALLBACK OJC---------------
/******************************************************************************
 *
 *	消息、回调中转类
 *
 *  负责处理Objective-C原生回调、通知处理
 *
 *****************************************************************************/
static PPCallbackHandler * s_SharedPPCallbackHandler = NULL;

@implementation PPCallbackHandler

+ (PPCallbackHandler *)sharedHandler
{
    if (!s_SharedPPCallbackHandler)
    {
        s_SharedPPCallbackHandler = [[PPCallbackHandler alloc] init];
    }
    
    return s_SharedPPCallbackHandler;
}

/**
 * @brief   余额大于所购买道具
 * @param   INPUT   paramPPPayResultCode       接口返回的结果编码
 * @return  无返回
 */
- (void)ppPayResultCallBack : (PPPayResultCode)paramPPPayResultCode
{
    CCLOG("ppPayResultCallBack");
    CCLOG("paramPPPayResultCode: %d", paramPPPayResultCode);
    
    PPAdapter::PPAdapterInstance()->PPPayResultCallBack(paramPPPayResultCode);
}

/**
 * @brief   验证更新成功后
 * @noti    分别在非强制更新点击取消更新和暂无更新时触发回调用于通知弹出登录界面
 * @return  无返回
 */
- (void)ppVerifyingUpdatePassCallBack
{
    CCLOG("ppVerifyingUpdatePassCallBack");
    
    PPAdapter::PPAdapterInstance()->PPVerifyingUpdatePassCallBack();
}

/**
 * @brief   登录成功回调【任其一种验证即可】
 * @param   INPUT   paramStrToKenKey       字符串token
 * @return  无返回
 */
- (void)ppLoginStrCallBack : (NSString *)paramStrToKenKey
{
    CCLOG("ppLoginStrCallBack");
    
    const char * strToKenKey = [paramStrToKenKey UTF8String];
    
    CCLOG("paramStrToKenKey: %s", strToKenKey);
    
    PPAdapter::PPAdapterInstance()->PPLoginStrCallBack(strToKenKey);
}

/**
 * @brief   关闭Web页面后的回调
 * @param   INPUT   paramPPWebViewCode    接口返回的页面编码
 * @return  无返回
 */
- (void)ppCloseWebViewCallBack : (PPWebViewCode)paramPPWebViewCode
{
    CCLOG("ppCloseWebViewCallBack");
    CCLOG("paramPPWebViewCode: %d", paramPPWebViewCode);
    
    PPAdapter::PPAdapterInstance()->PPCloseWebViewCallBack(paramPPWebViewCode);
}

/**
 * @brief   关闭SDK客户端页面后的回调
 * @param   INPUT   paramPPPageCode       接口返回的页面编码
 * @return  无返回
 */
- (void)ppClosePageViewCallBack : (PPPageCode)paramPPPageCode
{
    CCLOG("ppClosePageViewCallBack");
    CCLOG("paramPPPageCode: %d", paramPPPageCode);
    
    PPAdapter::PPAdapterInstance()->PPClosePageViewCallBack(paramPPPageCode);
}

/**
 * @brief   注销后的回调
 * @return  无返回
 */
- (void)ppLogOffCallBack
{
    CCLOG("ppLogOffCallBack");
    
    PPAdapter::PPAdapterInstance()->PPLogOffCallBack();
}

@end
