//
//  OnlineUpdate.h
//  Client-v1.0.0-e2.1.4
//
//  Created by lcc3536 on 13-8-5.
//
//

#ifndef __Client_v1_0_0_e2_1_4__OnlineUpdate__
#define __Client_v1_0_0_e2_1_4__OnlineUpdate__

#include <iostream>
#include "cocos2d.h"
#include "AssetsManager/AssetsManager.h"

class OnlineUpdate : public cocos2d::CCLayer, public cocos2d::extension::AssetsManagerDelegateProtocol
{
public:
    OnlineUpdate();
    ~OnlineUpdate();
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

#endif /* defined(__Client_v1_0_0_e2_1_4__OnlineUpdate__) */
