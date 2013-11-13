#include "js_cocos2dx_autogen_extension.hpp"
#include "cocos2d_specifics.hpp"
#include "MobClickCPP.h"

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


JSClass  *jsb_MobClickCPP_class;
JSObject *jsb_MobClickCPP_prototype;

JSBool js_js_cocos2dx_autogen_extension_MobClickCPP_startWithAppkey(JSContext *cx, uint32_t argc, jsval *vp)
{
	jsval *argv = JS_ARGV(cx, vp);
	JSBool ok = JS_TRUE;
	if (argc == 1) {
		const char* arg0;
		std::string arg0_tmp; ok &= jsval_to_std_string(cx, argv[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
		JSB_PRECONDITION2(ok, cx, JS_FALSE, "Error processing arguments");
		MobClickCPP::startWithAppkey(arg0);
		JS_SET_RVAL(cx, vp, JSVAL_VOID);
		return JS_TRUE;
	}
	JS_ReportError(cx, "wrong number of arguments");
	return JS_FALSE;
}

JSBool js_js_cocos2dx_autogen_extension_MobClickCPP_startWithAppKey(JSContext *cx, uint32_t argc, jsval *vp)
{
	jsval *argv = JS_ARGV(cx, vp);
	JSBool ok = JS_TRUE;
	if (argc == 3) {
		const char* arg0;
		int arg1;
		const char* arg2;
		std::string arg0_tmp; ok &= jsval_to_std_string(cx, argv[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
		ok &= jsval_to_int32(cx, argv[1], (int32_t *)&arg1);
		std::string arg2_tmp; ok &= jsval_to_std_string(cx, argv[2], &arg2_tmp); arg2 = arg2_tmp.c_str();
		JSB_PRECONDITION2(ok, cx, JS_FALSE, "Error processing arguments");
		MobClickCPP::startWithAppKey(arg0, arg1, arg2);
		JS_SET_RVAL(cx, vp, JSVAL_VOID);
		return JS_TRUE;
	}
	JS_ReportError(cx, "wrong number of arguments");
	return JS_FALSE;
}




void js_js_cocos2dx_autogen_extension_MobClickCPP_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (MobClickCPP)", obj);
    js_proxy_t* nproxy;
    js_proxy_t* jsproxy;
    jsproxy = jsb_get_js_proxy(obj);
    if (jsproxy) {
        nproxy = jsb_get_native_proxy(jsproxy->ptr);

        MobClickCPP *nobj = static_cast<MobClickCPP *>(nproxy->ptr);
        if (nobj)
            delete nobj;
        
        jsb_remove_proxy(nproxy, jsproxy);
    }
}

static JSBool js_js_cocos2dx_autogen_extension_MobClickCPP_ctor(JSContext *cx, uint32_t argc, jsval *vp)
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
    MobClickCPP *nobj = new MobClickCPP();
    js_proxy_t* p = jsb_new_proxy(nobj, obj);
    JS_SET_RVAL(cx, vp, JSVAL_VOID);
    return JS_TRUE;
}

void js_register_js_cocos2dx_autogen_extension_MobClickCPP(JSContext *cx, JSObject *global) {
	jsb_MobClickCPP_class = (JSClass *)calloc(1, sizeof(JSClass));
	jsb_MobClickCPP_class->name = "MobClickCPP";
	jsb_MobClickCPP_class->addProperty = JS_PropertyStub;
	jsb_MobClickCPP_class->delProperty = JS_PropertyStub;
	jsb_MobClickCPP_class->getProperty = JS_PropertyStub;
	jsb_MobClickCPP_class->setProperty = JS_StrictPropertyStub;
	jsb_MobClickCPP_class->enumerate = JS_EnumerateStub;
	jsb_MobClickCPP_class->resolve = JS_ResolveStub;
	jsb_MobClickCPP_class->convert = JS_ConvertStub;
	jsb_MobClickCPP_class->finalize = js_js_cocos2dx_autogen_extension_MobClickCPP_finalize;
	jsb_MobClickCPP_class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);

	JSPropertySpec *properties = NULL;

	JSFunctionSpec *funcs = NULL;

	static JSFunctionSpec st_funcs[] = {
		JS_FN("startWithAppkey", js_js_cocos2dx_autogen_extension_MobClickCPP_startWithAppkey, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("startWithAppKey", js_js_cocos2dx_autogen_extension_MobClickCPP_startWithAppKey, 3, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FS_END
	};

	jsb_MobClickCPP_prototype = JS_InitClass(
		cx, global,
		NULL, // parent proto
		jsb_MobClickCPP_class,
		dummy_constructor<MobClickCPP>, 0, // no constructor
		properties,
		funcs,
		NULL, // no static properties
		st_funcs);
	// make the class enumerable in the registered namespace
	JSBool found;
	JS_SetPropertyAttributes(cx, global, "MobClickCPP", JSPROP_ENUMERATE | JSPROP_READONLY, &found);

	// add the proto and JSClass to the type->js info hash table
	TypeTest<MobClickCPP> t;
	js_type_class_t *p;
	uint32_t typeId = t.s_id();
	HASH_FIND_INT(_js_global_type_ht, &typeId, p);
	if (!p) {
		p = (js_type_class_t *)malloc(sizeof(js_type_class_t));
		p->type = typeId;
		p->jsclass = jsb_MobClickCPP_class;
		p->proto = jsb_MobClickCPP_prototype;
		p->parentProto = NULL;
		HASH_ADD_INT(_js_global_type_ht, type, p);
	}
}

void register_all_js_cocos2dx_autogen_extension(JSContext* cx, JSObject* obj) {
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

	js_register_js_cocos2dx_autogen_extension_MobClickCPP(cx, obj);
}

