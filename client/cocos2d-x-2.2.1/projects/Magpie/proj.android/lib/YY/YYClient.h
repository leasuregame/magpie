/*
 * YYClient.h
 *
 *  Created on: Aug 23, 2014
 *      Author: uRyn
 */

#ifndef YYCLIENT_H_
#define YYCLIENT_H_
#include <string>
#include <iostream>

#include <android/log.h>
#define  LOG_TAG    "c++log"
#define LOGD(...) __android_log_print(ANDROID_LOG_DEBUG,TAG ,__VA_ARGS__)
#define LOGI(...) __android_log_print(ANDROID_LOG_INFO,TAG ,__VA_ARGS__)
#define LOGW(...) __android_log_print(ANDROID_LOG_WARN,TAG ,__VA_ARGS__)
#define LOGE(...) __android_log_print(ANDROID_LOG_ERROR,TAG ,__VA_ARGS__)
#define LOGF(...) __android_log_print(ANDROID_LOG_FATAL,TAG ,__VA_ARGS__)

using namespace std;

class YYClient {
public:

	virtual ~YYClient(){};

	static string getInitResult();
	static void login();
	static string getLoginResult();
	static string getSid();
	static string getTime();
	static string getAccount();
	static string getUserName();
	static void pay(const char* areaId, const char* playerId, const char* playerName, const char* productId, const char* productName, float price);
	static string getPayResult();
	static void exitSDK();
	static void enterGameServer(const char* gameServer, const char* roleId, const char* roleName);

	YYClient(){};
};

#endif /* YYCLIENT_H_ */
