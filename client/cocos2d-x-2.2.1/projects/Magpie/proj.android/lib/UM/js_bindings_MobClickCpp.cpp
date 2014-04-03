#include "js_bindings_MobClickCpp.hpp"
#include "cocos2d_specifics.hpp"
#include "MobClickCpp.h"

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


JSClass  *jsb_MobClickCpp_class;
JSObject *jsb_MobClickCpp_prototype;

JSBool js_js_bindings_MobClickCpp_MobClickCpp_applicationDidEnterBackground(JSContext *cx, uint32_t argc, jsval *vp)
{
	if (argc == 0) {
		MobClickCpp::applicationDidEnterBackground();
		JS_SET_RVAL(cx, vp, JSVAL_VOID);
		return JS_TRUE;
	}
	JS_ReportError(cx, "wrong number of arguments");
	return JS_FALSE;
}

JSBool js_js_bindings_MobClickCpp_MobClickCpp_applicationWillEnterForeground(JSContext *cx, uint32_t argc, jsval *vp)
{
	if (argc == 0) {
		MobClickCpp::applicationWillEnterForeground();
		JS_SET_RVAL(cx, vp, JSVAL_VOID);
		return JS_TRUE;
	}
	JS_ReportError(cx, "wrong number of arguments");
	return JS_FALSE;
}

JSBool js_js_bindings_MobClickCpp_MobClickCpp_beginEventWithLabel(JSContext *cx, uint32_t argc, jsval *vp)
{
	jsval *argv = JS_ARGV(cx, vp);
	JSBool ok = JS_TRUE;
	if (argc == 2) {
		const char* arg0;
		const char* arg1;
		std::string arg0_tmp; ok &= jsval_to_std_string(cx, argv[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
		std::string arg1_tmp; ok &= jsval_to_std_string(cx, argv[1], &arg1_tmp); arg1 = arg1_tmp.c_str();
		JSB_PRECONDITION2(ok, cx, JS_FALSE, "Error processing arguments");
		MobClickCpp::beginEventWithLabel(arg0, arg1);
		JS_SET_RVAL(cx, vp, JSVAL_VOID);
		return JS_TRUE;
	}
	JS_ReportError(cx, "wrong number of arguments");
	return JS_FALSE;
}

JSBool js_js_bindings_MobClickCpp_MobClickCpp_setCrashReportEnabled(JSContext *cx, uint32_t argc, jsval *vp)
{
	jsval *argv = JS_ARGV(cx, vp);
	JSBool ok = JS_TRUE;
	if (argc == 1) {
		JSBool arg0;
		ok &= JS_ValueToBoolean(cx, argv[0], &arg0);
		JSB_PRECONDITION2(ok, cx, JS_FALSE, "Error processing arguments");
		MobClickCpp::setCrashReportEnabled(arg0);
		JS_SET_RVAL(cx, vp, JSVAL_VOID);
		return JS_TRUE;
	}
	JS_ReportError(cx, "wrong number of arguments");
	return JS_FALSE;
}

JSBool js_js_bindings_MobClickCpp_MobClickCpp_checkUpdate(JSContext *cx, uint32_t argc, jsval *vp)
{
	jsval *argv = JS_ARGV(cx, vp);
	JSBool ok = JS_TRUE;
	
	do {
		if (argc == 3) {
			const char* arg0;
			std::string arg0_tmp; ok &= jsval_to_std_string(cx, argv[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
			if (!ok) { ok = JS_TRUE; break; }
			const char* arg1;
			std::string arg1_tmp; ok &= jsval_to_std_string(cx, argv[1], &arg1_tmp); arg1 = arg1_tmp.c_str();
			if (!ok) { ok = JS_TRUE; break; }
			const char* arg2;
			std::string arg2_tmp; ok &= jsval_to_std_string(cx, argv[2], &arg2_tmp); arg2 = arg2_tmp.c_str();
			if (!ok) { ok = JS_TRUE; break; }
			MobClickCpp::checkUpdate(arg0, arg1, arg2);
			return JS_TRUE;
		}
	} while (0);
	
	do {
		if (argc == 0) {
			MobClickCpp::checkUpdate();
			return JS_TRUE;
		}
	} while (0);
	JS_ReportError(cx, "wrong number of arguments");
	return JS_FALSE;
}
JSBool js_js_bindings_MobClickCpp_MobClickCpp_beginLogPageView(JSContext *cx, uint32_t argc, jsval *vp)
{
	jsval *argv = JS_ARGV(cx, vp);
	JSBool ok = JS_TRUE;
	if (argc == 1) {
		const char* arg0;
		std::string arg0_tmp; ok &= jsval_to_std_string(cx, argv[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
		JSB_PRECONDITION2(ok, cx, JS_FALSE, "Error processing arguments");
		MobClickCpp::beginLogPageView(arg0);
		JS_SET_RVAL(cx, vp, JSVAL_VOID);
		return JS_TRUE;
	}
	JS_ReportError(cx, "wrong number of arguments");
	return JS_FALSE;
}

JSBool js_js_bindings_MobClickCpp_MobClickCpp_setAppVersion(JSContext *cx, uint32_t argc, jsval *vp)
{
	jsval *argv = JS_ARGV(cx, vp);
	JSBool ok = JS_TRUE;
	if (argc == 1) {
		const char* arg0;
		std::string arg0_tmp; ok &= jsval_to_std_string(cx, argv[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
		JSB_PRECONDITION2(ok, cx, JS_FALSE, "Error processing arguments");
		MobClickCpp::setAppVersion(arg0);
		JS_SET_RVAL(cx, vp, JSVAL_VOID);
		return JS_TRUE;
	}
	JS_ReportError(cx, "wrong number of arguments");
	return JS_FALSE;
}

JSBool js_js_bindings_MobClickCpp_MobClickCpp_getConfigParams(JSContext *cx, uint32_t argc, jsval *vp)
{
	jsval *argv = JS_ARGV(cx, vp);
	JSBool ok = JS_TRUE;
	if (argc == 1) {
		const char* arg0;
		std::string arg0_tmp; ok &= jsval_to_std_string(cx, argv[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
		JSB_PRECONDITION2(ok, cx, JS_FALSE, "Error processing arguments");
		std::string ret = MobClickCpp::getConfigParams(arg0);
		jsval jsret;
		jsret = std_string_to_jsval(cx, ret);
		JS_SET_RVAL(cx, vp, jsret);
		return JS_TRUE;
	}
	JS_ReportError(cx, "wrong number of arguments");
	return JS_FALSE;
}

JSBool js_js_bindings_MobClickCpp_MobClickCpp_endEventWithLabel(JSContext *cx, uint32_t argc, jsval *vp)
{
	jsval *argv = JS_ARGV(cx, vp);
	JSBool ok = JS_TRUE;
	if (argc == 2) {
		const char* arg0;
		const char* arg1;
		std::string arg0_tmp; ok &= jsval_to_std_string(cx, argv[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
		std::string arg1_tmp; ok &= jsval_to_std_string(cx, argv[1], &arg1_tmp); arg1 = arg1_tmp.c_str();
		JSB_PRECONDITION2(ok, cx, JS_FALSE, "Error processing arguments");
		MobClickCpp::endEventWithLabel(arg0, arg1);
		JS_SET_RVAL(cx, vp, JSVAL_VOID);
		return JS_TRUE;
	}
	JS_ReportError(cx, "wrong number of arguments");
	return JS_FALSE;
}

JSBool js_js_bindings_MobClickCpp_MobClickCpp_endEvent(JSContext *cx, uint32_t argc, jsval *vp)
{
	jsval *argv = JS_ARGV(cx, vp);
	JSBool ok = JS_TRUE;
	if (argc == 1) {
		const char* arg0;
		std::string arg0_tmp; ok &= jsval_to_std_string(cx, argv[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
		JSB_PRECONDITION2(ok, cx, JS_FALSE, "Error processing arguments");
		MobClickCpp::endEvent(arg0);
		JS_SET_RVAL(cx, vp, JSVAL_VOID);
		return JS_TRUE;
	}
	JS_ReportError(cx, "wrong number of arguments");
	return JS_FALSE;
}

JSBool js_js_bindings_MobClickCpp_MobClickCpp_startWithAppkey(JSContext *cx, uint32_t argc, jsval *vp)
{
	jsval *argv = JS_ARGV(cx, vp);
	JSBool ok = JS_TRUE;
	if (argc == 1) {
		const char* arg0;
		std::string arg0_tmp; ok &= jsval_to_std_string(cx, argv[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
		JSB_PRECONDITION2(ok, cx, JS_FALSE, "Error processing arguments");
		MobClickCpp::startWithAppkey(arg0);
		JS_SET_RVAL(cx, vp, JSVAL_VOID);
		return JS_TRUE;
	}
	if (argc == 2) {
		const char* arg0;
		const char* arg1;
		std::string arg0_tmp; ok &= jsval_to_std_string(cx, argv[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
		std::string arg1_tmp; ok &= jsval_to_std_string(cx, argv[1], &arg1_tmp); arg1 = arg1_tmp.c_str();
		JSB_PRECONDITION2(ok, cx, JS_FALSE, "Error processing arguments");
		MobClickCpp::startWithAppkey(arg0, arg1);
		JS_SET_RVAL(cx, vp, JSVAL_VOID);
		return JS_TRUE;
	}
	JS_ReportError(cx, "wrong number of arguments");
	return JS_FALSE;
}

JSBool js_js_bindings_MobClickCpp_MobClickCpp_endLogPageView(JSContext *cx, uint32_t argc, jsval *vp)
{
	jsval *argv = JS_ARGV(cx, vp);
	JSBool ok = JS_TRUE;
	if (argc == 1) {
		const char* arg0;
		std::string arg0_tmp; ok &= jsval_to_std_string(cx, argv[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
		JSB_PRECONDITION2(ok, cx, JS_FALSE, "Error processing arguments");
		MobClickCpp::endLogPageView(arg0);
		JS_SET_RVAL(cx, vp, JSVAL_VOID);
		return JS_TRUE;
	}
	JS_ReportError(cx, "wrong number of arguments");
	return JS_FALSE;
}

JSBool js_js_bindings_MobClickCpp_MobClickCpp_setLogEnabled(JSContext *cx, uint32_t argc, jsval *vp)
{
	jsval *argv = JS_ARGV(cx, vp);
	JSBool ok = JS_TRUE;
	if (argc == 1) {
		JSBool arg0;
		ok &= JS_ValueToBoolean(cx, argv[0], &arg0);
		JSB_PRECONDITION2(ok, cx, JS_FALSE, "Error processing arguments");
		MobClickCpp::setLogEnabled(arg0);
		JS_SET_RVAL(cx, vp, JSVAL_VOID);
		return JS_TRUE;
	}
	JS_ReportError(cx, "wrong number of arguments");
	return JS_FALSE;
}

JSBool js_js_bindings_MobClickCpp_MobClickCpp_end(JSContext *cx, uint32_t argc, jsval *vp)
{
	if (argc == 0) {
		MobClickCpp::end();
		JS_SET_RVAL(cx, vp, JSVAL_VOID);
		return JS_TRUE;
	}
	JS_ReportError(cx, "wrong number of arguments");
	return JS_FALSE;
}

JSBool js_js_bindings_MobClickCpp_MobClickCpp_updateOnlineConfig(JSContext *cx, uint32_t argc, jsval *vp)
{
	if (argc == 0) {
		MobClickCpp::updateOnlineConfig();
		JS_SET_RVAL(cx, vp, JSVAL_VOID);
		return JS_TRUE;
	}
	JS_ReportError(cx, "wrong number of arguments");
	return JS_FALSE;
}

JSBool js_js_bindings_MobClickCpp_MobClickCpp_event(JSContext *cx, uint32_t argc, jsval *vp)
{
	jsval *argv = JS_ARGV(cx, vp);
	JSBool ok = JS_TRUE;
	
	do {
		if (argc == 1) {
			const char* arg0;
			std::string arg0_tmp; ok &= jsval_to_std_string(cx, argv[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
			if (!ok) { ok = JS_TRUE; break; }
			MobClickCpp::event(arg0);
			return JS_TRUE;
		}
	} while (0);
	do {
		if (argc == 2) {
			const char* arg0;
			std::string arg0_tmp; ok &= jsval_to_std_string(cx, argv[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
			if (!ok) { ok = JS_TRUE; break; }
			const char* arg1;
			std::string arg1_tmp; ok &= jsval_to_std_string(cx, argv[1], &arg1_tmp); arg1 = arg1_tmp.c_str();
			if (!ok) { ok = JS_TRUE; break; }
			MobClickCpp::event(arg0, arg1);
			return JS_TRUE;
		}
	} while (0);
	JS_ReportError(cx, "wrong number of arguments");
	return JS_FALSE;
}
JSBool js_js_bindings_MobClickCpp_MobClickCpp_beginEvent(JSContext *cx, uint32_t argc, jsval *vp)
{
	jsval *argv = JS_ARGV(cx, vp);
	JSBool ok = JS_TRUE;
	if (argc == 1) {
		const char* arg0;
		std::string arg0_tmp; ok &= jsval_to_std_string(cx, argv[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
		JSB_PRECONDITION2(ok, cx, JS_FALSE, "Error processing arguments");
		MobClickCpp::beginEvent(arg0);
		JS_SET_RVAL(cx, vp, JSVAL_VOID);
		return JS_TRUE;
	}
	JS_ReportError(cx, "wrong number of arguments");
	return JS_FALSE;
}




void js_js_bindings_MobClickCpp_MobClickCpp_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (MobClickCpp)", obj);
    js_proxy_t* nproxy;
    js_proxy_t* jsproxy;
    jsproxy = jsb_get_js_proxy(obj);
    if (jsproxy) {
        nproxy = jsb_get_native_proxy(jsproxy->ptr);
        
        MobClickCpp *nobj = static_cast<MobClickCpp *>(nproxy->ptr);
        if (nobj)
            delete nobj;
        
        jsb_remove_proxy(nproxy, jsproxy);
    }
}

static JSBool js_js_bindings_MobClickCpp_MobClickCpp_ctor(JSContext *cx, uint32_t argc, jsval *vp)
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
    MobClickCpp *nobj = new MobClickCpp();
    js_proxy_t* p = jsb_new_proxy(nobj, obj);
    JS_SET_RVAL(cx, vp, JSVAL_VOID);
    return JS_TRUE;
}

void js_register_js_bindings_MobClickCpp_MobClickCpp(JSContext *cx, JSObject *global) {
	jsb_MobClickCpp_class = (JSClass *)calloc(1, sizeof(JSClass));
	jsb_MobClickCpp_class->name = "MobClickCPP";
	jsb_MobClickCpp_class->addProperty = JS_PropertyStub;
	jsb_MobClickCpp_class->delProperty = JS_PropertyStub;
	jsb_MobClickCpp_class->getProperty = JS_PropertyStub;
	jsb_MobClickCpp_class->setProperty = JS_StrictPropertyStub;
	jsb_MobClickCpp_class->enumerate = JS_EnumerateStub;
	jsb_MobClickCpp_class->resolve = JS_ResolveStub;
	jsb_MobClickCpp_class->convert = JS_ConvertStub;
	jsb_MobClickCpp_class->finalize = js_js_bindings_MobClickCpp_MobClickCpp_finalize;
	jsb_MobClickCpp_class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);
    
	JSPropertySpec *properties = NULL;
    
	JSFunctionSpec *funcs = NULL;
    
	static JSFunctionSpec st_funcs[] = {
		JS_FN("applicationDidEnterBackground", js_js_bindings_MobClickCpp_MobClickCpp_applicationDidEnterBackground, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("applicationWillEnterForeground", js_js_bindings_MobClickCpp_MobClickCpp_applicationWillEnterForeground, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("beginEventWithLabel", js_js_bindings_MobClickCpp_MobClickCpp_beginEventWithLabel, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("setCrashReportEnabled", js_js_bindings_MobClickCpp_MobClickCpp_setCrashReportEnabled, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("checkUpdate", js_js_bindings_MobClickCpp_MobClickCpp_checkUpdate, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("beginLogPageView", js_js_bindings_MobClickCpp_MobClickCpp_beginLogPageView, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("setAppVersion", js_js_bindings_MobClickCpp_MobClickCpp_setAppVersion, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("getConfigParams", js_js_bindings_MobClickCpp_MobClickCpp_getConfigParams, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("endEventWithLabel", js_js_bindings_MobClickCpp_MobClickCpp_endEventWithLabel, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("endEvent", js_js_bindings_MobClickCpp_MobClickCpp_endEvent, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("startWithAppKey", js_js_bindings_MobClickCpp_MobClickCpp_startWithAppkey, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("endLogPageView", js_js_bindings_MobClickCpp_MobClickCpp_endLogPageView, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("setLogEnabled", js_js_bindings_MobClickCpp_MobClickCpp_setLogEnabled, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("end", js_js_bindings_MobClickCpp_MobClickCpp_end, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("updateOnlineConfig", js_js_bindings_MobClickCpp_MobClickCpp_updateOnlineConfig, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("event", js_js_bindings_MobClickCpp_MobClickCpp_event, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("beginEvent", js_js_bindings_MobClickCpp_MobClickCpp_beginEvent, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FS_END
	};
    
	jsb_MobClickCpp_prototype = JS_InitClass(
                                             cx, global,
                                             NULL, // parent proto
                                             jsb_MobClickCpp_class,
                                             dummy_constructor<MobClickCpp>, 0, // no constructor
                                             properties,
                                             funcs,
                                             NULL, // no static properties
                                             st_funcs);
	// make the class enumerable in the registered namespace
	JSBool found;
	JS_SetPropertyAttributes(cx, global, "MobClickCPP", JSPROP_ENUMERATE | JSPROP_READONLY, &found);
    
	// add the proto and JSClass to the type->js info hash table
	TypeTest<MobClickCpp> t;
	js_type_class_t *p;
	uint32_t typeId = t.s_id();
	HASH_FIND_INT(_js_global_type_ht, &typeId, p);
	if (!p) {
		p = (js_type_class_t *)malloc(sizeof(js_type_class_t));
		p->type = typeId;
		p->jsclass = jsb_MobClickCpp_class;
		p->proto = jsb_MobClickCpp_prototype;
		p->parentProto = NULL;
		HASH_ADD_INT(_js_global_type_ht, type, p);
	}
}

void register_all_js_bindings_MobClickCpp(JSContext* cx, JSObject* obj) {
	// first, try to get the ns
	jsval nsval;
	JSObject *ns;
	JS_GetProperty(cx, obj, "um", &nsval);
	if (nsval == JSVAL_VOID) {
		ns = JS_NewObject(cx, NULL, NULL, NULL);
		nsval = OBJECT_TO_JSVAL(ns);
		JS_SetProperty(cx, obj, "um", &nsval);
	} else {
		JS_ValueToObject(cx, nsval, &ns);
	}
	obj = ns;
    
	js_register_js_bindings_MobClickCpp_MobClickCpp(cx, obj);
}

