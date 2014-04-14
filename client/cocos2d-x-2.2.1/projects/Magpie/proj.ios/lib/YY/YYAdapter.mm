//
//  YYAdapter.cpp
//  Magpie
//
//  Created by lCeve on 14-4-8.
//
//

#include "cocos2d.h"
#include "ScriptingCore.h"
#include "YYGameCenterSdk.h"
#include "YYAdapter.h"
#include "YYCallbackHandler.h"

#pragma mark    ---------------SDK API---------------
static YYAdapter * s_SharedYYAdapter = NULL;

YYAdapter::YYAdapter()
{
    
}

YYAdapter::~YYAdapter()
{
    
}

YYAdapter * YYAdapter::YYAdapterInstance()
{
    if (s_SharedYYAdapter == NULL)
    {
        s_SharedYYAdapter = new YYAdapter();
        
        [YYCallbackHandler sharedHandler];
    }
    
    return s_SharedYYAdapter;
}

const char * YYAdapter::YYGetSdkVersion()
{
    CCLOG("YYGetSdkVersion");
    
    NSString * NSVersion = [YYGameCenterSdk getSdkVersion];
    const char * version = [NSVersion UTF8String];
    
    return version;
}

void YYAdapter::YYInitWithAppId(const char * appId, bool isDebug)
{
    CCLOG("YYInitWithAppId");
    
    NSString * NSAppId = [NSString stringWithUTF8String : appId];
    
    [[YYGameCenterSdk defaultSdk] initWithAppid : NSAppId delegate : [YYCallbackHandler sharedHandler] isDebug : isDebug];
}

void YYAdapter::YYLogin()
{
    CCLOG("YYLogin");
    
    [[YYGameCenterSdk defaultSdk] login];
}

void YYAdapter::YYRegister()
{
    CCLOG("YYRegister");
    
    [[YYGameCenterSdk defaultSdk] register];
}

void YYAdapter::YYModifyPassword()
{
    CCLOG("YYModifyPassword");
}

void YYAdapter::YYLogout()
{
    CCLOG("YYLogout");
    
    [[YYGameCenterSdk defaultSdk] logout];
}

bool YYAdapter::YYIsLogin()
{
    CCLOG("YYIsLogin");
    
    return [[YYGameCenterSdk defaultSdk] isLogin];
}

User * YYAdapter::YYGetUser()
{
    CCLOG("YYGetUser");
    
    YYGUser * yyUser = [[YYGameCenterSdk defaultSdk] getUser];
    User * _user = new User();
    
    _user->sid = [[yyUser sid] UTF8String];
    _user->account = [yyUser account];
    _user->time = [yyUser time];
    _user->userName = [[yyUser username] UTF8String];
    _user->isLogin = [yyUser isLogin];
    
    return _user;
}

void YYAdapter::YYSelectGameServer(const char * serverName)
{
    CCLOG("YYSelectGameServer");
    
    NSString * NSServerName = [NSString stringWithUTF8String : serverName];
    
    [[YYGameCenterSdk defaultSdk] selectGameServer : NSServerName];
}

void YYAdapter::YYCreateUserRole(const char * roleName, int defaultRoleLevel)
{
    CCLOG("YYCreateUserRole");
    
    NSString * NSRoleName = [NSString stringWithUTF8String : roleName];
    
    [[YYGameCenterSdk defaultSdk] createUserRole : NSRoleName defaultRoleLevel : defaultRoleLevel];
}

void YYAdapter::YYUpdateUserRole(const char * roleName, int roleLevel)
{
    CCLOG("YYUpdateUserRole");
    
    NSString * NSRoleName = [NSString stringWithUTF8String : roleName];
    
    [[YYGameCenterSdk defaultSdk] updateUserRole : NSRoleName roleLever : roleLevel];
}

void YYAdapter::YYGameConsumeOnServer(const char * serverName, float count)
{
    CCLOG("YYGameConsumeOnServer");
    
    NSString * NSServerName = [NSString stringWithUTF8String : serverName];
    
    [[YYGameCenterSdk defaultSdk] gameConsumeOnServer : NSServerName count : count];
}


#pragma mark    ---------------SDK CALLBACK---------------
/******************************************************************************
 *
 *	Objective-C回调中调回C++同名函数
 *
 *****************************************************************************/
void YYAdapter::YYOnLoginRetCode(long code, User * user)
{
    JSContext * cx = ScriptingCore::getInstance()->getGlobalContext();
    
    JSObject * jsobj = JS_NewObject(cx, NULL, NULL, NULL);
    
    char account[100];
    sprintf(account, "%ld", user->account);
    
    char time[100];
    sprintf(time, "%lld", user->time);
    
    jsval jsSid = c_string_to_jsval(cx, user->sid);
    jsval jsAccount = c_string_to_jsval(cx, account);
    jsval jsTime = c_string_to_jsval(cx, time);
    jsval jsUserName = c_string_to_jsval(cx, user->userName);
    jsval jsIsLogin = BOOLEAN_TO_JSVAL(user->isLogin);
    
    JS_SetProperty(cx, jsobj, "sid", &jsSid);
    JS_SetProperty(cx, jsobj, "account", &jsAccount);
    JS_SetProperty(cx, jsobj, "time", &jsTime);
    JS_SetProperty(cx, jsobj, "userName", &jsUserName);
    JS_SetProperty(cx, jsobj, "isLogin", &jsIsLogin);
    
    jsval v[] = {
        v[0] = long_long_to_jsval(cx, code),
        v[1] = OBJECT_TO_JSVAL(jsobj)
    };
    
    ScriptingCore::getInstance()->executeCallbackWithOwner(this, "YYOnLoginRetCode", 2, v, NULL);
}


#pragma mark    ---------------SDK CALLBACK OJC---------------
/******************************************************************************
 *
 *	消息、回调中转类
 *
 *  负责处理Objective-C原生回调、通知处理
 *
 *****************************************************************************/
static YYCallbackHandler * s_SharedYYCallbackHandler = NULL;

@implementation YYCallbackHandler

+ (YYCallbackHandler *)sharedHandler
{
    if (!s_SharedYYCallbackHandler)
    {
        s_SharedYYCallbackHandler = [[YYCallbackHandler alloc] init];
    }
    
    return s_SharedYYCallbackHandler;
}

/**
 * @brief   余额大于所购买道具
 * @param   INPUT   retcode 返回状态码 0 登陆成功  其它状态表示失败 具体
 *      {“retcode”:-1,"msg":"参数非法"}
 *      {“retcode”:-2,"msg":"维护信息"}
 *      {“retcode”:-3 ,"msg":"用户未登录(游客除外)"}
 *      {“retcode”:-99,"msg":"未知错误"}
 * @param   INPUT   user 登陆的用户信息
 * @return  无返回
 */
- (void) onLoginRetcode:(long)retcode user:(YYGUser *) user
{
    CCLOG("onLoginRetcode");
    
    User * _user = new User();
    
    _user->sid = [[user sid] UTF8String];
    _user->account = [user account];
    _user->time = [user time];
    _user->userName = [[user username] UTF8String];
    _user->isLogin = [user isLogin];
    
    YYAdapter::YYAdapterInstance()->YYOnLoginRetCode(retcode, _user);
}

@end
