//
//  yygamecentersdk.h
//  yygamecentersdk
//
//  Created by fantasy on 14-3-3.
//  @email zhouhaosheng@yy.com
//  Copyright (c) 2014年 fantasy. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "YYGameCenterSdkDelegate.h"
#import "YYGUser.h"

@interface YYGameCenterSdk : NSObject
//实例化SDK
+ (YYGameCenterSdk *) defaultSdk;
//初始化SDK参数
- (void) initWithAppid:(NSString *) appid delegate:(id) delegate isDebug:(BOOL)isDebug;
//登陆
- (void) login;
//注册
- (void) register;
//个性密码
- (void) modifyPassword;
//注销
- (void) logout;
//判断是否登陆
- (bool) isLogin;
//获取登陆用户信息
- (YYGUser *) getUser;

//获取SDK版本号
+ (NSString *) getSdkVersion;
@end
