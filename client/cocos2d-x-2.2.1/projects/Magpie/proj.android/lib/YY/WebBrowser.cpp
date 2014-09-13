/*
 * WebBrowser.cpp
 *
 *  Created on: 2014-9-12
 *      Author: arthur
 */

#include "WebBrowser.h"
#include "JniHelper.h"
#include "cocos2d.h"
using namespace cocos2d;

WebBrowser::WebBrowser() {
	// TODO Auto-generated constructor stub
}

void WebBrowser::openWebView() {
	//#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
    //Jni对象，可以看成结构体
    JniMethodInfo minfo;
    //getStaticMethodInfo，判断Java静态函数是否存在，并且把信息保存到minfo里
    //参数1：JniMethodInfo
    //参数2：Java类包名+类名
    //参数3：Java函数名称
    //参数4：函数参数类型和返回值类型，这里的返回值类型是Majiang类的对象。写法：L+包名+;     其他的类型请看上面的“JNI详细教程”
    bool isHave = JniHelper::getStaticMethodInfo(minfo,"com/LeasureGame/Magpie/Magpie","getInstance","()Lcom/LeasureGame/Magpie/Magpie;");
    jobject jobj;//存对象
    if (isHave) {
        CCLog("静态函数存在");
        //调用Java静态函数，取得对象。
        jobj = minfo.env->CallStaticObjectMethod(minfo.classID, minfo.methodID);
    }
    //getMethodInfo，判断Java非静态函数是否存在，并且把信息保存到minfo里
    isHave = JniHelper::getMethodInfo(minfo,"com/LeasureGame/Magpie/Magpie","openAndroidView","()V");
    if (isHave) {
        CCLog("非静态函数存在");
        //调用java非静态函数, 参数1：Java对象，上面已经取得   参数2：方法ID
        minfo.env->CallVoidMethod(jobj, minfo.methodID);
    }
    //#endif
}

WebBrowser::~WebBrowser() {
	// TODO Auto-generated destructor stub
}

