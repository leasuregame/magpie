//
//  TBPlatformError.h
//  TBPlatform
//
//  Created by OXH on 13-4-26.
//
//

#ifndef TBPlatform_TBPlatformError_h
#define TBPlatform_TBPlatformError_h
/*!
 返回的错误代码编号
 */
#define TB_PLATFORM_NO_APPID_ERROR                  -105    /*未设置AppID*/
#define TB_PLATFORM_NETWORKING_ERROR                -100    /*网络不给力*/
#define TB_PLATFORM_NOT_LOGINED                     -1      /*玩家未登陆*/ 
#define TB_PLATFORM_NO_ERROR						0       /*没有错误*/
#define TB_PLATFORM_LOGIN_FAILED_ERROR                        1    /*登录失败*/
#define TB_PLATFORM_LOGIN_INCORRECT_ACCOUNT_OR_PASSWORD_ERROR 2    /*帐号或密码错误*/
#define TB_PLATFORM_LOGIN_INVALID_ACCOUNT_ERROR               3    /*帐号被禁用*/
#define TB_PLATFORM_LOGIN_SYNC_FAILED_ERROR                   300  /*帐号同步出错*/
#define TB_PLATFORM_LOGIN_REQUEST_FAILED_ERROR                400  /*登录请求失败*/


#define TB_PLATFORM_NO_BBS                                    1000 /*该游戏未配置论坛*/


#endif
