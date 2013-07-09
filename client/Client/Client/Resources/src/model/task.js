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
    _points: 0, // 最大成数

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
    }
})


Task.create = function(data) {
    var ret = new Task();

    if(ret && ret.init(data)) {
        return ret;
    }

    return null;
}