//
//  AssetsManagerTestAppDelegate.cpp
//  AssetsManagerTest
//

#include "AppDelegate.h"

#include "cocos2d.h"
#include "SimpleAudioEngine.h"
#include "ScriptingCore.h"
#include "generated/jsb_cocos2dx_auto.hpp"
#include "cocos2d_specifics.hpp"

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
}

bool AppDelegate::applicationDidFinishLaunching()
{
    // initialize director
    CCDirector *pDirector = CCDirector::sharedDirector();
    pDirector->setOpenGLView(CCEGLView::sharedOpenGLView());

    // turn on display FPS
    //pDirector->setDisplayStats(true);
    
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
    sc->addRegisterCallback(register_cocos2dx_js_extensions);
    
    sc->start();
    
    CCScene *scene = CCScene::create();
    UpdateLayer *updateLayer = new UpdateLayer();
    scene->addChild(updateLayer);
    updateLayer->release();
    
    pDirector->runWithScene(scene);
    
    return true;
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
    label->setString("提示信息：你点击了更新。。");
    
    // update resources
    getAssetsManager()->update();
    
    isUpdateItemClicked = true;
}

void UpdateLayer::reset(cocos2d::CCObject *pSender)
{
    label->setString("提示信息：你点击了删除。。");
    
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
    label->setString("提示信息：你点击了进入。。");
    
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
    ScriptingCore::getInstance()->runScript("main.js");
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
    
    label = CCLabelTTF::create("提示信息：", "Times New Roman", 25);
    label->setPosition(ccp(size.width/5, size.height/5));
    label->setAnchorPoint(ccp(0, 0));
    addChild(label);
    
    CCLOG("::: %d   %f", pItemEnter->fontSize(), size.height);

    
    pItemEnter->setPosition(ccp(size.width/2, size.height/2 + 150));
    pItemReset->setPosition(ccp(size.width/2, size.height/2));
    pItemUpdate->setPosition(ccp(size.width/2, size.height/2 - 150));
    
    CCMenu *menu = CCMenu::create(pItemUpdate, pItemEnter, pItemReset, NULL);
    menu->setPosition(ccp(0,0));
    addChild(menu);
    
    return true;
}

AssetsManager* UpdateLayer::getAssetsManager()
{
    static AssetsManager *pAssetsManager = NULL;
    
    if (! pAssetsManager)
    {
        pAssetsManager = new AssetsManager("http://192.168.1.15/resource/game.zip",
                                           "http://192.168.1.15:8888/",
                                           pathToSave.c_str());
    }
    
    pAssetsManager->setLabel(label);
    
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
