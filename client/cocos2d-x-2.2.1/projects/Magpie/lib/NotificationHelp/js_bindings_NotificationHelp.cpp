#include "js_bindings_NotificationHelp.hpp"
#include "cocos2d_specifics.hpp"
#include "NotificationHelp.h"

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


JSClass  *jsb_NotificationHelp_class;
JSObject *jsb_NotificationHelp_prototype;

JSBool js_js_bindings_NotificationHelp_NotificationHelp_push(JSContext *cx, uint32_t argc, jsval *vp)
{
	jsval *argv = JS_ARGV(cx, vp);
	JSBool ok = JS_TRUE;
	if (argc == 2) {
		const char* arg0;
		int arg1;
		std::string arg0_tmp; ok &= jsval_to_std_string(cx, argv[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
		ok &= jsval_to_int32(cx, argv[1], (int32_t *)&arg1);
		JSB_PRECONDITION2(ok, cx, JS_FALSE, "Error processing arguments");
		NotificationHelp::push(arg0, arg1);
		JS_SET_RVAL(cx, vp, JSVAL_VOID);
		return JS_TRUE;
	}
	if (argc == 3) {
		const char* arg0;
		int arg1;
		int arg2;
		std::string arg0_tmp; ok &= jsval_to_std_string(cx, argv[0], &arg0_tmp); arg0 = arg0_tmp.c_str();
		ok &= jsval_to_int32(cx, argv[1], (int32_t *)&arg1);
		ok &= jsval_to_int32(cx, argv[2], (int32_t *)&arg2);
		JSB_PRECONDITION2(ok, cx, JS_FALSE, "Error processing arguments");
		NotificationHelp::push(arg0, arg1, arg2);
		JS_SET_RVAL(cx, vp, JSVAL_VOID);
		return JS_TRUE;
	}
	JS_ReportError(cx, "wrong number of arguments");
	return JS_FALSE;
}

JSBool js_js_bindings_NotificationHelp_NotificationHelp_start(JSContext *cx, uint32_t argc, jsval *vp)
{
	if (argc == 0) {
		NotificationHelp::start();
		JS_SET_RVAL(cx, vp, JSVAL_VOID);
		return JS_TRUE;
	}
	JS_ReportError(cx, "wrong number of arguments");
	return JS_FALSE;
}

JSBool js_js_bindings_NotificationHelp_NotificationHelp_end(JSContext *cx, uint32_t argc, jsval *vp)
{
	if (argc == 0) {
		NotificationHelp::end();
		JS_SET_RVAL(cx, vp, JSVAL_VOID);
		return JS_TRUE;
	}
	JS_ReportError(cx, "wrong number of arguments");
	return JS_FALSE;
}

JSBool js_js_bindings_NotificationHelp_NotificationHelp_remove(JSContext *cx, uint32_t argc, jsval *vp)
{
	jsval *argv = JS_ARGV(cx, vp);
	JSBool ok = JS_TRUE;
	
	do {
		if (argc == 1) {
			int arg0;
			ok &= jsval_to_int32(cx, argv[0], (int32_t *)&arg0);
			if (!ok) { ok = JS_TRUE; break; }
			NotificationHelp::remove(arg0);
			return JS_TRUE;
		}
	} while (0);
	
	do {
		if (argc == 0) {
			NotificationHelp::remove();
			return JS_TRUE;
		}
	} while (0);
	JS_ReportError(cx, "wrong number of arguments");
	return JS_FALSE;
}



void js_js_bindings_NotificationHelp_NotificationHelp_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (NotificationHelp)", obj);
    js_proxy_t* nproxy;
    js_proxy_t* jsproxy;
    jsproxy = jsb_get_js_proxy(obj);
    if (jsproxy) {
        nproxy = jsb_get_native_proxy(jsproxy->ptr);
        
        NotificationHelp *nobj = static_cast<NotificationHelp *>(nproxy->ptr);
        if (nobj)
            delete nobj;
        
        jsb_remove_proxy(nproxy, jsproxy);
    }
}

static JSBool js_js_bindings_NotificationHelp_NotificationHelp_ctor(JSContext *cx, uint32_t argc, jsval *vp)
{
	JSObject *obj = JS_THIS_OBJECT(cx, vp);
    NotificationHelp *nobj = new NotificationHelp();
    js_proxy_t* p = jsb_new_proxy(nobj, obj);
    JS_SET_RVAL(cx, vp, JSVAL_VOID);
    return JS_TRUE;
}

void js_register_js_bindings_NotificationHelp_NotificationHelp(JSContext *cx, JSObject *global) {
	jsb_NotificationHelp_class = (JSClass *)calloc(1, sizeof(JSClass));
	jsb_NotificationHelp_class->name = "NotificationHelp";
	jsb_NotificationHelp_class->addProperty = JS_PropertyStub;
	jsb_NotificationHelp_class->delProperty = JS_PropertyStub;
	jsb_NotificationHelp_class->getProperty = JS_PropertyStub;
	jsb_NotificationHelp_class->setProperty = JS_StrictPropertyStub;
	jsb_NotificationHelp_class->enumerate = JS_EnumerateStub;
	jsb_NotificationHelp_class->resolve = JS_ResolveStub;
	jsb_NotificationHelp_class->convert = JS_ConvertStub;
	jsb_NotificationHelp_class->finalize = js_js_bindings_NotificationHelp_NotificationHelp_finalize;
	jsb_NotificationHelp_class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);
    
	JSPropertySpec *properties = NULL;
    
	JSFunctionSpec *funcs = NULL;
    
	static JSFunctionSpec st_funcs[] = {
		JS_FN("push", js_js_bindings_NotificationHelp_NotificationHelp_push, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("start", js_js_bindings_NotificationHelp_NotificationHelp_start, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("end", js_js_bindings_NotificationHelp_NotificationHelp_end, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FN("remove", js_js_bindings_NotificationHelp_NotificationHelp_remove, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
		JS_FS_END
	};
    
	jsb_NotificationHelp_prototype = JS_InitClass(
                                                  cx, global,
                                                  NULL, // parent proto
                                                  jsb_NotificationHelp_class,
                                                  dummy_constructor<NotificationHelp>, 0, // no constructor
                                                  properties,
                                                  funcs,
                                                  NULL, // no static properties
                                                  st_funcs);
	// make the class enumerable in the registered namespace
	JSBool found;
	JS_SetPropertyAttributes(cx, global, "NotificationHelp", JSPROP_ENUMERATE | JSPROP_READONLY, &found);
    
	// add the proto and JSClass to the type->js info hash table
	TypeTest<NotificationHelp> t;
	js_type_class_t *p;
	uint32_t typeId = t.s_id();
	HASH_FIND_INT(_js_global_type_ht, &typeId, p);
	if (!p) {
		p = (js_type_class_t *)malloc(sizeof(js_type_class_t));
		p->type = typeId;
		p->jsclass = jsb_NotificationHelp_class;
		p->proto = jsb_NotificationHelp_prototype;
		p->parentProto = NULL;
		HASH_ADD_INT(_js_global_type_ht, type, p);
	}
}

void register_all_js_bindings_NotificationHelp(JSContext* cx, JSObject* obj) {
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
    
	js_register_js_bindings_NotificationHelp_NotificationHelp(cx, obj);
}

