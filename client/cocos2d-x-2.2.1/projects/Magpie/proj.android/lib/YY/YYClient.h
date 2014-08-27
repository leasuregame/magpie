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
using namespace std;

class YYClient {
public:

	virtual ~YYClient(){};

	//static YYClient* getInstance();

	static void init();
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

	YYClient(){};
//	void executeCallback(const char* name, uint32_t argc, jsval *vp, jsval *retVal);
};

#endif /* YYCLIENT_H_ */
