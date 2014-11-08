/*
 * YYClient.cpp
 *
 *  Created on: Aug 23, 2014
 *      Author: uRyn
 */

#include "YYClient.h"
#include "JniHelper.h"
#include "cocos2d.h"
using namespace cocos2d;

const char* yyWrapperClassName = "com/LeasureGame/Magpie/YYWrapper";
const char* mActivityName = "com/LeasureGame/Magpie/Magpie";

#define GET_JSTRING(cstr)   ((cstr) ? t.env->NewStringUTF(cstr) : NULL)

#define SAFE_RELEASE_JOBJ(jobj)   if(jobj) { \
                                    t.env->DeleteLocalRef(jobj); \
                                }
#define SAFE_RELEASE_JCONTEXT(jctx)     if(!_ctx){ \
                                            SAFE_RELEASE_JOBJ(jctx); \
                                }

jobject _ctx = NULL;

jobject getContext1(){
    if (_ctx) {
        return _ctx;
    }
    JniMethodInfo t;
    if( JniHelper::getStaticMethodInfo(t
                                       , mActivityName
                                       , "getContext"
                                       , "()Landroid/content/Context;"))
    {
        jobject ret = t.env->CallStaticObjectMethod(t.classID, t.methodID);
        SAFE_RELEASE_JOBJ(t.classID);
        return ret;
    }
    return NULL;
}

/*void YYClient::init() {
	JniMethodInfo t;
	//LOGI("debug init in c++");
	if( JniHelper::getStaticMethodInfo( t
										, yyWrapperClassName
										, "init"
										, "(Landroid/content/Context;)V"))
	{
		jobject ctx = getContext1();
		t.env->CallStaticVoidMethod(t.classID, t.methodID, ctx);
		SAFE_RELEASE_JCONTEXT(ctx)
		SAFE_RELEASE_JOBJ(t.classID);
	}
}*/

string YYClient::getInitResult() {
	string ret = "";
	JniMethodInfo t;
	if( JniHelper::getStaticMethodInfo(t
									   , yyWrapperClassName
									   , "getInitResult"
									   , "()Ljava/lang/String;"))
	{
		jstring isInitSuccess = (jstring)t.env->CallStaticObjectMethod(t.classID, t.methodID);
		ret = JniHelper::jstring2string(isInitSuccess);
		SAFE_RELEASE_JOBJ(isInitSuccess);
		SAFE_RELEASE_JOBJ(t.classID);
	}
	return ret;
}

void YYClient::CreateUserRole(const char* roleName)
{
	JniMethodInfo t;
	if( JniHelper::getStaticMethodInfo(t
		, yyWrapperClassName
		, "CreateUserRole"
		, "(Ljava/lang/String;)V"))
	{
		jstring jstrRoleName = GET_JSTRING(roleName);

		t.env->CallStaticVoidMethod(
			t.classID,
			t.methodID,
			jstrRoleName);

		SAFE_RELEASE_JOBJ(jstrRoleName);
		SAFE_RELEASE_JOBJ(t.classID);
	}
}

void YYClient::OnRoleLevelChange(const char* roleName, int roleLevel)
{
	JniMethodInfo t;
	if( JniHelper::getStaticMethodInfo(t
		, yyWrapperClassName
		, "OnRoleLevelChange"
		, "(Ljava/lang/String;I)V"))
	{
		jstring jstrRoleName = GET_JSTRING(roleName);
		jint jroleLevel = (jint)roleLevel;

		t.env->CallStaticVoidMethod(
			t.classID,
			t.methodID,
			jstrRoleName,
			jroleLevel);

		SAFE_RELEASE_JOBJ(jstrRoleName);
		SAFE_RELEASE_JOBJ(t.classID);
	}
}

void YYClient::login() {
	JniMethodInfo t;
	if( JniHelper::getStaticMethodInfo( t
										, yyWrapperClassName
										, "login"
										, "(Landroid/content/Context;)V"))
	{
		jobject ctx = getContext1();
		t.env->CallStaticVoidMethod(t.classID, t.methodID, ctx);
		SAFE_RELEASE_JCONTEXT(ctx)
		SAFE_RELEASE_JOBJ(t.classID);
	}
}

string YYClient::getLoginResult() {
	string ret = "";
	JniMethodInfo t;
	if( JniHelper::getStaticMethodInfo(t
									   , yyWrapperClassName
									   , "getLoginResult"
									   , "()Ljava/lang/String;"))
	{
		jstring isLoginSuccess = (jstring)t.env->CallStaticObjectMethod(t.classID, t.methodID);
		ret = JniHelper::jstring2string(isLoginSuccess);
		SAFE_RELEASE_JOBJ(isLoginSuccess);
		SAFE_RELEASE_JOBJ(t.classID);
	}
	return ret;
}

string YYClient::getSid() {
	string ret = "";
	JniMethodInfo t;
	if( JniHelper::getStaticMethodInfo(t
									   , yyWrapperClassName
									   , "getSid"
									   , "()Ljava/lang/String;"))
	{
		jstring sid = (jstring)t.env->CallStaticObjectMethod(t.classID, t.methodID);
		ret = JniHelper::jstring2string(sid);
		SAFE_RELEASE_JOBJ(sid);
		SAFE_RELEASE_JOBJ(t.classID);
	}
	return ret;
}

string YYClient::getTime() {
	string ret = "";
	JniMethodInfo t;
	if( JniHelper::getStaticMethodInfo(t
									   , yyWrapperClassName
									   , "getTime"
									   , "()Ljava/lang/String;"))
	{
		jstring time = (jstring)t.env->CallStaticObjectMethod(t.classID, t.methodID);
		ret = JniHelper::jstring2string(time);
		SAFE_RELEASE_JOBJ(time);
		SAFE_RELEASE_JOBJ(t.classID);
	}
	return ret;
}

string YYClient::getAccount() {
	string ret = "";
	JniMethodInfo t;
	if( JniHelper::getStaticMethodInfo(t
									   , yyWrapperClassName
									   , "getAccount"
									   , "()Ljava/lang/String;"))
	{
		jstring account = (jstring)t.env->CallStaticObjectMethod(t.classID, t.methodID);
		ret = JniHelper::jstring2string(account);
		SAFE_RELEASE_JOBJ(account);
		SAFE_RELEASE_JOBJ(t.classID);
	}
	return ret;
}

string YYClient::getUserName() {
	string ret = "";
	JniMethodInfo t;
	if( JniHelper::getStaticMethodInfo(t
									   , yyWrapperClassName
									   , "getUserName"
									   , "()Ljava/lang/String;"))
	{
		jstring account = (jstring)t.env->CallStaticObjectMethod(t.classID, t.methodID);
		ret = JniHelper::jstring2string(account);
		SAFE_RELEASE_JOBJ(account);
		SAFE_RELEASE_JOBJ(t.classID);
	}
	return ret;
}

void YYClient::enterGameServer(const char* gameServer, const char* roleId, const char* roleName)
{
	JniMethodInfo t;
	if(JniHelper::getStaticMethodInfo(t
		, yyWrapperClassName
		, "enterGameServer"
		, "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V"))
	{
		jstring jstrGameServer = GET_JSTRING(gameServer);
		jstring jstrRoleId = GET_JSTRING(roleId);
		jstring jstrRoleName = GET_JSTRING(roleName);

		t.env->CallStaticVoidMethod(
			t.classID,
			t.methodID,
			jstrGameServer,
			jstrRoleId,
			jstrRoleName);

		SAFE_RELEASE_JOBJ(jstrGameServer);
		SAFE_RELEASE_JOBJ(jstrRoleId);
		SAFE_RELEASE_JOBJ(jstrRoleName);
	}
}

void YYClient::pay(const char* areaId, const char* playerId, const char* playerName, const char* productId, const char* productName, float price) {
	JniMethodInfo t;
	if( JniHelper::getStaticMethodInfo(t
		, yyWrapperClassName
		, "pay"
		, "(Landroid/content/Context;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;F)V"))
	{
		jobject ctx = getContext1();
		jstring jstrAreaId =GET_JSTRING(areaId);
		jstring jstrPlayerId = GET_JSTRING(playerId);
		jstring jstrPlayerName = GET_JSTRING(playerName);
		jstring jstrProductId = GET_JSTRING(productId);
		jstring jstrProductName = GET_JSTRING(productName);
		jfloat jfloPrice = (jfloat)price;

		t.env->CallStaticVoidMethod(t.classID, t.methodID, ctx,
				jstrAreaId, jstrPlayerId, jstrPlayerName, jstrProductId,
				jstrProductName, jfloPrice);

		SAFE_RELEASE_JCONTEXT(ctx);
		SAFE_RELEASE_JOBJ(jstrAreaId);
		SAFE_RELEASE_JOBJ(jstrPlayerId);
		SAFE_RELEASE_JOBJ(jstrPlayerName);
		SAFE_RELEASE_JOBJ(jstrProductId);
		SAFE_RELEASE_JOBJ(jstrProductName);
		//SAFE_RELEASE_JOBJ(jfloPrice);
		SAFE_RELEASE_JOBJ(t.classID);
	}
}

string YYClient::getPayResult() {
	string ret = "";
	JniMethodInfo t;
	if( JniHelper::getStaticMethodInfo(t
									   , yyWrapperClassName
									   , "getPayResult"
									   , "()Ljava/lang/String;"))
	{
		jstring payResult = (jstring)t.env->CallStaticObjectMethod(t.classID, t.methodID);
		ret = JniHelper::jstring2string(payResult);
		SAFE_RELEASE_JOBJ(payResult);
		SAFE_RELEASE_JOBJ(t.classID);
	}
	return ret;
}

void YYClient::exitSDK() {
	JniMethodInfo t;
	if( JniHelper::getStaticMethodInfo( t
										, yyWrapperClassName
										, "exitSDK"
										, "(Landroid/content/Context;)V"))
	{
		jobject ctx = getContext1();
		t.env->CallStaticVoidMethod(t.classID, t.methodID, ctx);
		SAFE_RELEASE_JCONTEXT(ctx)
		SAFE_RELEASE_JOBJ(t.classID);
	}
}



