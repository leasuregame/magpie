/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-5-28
 * Time: 下午3:23
 * To change this template use File | Settings | File Templates.
 */


/*
* HttpClientPackage
* */

var lz = lz || {};

lz.HttpClientPackage = cc.Class.extend({
    _timeoutForConnect : 0,
    _timeoutForRead : 0,


    HttpGetRequest : function(url, callback, target) {
        $.ajax({
            type : "get",
            async : false,
            url : url,
            dataType : "jsonp",
            jsonpCallback :"callback",
            success : function(json){
                cc.log(json);
                if(target) callback.call(target, json);
                else callback(json);
            },
            error : function(){
                alert('fail');
            }
        });
    },

    HttpPostRequest : function(url, data, callback, target) {
        $.ajax({
            type : "get",
            async : false,
            url : url,
            data : data,
            dataType : "jsonp",
            jsonpCallback :"callback",
            success: function(json){
                cc.log(json);

                if(target) target.callback(json);
                else callback(json);
            },
            error: function(){
                alert('fail');
            }
        });
    },

    setTimeoutForConnect : function(value) {
        this._timeoutForConnect = value;
    },

    setTimeoutForRead : function(value) {
        this._timeoutForRead = value;
    }
})


/*
 * 单例
 * */
lz.HttpClientPackage.getInstance = singleton(lz.HttpClientPackage);

lz.HttpClientPackage.destroyInstance = function() {
}