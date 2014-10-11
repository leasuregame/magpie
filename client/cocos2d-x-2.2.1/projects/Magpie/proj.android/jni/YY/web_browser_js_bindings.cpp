#include "web_browser_js_bindings.hpp"
#include "cocos2d_specifics.hpp"
#include "WebBrowser.h"

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


JSClass  *jsb_WebBrowser_class;
JSObject *jsb_WebBrowser_prototype;

JSBool js_web_browser_js_bindings_WebBrowser_close(JSContext *cx, uint32_t argc, jsval *vp)
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	WebBrowser* cobj = (WebBrowser *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2( cobj, cx, JS_FALSE, "Invalid Native Object");
	if (argc == 0) {
		cobj->close();
		JS_SET_RVAL(cx, vp, JSVAL_VOID);
		return JS_TRUE;
	}

	JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 0);
	return JS_FALSE;
}
JSBool js_web_browser_js_bindings_WebBrowser_updateUrl(JSContext *cx, uint32_t argc, jsval *vp)
{
	jsval *argv = JS_ARGV(cx, vp);
	JSBool ok = JS_TRUE;
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	WebBrowser* cobj = (WebBrowser *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2( cobj, cx, JS_FALSE, "Invalid Native Object");
	if (argc == 1) {
		const char* arg0;
		std::string arg0_tmp; ok &= jsval_to_std_string(cx, argv[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
		JSB_PRECONDITION2(ok, cx, JS_FALSE, "Error processing arguments");
		cobj->updateUrl(arg0);
		JS_SET_RVAL(cx, vp, JSVAL_VOID);
		return JS_TRUE;
	}

	JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
	return JS_FALSE;
}
JSBool js_web_browser_js_bindings_WebBrowser_openWebView(JSContext *cx, uint32_t argc, jsval *vp)
{
	jsval *argv = JS_ARGV(cx, vp);
	JSBool ok = JS_TRUE;
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy = jsb_get_js_proxy(obj);
	WebBrowser* cobj = (WebBrowser *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2( cobj, cx, JS_FALSE, "Invalid Native Object");
	if (argc == 5) {
		const char* arg0;
		int arg1;
		int arg2;
		int arg3;
		int arg4;
		std::string arg0_tmp; ok &= jsval_to_std_string(cx, argv[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
		ok &= jsval_to_int32(cx, argv[1], (int32_t *)&arg1);
		ok &= jsval_to_int32(cx, argv[2], (int32_t *)&arg2);
		ok &= jsval_to_int32(cx, argv[3], (int32_t *)&arg3);
		ok &= jsval_to_int32(cx, argv[4], (int32_t *)&arg4);
		JSB_PRECONDITION2(ok, cx, JS_FALSE, "Error processing arguments");
		cobj->openWebView(arg0, arg1, arg2, arg3, arg4);
		JS_SET_RVAL(cx, vp, JSVAL_VOID);
		return JS_TRUE;
	}

	JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 5);
	return JS_FALSE;
}
JSBool js_web_browser_js_bindings_WebBrowser_constructor(JSContext *cx, uint32_t argc, jsval *vp)
{
	if (argc == 0) {
		WebBrowser* cobj = new WebBrowser();
		TypeTest<WebBrowser> t;
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




void js_web_browser_js_bindings_WebBrowser_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (WebBrowser)", obj);
    js_proxy_t* nproxy;
    js_proxy_t* jsproxy;
    jsproxy = jsb_get_js_proxy(obj);
    if (jsproxy) {
        nproxy = jsb_get_native_proxy(jsproxy->ptr);

        WebBrowser *nobj = static_cast<WebBrowser *>(nproxy->ptr);
        if (nobj)
            delete nobj;
        
        jsb_remove_proxy(nproxy, jsproxy);
    }
}

static JSBool js_web_browser_js_bindings_WebBrowser_ctor(JSContext *cx, uint32_t argc, jsval *vp)
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
    WebBrowser *nobj = new WebBrowser();
    js_proxy_t* p = jsb_new_proxy(nobj, obj);
    JS_SET_RVAL(cx, vp, JSVAL_VOID);
    return JS_TRUE;
}

void js_register_web_browser_js_bindings_WebBrowser(JSContext *cx, JSObject *global) {
	jsb_WebBrowser_class = (JSClass *)calloc(1, sizeof(JSClass));
	jsb_WebBrowser_class->name = "WebBrowser";
	jsb_WebBrowser_class->addProperty = JS_PropertyStub;
	jsb_WebBrowser_class->delProperty = JS_PropertyStub;
	jsb_WebBrowser_class->getProperty = JS_PropertyStub;
	jsb_WebBrowser_class->setProperty = JS_StrictPropertyStub;
	jsb_WebBrowser_class->enumerate = JS_EnumerateStub;
	jsb_WebBrowser_class->resolve = JS_ResolveStub;
	jsb_WebBrowser_class->convert = JS_ConvertStub;
	jsb_WebBrowser_class->finalize = js_web_browser_js_bindings_WebBrowser_finalize;
	jsb_WebBrowser_class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);

	JSPropertySpec *properties = NULL;

	static JSFunctionSpec funcs[] = {
		JS_FN("close", js_web_browser_js_bindings_WebBrowser_close, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("updateUrl", js_web_browser_js_bindings_WebBrowser_updateUrl, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("openWebView", js_web_browser_js_bindings_WebBrowser_openWebView, 5, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("ctor", js_web_browser_js_bindings_WebBrowser_ctor, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
	};

	JSFunctionSpec *st_funcs = NULL;

	jsb_WebBrowser_prototype = JS_InitClass(
		cx, global,
		NULL, // parent proto
		jsb_WebBrowser_class,
		js_web_browser_js_bindings_WebBrowser_constructor, 0, // constructor
		properties,
		funcs,
		NULL, // no static properties
		st_funcs);
	// make the class enumerable in the registered namespace
	JSBool found;
	JS_SetPropertyAttributes(cx, global, "WebBrowser", JSPROP_ENUMERATE | JSPROP_READONLY, &found);

	// add the proto and JSClass to the type->js info hash table
	TypeTest<WebBrowser> t;
	js_type_class_t *p;
	uint32_t typeId = t.s_id();
	HASH_FIND_INT(_js_global_type_ht, &typeId, p);
	if (!p) {
		p = (js_type_class_t *)malloc(sizeof(js_type_class_t));
		p->type = typeId;
		p->jsclass = jsb_WebBrowser_class;
		p->proto = jsb_WebBrowser_prototype;
		p->parentProto = NULL;
		HASH_ADD_INT(_js_global_type_ht, type, p);
	}
}

void register_all_web_browser_js_bindings(JSContext* cx, JSObject* obj) {

	js_register_web_browser_js_bindings_WebBrowser(cx, obj);
}

