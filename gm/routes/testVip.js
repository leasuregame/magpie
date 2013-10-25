/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-10-25
 * Time: 下午3:49
 * To change this template use File | Settings | File Templates.
 */

var Player = require('../models/player');
var Url = require('url');

var testVip = function(app) {

    app.get('/testVip',function(req,res) {
        if(!req.session.player) {
            res.redirect('/playerLogin?target=testVip');
        } else {
            var privilege = Player.getVipPrivilegeList(req.session.player.vip);
            res.render('testVip',{
                user: req.session.user,
                player : req.session.player,
                privilege: privilege,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        }
    });

    app.post('/testVip',function(req,res){
        var url = Url.parse(req.url,true);
        var query = url.query;
        var vip = query["vip"];
        var id = req.session.player.id;
        Player.updateVip(id,vip,function(err,privilege) {
            if(err) {
                res.send({type:'error',privilege:null});
            }else {
                 res.send({type:'success',privilege:privilege});
            }
        });
    });
};

module.exports = testVip;