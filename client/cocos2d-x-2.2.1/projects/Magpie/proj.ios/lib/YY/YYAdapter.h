//
//  YYAdapter.h
//  Magpie
//
//  Created by lCeve on 14-4-8.
//
//

#ifndef __YY_ADAPTER__
#define __YY_ADAPTER__

#include <iostream>

typedef struct UserData {
    const char * sid;
    long account;
    long long time;
    const char * userName;
    bool isLogin;
} User;

class YYAdapter
{
public:
    YYAdapter();
    virtual ~YYAdapter();
    
    static YYAdapter * YYAdapterInstance();
    
    /**
     * @brief     获取SDK版本号
     * @return    版本号
     */
    static const char * YYGetSdkVersion();
    
    /**
     * @brief     初始化SDK
     * @return    无返回
     */
    void YYInitWithAppId(const char * appId, bool isDebug);
    
    /**
     * @brief     登录
     * @return    无返回
     */
    void YYLogin();
    
    /**
     * @brief     注册
     * @return    无返回
     */
    void YYRegister();
    
    /**
     * @brief     个性密码
     * @return    无返回
     */
    void YYModifyPassword();
    
    /**
     * @brief     注销
     * @return    无返回
     */
    void YYLogout();
    
    /**
     * @brief     判断是否登录
     * @return    布尔值表示是否登录
     */
    bool YYIsLogin();
    
    /**
     * @brief     获取登录用户信息
     * @return    返回用户信息
     */
    User * YYGetUser();
    
    /**
     * @brief     玩家选择区服 (厂商在玩家选择完区服, 进入游戏后调用)
     * @return    无返回
     */
    void YYSelectGameServer(const char * serverName);
    
    /**
     * @brief     玩家创建角色 (厂商在玩家创建完角色后调用)
     * @return    无返回
     */
    void YYCreateUserRole(const char * roleName, int defaultRoleLevel);
    
    /**
     * @brief     玩家角色升级 (厂商在玩家角色升级的时候调用)
     * @return    无返回
     */
    void YYUpdateUserRole(const char * roleName, int roleLevel);
    
    /**
     * @brief     玩家充值 count单位是人民币 (厂商在玩家appstore充值到游戏成功之后调用)
     * @return    无返回
     */
    void YYGameConsumeOnServer(const char * serverName, float count);
    
/******************************************************************************
 *
 *	Objective-C回调中调回C++同名函数
 *
 *****************************************************************************/
    void YYOnLoginRetCode(long code, User * user);
};

#endif /* defined(__YY_ADAPTER__) */
