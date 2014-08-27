/*
 * YYClient.cpp
 *
 *  Created on: Aug 23, 2014
 *      Author: uRyn
 */

#include "YYClient.h"
#include "JniHelper.h"
#include "cocos2d.h"
using namespace cocos2d;

const char* yyWrapperClassName = "com/LeasureGame/Magpie/YYWrapper";
const char* mActivityName = "com/LeasureGame/Magpie/Magpie";

#define GET_JSTRING(cstr)   ((cstr) ? t.env->NewStringUTF(cstr) : NULL)

#define SAFE_RELEASE_JOBJ(jobj)   if(jobj) { \
                                    t.env->DeleteLocalRef(jobj); \
                                }
#define SAFE_RELEASE_JCONTEXT(jctx)     if(!s_umeng_ctx){ \
                                            SAFE_RELEASE_JOBJ(jctx); \
                                }

jobject _ctx = NULL;

jobject getContext1(){
    if (_ctx) {
        return _ctx;
    }
    JniMethodInfo t;
    if( JniHelper::getStaticMethodInfo(t
                                       , mActivityName
                                       , "getContext"
                                       , "()Landroid/content/Context;"))
    {
        jobject ret = t.env->CallStaticObjectMethod(t.classID, t.methodID);
        SAFE_RELEASE_JOBJ(t.classID);
        return ret;
    }
    return NULL;
}

//static YYClient* _instance;

//YYClient* YYClient::getInstance(){
//	if(_instance == NULL) {
//		return new YYClient();
//	} else {
//		return _instance;
//	}
//}

//void YYClient::executeCallback(const char* name, uint32_t argc, jsval *vp, jsval *retVal) {
//	ScriptingCore::getInstance()->executeCallbackWithOwner(this, name, argc, vp, retVal);
//}

void YYClient::init() {
	JniMethodInfo t;
	if( JniHelper::getStaticMethodInfo( t
										, yyWrapperClassName
										, "init"
										, "(Landroid/content/Context;)V"))
	{
		jobject ctx = getContext1();
		t.env->CallStaticVoidMethod(t.classID, t.methodID, ctx);
		SAFE_RELEASE_JOBJ(t.classID);
	}
}

bool YYClient::getInitResult() {
	JniMethodInfo t;
	jboolean isInitSuccess = false;
	if( JniHelper::getStaticMethodInfo(t
									   , yyWrapperClassName
									   , "getInitResult"
									   , "()Z"))
	{
		isInitSuccess = t.env->CallStaticBooleanMethod(t.classID, t.methodID);
		SAFE_RELEASE_JOBJ(t.classID);
	}
	return isInitSuccess;
}

