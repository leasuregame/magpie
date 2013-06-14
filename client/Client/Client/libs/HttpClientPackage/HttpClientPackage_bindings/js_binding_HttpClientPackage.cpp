#include "js_binding_HttpClientPackage.hpp"
#include "cocos2d_specifics.hpp"
#include "HttpClientPackage.h"

template<class T>
static JSBool dummy_constructor(JSContext *cx, uint32_t argc, jsval *vp) {
	TypeTest<T> t;
	T* cobj = new T();
	js_type_class_t *p;
	uint32_t typeId = t.s_id();
	HASH_FIND_INT(_js_global_type_ht, &typeId, p);
	assert(p);
	JSObject *_tmp = JS_NewObject(cx, p->jsclass, p->proto, p->parentProto);
	js_proxy_t *pp;
	JS_NEW_PROXY(pp, cobj, _tmp);
	JS_SET_RVAL(cx, vp, OBJECT_TO_JSVAL(_tmp));

	return JS_TRUE;
}

static JSBool empty_constructor(JSContext *cx, uint32_t argc, jsval *vp) {
	return JS_FALSE;
}


JSClass  *jsb_HttpClientPackage_class;
JSObject *jsb_HttpClientPackage_prototype;

JSBool js_js_binding_HttpClientPackage_HttpClientPackage_setTimeoutForConnect(JSContext *cx, uint32_t argc, jsval *vp)
{
	jsval *argv = JS_ARGV(cx, vp);
	JSBool ok = JS_TRUE;
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	HttpClientPackage* cobj = (HttpClientPackage *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2( cobj, cx, JS_FALSE, "Invalid Native Object");
	if (argc == 1) {
		int arg0;
		ok &= jsval_to_int32(cx, argv[0], (int32_t *)&arg0);
		JSB_PRECONDITION2(ok, cx, JS_FALSE, "Error processing arguments");
		cobj->setTimeoutForConnect(arg0);
		JS_SET_RVAL(cx, vp, JSVAL_VOID);
		return JS_TRUE;
	}

	JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
	return JS_FALSE;
}
JSBool js_js_binding_HttpClientPackage_HttpClientPackage_HttpGetRequest(JSContext *cx, uint32_t argc, jsval *vp)
{
	jsval *argv = JS_ARGV(cx, vp);
	JSBool ok = JS_TRUE;
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	HttpClientPackage* cobj = (HttpClientPackage *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2( cobj, cx, JS_FALSE, "Invalid Native Object");
	if (argc == 3) {
		std::string arg0;
		ok &= jsval_to_std_string(cx, argv[0], &arg0);
		JSB_PRECONDITION2(ok, cx, JS_FALSE, "Error processing arguments");
		bool ret = cobj->HttpGetRequest(arg0);
		jsval jsret;
		jsret = BOOLEAN_TO_JSVAL(ret);
		JS_SET_RVAL(cx, vp, jsret);
        
        cobj->setJsCallback(argv[1], argv[2]);
        
		return JS_TRUE;
	}

	JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
	return JS_FALSE;
}
JSBool js_js_binding_HttpClientPackage_HttpClientPackage_HttpPostRequest(JSContext *cx, uint32_t argc, jsval *vp)
{
	jsval *argv = JS_ARGV(cx, vp);
	JSBool ok = JS_TRUE;
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	HttpClientPackage* cobj = (HttpClientPackage *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2( cobj, cx, JS_FALSE, "Invalid Native Object");
	if (argc == 4) {
		std::string arg0;
		std::string arg1;
		ok &= jsval_to_std_string(cx, argv[0], &arg0);
		ok &= jsval_to_std_string(cx, argv[1], &arg1);
		JSB_PRECONDITION2(ok, cx, JS_FALSE, "Error processing arguments");
		bool ret = cobj->HttpPostRequest(arg0, arg1);
		jsval jsret;
		jsret = BOOLEAN_TO_JSVAL(ret);
		JS_SET_RVAL(cx, vp, jsret);
        
        cobj->setJsCallback(argv[2], argv[3]);
        
		return JS_TRUE;
	}

	JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 2);
	return JS_FALSE;
}
JSBool js_js_binding_HttpClientPackage_HttpClientPackage_setTimeoutForRead(JSContext *cx, uint32_t argc, jsval *vp)
{
	jsval *argv = JS_ARGV(cx, vp);
	JSBool ok = JS_TRUE;
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
	js_proxy_t *proxy; JS_GET_NATIVE_PROXY(proxy, obj);
	HttpClientPackage* cobj = (HttpClientPackage *)(proxy ? proxy->ptr : NULL);
	JSB_PRECONDITION2( cobj, cx, JS_FALSE, "Invalid Native Object");
	if (argc == 1) {
		int arg0;
		ok &= jsval_to_int32(cx, argv[0], (int32_t *)&arg0);
		JSB_PRECONDITION2(ok, cx, JS_FALSE, "Error processing arguments");
		cobj->setTimeoutForRead(arg0);
		JS_SET_RVAL(cx, vp, JSVAL_VOID);
		return JS_TRUE;
	}

	JS_ReportError(cx, "wrong number of arguments: %d, was expecting %d", argc, 1);
	return JS_FALSE;
}
JSBool js_js_binding_HttpClientPackage_HttpClientPackage_destroyInstance(JSContext *cx, uint32_t argc, jsval *vp)
{
	if (argc == 0) {
		HttpClientPackage::destroyInstance();
		JS_SET_RVAL(cx, vp, JSVAL_VOID);
		return JS_TRUE;
	}
	JS_ReportError(cx, "wrong number of arguments");
	return JS_FALSE;
}

JSBool js_js_binding_HttpClientPackage_HttpClientPackage_getInstance(JSContext *cx, uint32_t argc, jsval *vp)
{
	if (argc == 0) {
		HttpClientPackage* ret = HttpClientPackage::getInstance();
		jsval jsret;
		do {
		if (ret) {
			js_proxy_t *proxy = js_get_or_create_proxy<HttpClientPackage>(cx, ret);
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

void js_js_binding_HttpClientPackage_HttpClientPackage_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (HttpClientPackage)", obj);
    js_proxy_t* nproxy;
    js_proxy_t* jsproxy;
    JS_GET_NATIVE_PROXY(jsproxy, obj);
    if (jsproxy) {
        JS_GET_PROXY(nproxy, jsproxy->ptr);

        HttpClientPackage *nobj = static_cast<HttpClientPackage *>(nproxy->ptr);
        if (nobj)
            delete nobj;
        
        JS_REMOVE_PROXY(nproxy, jsproxy);
    }
}

static JSBool js_js_binding_HttpClientPackage_HttpClientPackage_ctor(JSContext *cx, uint32_t argc, jsval *vp)
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
    HttpClientPackage *nobj = new HttpClientPackage();
    js_proxy_t* p;
    JS_NEW_PROXY(p, nobj, obj);
    JS_SET_RVAL(cx, vp, JSVAL_VOID);
    return JS_TRUE;
}

void js_register_js_binding_HttpClientPackage_HttpClientPackage(JSContext *cx, JSObject *global) {
	jsb_HttpClientPackage_class = (JSClass *)calloc(1, sizeof(JSClass));
	jsb_HttpClientPackage_class->name = "HttpClientPackage";
	jsb_HttpClientPackage_class->addProperty = JS_PropertyStub;
	jsb_HttpClientPackage_class->delProperty = JS_PropertyStub;
	jsb_HttpClientPackage_class->getProperty = JS_PropertyStub;
	jsb_HttpClientPackage_class->setProperty = JS_StrictPropertyStub;
	jsb_HttpClientPackage_class->enumerate = JS_EnumerateStub;
	jsb_HttpClientPackage_class->resolve = JS_ResolveStub;
	jsb_HttpClientPackage_class->convert = JS_ConvertStub;
	jsb_HttpClientPackage_class->finalize = js_js_binding_HttpClientPackage_HttpClientPackage_finalize;
	jsb_HttpClientPackage_class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);

	JSPropertySpec *properties = NULL;

	static JSFunctionSpec funcs[] = {
		JS_FN("setTimeoutForConnect", js_js_binding_HttpClientPackage_HttpClientPackage_setTimeoutForConnect, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("HttpGetRequest", js_js_binding_HttpClientPackage_HttpClientPackage_HttpGetRequest, 3, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("HttpPostRequest", js_js_binding_HttpClientPackage_HttpClientPackage_HttpPostRequest, 4, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("setTimeoutForRead", js_js_binding_HttpClientPackage_HttpClientPackage_setTimeoutForRead, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("ctor", js_js_binding_HttpClientPackage_HttpClientPackage_ctor, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
	};

	static JSFunctionSpec st_funcs[] = {
		JS_FN("destroyInstance", js_js_binding_HttpClientPackage_HttpClientPackage_destroyInstance, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("getInstance", js_js_binding_HttpClientPackage_HttpClientPackage_getInstance, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FS_END
	};

	jsb_HttpClientPackage_prototype = JS_InitClass(
		cx, global,
		NULL,
		jsb_HttpClientPackage_class,
		dummy_constructor<HttpClientPackage>, 0, // no constructor
		properties,
		funcs,
		NULL, // no static properties
		st_funcs);
	// make the class enumerable in the registered namespace
	JSBool found;
	JS_SetPropertyAttributes(cx, global, "HttpClientPackage", JSPROP_ENUMERATE | JSPROP_READONLY, &found);

	// add the proto and JSClass to the type->js info hash table
	TypeTest<HttpClientPackage> t;
	js_type_class_t *p;
	uint32_t typeId = t.s_id();
	HASH_FIND_INT(_js_global_type_ht, &typeId, p);
	if (!p) {
		p = (js_type_class_t *)malloc(sizeof(js_type_class_t));
		p->type = typeId;
		p->jsclass = jsb_HttpClientPackage_class;
		p->proto = jsb_HttpClientPackage_prototype;
		p->parentProto = NULL;
		HASH_ADD_INT(_js_global_type_ht, type, p);
	}
}

void register_all_js_binding_HttpClientPackage(JSContext* cx, JSObject* obj) {
	// first, try to get the ns
	jsval nsval;
	JSObject *ns;
	JS_GetProperty(cx, obj, "lz", &nsval);
	if (nsval == JSVAL_VOID) {
		ns = JS_NewObject(cx, NULL, NULL, NULL);
		nsval = OBJECT_TO_JSVAL(ns);
		JS_SetProperty(cx, obj, "lz", &nsval);
	} else {
		JS_ValueToObject(cx, nsval, &ns);
	}
	obj = ns;

	js_register_js_binding_HttpClientPackage_HttpClientPackage(cx, obj);
}

