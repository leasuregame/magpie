#include "yy_client_js_bindings.hpp"
#include "cocos2d_specifics.hpp"
#include "YYClient.h"

template<class T>
static JSBool dummy_constructor(JSContext *cx, uint32_t argc, jsval *vp) {
	TypeTest<T> t;
	T* cobj = new T();
	js_type_class_t *p;
	uint32_t typeId = t.s_id();
	HASH_FIND_INT(_js_global_type_ht, &typeId, p);
	assert(p);
	JSObject *_tmp = JS_NewObject(cx, p->jsclass, p->proto, p->parentProto);
	js_proxy_t *pp = jsb_new_proxy(cobj, _tmp);
	JS_SET_RVAL(cx, vp, OBJECT_TO_JSVAL(_tmp));

	return JS_TRUE;
}

static JSBool empty_constructor(JSContext *cx, uint32_t argc, jsval *vp) {
	return JS_FALSE;
}


JSClass  *jsb_YYClient_class;
JSObject *jsb_YYClient_prototype;

JSBool js_yy_client_js_bindings_YYClient_getTime(JSContext *cx, uint32_t argc, jsval *vp)
{
	if (argc == 0) {
		std::string ret = YYClient::getTime();
		jsval jsret;
		jsret = std_string_to_jsval(cx, ret);
		JS_SET_RVAL(cx, vp, jsret);
		return JS_TRUE;
	}
	JS_ReportError(cx, "wrong number of arguments");
	return JS_FALSE;
}

JSBool js_yy_client_js_bindings_YYClient_pay(JSContext *cx, uint32_t argc, jsval *vp)
{
	jsval *argv = JS_ARGV(cx, vp);
	JSBool ok = JS_TRUE;
	if (argc == 6) {
		const char* arg0;
		const char* arg1;
		const char* arg2;
		const char* arg3;
		const char* arg4;
		double arg5;
		std::string arg0_tmp; ok &= jsval_to_std_string(cx, argv[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
		std::string arg1_tmp; ok &= jsval_to_std_string(cx, argv[1], &arg1_tmp); arg1 = arg1_tmp.c_str();
		std::string arg2_tmp; ok &= jsval_to_std_string(cx, argv[2], &arg2_tmp); arg2 = arg2_tmp.c_str();
		std::string arg3_tmp; ok &= jsval_to_std_string(cx, argv[3], &arg3_tmp); arg3 = arg3_tmp.c_str();
		std::string arg4_tmp; ok &= jsval_to_std_string(cx, argv[4], &arg4_tmp); arg4 = arg4_tmp.c_str();
		ok &= JS_ValueToNumber(cx, argv[5], &arg5);
		JSB_PRECONDITION2(ok, cx, JS_FALSE, "Error processing arguments");
		YYClient::pay(arg0, arg1, arg2, arg3, arg4, arg5);
		JS_SET_RVAL(cx, vp, JSVAL_VOID);
		return JS_TRUE;
	}
	JS_ReportError(cx, "wrong number of arguments");
	return JS_FALSE;
}

JSBool js_yy_client_js_bindings_YYClient_exitSDK(JSContext *cx, uint32_t argc, jsval *vp)
{
	if (argc == 0) {
		YYClient::exitSDK();
		JS_SET_RVAL(cx, vp, JSVAL_VOID);
		return JS_TRUE;
	}
	JS_ReportError(cx, "wrong number of arguments");
	return JS_FALSE;
}

JSBool js_yy_client_js_bindings_YYClient_getInitResult(JSContext *cx, uint32_t argc, jsval *vp)
{
	if (argc == 0) {
		std::string ret = YYClient::getInitResult();
		jsval jsret;
		jsret = std_string_to_jsval(cx, ret);
		JS_SET_RVAL(cx, vp, jsret);
		return JS_TRUE;
	}
	JS_ReportError(cx, "wrong number of arguments");
	return JS_FALSE;
}

JSBool js_yy_client_js_bindings_YYClient_init(JSContext *cx, uint32_t argc, jsval *vp)
{
	if (argc == 0) {
		YYClient::init();
		JS_SET_RVAL(cx, vp, JSVAL_VOID);
		return JS_TRUE;
	}
	JS_ReportError(cx, "wrong number of arguments");
	return JS_FALSE;
}

JSBool js_yy_client_js_bindings_YYClient_getSid(JSContext *cx, uint32_t argc, jsval *vp)
{
	if (argc == 0) {
		std::string ret = YYClient::getSid();
		jsval jsret;
		jsret = std_string_to_jsval(cx, ret);
		JS_SET_RVAL(cx, vp, jsret);
		return JS_TRUE;
	}
	JS_ReportError(cx, "wrong number of arguments");
	return JS_FALSE;
}

JSBool js_yy_client_js_bindings_YYClient_getPayResult(JSContext *cx, uint32_t argc, jsval *vp)
{
	if (argc == 0) {
		std::string ret = YYClient::getPayResult();
		jsval jsret;
		jsret = std_string_to_jsval(cx, ret);
		JS_SET_RVAL(cx, vp, jsret);
		return JS_TRUE;
	}
	JS_ReportError(cx, "wrong number of arguments");
	return JS_FALSE;
}

JSBool js_yy_client_js_bindings_YYClient_login(JSContext *cx, uint32_t argc, jsval *vp)
{
	if (argc == 0) {
		YYClient::login();
		JS_SET_RVAL(cx, vp, JSVAL_VOID);
		return JS_TRUE;
	}
	JS_ReportError(cx, "wrong number of arguments");
	return JS_FALSE;
}

JSBool js_yy_client_js_bindings_YYClient_getAccount(JSContext *cx, uint32_t argc, jsval *vp)
{
	if (argc == 0) {
		std::string ret = YYClient::getAccount();
		jsval jsret;
		jsret = std_string_to_jsval(cx, ret);
		JS_SET_RVAL(cx, vp, jsret);
		return JS_TRUE;
	}
	JS_ReportError(cx, "wrong number of arguments");
	return JS_FALSE;
}

JSBool js_yy_client_js_bindings_YYClient_getLoginResult(JSContext *cx, uint32_t argc, jsval *vp)
{
	if (argc == 0) {
		std::string ret = YYClient::getLoginResult();
		jsval jsret;
		jsret = std_string_to_jsval(cx, ret);
		JS_SET_RVAL(cx, vp, jsret);
		return JS_TRUE;
	}
	JS_ReportError(cx, "wrong number of arguments");
	return JS_FALSE;
}

JSBool js_yy_client_js_bindings_YYClient_getUserName(JSContext *cx, uint32_t argc, jsval *vp)
{
	if (argc == 0) {
		std::string ret = YYClient::getUserName();
		jsval jsret;
		jsret = std_string_to_jsval(cx, ret);
		JS_SET_RVAL(cx, vp, jsret);
		return JS_TRUE;
	}
	JS_ReportError(cx, "wrong number of arguments");
	return JS_FALSE;
}

JSBool js_yy_client_js_bindings_YYClient_constructor(JSContext *cx, uint32_t argc, jsval *vp)
{
	if (argc == 0) {
		YYClient* cobj = new YYClient();
		TypeTest<YYClient> t;
		js_type_class_t *typeClass;
		uint32_t typeId = t.s_id();
		HASH_FIND_INT(_js_global_type_ht, &typeId, typeClass);
		assert(typeClass);
		JSObject *obj = JS_NewObject(cx, typeClass->jsclass, typeClass->proto, typeClass->parentProto);
		JS_SET_RVAL(cx, vp, OBJECT_TO_JSVAL(obj));
		// link the native object with the javascript object
		js_proxy_t* p = jsb_new_proxy(cobj, obj);
		return JS_TRUE;
	}

	JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 0);
	return JS_FALSE;
}




void js_yy_client_js_bindings_YYClient_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (YYClient)", obj);
    js_proxy_t* nproxy;
    js_proxy_t* jsproxy;
    jsproxy = jsb_get_js_proxy(obj);
    if (jsproxy) {
        nproxy = jsb_get_native_proxy(jsproxy->ptr);

        YYClient *nobj = static_cast<YYClient *>(nproxy->ptr);
        if (nobj)
            delete nobj;
        
        jsb_remove_proxy(nproxy, jsproxy);
    }
}

static JSBool js_yy_client_js_bindings_YYClient_ctor(JSContext *cx, uint32_t argc, jsval *vp)
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
    YYClient *nobj = new YYClient();
    js_proxy_t* p = jsb_new_proxy(nobj, obj);
    JS_SET_RVAL(cx, vp, JSVAL_VOID);
    return JS_TRUE;
}

void js_register_yy_client_js_bindings_YYClient(JSContext *cx, JSObject *global) {
	jsb_YYClient_class = (JSClass *)calloc(1, sizeof(JSClass));
	jsb_YYClient_class->name = "YYClient";
	jsb_YYClient_class->addProperty = JS_PropertyStub;
	jsb_YYClient_class->delProperty = JS_PropertyStub;
	jsb_YYClient_class->getProperty = JS_PropertyStub;
	jsb_YYClient_class->setProperty = JS_StrictPropertyStub;
	jsb_YYClient_class->enumerate = JS_EnumerateStub;
	jsb_YYClient_class->resolve = JS_ResolveStub;
	jsb_YYClient_class->convert = JS_ConvertStub;
	jsb_YYClient_class->finalize = js_yy_client_js_bindings_YYClient_finalize;
	jsb_YYClient_class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);

	JSPropertySpec *properties = NULL;

	JSFunctionSpec *funcs = NULL;

	static JSFunctionSpec st_funcs[] = {
		JS_FN("getTime", js_yy_client_js_bindings_YYClient_getTime, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("pay", js_yy_client_js_bindings_YYClient_pay, 6, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("exitSDK", js_yy_client_js_bindings_YYClient_exitSDK, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("getInitResult", js_yy_client_js_bindings_YYClient_getInitResult, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("init", js_yy_client_js_bindings_YYClient_init, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("getSid", js_yy_client_js_bindings_YYClient_getSid, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("getPayResult", js_yy_client_js_bindings_YYClient_getPayResult, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("login", js_yy_client_js_bindings_YYClient_login, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("getAccount", js_yy_client_js_bindings_YYClient_getAccount, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("getLoginResult", js_yy_client_js_bindings_YYClient_getLoginResult, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("getUserName", js_yy_client_js_bindings_YYClient_getUserName, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FS_END
	};

	jsb_YYClient_prototype = JS_InitClass(
		cx, global,
		NULL, // parent proto
		jsb_YYClient_class,
		js_yy_client_js_bindings_YYClient_constructor, 0, // constructor
		properties,
		funcs,
		NULL, // no static properties
		st_funcs);
	// make the class enumerable in the registered namespace
	JSBool found;
	JS_SetPropertyAttributes(cx, global, "YYClient", JSPROP_ENUMERATE | JSPROP_READONLY, &found);

	// add the proto and JSClass to the type->js info hash table
	TypeTest<YYClient> t;
	js_type_class_t *p;
	uint32_t typeId = t.s_id();
	HASH_FIND_INT(_js_global_type_ht, &typeId, p);
	if (!p) {
		p = (js_type_class_t *)malloc(sizeof(js_type_class_t));
		p->type = typeId;
		p->jsclass = jsb_YYClient_class;
		p->proto = jsb_YYClient_prototype;
		p->parentProto = NULL;
		HASH_ADD_INT(_js_global_type_ht, type, p);
	}
}

void register_all_yy_client_js_bindings(JSContext* cx, JSObject* obj) {
	// first, try to get the ns
	jsval nsval;
	JSObject *ns;
	JS_GetProperty(cx, obj, "yy", &nsval);
	if (nsval == JSVAL_VOID) {
		ns = JS_NewObject(cx, NULL, NULL, NULL);
		nsval = OBJECT_TO_JSVAL(ns);
		JS_SetProperty(cx, obj, "yy", &nsval);
	} else {
		JS_ValueToObject(cx, nsval, &ns);
	}
	obj = ns;

	js_register_yy_client_js_bindings_YYClient(cx, obj);
}

