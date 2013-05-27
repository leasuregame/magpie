//
//  HttpClientPackage.h
//  httpClientTest
//
//  Created by lCeve on 13-5-23.
//
//

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
    bool HttpGetRequest(std::string url);
    bool HttpPostRequest(std::string url, std::string data);
    std::string GetResponseCode();

    static HttpClientPackage* getInstance();
    void destroyInstance();
    
    void callback(cocos2d::CCNode *sender, void *data);
    
    static HttpClientPackage * httpClientPackage;
    std::string responseCode;
    
    void setJsCallback(jsval jsCallback, jsval jsThisObj);
    
    jsval jsCallback;
    jsval jsThisObj;
    jsval extraData;
};

#endif /* defined(__httpClientTest__HttpClientPackage__) */
