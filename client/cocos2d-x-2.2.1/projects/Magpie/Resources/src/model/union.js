/**
 * Created by xiaoyu on 2014/10/16.
 */

var TYPE_UNION_PRESIDENT = "1";
var TYPE_UNION_ELDERS = "2";
var TYPE_UNION_MEMBER = "3";

var TYPE_UNION_SHOW_MYSELF = 0;
var TYPE_UNION_SHOW_OTHER = 1;

var Union = Entity.extend({
    _id: null,              //公会id
    _name: null,            //名字
    _lv: 0,                 //等级
    _notice: "",            //公告
    _count: 0,              //当前人数
    _maxCount: 0,           //最多人数
    _creator: null,         //创建公会的玩家id
    _elderCount: null,      //当前长老数量
    _created: null,         //创建时间
    _ability: 0,            //战斗力
    _memberList: [],        //成员
    _role: null,            //玩家角色
    _tree: null,            //许愿树

    init: function () {
        this.sync();
    },

    sync: function (cb) {
        cc.log("Union sync");

        cb = cb || function () {
        };

        if (gameData.player.get("lv") < outputTables.function_limit.rows[1].union) {
            return;
        }

        var that = this;
        lz.server.request("area.unionHandler.getUnion", {}, function (data) {
            cc.log(data);

            lz.server.on("onUnionRequestApprove", function (data) {
                cc.log("onUnionRequestApprove");
                cc.log(data);

                var msg = data.msg.union;
                for (var key in msg) {
                    that.set(key, msg[key]);
                }
            });

            lz.server.on("onUnionDismiss", function (data) {
                cc.log("onUnionDismiss");
                cc.log(data);
                that._id = null;
            });

            if (data.code == 200) {
                cc.log("Union getUnion success");

                var msg = data.msg.union;
                for (var key in msg) {
                    that.set(key, msg[key]);
                }

                cb();
            } else if (data.code == 400) {
                cc.log("Union getUnion: not join");
                that._id = -1;
                cb();
            } else {
                cc.log("Union getUnion fail");

                that.sync();
            }
        }, true);
    },

    update: function (data) {
        this.set("id", data.id);
        this.set("name", data.name);
        this.set("lv", data.lv);
        this.set("notice", data.notice);
        this.set("count", data.count);
        this.set("maxCount", data.maxCount);
        this.set("created", data.created);
        this.set("ability", data.ability);
        this.set("memberList", data.memberList);
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

                var msg = data.msg.union;
                for (var key in msg) {
                    that.set(key, msg[key]);
                }

                cb(true);
            } else {
                TipLayer.tip(data.msg);
                cb(false);
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
                var unions = data.msg.unions || [];
                if (unions.length == 0) {
                    TipLayer.tip("未找到对应的公会");
                }
                cb(unions);
            } else {
                TipLayer.tip(data.msg);
                cb();
            }
        });
    },

    unionList: function (cb) {
        cc.log("Union unionList");

        var that = this;
        lz.server.request("area.unionHandler.unionList", {

        }, function (data) {
            cc.log(data);
            if (data.code == 200) {
                cb(data.msg.unionList)
            } else {
                TipLayer.tip(data.msg);
                cb();
            }
        });
    },

    getMemberList: function (cb, id) {
        var that = this;
        lz.server.request("area.unionHandler.getMemberList", {
            unionId: id
        }, function (data) {
            cc.log(data);
            if (data.code == 200) {
                cb(data.msg.memberList)
            } else {
                TipLayer.tip(data.msg);
                cb();
            }
        });
    },

    unionRequest: function (cb, id) {
        cc.log("Union unionRequest");

        var that = this;
        lz.server.request("area.unionHandler.unionRequest", {
            unionId: id
        }, function (data) {
            cc.log(data);
            if (data.code == 200) {
                TipLayer.tip("申请成功");
                cb(true);
            } else {
                TipLayer.tip(data.msg);
                cb(false);
            }
        });
    },

    unionCancel: function (cb, id) {
        cc.log("Union unionCancel");

        var that = this;
        lz.server.request("area.unionHandler.unionCancel", {
            requestId: id
        }, function (data) {
            cc.log(data);
            if (data.code == 200) {
                cb();
            } else {
                TipLayer.tip(data.msg);
                cb();
            }
        });
    },

    requestList: function (cb) {
        cc.log("Union requestList");

        var that = this;
        lz.server.request("area.unionHandler.requestList", {
            unionId: this._id
        }, function (data) {
            cc.log(data);
            if (data.code == 200) {
                cb(data.msg.requestList);
            } else {
                TipLayer.tip(data.msg);
                cb();
            }
        });
    },

    unionApprove: function (cb, id) {
        cc.log("Union unionApprove");

        var that = this;
        lz.server.request("area.unionHandler.requestApprove", {
            requestId: id
        }, function (data) {
            cc.log(data);
            if (data.code == 200) {
                that._memberList.push(data.msg.member);
                that.update({
                    count: data.msg.unionCount
                });
                cb(data.msg.requestList);
            } else {
                TipLayer.tip(data.msg);
                cb();
            }
        });
    },

    unionRefuse: function (cb, id) {
        cc.log("Union unionRefuse");

        var that = this;
        lz.server.request("area.unionHandler.requestRefuse", {
            requestId: id
        }, function (data) {
            cc.log(data);
            if (data.code == 200) {
                cb(data.msg.requestList);
            } else {
                TipLayer.tip(data.msg);
                cb();
            }
        });
    },

    unionQuit: function (cb) {
        cc.log("Union unionQuit");

        var that = this;
        lz.server.request("area.unionHandler.unionQuit", {
            unionId: this._id
        }, function (data) {
            cc.log(data);
            if (data.code == 200) {
                TipLayer.tip("退出公会成功");
                that._id = null;
                cb(true);
            } else {
                TipLayer.tip(data.msg);
                cb(false);
            }
        });
    },

    unionDismiss: function (cb) {
        var that = this;
        lz.server.request("area.unionHandler.unionDismiss", {
            unionId: this._id
        }, function (data) {
            cc.log(data);
            if (data.code == 200) {
                TipLayer.tip("解散公会成功");
                that._id = null;
                cb(true);
            } else {
                TipLayer.tip(data.msg);
                cb(false);
            }
        });
    },

    unionUpdate: function (cb, notice) {
        cc.log("Union unionList");

        var that = this;
        lz.server.request("area.unionHandler.unionUpdate", {
            notice: notice
        }, function (data) {
            cc.log(data);
            if (data.code == 200) {
                TipLayer.tip("更新成功");
                cb(true);
            } else {
                TipLayer.tip(data.msg);
                cb(false);
            }
        });
    },

    getTree: function (cb) {
        cc.log("Union getTree");

        var that = this;
        lz.server.request("area.unionTreeHandler.getTree", {
            treeId: this._tree.id
        }, function (data) {
            cc.log(data);
            if (data.code == 200) {
                cb(data.msg.tree);
            } else {
                TipLayer.tip(data.msg);
            }
        });
    },

    watering: function (cb) {
        cc.log("Union watering");

        var that = this;
        lz.server.request("area.unionTreeHandler.watering", {
            treeId: this._tree.id
        }, function (data) {
            cc.log(data);
            if (data.code == 200) {
                var rewards = data.msg.rewards;

                for (var key in rewards) {
                    gameData.player.add(key, rewards[key]);
                }

                lz.tipReward(rewards);

                cb(data.msg.tree);
            } else {
                TipLayer.tip(data.msg);
            }
        });
    },

    removeWaterCd: function (cb) {
        cc.log("Union removeWaterCd");

        var that = this;
        lz.server.request("area.unionTreeHandler.removeWaterCd", {
        }, function (data) {
            cc.log(data);
            if (data.code == 200) {
                cb(data.msg.waterCd);
            } else {
                TipLayer.tip(data.msg);
            }
        });
    },

    _changeRole: function (id, role) {
        var len = this._memberList.length;
        for (var i = 0; i < len; i++) {
            var player = this._memberList[i];
            if (player.playerId == id) {
                player.role = role;
                break;
            }
        }
    },

    addElder: function (cb, id) {
        cc.log("Union addElder: " + id);

        var that = this;
        lz.server.request("area.unionHandler.addElder", {
            targetId: id
        }, function (data) {
            cc.log(data);
            if (data.code == 200) {
                that._changeRole(id, TYPE_UNION_ELDERS);
                TipLayer.tip("设置成功");
                cb();
            } else {
                TipLayer.tip(data.msg);
            }
        });
    },

    removeElder: function (cb, id) {
        cc.log("Union removeElder: " + id);

        var that = this;
        lz.server.request("area.unionHandler.removeElder", {
            targetId: id
        }, function (data) {
            cc.log(data);
            if (data.code == 200) {
                that._changeRole(id, TYPE_UNION_MEMBER);
                TipLayer.tip("取消成功");
                cb();
            } else {
                TipLayer.tip(data.msg);
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
