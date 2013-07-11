/**
 * Created with JetBrains WebStorm.
 * User: lcc3536
 * Date: 13-7-9
 * Time: 下午6:20
 * To change this template use File | Settings | File Templates.
 */


/*
 * task
 * */


var Task = Entity.extend({
    _id: 0,
    _progress: 0,
    _points: 0, // 最大层数

    init: function (data) {
        this.update(data);

        return true;
    },

    update: function (data) {
        if (this._id != data.id) {
            this._id = data.id;
            this._points = xxx; // 获取数据表层数，需要修改
        }

        this._progress = data.progress;
    },

    getPercentage: function () {
        return (this._progress / this._points);
    },

    /*
     * 根据id和任务进度请求服务器执行任务
     * @ param {function} cb 回调函数
     * @ param {number} id 任务id
     * @ param {number} progress 进度
     * */
    explore: function (cb, id) {
        cc.log("Task explore");

        var that = this;
        lzWindow.pomelo.request("logic.taskHandler.explore", {playerId: 1, id: id}, function (data) {
            cc.log("pomelo websocket callback data:");
            cc.log(data);

            if (data.code == 200) {
                cc.log("explore success");

                var msg = data.msg;

                that.update({
                    id: msg.id,
                    progress: msg.progress
                });

                cb("success");
            } else {
                cc.log("explore fail");

                cb("fail");
            }
        });
    }
})


Task.create = function (data) {
    var ret = new Task();

    if (ret && ret.init(data)) {
        return ret;
    }

    return null;
}