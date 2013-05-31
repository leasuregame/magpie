//
//  HttpClientPackage.h
//  httpClientTest
//
//  Created by lcc3536 on 13-5-23.
//
//


/*
 封装HttpClient类，绑定js
 
 主要提供以下接口供js调用：
 getInstance 函数 获取引用
 js调用格式：
 lz.HttpClientPackage.getInstance();
 
 destroyInstance 函数 消除引用
 js调用格式：
 lz.HttpClientPackage.destroyInstance();
 
 HttpGetRequest 函数 发送 http get 请求
 js调用格式：
 lz.HttpClientPackage.HttpGetRequest(url, callback, this);
 e.g.
    var lCeve = {
        callback : function() {
            cc.log("Success");
        }
    }
    lz.HttpClientPackage.HttpGetRequest("http://www.baidu.com/", lCeve.callback, lCeve);
 
 HttpPostRequest 函数 发送 http post 请求
 js调用格式：
 lz.HttpClientPackage.HttpPostRequest(url, data, callback, this);
 e.g.
    var lCeve = {
    callback : function() {
        cc.log("Success");
        }
    }
    lz.HttpClientPackage.HttpGetRequest("http://www.baidu.com/", "nimei", lCeve.callback, lCeve);
 */


#ifndef __httpClientTest__HttpClientPackage__
#define __httpClientTest__HttpClientPackage__


#include <iostream>
#include "jsapi.h"
#include "cocos2d.h"
#include "cocos-ext.h"
#include "ScriptingCore.h"
#include "cocos2d_specifics.hpp"


USING_NS_CC;
USING_NS_CC_EXT;


class HttpClientPackage : public CCObject
{
public:
    static HttpClientPackage * httpClientPackage;
    
    static HttpClientPackage * getInstance();
    static void destroyInstance();
    
    void setJsCallback(jsval jsCallback, jsval jsThisObj);
    
    bool HttpGetRequest(string url);
    bool HttpPostRequest(string url, string data);
    
    void setTimeoutForConnect(int value);
    void setTimeoutForRead(int value);
    
    void callback(CCNode * sender, void *data);
    
    
private:
    jsval jsCallback;
    jsval jsThisObj;
};

#endif /* defined(__httpClientTest__HttpClientPackage__) */
