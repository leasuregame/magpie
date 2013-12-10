/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-10-8
 * Time: 上午11:37
 * To change this template use File | Settings | File Templates.
 */

var GameUser = require('../models/gameUser');
var table = require('../models/manager/table');


var buyVip = function(app) {

    app.get('/buyVip',function(req,res){
        if(!req.session.player) {
            res.redirect('/playerLogin?target=buyVip');
        } else {
            var player = req.session.player;
            var env = app.settings.env;
            GameUser.getUserByAccount(env,player.userId,player.areaId,function(err,user){
                if(!err) {
                    var recharge = table.getTable("recharge");
                    console.log(recharge._data);

                    res.render('buyVip', {
                        user: req.session.user,
                        gameUser:user,
                        recharge: recharge._data,
                        player : req.session.player,
                        area : req.session.area,
                        success: req.flash('success').toString(),
                        error: req.flash('error').toString()
                    });
                }
            });
        }
    });

};

module.exports = buyVip;
