/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-4-24
 * Time: 下午4:30
 * To change this template use File | Settings | File Templates.
 */

var testScene = cc.Scene.extend({
    ctor : function() {
        this._super();
        cc.associateWithNative( this, cc.Scene );
    },

    onEnter : function() {
        this._super();

        var layer = new testLayer();
        layer.init();
//        layer.setPosition(-40, 0);
        this.addChild(layer);
//
//        var noLayer = new CloudLayer();
//        noLayer.init();
//        this.addChild(noLayer);
    },

    init : function() {

    }
})

/*
    - (void) applicationDidFinishLaunching:(UIApplication*)application
{
...
    application.applicationIconBadgeNumber = 0;//应用程序右上角的数字=0（消失）
    [[UIApplication sharedApplication] cancelAllLocalNotifications];//取消所有的通知
    //------通知；
    UILocalNotification *notification=[[UILocalNotification alloc] init];
    if (notification!=nil) {//判断系统是否支持本地通知
        notification.fireDate=[NSDate dateWithTimeIntervalSinceNow:kCFCalendarUnitDay];//本次开启立即执行的周期
        notification.repeatInterval=kCFCalendarUnitDay;//循环通知的周期
        notification.timeZone=[NSTimeZone defaultTimeZone];
        notification.alertBody=@"哇，我的女神，你怎了？";//弹出的提示信息
        notification.applicationIconBadgeNumber=1; //应用程序的右上角小数字
        notification.soundName= UILocalNotificationDefaultSoundName;//本地化通知的声音
        notification.alertAction = NSLocalizedString(@"营救女神！", nil);  //弹出的提示框按钮
        [[UIApplication sharedApplication]   scheduleLocalNotification:notification];
    }
...
}
*/