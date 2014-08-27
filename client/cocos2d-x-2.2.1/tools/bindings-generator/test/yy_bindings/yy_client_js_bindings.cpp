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

JSBool js_yy_client_js_bindings_YYClient_getInitResult(JSContext *cx, uint32_t argc, jsval *vp)
{
	if (argc == 0) {
		bool ret = YYClient::getInitResult();
		jsval jsret;
		jsret = BOOLEAN_TO_JSVAL(ret);
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
		JS_FN("getInitResult", js_yy_client_js_bindings_YYClient_getInitResult, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("init", js_yy_client_js_bindings_YYClient_init, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FS_END
	};

	jsb_YYClient_prototype = JS_InitClass(
		cx, global,
		NULL, // parent proto
		jsb_YYClient_class,
		dummy_constructor<YYClient>, 0, // no constructor
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

