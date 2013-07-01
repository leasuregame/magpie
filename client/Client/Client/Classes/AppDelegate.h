//
//  GCTestAppDelegate.h
//  GCTest
//
//  Created by Rohan Kuruvilla on 06/08/2012.
//  Copyright __MyCompanyName__ 2012. All rights reserved.
//

#ifndef  _APP_DELEGATE_H_
#define  _APP_DELEGATE_H_

#include "CCApplication.h"
#include "cocos2d.h"
#include "AssetsManager/AssetsManager.h"

/**
@brief    The cocos2d Application.

The reason for implement as private inheritance is to hide some interface call by CCDirector.
*/
class  AppDelegate : private cocos2d::CCApplication
{
public:
    AppDelegate();
    virtual ~AppDelegate();

    /**
    @brief    Implement CCDirector and CCScene init code here.
    @return true    Initialize success, app continue.
    @return false   Initialize failed, app terminate.
    */
    virtual bool applicationDidFinishLaunching();

    /**
    @brief  The function be called when the application enter background
    @param  the pointer of the application
    */
    virtual void applicationDidEnterBackground();

    /**
    @brief  The function be called when the application enter foreground
    @param  the pointer of the application
    */
    virtual void applicationWillEnterForeground();
};

class UpdateLayer : public cocos2d::CCLayer, public cocos2d::extension::AssetsManagerDelegateProtocol
{
public:
    UpdateLayer();
    ~UpdateLayer();
    virtual bool init();
    
    void enter(cocos2d::CCObject *pSender);
    void reset(cocos2d::CCObject *pSender);
    void update(cocos2d::CCObject *pSender);
    
    virtual void onError(cocos2d::extension::AssetsManager::ErrorCode errorCode);
    virtual void onProgress(int percent);
    virtual void onSuccess();
    
private:
    cocos2d::extension::AssetsManager* getAssetsManager();
    void createDownloadedDir();
    
    cocos2d::CCMenuItemFont *pItemEnter;
    cocos2d::CCMenuItemFont *pItemReset;
    cocos2d::CCMenuItemFont *pItemUpdate;
    cocos2d::CCLabelTTF *pProgressLabel;
    std::string pathToSave;
    bool isUpdateItemClicked;
};


#endif // _APP_DELEGATE_H_

