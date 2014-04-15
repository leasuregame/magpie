//
//  YYGamecenterSdkDelegate.h
//  yygamecentersdk
//
//  Created by fantasy on 14-3-14.
//  @email zhouhaosheng@yy.com
//  Copyright (c) 2014年 fantasy. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "YYGUser.h"

@protocol YYGameCenterSdkDelegate <NSObject>
@required

//retcode  返回状态码，0 登陆成功  其它状态表示失败，具体{“retcode”:-1,"msg":"参数非法"} {“retcode”:-2,"msg":"维护信息"} {“retcode”:-3 ,"msg":"用户未登录(游客除外)"} {“retcode”:-99,"msg":"未知错误"}
//user 登陆的用户信息
- (void) onLoginRetcode:(long)retcode user:(YYGUser *) user;
@end
