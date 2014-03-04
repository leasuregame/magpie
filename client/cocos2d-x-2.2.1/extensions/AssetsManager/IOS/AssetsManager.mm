/****************************************************************************
 Copyright (c) 2013 cocos2d-x.org
 
 http://www.cocos2d-x.org
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

#include "AssetsManager.h"
#include "cocos2d.h"

#if (CC_TARGET_PLATFORM != CC_PLATFORM_WINRT) && (CC_TARGET_PLATFORM != CC_PLATFORM_WP8)
#include <curl/curl.h>
#include <curl/easy.h>

#include <stdio.h>
#include <vector>

#if (CC_TARGET_PLATFORM != CC_PLATFORM_WIN32)
#include <sys/types.h>
#include <sys/stat.h>
#include <errno.h>
#include <dirent.h>
#endif

#include "support/zip_support/unzip.h"
#import <Foundation/Foundation.h>

using namespace cocos2d;
using namespace std;

NS_CC_EXT_BEGIN;

#define UPDATE_DIR "update_dir"
#define KEY_OF_APP_VERSION   "app-version-code"
#define KEY_OF_VERSION   "current-version-code"
#define KEY_OF_DOWNLOADED_VERSION    "downloaded-version-code"
#define TEMP_PACKAGE_FILE_NAME    "cocos2dx-update-temp-package.zip"
#define BUFFER_SIZE    8192
#define MAX_FILENAME   512

// Message type
#define ASSETSMANAGER_MESSAGE_UPDATE_SUCCEED                0
#define ASSETSMANAGER_MESSAGE_RECORD_DOWNLOADED_VERSION     1
#define ASSETSMANAGER_MESSAGE_PROGRESS                      2
#define ASSETSMANAGER_MESSAGE_ERROR                         3

// Some data struct for sending messages

struct ErrorMessage
{
    AssetsManager::ErrorCode code;
    AssetsManager* manager;
};

struct ProgressMessage
{
    double totalToDownload;
    double nowDownloaded;
    AssetsManager* manager;
};

string getNewVersion(string version1, string version2)
{
    if(version1 == "")
    {
        return version2;
    }
    
    if(version2 == "")
    {
        return version1;
    }
    
    if(version1 == version2)
    {
        return version1;
    }
    
    int len = 3;
    int v1[len], v2[len];
    
    sscanf(version1.c_str(), "%d.%d.%d", &v1[0], &v1[1], &v1[2]);
    sscanf(version2.c_str(), "%d.%d.%d", &v2[0], &v2[1], &v2[2]);
    
    CCLOG("===============================");
    CCLOG("%s", version1.c_str());
    CCLOG("%d--%d--%d", v1[0], v1[1], v1[2]);
    CCLOG("===============================");
    CCLOG("%s", version2.c_str());
    CCLOG("%d--%d--%d", v2[0], v2[1], v2[2]);
    CCLOG("===============================");
    
    for(int i = 0; i < len; ++i)
    {
        if(v1[i] != v2[i])
        {
            return (v1[i] > v2[i] ? version1 : version2);
        }
    }
    
    CCLOG("版本号相同");
    
    return version1;
}


// Implementation of AssetsManager

AssetsManager::AssetsManager(const char* packageUrl/* =NULL */, const char* versionFileUrl/* =NULL */, const char* storagePath/* =NULL */)
: _version("")
, _packageUrl(packageUrl)
, _versionFileUrl(versionFileUrl)
, _downloadedVersion("")
, _curl(NULL)
, _tid(NULL)
, _connectionTimeout(0)
, _delegate(NULL)
, _shouldDeleteDelegateWhenExit(false)
{
    this->setStoragePath(storagePath);
    _schedule = new Helper();
}

AssetsManager::~AssetsManager()
{
    if (_schedule)
    {
        _schedule->release();
    }
    
    // 添加释放代理操作
    if (_shouldDeleteDelegateWhenExit)
    {
        delete _delegate;
    }
}

void AssetsManager::init()
{
    CCLOG("---------------------------------");
    CCLOG("IOS AssetsManager");
    CCLOG("---------------------------------");
    
    std::string oldAppVersion = CCUserDefault::sharedUserDefault()->getStringForKey(KEY_OF_APP_VERSION, "");
    std::string appVersion = getAppVersion();
    
    CCLOG("%s", oldAppVersion.c_str());
    CCLOG("%s", appVersion.c_str());
    
    if(oldAppVersion != appVersion)
    {
        CCUserDefault::sharedUserDefault()->setStringForKey(KEY_OF_APP_VERSION, appVersion);
        
        destroyStoragePath();
    }
    
    setSearchPath();
}

void AssetsManager::checkStoragePath()
{
    if (_storagePath.size() > 0 && _storagePath[_storagePath.size() - 1] != '/')
    {
        _storagePath.append("/");
    }
}

static size_t getVersionCode(void *ptr, size_t size, size_t nmemb, void *userdata)
{
    string *version = (string*)userdata;
    version->append((char*)ptr, size * nmemb);
    
    return (size * nmemb);
}

bool AssetsManager::checkUpdate()
{
    if (_versionFileUrl.size() == 0) return false;
    
    _curl = curl_easy_init();
    if (! _curl)
    {
        CCLOG("can not init curl");
        return false;
    }
    
    // Clear _version before assign new value.
    _version.clear();
    
    CURLcode res;
    curl_easy_setopt(_curl, CURLOPT_URL, _versionFileUrl.c_str());
    curl_easy_setopt(_curl, CURLOPT_SSL_VERIFYPEER, 0L);
    curl_easy_setopt(_curl, CURLOPT_WRITEFUNCTION, getVersionCode);
    curl_easy_setopt(_curl, CURLOPT_WRITEDATA, &_version);
    if (_connectionTimeout) curl_easy_setopt(_curl, CURLOPT_CONNECTTIMEOUT, _connectionTimeout);
    res = curl_easy_perform(_curl);
    
    if (res != 0)
    {
        sendErrorMessage(kNetwork);
        CCLOG("can not get version file content, error code is %d", res);
        curl_easy_cleanup(_curl);
        return false;
    }
    
    string version = getVersion();
    string recordedVersion = getNewVersion(version, _version);
    if (recordedVersion == version)
    {
        sendErrorMessage(kNoNewVersion);
        CCLOG("there is not new version");
        // Set resource search path.
        setSearchPath();
        return false;
    }
    
    CCLOG("there is a new version: %s", _version.c_str());
    
    return true;
}

void* assetsManagerDownloadAndUncompress(void *data)
{
    AssetsManager* self = (AssetsManager*)data;
    
    do
    {
        //        if (self->_downloadedVersion != self->_version)
        //        {
        
        if (! self->downLoad()) break;
        
        // Record downloaded version.
        AssetsManager::Message *msg1 = new AssetsManager::Message();
        msg1->what = ASSETSMANAGER_MESSAGE_RECORD_DOWNLOADED_VERSION;
        msg1->obj = self;
        self->_schedule->sendMessage(msg1);
        //        }
        
        // Uncompress zip file.
        if (! self->uncompress())
        {
            self->sendErrorMessage(AssetsManager::kUncompress);
            break;
        }
        
        // Record updated version and remove downloaded zip file
        AssetsManager::Message *msg2 = new AssetsManager::Message();
        msg2->what = ASSETSMANAGER_MESSAGE_UPDATE_SUCCEED;
        msg2->obj = self;
        self->_schedule->sendMessage(msg2);
    } while (0);
    
    if (self->_tid)
    {
        delete self->_tid;
        self->_tid = NULL;
    }
    
    return NULL;
}

void AssetsManager::update()
{
    if (_tid) return;
    
    // 1. Urls of package and version should be valid;
    // 2. Package should be a zip file.
    // 去除检查url后面带.zip的判断
    // std::string::npos == _packageUrl.find(".zip")
    if (_versionFileUrl.size() == 0 || _packageUrl.size() == 0)
    {
        CCLOG("no version file url, or no package url, or the package is not a zip file");
        return;
    }
    
    // Check if there is a new version.
    if (! checkUpdate()) return;
    
    // Is package already downloaded?
    _downloadedVersion = CCUserDefault::sharedUserDefault()->getStringForKey(KEY_OF_DOWNLOADED_VERSION);
    
    _tid = new pthread_t();
    pthread_create(&(*_tid), NULL, assetsManagerDownloadAndUncompress, this);
}

bool AssetsManager::uncompress()
{
    // Open the zip file
    string outFileName = _storagePath + TEMP_PACKAGE_FILE_NAME;
    unzFile zipfile = unzOpen(outFileName.c_str());
    if (! zipfile)
    {
        CCLOG("can not open downloaded zip file %s", outFileName.c_str());
        return false;
    }
    
    // Get info about the zip file
    unz_global_info global_info;
    if (unzGetGlobalInfo(zipfile, &global_info) != UNZ_OK)
    {
        CCLOG("can not read file global info of %s", outFileName.c_str());
        unzClose(zipfile);
        return false;
    }
    
    // Buffer to hold data read from the zip file
    char readBuffer[BUFFER_SIZE];
    
    CCLOG("start uncompressing");
    
    // Loop to extract all files.
    uLong i;
    for (i = 0; i < global_info.number_entry; ++i)
    {
        // Get info about current file.
        unz_file_info fileInfo;
        char fileName[MAX_FILENAME];
        if (unzGetCurrentFileInfo(zipfile,
                                  &fileInfo,
                                  fileName,
                                  MAX_FILENAME,
                                  NULL,
                                  0,
                                  NULL,
                                  0) != UNZ_OK)
        {
            CCLOG("can not read file info");
            unzClose(zipfile);
            return false;
        }
        
        string fullPath = _storagePath + fileName;
        
        // Check if this entry is a directory or a file.
        const size_t filenameLength = strlen(fileName);
        if (fileName[filenameLength-1] == '/')
        {
            // Entry is a direcotry, so create it.
            // If the directory exists, it will failed scilently.
            if (!createDirectory(fullPath.c_str()))
            {
                CCLOG("can not create directory %s", fullPath.c_str());
                unzClose(zipfile);
                return false;
            }
        }
        else
        {
            // 从3.0版本拷贝
            //There are not directory entry in some case.
            //So we need to test whether the file directory exists when uncompressing file entry
            //, if does not exist then create directory
            string fileNameStr(fileName);
            size_t startIndex=0;
            size_t index=fileNameStr.find("/",startIndex);
            
            while(index!=-1)
            {
                string dir=_storagePath+fileNameStr.substr(0,index);
                
                FILE *out = fopen(dir.c_str(), "r");
                
                if(!out)
                {
                    if (!createDirectory(dir.c_str()))
                    {
                        CCLOG("can not create directory %s", dir.c_str());
                        unzClose(zipfile);
                        return false;
                    }
                    else
                    {
                        CCLOG("create directory %s",dir.c_str());
                    }
                }
                else
                {
                    fclose(out);
                }
                
                startIndex=index+1;
                
                index=fileNameStr.find("/",startIndex);
            }
            
            // Entry is a file, so extract it.
            
            // Open current file.
            if (unzOpenCurrentFile(zipfile) != UNZ_OK)
            {
                CCLOG("can not open file %s", fileName);
                unzClose(zipfile);
                return false;
            }
            
            // Create a file to store current file.
            FILE *out = fopen(fullPath.c_str(), "wb");
            if (! out)
            {
                CCLOG("can not open destination file %s", fullPath.c_str());
                unzCloseCurrentFile(zipfile);
                unzClose(zipfile);
                return false;
            }
            
            // Write current file content to destinate file.
            int error = UNZ_OK;
            do
            {
                error = unzReadCurrentFile(zipfile, readBuffer, BUFFER_SIZE);
                if (error < 0)
                {
                    CCLOG("can not read zip file %s, error code is %d", fileName, error);
                    unzCloseCurrentFile(zipfile);
                    unzClose(zipfile);
                    return false;
                }
                
                if (error > 0)
                {
                    fwrite(readBuffer, error, 1, out);
                }
            } while(error > 0);
            
            fclose(out);
        }
        
        unzCloseCurrentFile(zipfile);
        
        // Goto next entry listed in the zip file.
        if ((i+1) < global_info.number_entry)
        {
            if (unzGoToNextFile(zipfile) != UNZ_OK)
            {
                CCLOG("can not read next file");
                unzClose(zipfile);
                return false;
            }
        }
    }
    
    CCLOG("end uncompressing");
    
    return true;
}

/*
 * Create a direcotry is platform depended.
 */
bool AssetsManager::createDirectory(const char *path)
{
#if (CC_TARGET_PLATFORM != CC_PLATFORM_WIN32)
    mode_t processMask = umask(0);
    int ret = mkdir(path, S_IRWXU | S_IRWXG | S_IRWXO);
    umask(processMask);
    if (ret != 0 && (errno != EEXIST))
    {
        return false;
    }
    
    return true;
#else
    BOOL ret = CreateDirectoryA(path, NULL);
	if (!ret && ERROR_ALREADY_EXISTS != GetLastError())
	{
		return false;
	}
    return true;
#endif
}

void AssetsManager::setSearchPath()
{
    vector<string> searchPaths = CCFileUtils::sharedFileUtils()->getSearchPaths();
    vector<string>::iterator iter = searchPaths.begin();
    
    // 修改资源搜索路径
    // 如果第一个搜索路径与当前更新的路径一样
    // 则不更新搜索路径
    if(*iter != _storagePath)
    {
        searchPaths.insert(iter, _storagePath);
        CCFileUtils::sharedFileUtils()->setSearchPaths(searchPaths);
    }
}

static size_t downLoadPackage(void *ptr, size_t size, size_t nmemb, void *userdata)
{
    FILE *fp = (FILE*)userdata;
    size_t written = fwrite(ptr, size, nmemb, fp);
    return written;
}

int assetsManagerProgressFunc(void *ptr, double totalToDownload, double nowDownloaded, double totalToUpLoad, double nowUpLoaded)
{
    AssetsManager* manager = (AssetsManager*)ptr;
    AssetsManager::Message *msg = new AssetsManager::Message();
    msg->what = ASSETSMANAGER_MESSAGE_PROGRESS;
    
    ProgressMessage *progressData = new ProgressMessage();
    progressData->totalToDownload = totalToDownload;
    progressData->nowDownloaded = nowDownloaded;
    progressData->manager = manager;
    msg->obj = progressData;
    
    manager->_schedule->sendMessage(msg);
    
    CCLOG("downloading... %d%%", (int)(nowDownloaded/totalToDownload*100));
    
    return 0;
}

bool AssetsManager::downLoad()
{
    // Create a file to save package.
    string outFileName = _storagePath + TEMP_PACKAGE_FILE_NAME;
    FILE *fp = fopen(outFileName.c_str(), "wb");
    if (! fp)
    {
        sendErrorMessage(kCreateFile);
        CCLOG("can not create file %s", outFileName.c_str());
        return false;
    }
    
    CCLOG("%s", _packageUrl.c_str());
    
    // Download pacakge
    CURLcode res;
    curl_easy_setopt(_curl, CURLOPT_URL, _packageUrl.c_str());
    curl_easy_setopt(_curl, CURLOPT_WRITEFUNCTION, downLoadPackage);
    curl_easy_setopt(_curl, CURLOPT_WRITEDATA, fp);
    curl_easy_setopt(_curl, CURLOPT_NOPROGRESS, false);
    curl_easy_setopt(_curl, CURLOPT_PROGRESSFUNCTION, assetsManagerProgressFunc);
    curl_easy_setopt(_curl, CURLOPT_PROGRESSDATA, this);
    curl_easy_setopt(_curl, CURLOPT_FOLLOWLOCATION, 1);
    res = curl_easy_perform(_curl);
    curl_easy_cleanup(_curl);
    if (res != 0)
    {
        sendErrorMessage(kNetwork);
        CCLOG("error when download package %d", res);
        fclose(fp);
        return false;
    }
    
    CCLOG("succeed downloading package %s", _packageUrl.c_str());
    
    fclose(fp);
    return true;
}

const char* AssetsManager::getPackageUrl() const
{
    return _packageUrl.c_str();
}

void AssetsManager::setPackageUrl(const char *packageUrl)
{
    _packageUrl = packageUrl;
}

const char* AssetsManager::getStoragePath() const
{
    return _storagePath.c_str();
}

void AssetsManager::setStoragePath(const char *storagePath)
{
    string path = storagePath;
    
    if (path.size() > 0 && path[_storagePath.size() - 1] != '/')
    {
        // 修改路径，若传入的路径为简单目录，转换成绝对路径
        path = CCFileUtils::sharedFileUtils()->getWritablePath() + path + "/";
    }
    
    if(path != _storagePath) {
        _storagePath = path;
        
        this->createStoragePath();
    }
}

const char* AssetsManager::getVersionFileUrl() const
{
    return _versionFileUrl.c_str();
}

void AssetsManager::setVersionFileUrl(const char *versionFileUrl)
{
    _versionFileUrl = versionFileUrl;
}

string AssetsManager::getVersion()
{
    return getNewVersion(CCUserDefault::sharedUserDefault()->getStringForKey(KEY_OF_VERSION, ""), getAppVersion());
}

void AssetsManager::deleteVersion()
{
    CCUserDefault::sharedUserDefault()->setStringForKey(KEY_OF_VERSION, getAppVersion());
}

void AssetsManager::setDelegate(AssetsManagerDelegateProtocol *delegate)
{
    CCLOG("AssetsManager::setDelegate");
    
    if(_delegate) {
        delete _delegate;
    }
    
    _delegate = delegate;
    
    this->_shouldDeleteDelegateWhenExit = true;
}

void AssetsManager::setConnectionTimeout(unsigned int timeout)
{
    _connectionTimeout = timeout;
}

unsigned int AssetsManager::getConnectionTimeout()
{
    return _connectionTimeout;
}

void AssetsManager::sendErrorMessage(AssetsManager::ErrorCode code)
{
    Message *msg = new Message();
    msg->what = ASSETSMANAGER_MESSAGE_ERROR;
    
    ErrorMessage *errorMessage = new ErrorMessage();
    errorMessage->code = code;
    errorMessage->manager = this;
    msg->obj = errorMessage;
    
    _schedule->sendMessage(msg);
}

// Implementation of AssetsManagerHelper

AssetsManager::Helper::Helper()
: _message(NULL)
{
    pthread_mutex_init(&_messageQueueMutex, NULL);
    CCDirector::sharedDirector()->getScheduler()->scheduleUpdateForTarget(this, 0, false);
}

AssetsManager::Helper::~Helper()
{
    CCDirector::sharedDirector()->getScheduler()->unscheduleAllForTarget(this);
    delete _message;
}

void AssetsManager::Helper::sendMessage(Message *msg)
{
    pthread_mutex_lock(&_messageQueueMutex);
    
    if(_message != NULL)
    {
        delete _message;
        _message = NULL;
    }
    
    _message = msg;
    pthread_mutex_unlock(&_messageQueueMutex);
}

void AssetsManager::Helper::update(float dt)
{
    Message *msg = NULL;
    
    // Returns quickly if no message
    pthread_mutex_lock(&_messageQueueMutex);
    if (_message == NULL)
    {
        pthread_mutex_unlock(&_messageQueueMutex);
        return;
    }
    
    msg = _message;
    _message = NULL;
    pthread_mutex_unlock(&_messageQueueMutex);
    
    
    switch (msg->what)
    {
        case ASSETSMANAGER_MESSAGE_UPDATE_SUCCEED:
            handleUpdateSucceed(msg);
            
            break;
        case ASSETSMANAGER_MESSAGE_RECORD_DOWNLOADED_VERSION:
            CCUserDefault::sharedUserDefault()->setStringForKey(KEY_OF_DOWNLOADED_VERSION,
                                                                ((AssetsManager*)msg->obj)->_version.c_str());
            CCUserDefault::sharedUserDefault()->flush();
            
            break;
        case ASSETSMANAGER_MESSAGE_PROGRESS:
            if (((ProgressMessage*)msg->obj)->manager->_delegate)
            {
                ((ProgressMessage*)msg->obj)->manager->_delegate->onProgress(((ProgressMessage*)msg->obj)->totalToDownload, ((ProgressMessage*)msg->obj)->nowDownloaded);
            }
            
            delete (ProgressMessage*)msg->obj;
            
            break;
        case ASSETSMANAGER_MESSAGE_ERROR:
            // error call back
            if (((ErrorMessage*)msg->obj)->manager->_delegate)
            {
                ((ErrorMessage*)msg->obj)->manager->_delegate->onError(((ErrorMessage*)msg->obj)->code);
            }
            
            delete ((ErrorMessage*)msg->obj);
            
            break;
        default:
            break;
    }
    
    delete msg;
}

void AssetsManager::Helper::handleUpdateSucceed(Message *msg)
{
    AssetsManager* manager = (AssetsManager*)msg->obj;
    
    // Record new version code.
    CCUserDefault::sharedUserDefault()->setStringForKey(KEY_OF_VERSION, manager->_version.c_str());
    
    // Unrecord downloaded version code.
    CCUserDefault::sharedUserDefault()->setStringForKey(KEY_OF_DOWNLOADED_VERSION, "");
    CCUserDefault::sharedUserDefault()->flush();
    
    // Set resource search path.
    manager->setSearchPath();
    
    // Delete unloaded zip file.
    string zipfileName = manager->_storagePath + TEMP_PACKAGE_FILE_NAME;
    if (remove(zipfileName.c_str()) != 0)
    {
        CCLOG("can not remove downloaded zip file %s", zipfileName.c_str());
    }
    
    if (manager) manager->_delegate->onSuccess();
}

/*
 创建目录
 */
void AssetsManager::createStoragePath()
{
    // Remove downloaded files
#if (CC_TARGET_PLATFORM != CC_PLATFORM_WIN32)
    DIR *dir = NULL;
    
    dir = opendir (_storagePath.c_str());
    if (!dir)
    {
        mkdir(_storagePath.c_str(), S_IRWXU | S_IRWXG | S_IRWXO);
    }
#else
    if ((GetFileAttributesA(_storagePath.c_str())) == INVALID_FILE_ATTRIBUTES)
    {
        CreateDirectoryA(_storagePath.c_str(), 0);
    }
#endif
}

/*
 删除目录
 */
void AssetsManager::destroyStoragePath()
{
    CCLOG("-------------------------------------");
    CCLOG("destroyStoragePath");
    CCLOG("-------------------------------------");
    
    // Delete recorded version codes.
    deleteVersion();
    
    // save to document folder
    std::string storagePath = _storagePath;
    NSString *path = [NSString stringWithUTF8String:storagePath.c_str()];
    NSFileManager *fileManager = [NSFileManager defaultManager];
    
    // 如果存在删除
    if([fileManager fileExistsAtPath:path])
    {
        [fileManager removeItemAtPath:path error:nil];
    }
    
    createStoragePath();
}

/*
 获取客户端版本
 */
std::string AssetsManager::getAppVersion()
{
    return [[[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"] UTF8String];
}

AssetsManager* AssetsManager::assetsManager = NULL;

AssetsManager* AssetsManager::getInstance()
{
    if(assetsManager == NULL)
    {
        assetsManager = new AssetsManager("", "", UPDATE_DIR);
        assetsManager->init();
    }
    
    return assetsManager;
}

NS_CC_EXT_END;
#endif // CC_PLATFORM_WINRT
