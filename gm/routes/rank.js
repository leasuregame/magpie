/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-9-3
 * Time: 上午10:49
 * To change this template use File | Settings | File Templates.
 */

var Rank = require('../models/rank');
var Url = require('url');

var rank = function (app) {

    app.get("/rank", function (req, res) {
        if (req.session.player) {
            var r = {};

            Rank.getRankByPlayerId(req.session.player.id, function (err, rank) {

                if(err)
                   console.log(err);

                else {
                    r =rank;
                }

                res.render('rank', {
                    //title : '玩家数据修改',
                    user: req.session.user,
                    player: req.session.player,
                    rank : r,
                    area: req.session.area,
                    success: req.flash('success').toString(),
                    error: req.flash('error').toString()
                });

            });


        } else {
            res.redirect('/playerLogin?target=rank');
        }
    });

    app.post("/rank",function(req,res){
        var url = Url.parse(req.url,true);
        var query = url.query;
        var rank = JSON.parse(query["rank"]);

        Rank.updateRank(rank,function(err,isOK){
            if(err) {
                res.send({type:'fail',info:'修改排名失败'});

            }else {
                res.send({type:'success',info:"修改排名成功"});
            }
        });

    });


};

module.exports = rank;
