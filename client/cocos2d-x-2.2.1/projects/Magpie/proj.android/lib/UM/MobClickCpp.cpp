//
//  MobClickCpp.cpp
//  MobClickCpp
//
//  Created by 张梓琦 on 13-10-9.
//  Copyright (c) 2013年 zhangziqi. All rights reserved.
//

#include "MobClickCpp.h"
#include "JniHelper.h"
#include "cocos2d.h"
using namespace cocos2d;

const char* kUmengClassName = "com/umeng/analytics/MobclickAgent";

const char* kActivityName = "com/LeasureGame/Magpie/Magpie";

#define GET_JSTRING(cstr)   ((cstr) ? t.env->NewStringUTF(cstr) : NULL)

#define SAFE_RELEASE_JOBJ(jobj)   if(jobj) { \
                                    t.env->DeleteLocalRef(jobj); \
                                }
#define SAFE_RELEASE_JCONTEXT(jctx)     if(!s_umeng_ctx){ \
                                            SAFE_RELEASE_JOBJ(jctx); \
                                }

jobject s_umeng_ctx = NULL;

jobject getContext(){
    if (s_umeng_ctx) {
        return s_umeng_ctx;
    }
    JniMethodInfo t;
    if( JniHelper::getStaticMethodInfo(t
                                       , kActivityName
                                       , "getContext"
                                       , "()Landroid/content/Context;"))
    {
        jobject ret = t.env->CallStaticObjectMethod(t.classID, t.methodID);
        SAFE_RELEASE_JOBJ(t.classID);
        return ret;
    }
    return NULL;
}

jobject getJHashMap(std::map<std::string, std::string> *stdMap){
    if (stdMap == NULL) {
        return NULL;
    }
    JniMethodInfo t;
    JniHelper::getMethodInfo(t
                             , "java/util/HashMap"
                             , "<init>"
                             , "(I)V");
    jobject ret = t.env->NewObject(t.classID, t.methodID, stdMap->size());
    SAFE_RELEASE_JOBJ(t.classID);
    
    JniHelper::getMethodInfo(t
                             , "java/util/HashMap"
                             , "put"
                             , "(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;");
    
    for (std::map<std::string, std::string>::iterator it = stdMap->begin(); it != stdMap->end(); it++) {
        jstring k = GET_JSTRING(it->first.c_str());
        jstring v = GET_JSTRING(it->second.c_str());
        t.env->CallObjectMethod(ret, t.methodID, k, v);
        SAFE_RELEASE_JOBJ(k);
        SAFE_RELEASE_JOBJ(v);
    }
    SAFE_RELEASE_JOBJ(t.classID);
    return ret;
}

void MobClickCpp::setAppVersion(const char *appVersion){
}

void MobClickCpp::setCrashReportEnabled(bool value){
}

void MobClickCpp::setLogEnabled(bool value){
    JniMethodInfo t;
    if( JniHelper::getStaticMethodInfo(t
                                       , kUmengClassName
                                       , "setDebugMode"
                                       , "(Z)V"))
    {
        t.env->CallStaticVoidMethod(t.classID, t.methodID, value ? JNI_TRUE : JNI_FALSE);
        SAFE_RELEASE_JOBJ(t.classID);
    }
}

void MobClickCpp::setWrapper(){
    JniMethodInfo t;
    if( JniHelper::getStaticMethodInfo(t
                                       , kUmengClassName
                                       , "setWrapper"
                                       , "(Ljava/lang/String;Ljava/lang/String;)V"))
    {
        jstring jstrWrapperType = GET_JSTRING("Cocos2d-x");
        jstring jstrWrapperVersion = GET_JSTRING("1.1");
        t.env->CallStaticVoidMethod(t.classID, t.methodID, jstrWrapperType, jstrWrapperVersion);
        SAFE_RELEASE_JOBJ(jstrWrapperType);
        SAFE_RELEASE_JOBJ(jstrWrapperVersion);
        SAFE_RELEASE_JOBJ(t.classID);
    }
}

string s_umeng_appKey = "";
string s_umeng_channelId = "";


void MobClickCpp::startWithAppkey(const char * appKey, const char * channelId){
    JniMethodInfo t;
    if( JniHelper::getStaticMethodInfo(t
                                       , kUmengClassName
                                       , "onResume"
                                       , "(Landroid/content/Context;Ljava/lang/String;Ljava/lang/String;)V"))
    {
        setWrapper();
        enableActivityDurationTrack();
        s_umeng_appKey = appKey;
        s_umeng_channelId = channelId ? channelId : "";
        jobject ctx = getContext();
        jstring jstrAppKey = GET_JSTRING(s_umeng_appKey.c_str());
        jstring jstrChanel = GET_JSTRING(s_umeng_channelId.c_str());
        t.env->CallStaticVoidMethod(t.classID, t.methodID, ctx, jstrAppKey, jstrChanel);
        SAFE_RELEASE_JCONTEXT(ctx);
        SAFE_RELEASE_JOBJ(jstrAppKey);
        SAFE_RELEASE_JOBJ(jstrChanel);
        SAFE_RELEASE_JOBJ(t.classID);
    }
}

bool s_umeng_isBackground = false;

void MobClickCpp::applicationWillEnterForeground(){
    if (s_umeng_isBackground) {
        MobClickCpp::startWithAppkey(s_umeng_appKey.c_str(), s_umeng_channelId.c_str());
        s_umeng_isBackground = false;
    }
}

void MobClickCpp::applicationDidEnterBackground(){
    JniMethodInfo t;
    if( JniHelper::getStaticMethodInfo(t
                                       , kUmengClassName
                                       , "onPause"
                                       , "(Landroid/content/Context;)V"))
    {
        jobject ctx = getContext();
        t.env->CallStaticVoidMethod(t.classID, t.methodID, ctx);
        SAFE_RELEASE_JCONTEXT(ctx);
        SAFE_RELEASE_JOBJ(t.classID);
    }
    s_umeng_isBackground = true;
}

void MobClickCpp::end(){
    JniMethodInfo t;
    if( JniHelper::getStaticMethodInfo(t
                                       , kUmengClassName
                                       , "onKillProcess"
                                       , "(Landroid/content/Context;)V"))
    {
        jobject ctx = getContext();
        t.env->CallStaticVoidMethod(t.classID, t.methodID, ctx);
        SAFE_RELEASE_JCONTEXT(ctx);
        SAFE_RELEASE_JOBJ(t.classID);
    }
}

void MobClickCpp::event(const char *eventId, const char *label){
    if (label && strlen(label) > 0) {
        JniMethodInfo t;
        if( JniHelper::getStaticMethodInfo(t
                                           , kUmengClassName
                                           , "onEvent"
                                           , "(Landroid/content/Context;Ljava/lang/String;Ljava/lang/String;)V"))
        {
            jobject ctx = getContext();
            jstring jstrEventId = GET_JSTRING(eventId);
            jstring jstrLabel =  GET_JSTRING(label);
            t.env->CallStaticVoidMethod(t.classID, t.methodID, ctx, jstrEventId, jstrLabel);
            SAFE_RELEASE_JCONTEXT(ctx);
            SAFE_RELEASE_JOBJ(jstrEventId);
            SAFE_RELEASE_JOBJ(jstrLabel);
            SAFE_RELEASE_JOBJ(t.classID);
        }
    }
    else {
        JniMethodInfo t;
        if( JniHelper::getStaticMethodInfo(t
                                           , kUmengClassName
                                           , "onEvent"
                                           , "(Landroid/content/Context;Ljava/lang/String;)V"))
        {
            jobject ctx = getContext();
            jstring jstrEventId = GET_JSTRING(eventId);
            t.env->CallStaticVoidMethod(t.classID, t.methodID, ctx, jstrEventId);
            SAFE_RELEASE_JCONTEXT(ctx);
            SAFE_RELEASE_JOBJ(jstrEventId);
            SAFE_RELEASE_JOBJ(t.classID);
        }
    }
}

void MobClickCpp::event(const char *eventId, eventDict *attributes){
    JniMethodInfo t;
    if( JniHelper::getStaticMethodInfo(t
                                       , kUmengClassName
                                       , "onEvent"
                                       , "(Landroid/content/Context;Ljava/lang/String;Ljava/util/HashMap;)V"))
    {
        jobject ctx = getContext();
        jstring jstrEventId = GET_JSTRING(eventId);
        jobject jhmAttr = getJHashMap(attributes);
        t.env->CallStaticVoidMethod(t.classID, t.methodID, ctx, jstrEventId, jhmAttr);
        SAFE_RELEASE_JCONTEXT(ctx);
        SAFE_RELEASE_JOBJ(jstrEventId);
        SAFE_RELEASE_JOBJ(jhmAttr);
        SAFE_RELEASE_JOBJ(t.classID);
    }
}

void MobClickCpp::beginEvent(const char *eventId){
    JniMethodInfo t;
    if( JniHelper::getStaticMethodInfo(t
                                       , kUmengClassName
                                       , "onEventBegin"
                                       , "(Landroid/content/Context;Ljava/lang/String;)V"))
    {
        jobject ctx = getContext();
        jstring jstrEventId = GET_JSTRING(eventId);
        t.env->CallStaticVoidMethod(t.classID, t.methodID, ctx, jstrEventId);
        SAFE_RELEASE_JCONTEXT(ctx);
        SAFE_RELEASE_JOBJ(jstrEventId);
        SAFE_RELEASE_JOBJ(t.classID);
    }
}

void MobClickCpp::endEvent(const char *eventId){
    JniMethodInfo t;
    if( JniHelper::getStaticMethodInfo(t
                                       , kUmengClassName
                                       , "onEventEnd"
                                       , "(Landroid/content/Context;Ljava/lang/String;)V"))
    {
        jobject ctx = getContext();
        jstring jstrEventId = GET_JSTRING(eventId);
        t.env->CallStaticVoidMethod(t.classID, t.methodID, ctx, jstrEventId);
        SAFE_RELEASE_JCONTEXT(ctx);
        SAFE_RELEASE_JOBJ(jstrEventId);
        SAFE_RELEASE_JOBJ(t.classID);
    }
}

void MobClickCpp::beginEventWithLabel(const char *eventId, const char *label){
    JniMethodInfo t;
    if( JniHelper::getStaticMethodInfo(t
                                       , kUmengClassName
                                       , "onEventBegin"
                                       , "(Landroid/content/Context;Ljava/lang/String;Ljava/lang/String;)V"))
    {
        jobject ctx = getContext();
        jstring jstrEventId = GET_JSTRING(eventId);
        jstring jstrLabel = GET_JSTRING(label);
        t.env->CallStaticVoidMethod(t.classID, t.methodID, ctx, jstrEventId, jstrLabel);
        SAFE_RELEASE_JCONTEXT(ctx);
        SAFE_RELEASE_JOBJ(jstrEventId);
        SAFE_RELEASE_JOBJ(jstrLabel);
        SAFE_RELEASE_JOBJ(t.classID);
    }
}

void MobClickCpp::endEventWithLabel(const char *eventId, const char *label){
    JniMethodInfo t;
    if( JniHelper::getStaticMethodInfo(t
                                       , kUmengClassName
                                       , "onEventEnd"
                                       , "(Landroid/content/Context;Ljava/lang/String;Ljava/lang/String;)V"))
    {
        jobject ctx = getContext();
        jstring jstrEventId = GET_JSTRING(eventId);
        jstring jstrLabel = GET_JSTRING(label);
        t.env->CallStaticVoidMethod(t.classID, t.methodID, ctx, jstrEventId, jstrLabel);
        SAFE_RELEASE_JCONTEXT(ctx);
        SAFE_RELEASE_JOBJ(jstrEventId);
        SAFE_RELEASE_JOBJ(jstrLabel);
        SAFE_RELEASE_JOBJ(t.classID);
    }
}

void MobClickCpp::beginEventWithAttributes(const char *eventId, const char *primarykey, eventDict *attributes){
    JniMethodInfo t;
    if( JniHelper::getStaticMethodInfo(t
                                       , kUmengClassName
                                       , "onKVEventBegin"
                                       , "(Landroid/content/Context;Ljava/lang/String;Ljava/util/HashMap;Ljava/lang/String;)V"))
    {
        jobject ctx = getContext();
        jstring jstrEventId = GET_JSTRING(eventId);
        jobject jhmAttr = getJHashMap(attributes);
        jstring jstrKey = GET_JSTRING(primarykey);
        t.env->CallStaticVoidMethod(t.classID, t.methodID, ctx, jstrEventId, jhmAttr, jstrKey);
        SAFE_RELEASE_JCONTEXT(ctx);
        SAFE_RELEASE_JOBJ(jstrEventId);
        SAFE_RELEASE_JOBJ(jhmAttr);
        SAFE_RELEASE_JOBJ(jstrKey);
        SAFE_RELEASE_JOBJ(t.classID);
    }
}

void MobClickCpp::endEventWithAttributes(const char *eventId, const char *primarykey){
    JniMethodInfo t;
    if( JniHelper::getStaticMethodInfo(t
                                       , kUmengClassName
                                       , "onKVEventEnd"
                                       , "(Landroid/content/Context;Ljava/lang/String;Ljava/lang/String;)V"))
    {
        jobject ctx = getContext();
        jstring jstrEventId = GET_JSTRING(eventId);
        jstring jstrKey = GET_JSTRING(primarykey);
        t.env->CallStaticVoidMethod(t.classID, t.methodID, ctx, jstrEventId, jstrKey);
        SAFE_RELEASE_JCONTEXT(ctx);
        SAFE_RELEASE_JOBJ(jstrEventId);
        SAFE_RELEASE_JOBJ(jstrKey);
        SAFE_RELEASE_JOBJ(t.classID);
    }
}

void MobClickCpp::beginLogPageView(const char *pageName){
    JniMethodInfo t;
    if( JniHelper::getStaticMethodInfo(t
                                       , kUmengClassName
                                       , "onPageStart"
                                       , "(Ljava/lang/String;)V"))
    {
        jstring jstrPageName = GET_JSTRING(pageName);
        t.env->CallStaticVoidMethod(t.classID, t.methodID, jstrPageName);
        SAFE_RELEASE_JOBJ(jstrPageName);
        SAFE_RELEASE_JOBJ(t.classID);
    }
}

void MobClickCpp::endLogPageView(const char *pageName){
    JniMethodInfo t;
    if( JniHelper::getStaticMethodInfo(t
                                       , kUmengClassName
                                       , "onPageEnd"
                                       , "(Ljava/lang/String;)V"))
    {
        jstring jstrPageName = GET_JSTRING(pageName);
        t.env->CallStaticVoidMethod(t.classID, t.methodID, jstrPageName);
        SAFE_RELEASE_JOBJ(jstrPageName);
        SAFE_RELEASE_JOBJ(t.classID);
    }
}


void MobClickCpp::checkUpdate(){
}

void MobClickCpp::checkUpdate(const char *title, const char *cancelTitle, const char *otherTitle){
}

void MobClickCpp::updateOnlineConfig(){
    JniMethodInfo t;
    if( JniHelper::getStaticMethodInfo(t
                                       , kUmengClassName
                                       , "updateOnlineConfig"
                                       , "(Landroid/content/Context;Ljava/lang/String;Ljava/lang/String;)V"))
    {
        jobject ctx = getContext();
        jstring jstrAppKey = GET_JSTRING(s_umeng_appKey.c_str());
        jstring jstrChanel = GET_JSTRING(s_umeng_channelId.c_str());
        t.env->CallStaticVoidMethod(t.classID, t.methodID, ctx, jstrAppKey, jstrChanel);
        SAFE_RELEASE_JCONTEXT(ctx);
        SAFE_RELEASE_JOBJ(jstrAppKey);
        SAFE_RELEASE_JOBJ(jstrChanel);
        SAFE_RELEASE_JOBJ(t.classID);
    }
}

string MobClickCpp::getConfigParams(const char *key){
    string ret = "";
    JniMethodInfo t;
    if( JniHelper::getStaticMethodInfo(t
                                       , kUmengClassName
                                       , "getConfigParams"
                                       , "(Landroid/content/Context;Ljava/lang/String;)Ljava/lang/String;"))
    {
        jobject ctx = getContext();
        jstring jstrKey = GET_JSTRING(key);
        jstring jstrRet = (jstring)t.env->CallStaticObjectMethod(t.classID, t.methodID, ctx, jstrKey);
        ret = JniHelper::jstring2string(jstrRet);
        SAFE_RELEASE_JOBJ(jstrRet);
        SAFE_RELEASE_JCONTEXT(ctx);
        SAFE_RELEASE_JOBJ(jstrKey);
        SAFE_RELEASE_JOBJ(t.classID);
    }
    return ret;
}

void MobClickCpp::setContext(void* context){
    s_umeng_ctx = (jobject)context;
}

void MobClickCpp::enableActivityDurationTrack(){
    JniMethodInfo t;
    if( JniHelper::getStaticMethodInfo(t
                                       , kUmengClassName
                                       , "openActivityDurationTrack"
                                       , "(Z)V"))
    {
        t.env->CallStaticVoidMethod(t.classID, t.methodID, JNI_FALSE);
        SAFE_RELEASE_JOBJ(t.classID);
    }
}




























