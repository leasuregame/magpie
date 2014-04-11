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
#include "NDAdapter.h"


NDAdapter::NDInit(int appId, const char *appKey, int versionCheckLevel)
{
    CCLOG("NDInit");
    
    // 初始化平台
    NdInitConfigure * cfg = [[[NdInitConfigure alloc] init] autorelease];
    cfg.appid = appId;
    cfg.appKey = appKey;
    cfg.versionCheckLevel = ND_VERSION_CHECK_LEVEL_STRICT;
    [[NdComPlatform defaultPlatform] NdInit : cfg];
    
    // obc callback
    [[NSNotificationCenter defaultCenter] addObserver : self
                                             selector : @selector(SNSInitResult:)
                                                 name : (NSString *)kNdCPInitDidFinishNotification
                                               object : nil];
}
