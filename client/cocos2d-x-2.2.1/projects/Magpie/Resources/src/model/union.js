/**
 * Created by xiaoyu on 2014/10/16.
 */

var Union = Entity.extend({
    _id: null,              //公会id
    _name: null,            //名字
    _lv: 0,                 //等级
    _notice: null,          //公告
    _count: 0,              //当前人数
    _maxCount: 0,           //最多人数
    _createTime: null,      //创建时间
    _ability: 0,            //战斗力
    _members: [],           //成员

    init: function (data) {
        this.update(data);
    },

    update: function (data) {
        this.set("id", data.id);
        this.set("name", data.name);
        this.set("lv", data.lv);
        this.set("notice", data.notice);
        this.set("count", data.count);
        this.set("maxCount", data.maxCount);
        this.set("createTime", data.createTime);
        this.set("ability", data.ability);
        this.set("member", data.member);
    },

    unionCreate: function (cb, name, notice) {
        cc.log("Union unionCreate");

        var that = this;
        lz.server.request("area.unionHandler.unionCreate", {
            name: name,
            notice: notice
        }, function (data) {
            cc.log(data);
            if (data.code == 200) {
                that.update(data.msg);
                cb();
            } else {
                TipLayer.tip(data.msg);
                cb();
            }
        });
    },

    unionSearch: function (cb, query) {
        cc.log("Union unionSearch");

        var that = this;
        lz.server.request("area.unionHandler.unionSearch", {
            query: query
        }, function (data) {
            cc.log(data);
            if (data.code == 200) {
                cb(data.msg.unions);
            } else {
                TipLayer.tip(data.msg);
                cb();
            }
        });
    },

    unionList: function(cb) {
        cc.log("Union unionList");

        var that = this;
        lz.server.request("area.unionHandler.unionList", {

        },function(data) {
            cc.log(data);
            if(code == 200) {
                cb(data.msg.unions)
            } else {
                TipLayer.tip(data.msg);
                cb();
            }
        });
    },

    unionRequest: function(cb, id) {
        cc.log("Union unionRequest");

        var that = this;
        lz.server.request("area.unionHandler.unionRequest", {
            unionId: id
        },function(data) {
            cc.log(data);
            if(code == 200) {
                TipLayer.tip("申请成功");
                cb();
            } else {
                TipLayer.tip(data.msg);
                cb();
            }
        });
    },

    unionCancel: function(cb, id) {
        cc.log("Union unionCancel");

        var that = this;
        lz.server.request("area.unionHandler.unionCancel", {
            requestId: id
        },function(data) {
            cc.log(data);
            if(code == 200) {
                cb();
            } else {
                TipLayer.tip(data.msg);
                cb();
            }
        });
    },

    unionApprove: function(cb, id) {
        cc.log("Union unionApprove");

        var that = this;
        lz.server.request("area.unionHandler.unionApprove", {
            requestId: id
        },function(data) {
            cc.log(data);
            if(code == 200) {
                cb(data.msg.member);
            } else {
                TipLayer.tip(data.msg);
                cb();
            }
        });
    },

    unionRefuse: function(cb, id) {
        cc.log("Union unionRefuse");

        var that = this;
        lz.server.request("area.unionHandler.unionRefuse", {
            requestId: id
        },function(data) {
            cc.log(data);
            if(code == 200) {
                cb();
            } else {
                TipLayer.tip(data.msg);
                cb();
            }
        });
    },

    unionQuit: function(cb, id) {
        cc.log("Union unionQuit");

        var that = this;
        lz.server.request("area.unionHandler.unionQuit", {
            unionId: id
        },function(data) {
            cc.log(data);
            if(code == 200) {
                TipLayer.tip("退出公会成功");
                cb();
            } else {
                TipLayer.tip(data.msg);
                cb();
            }
        });
    },

    unionUpdate: function(cb, notice ) {
        cc.log("Union unionList");

        var that = this;
        lz.server.request("area.unionHandler.unionUpdate", {
            notice: notice
        },function(data) {
            cc.log(data);
            if(code == 200) {
                TipLayer.tip("更新成功");
                cb();
            } else {
                TipLayer.tip(data.msg);
                cb();
            }
        });
    }

});

Union.create = function () {
    var ret = new Union();

    if (ret) {
        return ret;
    }

    return null;
};
