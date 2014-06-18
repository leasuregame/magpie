//
//  Notification.cpp
//  Magpie
//
//  Created by lCeve on 14-2-12.
//
//

#include "NotificationHelp.h"
#include "cocos2d.h"

void NotificationHelp::start()
{
    CCLOG("NotificationHelp init");
    
    // 把角标数字清0
    [UIApplication sharedApplication].applicationIconBadgeNumber = 0;
    
    // 删除key为DEFAULT_NOTIFICATION_KEY的通知
    NotificationHelp::remove(DEFAULT_NOTIFICATION_KEY);
}

void NotificationHelp::end()
{
    CCLOG("NotificationHelp end");
    
    // 设置每天11:00定时通知
    UILocalNotification * powerNotification1 = [[UILocalNotification alloc] init];
    if (powerNotification1 != nil)
    {
        CCLOG("11:00");
        
        NSDateFormatter * formatter = [[NSDateFormatter alloc] init];
        [formatter setDateFormat : @"HH:mm:ss"];
        powerNotification1.fireDate = [formatter dateFromString : @"11:00:00"];
        powerNotification1.timeZone = [NSTimeZone defaultTimeZone];
        powerNotification1.repeatInterval = NSDayCalendarUnit;
        powerNotification1.alertBody = [NSString stringWithUTF8String : "大神，玉帝邀您共进午餐。他说...他说...记得带上肥皂哟！"];
        powerNotification1.soundName = UILocalNotificationDefaultSoundName;
        powerNotification1.applicationIconBadgeNumber = 1;
        
        //add key
        NSDictionary * userInfo = [NSDictionary dictionaryWithObjectsAndKeys : [NSNumber numberWithInt : DEFAULT_NOTIFICATION_KEY], @"key", nil];
        [powerNotification1 setUserInfo : userInfo];
        
        [[UIApplication sharedApplication] scheduleLocalNotification : powerNotification1];
        [powerNotification1 release];
    }
    
    // 设置每天17:00定时通知
    UILocalNotification * powerNotification2 = [[UILocalNotification alloc] init];
    if (powerNotification2 != nil)
    {
        CCLOG("17:00");
        
        NSDateFormatter * formatter = [[NSDateFormatter alloc] init];
        [formatter setDateFormat : @"HH:mm:ss"];
        powerNotification2.fireDate = [formatter dateFromString : @"17:00:00"];
        powerNotification2.timeZone = [NSTimeZone defaultTimeZone];
        powerNotification2.repeatInterval = NSDayCalendarUnit;
        powerNotification2.alertBody = [NSString stringWithUTF8String : "大神，王母娘娘邀您共进晚餐。只是...只是...吃个晚餐哟！"];
        powerNotification2.soundName = UILocalNotificationDefaultSoundName;
        powerNotification2.applicationIconBadgeNumber = 1;
        
        //add key
        NSDictionary * userInfo = [NSDictionary dictionaryWithObjectsAndKeys : [NSNumber numberWithInt : DEFAULT_NOTIFICATION_KEY], @"key", nil];
        [powerNotification2 setUserInfo : userInfo];
        
        [[UIApplication sharedApplication] scheduleLocalNotification : powerNotification2];
        [powerNotification2 release];
    }
    
    // 设置3.5天后的9:00或21:00通知一次
    NSDate * time = [NSDate date];
    NSCalendar * calendar = [NSCalendar currentCalendar];
    NSUInteger unitFlags = NSYearCalendarUnit | NSMonthCalendarUnit | NSDayCalendarUnit | NSHourCalendarUnit | NSMinuteCalendarUnit | NSSecondCalendarUnit;
    NSDateComponents * dateComponent = [calendar components : unitFlags fromDate : time];
    
    int hour = [dateComponent hour];
    int minute = [dateComponent minute];
    int second = [dateComponent second];
    
    int timeInterval = 0;
    if(hour >= 9 && hour < 21)
    {
        timeInterval += (21 - hour - 1) * 60 * 60;
        timeInterval += (60 - minute - 1) * 60;
        timeInterval += 60 - second;
    }
    else
    {
        if(hour < 9)
        {
            hour += 24;
        }
        
        timeInterval += (33 - hour - 1) * 60 * 60;
        timeInterval += (60 - minute - 1) * 60;
        timeInterval += 60 - second;
    }
    
    for (int i = 0; i < 2; ++i)
    {
        UILocalNotification * notification = [[UILocalNotification alloc] init];
        if (notification != nil)
        {
            timeInterval += 3.5 * 24 * 60 * 60;
            
            CCLOG("%d----%d", i, timeInterval);
            
            notification.fireDate = [time dateByAddingTimeInterval : timeInterval];
            notification.timeZone = [NSTimeZone defaultTimeZone];
            notification.repeatInterval = NSWeekCalendarUnit;
            notification.alertBody = [NSString stringWithUTF8String : "大神，大神，你的嫦娥，你的织女，你的...，都被妖怪掳走啦，赶紧回来吧！"];
            notification.soundName = UILocalNotificationDefaultSoundName;
            notification.applicationIconBadgeNumber = 1;
            
            //add key
            NSDictionary * userInfo = [NSDictionary dictionaryWithObjectsAndKeys : [NSNumber numberWithInt : DEFAULT_NOTIFICATION_KEY], @"key", nil];
            [notification setUserInfo : userInfo];
            
            [[UIApplication sharedApplication] scheduleLocalNotification : notification];
            [notification release];
        }
    }
}

void NotificationHelp::push(const char * msg, const int timeInterval, const int key)
{
    CCLOG("NotificationHelp push %s %d %d", msg, timeInterval, key);
    
    UILocalNotification * notification = [[UILocalNotification alloc] init];
    
    if (notification != nil) {
        NSDate * time = [NSDate dateWithTimeIntervalSinceNow : timeInterval];
        NSCalendar * calendar = [NSCalendar currentCalendar];
        NSUInteger unitFlags = NSYearCalendarUnit | NSMonthCalendarUnit | NSDayCalendarUnit | NSHourCalendarUnit | NSMinuteCalendarUnit | NSSecondCalendarUnit;
        NSDateComponents * dateComponent = [calendar components : unitFlags fromDate : time];
        int hour = [dateComponent hour];
        
        CCLOG("hour is: %d", hour);
        
        // 00:00 ~ 09:00 不通知
        if(hour < 9)
        {
            return;
        }
        
        CCLOG("push");
        
        notification.fireDate = time;
        notification.timeZone = [NSTimeZone defaultTimeZone];
        notification.alertBody = [NSString stringWithUTF8String : msg];
        notification.soundName = UILocalNotificationDefaultSoundName;
        notification.applicationIconBadgeNumber = 1;
        
        //add key
        NSDictionary * userInfo = [NSDictionary dictionaryWithObjectsAndKeys : [NSNumber numberWithInt : key], @"key", nil];
        [notification setUserInfo : userInfo];
        
        [[UIApplication sharedApplication] scheduleLocalNotification : notification];
        [notification release];
    }
}

void NotificationHelp::remove()
{
    CCLOG("NotificationHelp remove");
    
    [[UIApplication sharedApplication] cancelAllLocalNotifications];
}

void NotificationHelp::remove(const int key)
{
    CCLOG("NotificationHelp remove %d", key);
    
    NSArray * narry=[[UIApplication sharedApplication] scheduledLocalNotifications];
    
    int len = [narry count];
    for (int i = 0; i < len; ++i)
    {
        UILocalNotification * notification = [narry objectAtIndex : i];
        NSDictionary * userInfo = notification.userInfo;
        NSNumber * nNumber = [userInfo objectForKey : @"key"];
        int _key=[nNumber intValue];
        
        if (_key == key) {
            [[UIApplication sharedApplication] cancelLocalNotification : notification];
        }
    }
}