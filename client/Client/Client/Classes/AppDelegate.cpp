#include "AppDelegate.h"

#include "cocos2d.h"
#include "SimpleAudioEngine.h"
#include "ScriptingCore.h"
#include "jsb_cocos2dx_auto.hpp"
#include "jsb_cocos2dx_extension_auto.hpp"
#include "jsb_cocos2dx_extension_manual.h"
#include "cocos2d_specifics.hpp"
#include "js_bindings_chipmunk_registration.h"
#include "js_bindings_ccbreader.h"
#include "js_bindings_system_registration.h"
#include "jsb_opengl_registration.h"
#include "js_binding_HttpClientPackage.hpp"
#include "jsb_websocket.h"

#if (CC_TARGET_PLATFORM != CC_PLATFORM_WIN32)
#include <dirent.h>
#include <sys/stat.h>
#endif

USING_NS_CC;
USING_NS_CC_EXT;
using namespace CocosDenshion;

AppDelegate::AppDelegate()
{
}

AppDelegate::~AppDelegate()
{
    //    SimpleAudioEngine::end();
}

bool AppDelegate::applicationDidFinishLaunching()
{
    // initialize director
    CCDirector *pDirector = CCDirector::sharedDirector();
    pDirector->setOpenGLView(CCEGLView::sharedOpenGLView());
    
    // turn on display FPS
    pDirector->setDisplayStats(true);
    
    CCSize screenSize = CCEGLView::sharedOpenGLView()->getFrameSize();
    
    if (screenSize.height > 960)
    {
        CCEGLView::sharedOpenGLView()->setDesignResolutionSize(0, 0, 720, 1136, kResolutionNoBorder);
    }
    else if (screenSize.height > 480)
    {
        CCEGLView::sharedOpenGLView()->setFrameSize(720, 1136);
        CCEGLView::sharedOpenGLView()->setDesignResolutionSize(40, 88, 720, 1136, kResolutionNoBorder);
    }
    else
    {
        CCEGLView::sharedOpenGLView()->setFrameSize(360, 568);
        CCEGLView::sharedOpenGLView()->setDesignResolutionSize(20, 44, 360, 568, kResolutionNoBorder);
    }
    
    // set FPS. the default value is 1.0/60 if you don't call this
    pDirector->setAnimationInterval(1.0 / 60);
    
    ScriptingCore* sc = ScriptingCore::getInstance();
    sc->addRegisterCallback(register_all_cocos2dx);
    sc->addRegisterCallback(register_all_cocos2dx_extension);
    sc->addRegisterCallback(register_cocos2dx_js_extensions);
    sc->addRegisterCallback(register_all_cocos2dx_extension_manual);
    sc->addRegisterCallback(register_CCBuilderReader);
    sc->addRegisterCallback(jsb_register_chipmunk);
    sc->addRegisterCallback(jsb_register_system);
    sc->addRegisterCallback(JSB_register_opengl);
    sc->addRegisterCallback(register_all_js_binding_HttpClientPackage);
    sc->addRegisterCallback(register_jsb_websocket);
    
    sc->start();
    
    CCScene *scene = CCScene::create();
    UpdateLayer *updateLayer = new UpdateLayer();
    scene->addChild(updateLayer);
    updateLayer->release();
    
    pDirector->runWithScene(scene);
    
//    CCScriptEngineProtocol *pEngine = ScriptingCore::getInstance();
//    CCScriptEngineManager::sharedManager()->setScriptEngine(pEngine);
//    ScriptingCore::getInstance()->runScript("main_binding.js");
    
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
}

// this function will be called when the app is active again
void AppDelegate::applicationWillEnterForeground()
{
    CCDirector::sharedDirector()->startAnimation();
    SimpleAudioEngine::sharedEngine()->resumeBackgroundMusic();
    SimpleAudioEngine::sharedEngine()->resumeAllEffects();
}

UpdateLayer::UpdateLayer()
: pItemEnter(NULL)
, pItemReset(NULL)
, pItemUpdate(NULL)
, pProgressLabel(NULL)
, isUpdateItemClicked(false)
{
    init();
}

UpdateLayer::~UpdateLayer()
{
    AssetsManager *pAssetsManager = getAssetsManager();
    CC_SAFE_DELETE(pAssetsManager);
}

void UpdateLayer::update(cocos2d::CCObject *pSender)
{
    pProgressLabel->setString("提示信息：你点击了更新。。。");
    
    // update resources
    getAssetsManager()->update();
    
    isUpdateItemClicked = true;
}

void UpdateLayer::reset(cocos2d::CCObject *pSender)
{
    pProgressLabel->setString("提示信息：你点击了删除。。。");
    
    // Remove downloaded files
#if (CC_TARGET_PLATFORM != CC_PLATFORM_WIN32)
    string command = "rm -r ";
    // Path may include space.
    command += "\"" + pathToSave + "\"";
    system(command.c_str());
#else
    string command = "rd /s /q ";
    // Path may include space.
    command += "\"" + pathToSave + "\"";
    system(command.c_str());
#endif
    // Delete recorded version codes.
    getAssetsManager()->deleteVersion();
    
    createDownloadedDir();
}

void UpdateLayer::enter(cocos2d::CCObject *pSender)
{
    pProgressLabel->setString("提示信息：你点击了进入。。。");
    
    // Should set search resource path before running script if "update" is not clicked.
    // Because AssetsManager will set
    if (! isUpdateItemClicked)
    {
        vector<string> searchPaths = CCFileUtils::sharedFileUtils()->getSearchPaths();
        searchPaths.insert(searchPaths.begin(), pathToSave);
        CCFileUtils::sharedFileUtils()->setSearchPaths(searchPaths);
    }
    
    CCScriptEngineProtocol *pEngine = ScriptingCore::getInstance();
    CCScriptEngineManager::sharedManager()->setScriptEngine(pEngine);
    ScriptingCore::getInstance()->runScript("main_binding.js");
}

bool UpdateLayer::init()
{
    CCLayer::init();
    
    createDownloadedDir();
    
    CCSize size = CCDirector::sharedDirector()->getWinSize();
    
    CCMenuItemFont::setFontSize(50);
    
    pItemReset = CCMenuItemFont::create("删除", this, menu_selector(UpdateLayer::reset));
    pItemEnter = CCMenuItemFont::create("进入", this, menu_selector(UpdateLayer::enter));
    pItemUpdate = CCMenuItemFont::create("更新", this, menu_selector(UpdateLayer::update));
    
    CCMenuItemFont::setFontSize(30);
    
    pItemEnter->setPosition(ccp(size.width/2, size.height/2 + 150));
    pItemReset->setPosition(ccp(size.width/2, size.height/2));
    pItemUpdate->setPosition(ccp(size.width/2, size.height/2 - 150));
    
    CCMenu *menu = CCMenu::create(pItemUpdate, pItemEnter, pItemReset, NULL);
    menu->setPosition(ccp(0,0));
    addChild(menu);
    
    pProgressLabel = CCLabelTTF::create("提示信息：", "Arial", 30);
    pProgressLabel->setPosition(ccp(size.width/5 + 50, size.height/5));
    pProgressLabel->setAnchorPoint(ccp(0, 0));
    addChild(pProgressLabel);
    
    return true;
}

AssetsManager* UpdateLayer::getAssetsManager()
{
    static AssetsManager *pAssetsManager = NULL;
    
    if (! pAssetsManager)
    {
        pAssetsManager = new AssetsManager("http://192.168.1.89/Resources/resources.zip",
                                           "http://192.168.1.89:8888/",
                                           pathToSave.c_str());
        pAssetsManager->setDelegate(this);
        pAssetsManager->setConnectionTimeout(3);
    }
    
    return pAssetsManager;
}

void UpdateLayer::createDownloadedDir()
{
    pathToSave = CCFileUtils::sharedFileUtils()->getWritablePath();
    pathToSave += "tmpdir";
    
    // Create the folder if it doesn't exist
#if (CC_TARGET_PLATFORM != CC_PLATFORM_WIN32)
    DIR *pDir = NULL;
    
    pDir = opendir (pathToSave.c_str());
    if (! pDir)
    {
        mkdir(pathToSave.c_str(), S_IRWXU | S_IRWXG | S_IRWXO);
    }
#else
	if ((GetFileAttributesA(pathToSave.c_str())) == INVALID_FILE_ATTRIBUTES)
	{
		CreateDirectoryA(pathToSave.c_str(), 0);
	}
#endif
}

void UpdateLayer::onError(AssetsManager::ErrorCode errorCode)
{
    if (errorCode == AssetsManager::kNoNewVersion)
    {
        pProgressLabel->setString("提示信息：不是新版本。。。");
    }
    
    if (errorCode == AssetsManager::kNetwork)
    {
        pProgressLabel->setString("提示信息：更行错误。。。");
    }
}

void UpdateLayer::onProgress(int percent)
{
    char progress[200];
    snprintf(progress, 200, "提示信息：已更新。。。 %d%%", percent);
    pProgressLabel->setString(progress);
}

void UpdateLayer::onSuccess()
{
    pProgressLabel->setString("提示信息：更新完毕。。。");
}