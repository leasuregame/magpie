//
//  Notification.h
//  Magpie
//
//  Created by lCeve on 14-2-12.
//
//

#ifndef __NOTIFICATION__HELP__
#define __NOTIFICATION__HELP__

#define DEFAULT_NOTIFICATION_KEY 0

class NotificationHelp
{
public:
    static void start();
    static void end();
    static void push(const char * msg, const int timeInterval, const int key = DEFAULT_NOTIFICATION_KEY);
    static void remove();
    static void remove(const int key);
};

#endif /* defined(__NOTIFICATION__HELP__) */
