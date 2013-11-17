//
//  MobClickCPP.cpp
//  um-jsb
//
//  Created by arthur on 13-11-8.
//
//

#include "MobClick.h"
#include "MobClickCPP.h"

void MobClickCPP::setAppVersion(const char *appVersion)
{
    NSString* version = [NSString stringWithUTF8String:appVersion];
    [MobClick setAppVersion:version];
}

void MobClickCPP::setCrashReportEnabled(bool value)
{
    [MobClick setCrashReportEnabled:value];
}

void MobClickCPP::setLogEnabled(bool value)
{
    [MobClick setLogEnabled:value];
}

void MobClickCPP::startWithAppKey(const char* appKey)
{
    [MobClick setLogEnabled:YES];
    
    NSString* key = [NSString stringWithUTF8String:appKey];
    [MobClick startWithAppkey:key];
}

void MobClickCPP::startWithAppKey(const char *appKey, ReportPolicyCPP rp, const char *cid)
{
    NSString* key = [NSString stringWithUTF8String:appKey];
    NSString* channelId = [NSString stringWithUTF8String:cid];
    [MobClick startWithAppkey:key reportPolicy:(ReportPolicy)rp channelId:channelId];
}

void MobClickCPP::setLogSendInterval(double second)
{
    [MobClick setLogSendInterval:second];
}

void MobClickCPP::logPageView(const char *pageName, int seconds)
{
    NSString* name = [NSString stringWithUTF8String:pageName];
    [MobClick logPageView:name seconds:seconds];
}

void MobClickCPP::beginLogPageView(const char *pageName)
{
    NSString* name = [NSString stringWithUTF8String:pageName];
    [MobClick beginLogPageView:name];
}

void MobClickCPP::endLogPageView(const char *pageName)
{
    NSString* name = [NSString stringWithUTF8String:pageName];
    [MobClick endLogPageView:name];
}

void MobClickCPP::event(const char *eventId)
{
    NSString* eid = [NSString stringWithUTF8String:eventId];
    [MobClick event:eid];
}

void MobClickCPP::event(const char *eventId, const char *lable)
{
    NSString* eid = [NSString stringWithUTF8String:eventId];
    NSString* lb = [NSString stringWithUTF8String:lable];
    
    [MobClick event:eid label:lb];
}

void MobClickCPP::eventWithAccumulation(const char *eventId, int accumulation)
{
    NSString* eid = [NSString stringWithUTF8String:eventId];
    [MobClick event:eid acc:accumulation];
}

void MobClickCPP::event(const char *eventId, const char *lable, int accumulation)
{
    NSString* eid = [NSString stringWithUTF8String:eventId];
    NSString* lb = [NSString stringWithUTF8String:lable];
    
    [MobClick event:eid label:lb acc:accumulation];
}

//void MobClickCPP::eventWithAttributes(const char *eventId, map<string, string> attributes)
//{
//	NSMutableDictionary *mdic = [NSMutableDictionary dictionaryWithCapacity:10];
//    
//	string key, val;
//	map<string, string>::iterator iter;
//	for(iter = attributes.begin(); iter != attributes.end(); iter++)
//	{
//		key = iter->first;
//		val = iter->second;
//        NSString* nkey = [NSString stringWithUTF8String:key];
//        NSString* nval = [NSString stringWithUTF8String:val];
//		[mdic setObject:nval forKey:nkey];
//	}
//	NSDictionary *dic = [NSDictionary dictionaryWithDictionary:mdic];
//	NSString* eid = [NSString stringWithUTF8String:eventId];
//	[MobClick event:eid attributes:dic];
//}

void MobClickCPP::beginEvent(const char *eventId)
{
    NSString* eid = [NSString stringWithUTF8String:eventId];
    [MobClick beginEvent:eid];
}

void MobClickCPP::endEvent(const char *eventId)
{
    NSString* eid = [NSString stringWithUTF8String:eventId];
    [MobClick endEvent:eid];
}

void MobClickCPP::beginEvent(const char *eventId, const char *lable)
{
    NSString* eid = [NSString stringWithUTF8String:eventId];
    NSString* lb = [NSString stringWithUTF8String:lable];
    
    [MobClick beginEvent:eid label:lb];
}

void MobClickCPP::endEvent(const char *eventId, const char *lable)
{
    NSString* eid = [NSString stringWithUTF8String:eventId];
    NSString* lb = [NSString stringWithUTF8String:lable];
    
    [MobClick endEvent:eid label:lb];
}

void MobClickCPP::countEventTime(const char *eventId, int millisecond)
{
    NSString* eid = [NSString stringWithUTF8String:eventId];
    [MobClick event:eid durations:millisecond];
}

void MobClickCPP::countEventTime(const char *eventId, const char *lable, int millisecond)
{
    NSString* eid = [NSString stringWithUTF8String:eventId];
    NSString* lb = [NSString stringWithUTF8String:lable];
    [MobClick event:eid label:lb durations:millisecond];
}

void MobClickCPP::checkUpdate()
{
    [MobClick checkUpdate];
}

void MobClickCPP::checkUpdate(const char *title, const char *cancelTitle, const char *otherTitle)
{
    NSString* titleStr = [NSString stringWithUTF8String:title];
    NSString* cancelTitleStr = [NSString stringWithUTF8String:cancelTitle];
    NSString* otherTitleStr = [NSString stringWithUTF8String:otherTitle];
    [MobClick checkUpdate:titleStr cancelButtonTitle:cancelTitleStr otherButtonTitles:otherTitleStr];
}

void MobClickCPP::updateOnlineConfig()
{
    [MobClick updateOnlineConfig];
}

//char* MobClickCPP::getConfigParams(char *key)
//{
//    NSString* k = [NSString stringWithUTF8String:key];
//    char* res = [[MobClick getConfigParams:k] UTF8String];
//    return res;
//}

void MobClickCPP::setLatitude(double latitute, double longitute)
{
    [MobClick setLatitude:latitute longitude:longitute];
}

bool MobClickCPP::isJailbroken()
{
    return [MobClick isJailbroken];
}

bool MobClickCPP::isPirated()
{
    return [MobClick isPirated];
}
