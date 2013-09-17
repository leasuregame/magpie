/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-9-13
<<<<<<< HEAD
 * Time: 下午5:48
 * To change this template use File | Settings | File Templates.
 */




var Url = require('url');
var Lottery = require('../models/lottery');

var lottery = function(app){

    app.get('/lottery',function(req,res){

        res.render('lottery',{
            user:req.session.user,
            success:req.flash('success').toString(),
            error:req.flash('error').toString()
        });
    });

    app.post('/lottery',function(req,res){


        var url = Url.parse(req.url,true);
        var query = url.query;
        var level = query["level"];
        var type = query["type"];
        var times = query["times"];

        Lottery.simulate(level,type,times,function(err,result){
            console.log(result);
            res.send({type:'success',info:result});
        });
    });

};

module.exports = lottery;

