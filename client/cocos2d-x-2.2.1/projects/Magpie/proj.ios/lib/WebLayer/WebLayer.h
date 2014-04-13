//
//  WebLayer.h
//  Magpie
//
//  Created by lCeve on 13-12-20.
//
//

#ifndef __WEB_LAYER__
#define __WEB_LAYER__

#ifdef __OBJC__
@class WebLayerOC;
#else
typedef struct objc_object WebLayerOC;
#endif

#include "cocos2d.h"

USING_NS_CC;

class WebLayer : public cocos2d::CCLayer
{
public:
    WebLayer(const char * url, const CCRect rect);
    virtual ~WebLayer();
    void close();
    
    static WebLayer * create(const char * url, const CCRect rect);
    
private:
    WebLayerOC * _webLayerOC;
};

#endif /* defined(__WEB_LAYER__) */