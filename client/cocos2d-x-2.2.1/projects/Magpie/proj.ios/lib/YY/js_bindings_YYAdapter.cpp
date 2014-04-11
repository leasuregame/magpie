#include "js_bindings_YYAdapter.hpp"
#include "cocos2d_specifics.hpp"
#include "YYAdapter.h"

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


JSClass  *jsb_YYAdapter_class;
JSObject *jsb_YYAdapter_prototype;

JSBool js_js_bindings_YYAdapter_YYAdapter_YYLogin(JSContext *cx, uint32_t argc, jsval *vp)
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	YYAdapter* cobj = (YYAdapter *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2( cobj, cx, JS_FALSE, "Invalid Native Object");
	if (argc == 0) {
		cobj->YYLogin();
		JS_SET_RVAL(cx, vp, JSVAL_VOID);
		return JS_TRUE;
	}

	JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 0);
	return JS_FALSE;
}
JSBool js_js_bindings_YYAdapter_YYAdapter_YYLogout(JSContext *cx, uint32_t argc, jsval *vp)
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	YYAdapter* cobj = (YYAdapter *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2( cobj, cx, JS_FALSE, "Invalid Native Object");
	if (argc == 0) {
		cobj->YYLogout();
		JS_SET_RVAL(cx, vp, JSVAL_VOID);
		return JS_TRUE;
	}

	JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 0);
	return JS_FALSE;
}
JSBool js_js_bindings_YYAdapter_YYAdapter_YYIsLogin(JSContext *cx, uint32_t argc, jsval *vp)
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	YYAdapter* cobj = (YYAdapter *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2( cobj, cx, JS_FALSE, "Invalid Native Object");
	if (argc == 0) {
		bool ret = cobj->YYIsLogin();
		jsval jsret;
		jsret = BOOLEAN_TO_JSVAL(ret);
		JS_SET_RVAL(cx, vp, jsret);
		return JS_TRUE;
	}

	JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 0);
	return JS_FALSE;
}
JSBool js_js_bindings_YYAdapter_YYAdapter_YYGetUser(JSContext *cx, uint32_t argc, jsval *vp)
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	YYAdapter* cobj = (YYAdapter *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2( cobj, cx, JS_FALSE, "Invalid Native Object");
	if (argc == 0) {
		User* ret = cobj->YYGetUser();

		JSObject* jsobj = JS_NewObject(cx, NULL, NULL, NULL);
    
	    char account[100];
        sprintf(account, "%ld", ret->account);
        
        char time[100];
        sprintf(time, "%lld", ret->time);
        
        jsval jsSid = c_string_to_jsval(cx, ret->sid);
        jsval jsAccount = c_string_to_jsval(cx, account);
        jsval jsTime = c_string_to_jsval(cx, time);
        jsval jsUserName = c_string_to_jsval(cx, ret->userName);
        jsval jsIsLogin = BOOLEAN_TO_JSVAL(ret->isLogin);
	    
	    JS_SetProperty(cx, jsobj, "sid", &jsSid);
	    JS_SetProperty(cx, jsobj, "account", &jsAccount);
	    JS_SetProperty(cx, jsobj, "time", &jsTime);
	    JS_SetProperty(cx, jsobj, "userName", &jsUserName);
	    JS_SetProperty(cx, jsobj, "isLogin", &jsIsLogin);
        
        jsval jsret = OBJECT_TO_JSVAL(jsobj);
		
		JS_SET_RVAL(cx, vp, jsret);
		return JS_TRUE;
	}

	JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 0);
	return JS_FALSE;
}
JSBool js_js_bindings_YYAdapter_YYAdapter_YYInitWithAppId(JSContext *cx, uint32_t argc, jsval *vp)
{
	jsval *argv = JS_ARGV(cx, vp);
	JSBool ok = JS_TRUE;
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	YYAdapter* cobj = (YYAdapter *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2( cobj, cx, JS_FALSE, "Invalid Native Object");
	if (argc == 2) {
		const char* arg0;
		JSBool arg1;
		std::string arg0_tmp; ok &= jsval_to_std_string(cx, argv[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
		ok &= JS_ValueToBoolean(cx, argv[1], &arg1);
		JSB_PRECONDITION2(ok, cx, JS_FALSE, "Error processing arguments");
		cobj->YYInitWithAppId(arg0, arg1);
		JS_SET_RVAL(cx, vp, JSVAL_VOID);
		return JS_TRUE;
	}

	JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 2);
	return JS_FALSE;
}
JSBool js_js_bindings_YYAdapter_YYAdapter_YYModifyPassword(JSContext *cx, uint32_t argc, jsval *vp)
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	YYAdapter* cobj = (YYAdapter *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2( cobj, cx, JS_FALSE, "Invalid Native Object");
	if (argc == 0) {
		cobj->YYModifyPassword();
		JS_SET_RVAL(cx, vp, JSVAL_VOID);
		return JS_TRUE;
	}

	JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 0);
	return JS_FALSE;
}
JSBool js_js_bindings_YYAdapter_YYAdapter_YYRegister(JSContext *cx, uint32_t argc, jsval *vp)
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	YYAdapter* cobj = (YYAdapter *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2( cobj, cx, JS_FALSE, "Invalid Native Object");
	if (argc == 0) {
		cobj->YYRegister();
		JS_SET_RVAL(cx, vp, JSVAL_VOID);
		return JS_TRUE;
	}

	JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 0);
	return JS_FALSE;
}
JSBool js_js_bindings_YYAdapter_YYAdapter_YYGetSdkVersion(JSContext *cx, uint32_t argc, jsval *vp)
{
	if (argc == 0) {
		const char* ret = YYAdapter::YYGetSdkVersion();
		jsval jsret;
		jsret = c_string_to_jsval(cx, ret);
		JS_SET_RVAL(cx, vp, jsret);
		return JS_TRUE;
	}
	JS_ReportError(cx, "wrong number of arguments");
	return JS_FALSE;
}

JSBool js_js_bindings_YYAdapter_YYAdapter_YYAdapterInstance(JSContext *cx, uint32_t argc, jsval *vp)
{
	if (argc == 0) {
		YYAdapter* ret = YYAdapter::YYAdapterInstance();
		jsval jsret;
		do {
		if (ret) {
			js_proxy_t *proxy = js_get_or_create_proxy<YYAdapter>(cx, ret);
			jsret = OBJECT_TO_JSVAL(proxy->obj);
		} else {
			jsret = JSVAL_NULL;
		}
	} while (0);
		JS_SET_RVAL(cx, vp, jsret);
		return JS_TRUE;
	}
	JS_ReportError(cx, "wrong number of arguments");
	return JS_FALSE;
}

JSBool js_js_bindings_YYAdapter_YYAdapter_constructor(JSContext *cx, uint32_t argc, jsval *vp)
{
	if (argc == 0) {
		YYAdapter* cobj = new YYAdapter();
		TypeTest<YYAdapter> t;
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




void js_js_bindings_YYAdapter_YYAdapter_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (YYAdapter)", obj);
    js_proxy_t* nproxy;
    js_proxy_t* jsproxy;
    jsproxy = jsb_get_js_proxy(obj);
    if (jsproxy) {
        nproxy = jsb_get_native_proxy(jsproxy->ptr);

        YYAdapter *nobj = static_cast<YYAdapter *>(nproxy->ptr);
        if (nobj)
            delete nobj;
        
        jsb_remove_proxy(nproxy, jsproxy);
    }
}

static JSBool js_js_bindings_YYAdapter_YYAdapter_ctor(JSContext *cx, uint32_t argc, jsval *vp)
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
    YYAdapter *nobj = new YYAdapter();
    js_proxy_t* p = jsb_new_proxy(nobj, obj);
    JS_SET_RVAL(cx, vp, JSVAL_VOID);
    return JS_TRUE;
}

void js_register_js_bindings_YYAdapter_YYAdapter(JSContext *cx, JSObject *global) {
	jsb_YYAdapter_class = (JSClass *)calloc(1, sizeof(JSClass));
	jsb_YYAdapter_class->name = "YYAdapter";
	jsb_YYAdapter_class->addProperty = JS_PropertyStub;
	jsb_YYAdapter_class->delProperty = JS_PropertyStub;
	jsb_YYAdapter_class->getProperty = JS_PropertyStub;
	jsb_YYAdapter_class->setProperty = JS_StrictPropertyStub;
	jsb_YYAdapter_class->enumerate = JS_EnumerateStub;
	jsb_YYAdapter_class->resolve = JS_ResolveStub;
	jsb_YYAdapter_class->convert = JS_ConvertStub;
	jsb_YYAdapter_class->finalize = js_js_bindings_YYAdapter_YYAdapter_finalize;
	jsb_YYAdapter_class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);

	JSPropertySpec *properties = NULL;

	static JSFunctionSpec funcs[] = {
		JS_FN("YYLogin", js_js_bindings_YYAdapter_YYAdapter_YYLogin, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("YYLogout", js_js_bindings_YYAdapter_YYAdapter_YYLogout, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("YYIsLogin", js_js_bindings_YYAdapter_YYAdapter_YYIsLogin, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("YYGetUser", js_js_bindings_YYAdapter_YYAdapter_YYGetUser, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("YYInitWithAppId", js_js_bindings_YYAdapter_YYAdapter_YYInitWithAppId, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("YYModifyPassword", js_js_bindings_YYAdapter_YYAdapter_YYModifyPassword, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("YYRegister", js_js_bindings_YYAdapter_YYAdapter_YYRegister, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("ctor", js_js_bindings_YYAdapter_YYAdapter_ctor, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
	};

	static JSFunctionSpec st_funcs[] = {
		JS_FN("YYGetSdkVersion", js_js_bindings_YYAdapter_YYAdapter_YYGetSdkVersion, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("YYAdapterInstance", js_js_bindings_YYAdapter_YYAdapter_YYAdapterInstance, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FS_END
	};

	jsb_YYAdapter_prototype = JS_InitClass(
		cx, global,
		NULL, // parent proto
		jsb_YYAdapter_class,
		js_js_bindings_YYAdapter_YYAdapter_constructor, 0, // constructor
		properties,
		funcs,
		NULL, // no static properties
		st_funcs);
	// make the class enumerable in the registered namespace
	JSBool found;
	JS_SetPropertyAttributes(cx, global, "YYAdapter", JSPROP_ENUMERATE | JSPROP_READONLY, &found);

	// add the proto and JSClass to the type->js info hash table
	TypeTest<YYAdapter> t;
	js_type_class_t *p;
	uint32_t typeId = t.s_id();
	HASH_FIND_INT(_js_global_type_ht, &typeId, p);
	if (!p) {
		p = (js_type_class_t *)malloc(sizeof(js_type_class_t));
		p->type = typeId;
		p->jsclass = jsb_YYAdapter_class;
		p->proto = jsb_YYAdapter_prototype;
		p->parentProto = NULL;
		HASH_ADD_INT(_js_global_type_ht, type, p);
	}
}

void register_all_js_bindings_YYAdapter(JSContext* cx, JSObject* obj) {
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

	js_register_js_bindings_YYAdapter_YYAdapter(cx, obj);
}

