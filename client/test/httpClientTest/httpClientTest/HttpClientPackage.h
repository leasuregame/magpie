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
#include "cocos2d.h"
#include "cocos-ext.h"

class HttpClientPackage : public cocos2d::CCObject
{
public:
    bool HttpGetRequest(std::string url);
    bool HttpPostRequest(std::string url, std::string data);
    std::string GetResponseCode();

    static HttpClientPackage* getInstance();
    void destroyInstance();

private:
    HttpClientPackage();
    void callback(cocos2d::CCNode *sender, void *data);
    
    static HttpClientPackage * httpClientPackage;
    std::string responseCode;
};

#endif /* defined(__httpClientTest__HttpClientPackage__) */
