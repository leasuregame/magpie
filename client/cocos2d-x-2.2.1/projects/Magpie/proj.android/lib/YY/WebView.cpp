/*
 * WebView.cpp
 *
 *  Created on: 2014-9-4
 *      Author: arthur
 */

#include "WebView.h"
#include "JniHelper.h"
#include "cocos2d.h"
using namespace cocos2d;

const char* webLayerClassName = "com/LeasureGame/Magpie/WebLayer";

#define GET_JSTRING(cstr)   ((cstr) ? t.env->NewStringUTF(cstr) : NULL)

#define SAFE_RELEASE_JOBJ(jobj)   if(jobj) { \
                                    t.env->DeleteLocalRef(jobj); \
								}

#define SAFE_RELEASE_JCONTEXT(jctx)     if(!_ctx){ \
                                            SAFE_RELEASE_JOBJ(jctx); \
                                }

WebView::WebView(const char* url) {
	JniMethodInfo t;
	if( JniHelper::getStaticMethodInfo( t
										, webLayerClassName
										, "getInstance"
										, "(Ljava/lang/String;)Lcom/LeasureGame/Magpie/WebLayer"))
	{
		jstring jstrUrl = GET_JSTRING(url);
		this->webview = t.env->CallStaticVoidMethod(t.classID, t.methodID, jstrUrl);
		SAFE_RELEASE_JCONTEXT(jstrUtl)
		SAFE_RELEASE_JOBJ(t.classID);
	}
}

void WebView::close() {
	JniMethodInfo t;
	if (JniHelper::getMethodInfo(t
								, webLayerClassName
								, "close"
								, "()V"))
	{
		t.env->callViewMethod(this->webview, t.classID, t.methodID);
		SAFE_RELEASE_JOBJ(t.classID);
	}
}

WebView* WebView::create(const char* url){
	return new WebView(url);
}

WebView::~WebView() {
	// TODO Auto-generated destructor stub
}

