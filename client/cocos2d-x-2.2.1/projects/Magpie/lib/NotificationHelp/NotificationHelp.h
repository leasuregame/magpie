//
//  Notification.h
//  Magpie
//
//  Created by lCeve on 14-2-12.
//
//

#ifndef __NOTIFICATION__HELP__
#define __NOTIFICATION__HELP__

class NotificationHelp
{
public:
    static void start();
    static void end();
    static void push(const char * msg, const int timeInterval, const int key = 0);
    static void remove();
    static void remove(const int key);
};

#endif /* defined(__NOTIFICATION__HELP__) */
