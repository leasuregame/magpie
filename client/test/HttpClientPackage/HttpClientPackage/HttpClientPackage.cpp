//
//  HttpClientPackage.cpp
//  httpClientTest
//
//  Created by lcc3536 on 13-5-23.
//
//

#include "HttpClientPackage.h"

HttpClientPackage * HttpClientPackage::httpClientPackage = NULL;

void HttpClientPackage::setJsCallback(jsval jsCallback, jsval jsThisObj)
{
    this->jsCallback = jsCallback;
    this->jsThisObj = jsThisObj;
}

bool HttpClientPackage::HttpGetRequest(std::string url)
{
    CCLog("HttpClientPackage::HttpGetRequest");
    CCLog(url.c_str());
    
    responseCode.clear();
    
    CCHttpRequest* request = new CCHttpRequest();
    request->setUrl(url.c_str());
    request->setRequestType(CCHttpRequest::kHttpGet);
    request->setResponseCallback(this, callfuncND_selector(HttpClientPackage::callback));
    
    request->setTag((url + " http get").c_str());
    CCHttpClient::getInstance()->send(request);
    
    request->release();
    
    return true;
}

bool HttpClientPackage::HttpPostRequest(std::string url, std::string data)
{
    CCLog("HttpClientPackage::HttpPostRequest");
    CCLog(url.c_str());
    CCLog(data.c_str());
 
    responseCode.clear();
    
    CCHttpRequest* request = new CCHttpRequest();
    request->setUrl(url.c_str());
    request->setRequestType(CCHttpRequest::kHttpPost);
    request->setResponseCallback(this, callfuncND_selector(HttpClientPackage::callback));
    
    // write the post data
    const char* postData = data.c_str();
    request->setRequestData(postData, strlen(postData));
    
    request->setTag((std::string("url ") + url + std::string(" data ") + data + std::string(" http post")).c_str());
    CCHttpClient::getInstance()->send(request);
    
    request->release();
    
    return true;
}

std::string HttpClientPackage::GetResponseCode()
{
    return responseCode;
}

void HttpClientPackage::callback(cocos2d::CCNode *sender, void *data)
{
    CCLog("HttpClientPackage::callback");
    
    CCHttpResponse *response = (CCHttpResponse*)data;
    
    if (!response)
    {
        return;
    }
    
    // You can get original request type from: response->request->reqType
    if (0 != strlen(response->getHttpRequest()->getTag()))
    {
        CCLog("%s completed", response->getHttpRequest()->getTag());
    }
    
    int statusCode = response->getResponseCode();
    char statusString[64] = {};
    sprintf(statusString, "HTTP Status Code: %d, tag = %s", statusCode, response->getHttpRequest()->getTag());
    
    CCLog(statusString);
    CCLog("response code: %d", statusCode);
    
    if (!response->isSucceed())
    {
        CCLog("response failed");
        CCLog("error buffer: %s", response->getErrorBuffer());
        return;
    }
    
    // dump data
    std::vector<char> *buffer = response->getResponseData();
    responseCode.assign(buffer->begin(),buffer->end() );
    
    //CCLog(responseCode.c_str());
    
    JSContext *cx = ScriptingCore::getInstance()->getGlobalContext();
    jsval valResponseCode = std_string_to_jsval(cx, responseCode);
    
    JSBool ok = JS_AddValueRoot(cx, &valResponseCode);
    if (!ok) {
        CCLOG("scheduleFunc: Root value fails.");
        return;
    }
    
    jsval retval;
    if(jsCallback != JSVAL_VOID)
    {
        JS_CallFunctionValue(cx, JSVAL_TO_OBJECT(jsThisObj), jsCallback, 1, &valResponseCode, &retval);
    }
    
    JS_RemoveValueRoot(cx, &valResponseCode);
}

HttpClientPackage* HttpClientPackage::getInstance()
{
    CCLog("HttpClientPackage getInstance");
    
    if(httpClientPackage != NULL) return httpClientPackage;
    
    CCLog("httpClientPackage is NULL, new a HttpClientPackage");
    
    httpClientPackage = new HttpClientPackage();
    
    return httpClientPackage;
}

void HttpClientPackage::destroyInstance()
{
    CCLog("HttpClientPackage destroyInstance");
    
    if(httpClientPackage != NULL) {
        httpClientPackage->release();
        httpClientPackage = NULL;
    }
}