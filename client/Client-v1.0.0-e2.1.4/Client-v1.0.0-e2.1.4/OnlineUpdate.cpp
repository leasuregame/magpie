//
//  OnlineUpdate.cpp
//  Client-v1.0.0-e2.1.4
//
//  Created by lcc3536 on 13-8-5.
//
//

#include <iostream>
#include "cocos2d.h"
#include "OnlineUpdate.h"

USING_NS_CC;
USING_NS_CC_EXT;

OnlineUpdate::OnlineUpdate()
: pItemEnter(NULL)
, pItemReset(NULL)
, pItemUpdate(NULL)
, pProgressLabel(NULL)
, isUpdateItemClicked(false)
{
    init();
}

OnlineUpdate::~OnlineUpdate()
{
    AssetsManager *pAssetsManager = getAssetsManager();
    CC_SAFE_DELETE(pAssetsManager);
}

void OnlineUpdate::update(cocos2d::CCObject *pSender)
{
    pProgressLabel->setString("提示信息：你点击了更新。。。");
    
    // update resources
    getAssetsManager()->update();
    
    isUpdateItemClicked = true;
}

void OnlineUpdate::reset(cocos2d::CCObject *pSender)
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

void OnlineUpdate::enter(cocos2d::CCObject *pSender)
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

bool OnlineUpdate::init()
{
    CCLayer::init();
    
    createDownloadedDir();
    
    CCSize size = CCDirector::sharedDirector()->getWinSize();
    
    CCMenuItemFont::setFontSize(50);
    
    pItemReset = CCMenuItemFont::create("删除", this, menu_selector(OnlineUpdate::reset));
    pItemEnter = CCMenuItemFont::create("进入", this, menu_selector(OnlineUpdate::enter));
    pItemUpdate = CCMenuItemFont::create("更新", this, menu_selector(OnlineUpdate::update));
    
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

AssetsManager* OnlineUpdate::getAssetsManager()
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

void OnlineUpdate::createDownloadedDir()
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

void OnlineUpdate::onError(AssetsManager::ErrorCode errorCode)
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

voidOnlineUpdate::onProgress(int percent)
{
    char progress[200];
    snprintf(progress, 200, "提示信息：已更新。。。 %d%%", percent);
    pProgressLabel->setString(progress);
}

void OnlineUpdate::onSuccess()
{
    pProgressLabel->setString("提示信息：更新完毕。。。");
}