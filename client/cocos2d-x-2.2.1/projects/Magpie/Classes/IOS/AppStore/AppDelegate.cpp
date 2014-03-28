#include "AppDelegate.h"

#include "cocos2d.h"
#include "cocos-ext.h"
#include "SimpleAudioEngine.h"
#include "ScriptingCore.h"
#include "generated/jsb_cocos2dx_auto.hpp"
#include "generated/jsb_cocos2dx_extension_auto.hpp"
#include "generated/jsb_cocos2dx_studio_auto.hpp"
#include "jsb_cocos2dx_extension_manual.h"
#include "jsb_cocos2dx_studio_manual.h"
#include "cocos2d_specifics.hpp"
#include "js_bindings_chipmunk_registration.h"
#include "js_bindings_system_registration.h"
#include "js_bindings_ccbreader.h"
#include "jsb_opengl_registration.h"
#include "XMLHTTPRequest.h"
#include "jsb_websocket.h"
#include "js_bindings_IAPHelp.hpp"
#include "js_bindings_MobClickCpp.hpp"
#include "js_bindings_WebLayer.hpp"
#include "js_bindings_NotificationHelp.hpp"

USING_NS_CC;
USING_NS_CC_EXT;
using namespace CocosDenshion;

AppDelegate::AppDelegate()
{
}

AppDelegate::~AppDelegate()
{
    CCScriptEngineManager::purgeSharedManager();
}

bool AppDelegate::applicationDidFinishLaunching()
{
    // initialize director
    CCDirector* pDirector = CCDirector::sharedDirector();
    CCEGLView* pEGLView = CCEGLView::sharedOpenGLView();
    
    pDirector->setOpenGLView(pEGLView);
    
    // turn on display FPS
    pDirector->setDisplayStats(false);
    
    CCSize screenSize = pEGLView->getFrameSize();
    
    this->resolutionAdapter();
    
    // set FPS. the default value is 1.0/60 if you don't call this
    pDirector->setAnimationInterval(1.0 / 30);
    
    ScriptingCore* sc = ScriptingCore::getInstance();
    sc->addRegisterCallback(register_all_cocos2dx);
    sc->addRegisterCallback(register_all_cocos2dx_extension);
    sc->addRegisterCallback(register_all_cocos2dx_extension_manual);
    sc->addRegisterCallback(register_cocos2dx_js_extensions);
    sc->addRegisterCallback(register_all_cocos2dx_studio);
    sc->addRegisterCallback(register_all_cocos2dx_studio_manual);
    sc->addRegisterCallback(register_CCBuilderReader);
    sc->addRegisterCallback(jsb_register_chipmunk);
    sc->addRegisterCallback(jsb_register_system);
    sc->addRegisterCallback(JSB_register_opengl);
    sc->addRegisterCallback(MinXmlHttpRequest::_js_register);
    sc->addRegisterCallback(register_jsb_websocket);
    sc->addRegisterCallback(register_all_js_bindings_IAPHelp);
    sc->addRegisterCallback(register_all_js_bindings_MobClickCpp);
    sc->addRegisterCallback(register_all_js_bindings_WebLayer);
    sc->addRegisterCallback(register_all_js_bindings_NotificationHelp);
    
    sc->start();
    
    AssetsManager::getInstance();
    
    CCScriptEngineProtocol *pEngine = ScriptingCore::getInstance();
    CCScriptEngineManager::sharedManager()->setScriptEngine(pEngine);
    ScriptingCore::getInstance()->runScript("main_binding.js");
       
    return true;
}

void handle_signal(int signal) {
    static int internal_state = 0;
    ScriptingCore* sc = ScriptingCore::getInstance();
    // should start everything back
    CCDirector* director = CCDirector::sharedDirector();
    if (director->getRunningScene()) {
        director->popToRootScene();
    } else {
        CCPoolManager::sharedPoolManager()->finalize();
        if (internal_state == 0) {
            //sc->dumpRoot(NULL, 0, NULL);
            sc->start();
            internal_state = 1;
        } else {
            sc->runScript("hello.js");
            internal_state = 0;
        }
    }
}

// This function will be called when the app is inactive. When comes a phone call,it's be invoked too
void AppDelegate::applicationDidEnterBackground()
{
    CCDirector::sharedDirector()->stopAnimation();
    SimpleAudioEngine::sharedEngine()->pauseBackgroundMusic();
    SimpleAudioEngine::sharedEngine()->pauseAllEffects();
    
    // 回调js同名函数
    ScriptingCore::getInstance()->executeCallbackWithOwner(this, "jsApplicationDidEnterBackground");
}

// this function will be called when the app is active again
void AppDelegate::applicationWillEnterForeground()
{
    CCDirector::sharedDirector()->startAnimation();
    SimpleAudioEngine::sharedEngine()->resumeBackgroundMusic();
    SimpleAudioEngine::sharedEngine()->resumeAllEffects();
    
    // 回调js同名函数
    ScriptingCore::getInstance()->executeCallbackWithOwner(this, "jsApplicationWillEnterForeground");
}

void AppDelegate::resolutionAdapter()
{
    CCLOG("AppDelegate resolutionAdapter");
    
    CCEGLView* pEGLView = CCEGLView::sharedOpenGLView();
    CCSize screenSize = pEGLView->getFrameSize();
    
    const CCSize resolutionSize1 = CCSize(640, 1136);
    const CCSize resolutionSize2 = CCSize(720, 960);
    const CCSize resolutionSize3 = CCSize(640, 960);
    
    const float screenSizeWHR = screenSize.width / screenSize.height;
    const float resolutionSizeWHR1 = resolutionSize1.width / resolutionSize1.height;
    const float resolutionSizeWHR2 = resolutionSize2.width / resolutionSize2.height;
    const float resolutionSizeWHR3 = resolutionSize3.width / resolutionSize3.height;
    
    const float WHR_EPSILON = 0.02f;
    
    CCLOG("宽度: %f | 高度: %f", screenSize.width, screenSize.height);
    
    do
    {
        if (screenSize.equals(resolutionSize1))
        {
            // 640 * 1146分辨率不需要适配
            break;
        }
        
        if (screenSize.equals(resolutionSize2))
        {
            // 720 * 960分辨率不需要适配
            break;
        }
        
        if (screenSize.equals(resolutionSize3))
        {
            // 640 * 960
            pEGLView->setDesignResolutionSize(0, 0, 720, 960, kResolutionNoBorder);
            break;
        }
        
        float gapWHR1 = fabsf(screenSizeWHR - resolutionSizeWHR1);
        float gapWHR2 = fabsf(screenSizeWHR - resolutionSizeWHR2);
        float gapWHR3 = fabsf(screenSizeWHR - resolutionSizeWHR3);
        
        if (gapWHR1 < WHR_EPSILON)
        {
            // 近似640 * 1146分辨率，使用kResolutionExactFit铺满屏幕
            pEGLView->setDesignResolutionSize(0, 0, 640, 1136, kResolutionExactFit);
            break;
        }
        
        if (gapWHR2 < WHR_EPSILON)
        {
            // 近似720 * 960分辨率，使用kResolutionExactFit铺满屏幕
            pEGLView->setDesignResolutionSize(0, 0, 720, 960, kResolutionExactFit);
            break;
        }
        
        if (gapWHR3 < WHR_EPSILON)
        {
            // 近似640 * 960分辨率，使用kResolutionExactFit铺满屏幕
            pEGLView->setDesignResolutionSize(40, 0, 640, 960, kResolutionExactFit);
            break;
        }

        if (gapWHR1 <= gapWHR2 && gapWHR1 <= gapWHR3)
        {
            // 接近640 * 1136分辨率，以640 * 1136分辨率处理
            pEGLView->setDesignResolutionSize(0, 0, 640, 1136, kResolutionShowAll);
            break;
        }
        
        if (gapWHR2 <= gapWHR1 && gapWHR2 <= gapWHR3)
        {
            // 接近720 * 960分辨率，以720 * 960分辨率处理
            pEGLView->setDesignResolutionSize(0, 0, 720, 960, kResolutionShowAll);
            break;
        }
        
        if (gapWHR3 <= gapWHR1 && gapWHR3 <= gapWHR2)
        {
            // 接近640 * 960分辨率，以640 * 960分辨率处理
            pEGLView->setDesignResolutionSize(40, 0, 640, 960, kResolutionShowAll);
            break;
        }
    } while(0);
}