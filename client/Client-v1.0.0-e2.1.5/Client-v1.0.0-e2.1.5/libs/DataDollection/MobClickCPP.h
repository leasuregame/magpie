//
//  MobClickCPP.h
//  um-jsb
//
//  Created by arthur on 13-11-8.
//
//

#ifndef __um_jsb__MobClickCPP__
#define __um_jsb__MobClickCPP__

#include <map>
#include <string>
using namespace std;

enum ReportPolicyCPP {
    realtime = 0,       //实时发送
    batch = 1,          //启动发送
    senddaily = 4,      //每日发送
    sendwifionly = 5,   //仅在wifi下启动时发送
    send_interval = 6,   //按最小间隔发送
    send_on_exit = 7        //退出或进入后台时发送
};

class MobClickCPP
{
public:
    
    /** 设置app版本号。由于历史原因需要和xcode3工程兼容,友盟提取的是Build号(CFBundleVersion),如果需要和App Store上的版本一致,需要调用此方法。
     
     @param appVersion 版本号，例如设置成`XcodeAppVersion`.
     @return void.
     */
    static void setAppVersion(const char *appVersion);
    
    /** 开启CrashReport收集, 默认是开启状态.
     
     @param value 设置成NO,就可以关闭友盟CrashReport收集.
     @return void.
     */
    static void setCrashReportEnabled(bool value);
    
    /** 设置是否打印sdk的log信息,默认不开启
     @param value 设置为YES,umeng SDK 会输出log信息,记得release产品时要设置回NO.
     @return .
     @exception .
     */
    static void setLogEnabled(bool value);
    
    ///---------------------------------------------------------------------------------------
    /// @name  开启统计
    ///---------------------------------------------------------------------------------------
    
    
    /** 开启友盟统计,默认以BATCH方式发送log.
     
     @param appKey 友盟appKey.
     @param reportPolicy 发送策略.
     @param channelId 渠道名称,为nil或@""时,默认会被被当作@"App Store"渠道
     @return void
     */
    static void startWithAppKey(const char *appKey);
    static void startWithAppKey(const char *appKey, ReportPolicyCPP rp, const char *cid);
    
    /** 当reportPolicy == SEND_INTERVAL 时设定log发送间隔
     
     @param second 单位为秒,最小为10,最大为86400(一天).
     @return void.
     */
    static void setLogSendInterval(double second);
    
    
    ///---------------------------------------------------------------------------------------
    /// @name  页面计时
    ///---------------------------------------------------------------------------------------
    
    
    /** 页面时长统计,记录某个view被打开多长时间,可以自己计时也可以调用beginLogPageView,endLogPageView自动计时
     
     @param pageName 需要记录时长的view名称.
     @param seconds 秒数，int型.
     @return void.
     */
    static void logPageView(const char *pageName, int seconds);
    static void beginLogPageView(const char *pageName);
    static void endLogPageView(const char *pageName);
    
    ///---------------------------------------------------------------------------------------
    /// @name  事件统计
    ///---------------------------------------------------------------------------------------
    
    
    /** 自定义事件,数量统计.
     使用前，请先到友盟App管理后台的设置->编辑自定义事件 中添加相应的事件ID，然后在工程中传入相应的事件ID
     
     @param  eventId 网站上注册的事件Id.
     @param  label 分类标签。不同的标签会分别进行统计，方便同一事件的不同标签的对比,为nil或空字符串时后台会生成和eventId同名的标签.
     @param  accumulation 累加值。为减少网络交互，可以自行对某一事件ID的某一分类标签进行累加，再传入次数作为参数。
     @return void.
     */
    static void event(const char *eventId);
    static void event(const char *eventId, const char *lable);
    static void event(const char *eventId, const char *lable, int accumulation);
    static void eventWithAccumulation(const char *eventId, int accumulation);
    //static void eventWithAttributes(const char *eventId, map<string, string> attributes);
    
    /** 自定义事件,时长统计.
     使用前，请先到友盟App管理后台的设置->编辑自定义事件 中添加相应的事件ID，然后在工程中传入相应的事件ID.
     beginEvent,endEvent要配对使用,也可以自己计时后通过durations参数传递进来
     
     @param  eventId 网站上注册的事件Id.
     @param  label 分类标签。不同的标签会分别进行统计，方便同一事件的不同标签的对比,为nil或空字符串时后台会生成和eventId同名的标签.
     @param  primarykey 这个参数用于和event_id一起标示一个唯一事件，并不会被统计；对于同一个事件在beginEvent和endEvent 中要传递相同的eventId 和 primarykey
     @param millisecond 自己计时需要的话需要传毫秒进来
     @return void.
     
     
     @warning 每个event的attributes不能超过10个
     eventId、attributes中key和value都不能使用空格和特殊字符，eventId、attributes的key最大为128个bytes(128个英文及数字或42个左右汉字)。label、attributes的value最大为256个bytes(256个英文及数字或84个左右汉字),
     超过后将被截短。其中eventId超过的将抛弃不再发送。
     id， ts， du是保留字段，不能作为eventId及key的名称
     
     */
    static void beginEvent(const char *eventId);
    static void endEvent(const char *eventId);
    
    static void beginEvent(const char *eventId, const char * lable);
    static void endEvent(const char *eventId, const char *lable);
    
    //static void beginEvent(const char *eventId, const char *keyName, map attributes);
    //static void endEvent(const char *eventId, const char *keyName);
    
    static void countEventTime(const char *eventId, int millisecond);
    static void countEventTime(const char *eventId, const char *lable, int millisecond);
    //static void event(const char *eventId, map attributes, int millisecond);
    
    ///---------------------------------------------------------------------------------------
    /// @name  按渠道自动更新
    ///---------------------------------------------------------------------------------------
    
    
    /** 按渠道自动更新检测
     检查当前app是否有更新，有更新弹出UIAlertView提示用户,当用户点击升级按钮时app会跳转到您预先设置的网址。
     无更新不做任何操作。
     您需要先在服务器端设置app版本信息，默认渠道是App Store.
     如果您想自己控制自动更新操作流程，请实现MobClickDelegate的appUpdate方法。
     
     @param title 对应UIAlertView的title.
     @param cancelTitle 对应UIAlertView的cancelTitle.
     @param otherTitle 对应UIAlertView的otherTitle.
     @param delegate 需要自定义checkUpdate的对象.
     @param callBackSelectorWithDictionary 当checkUpdate事件完成时此方法会被调用,同时标记app更新信息的字典被传回.
     @return void.
     */
    static void checkUpdate();
    static void checkUpdate(const char *title, const char *cancelTitle, const char *otherTitle);
    //(void)checkUpdateWithDelegate:(id)delegate selector:(SEL)callBackSelectorWithDictionary;
    //static void checkUpdateWithDelegate
    
    ///---------------------------------------------------------------------------------------
    /// @name  在线参数
    ///---------------------------------------------------------------------------------------
    
    
    /** 使用在线参数功能，可以让你动态修改应用中的参数值,
     检查并更新服务器端配置的在线参数,缓存在[NSUserDefaults standardUserDefaults]里,
     调用此方法您将自动拥有在线更改SDK端发送策略的功能,您需要先在服务器端设置好在线参数.
     请在[MobClick startWithAppkey:]方法之后调用;
     如果想知道在线参数是否完成完成，请监听UMOnlineConfigDidFinishedNotification
     @param 无.
     @return void.
     */
    static void updateOnlineConfig();
    
    /** 从[NSUserDefaults standardUserDefaults]获取缓存的在线参数的数值
     带参数的方法获取某个key的值，不带参数的获取所有的在线参数.
     需要先调用updateOnlineConfig才能使用,如果想知道在线参数是否完成完成，请监听UMOnlineConfigDidFinishedNotification
     
     @param key
     @return (NSString *) .
     */
    //static char * getConfigParams(char *key);
    
    /** 从[NSUserDefaults standardUserDefaults]获取缓存的在线参数
     @return (NSDictionary *).
     */
    
    //+ (NSDictionary *)getConfigParams;
    
    ///---------------------------------------------------------------------------------------
    /// @name 地理位置设置
    ///---------------------------------------------------------------------------------------
    
    
    /** 为了更精确的统计用户地理位置，可以调用此方法传入经纬度信息
     需要链接 CoreLocation.framework 并且 #import <CoreLocation/CoreLocation.h>
     @param latitude 纬度.
     @param longitude 经度.
     @param location CLLocation *型的地理信息
     @return void
     */
    static void setLatitude(double latitute, double longitute);
    // + (void)setLocation:(CLLocation *)location;
    //static void setLocation(int location);
    
    ///---------------------------------------------------------------------------------------
    /// @name helper方法
    ///---------------------------------------------------------------------------------------
    
    
    /** 判断设备是否越狱，判断方法根据 apt和Cydia.app的path来判断
     */
    static bool isJailbroken();
    /** 判断你的App是否被破解
     */
    static bool isPirated();
};

#endif /* defined(__um_jsb__MobClickCPP__) */
