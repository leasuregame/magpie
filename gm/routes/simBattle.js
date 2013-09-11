/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-9-10
 * Time: 下午5:06
 * To change this template use File | Settings | File Templates.
 */

var Url = require('url');
var Battle = require('../models/battle');

var simBattle = function (app) {

    app.get('/simBattle', function (req, res) {
        res.render('simBattle',{
            user:req.session.user,
            success:req.flash('success').toString(),
            error:req.flash('error').toString()
        });
    });

    app.post('/simBattle',function (req,res){
        var url = Url.parse(req.url,true);
        var query = url.query;
        var attack = JSON.parse(query['attack']);
        var defend = JSON.parse(query['defend']);
        var times = parseInt(query['times']);
       // console.log(Battle);
        //console.log(times);
        Battle.startBattle(attack,defend,times,function(err,report){
            console.log(report)
            res.send({type:'success',info:report});
        });

        //console.log(attack);
        //console.log(defend);

    });

};

module.exports = simBattle;