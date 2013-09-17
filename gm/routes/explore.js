/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-9-16
 * Time: 上午11:25
 * To change this template use File | Settings | File Templates.
 */

var Url = require('url');
var Area = require('../models/area');
var getDB = require('../models/getDatabase');
var dbClient = require('../models/dao/mysql/mysql');
var Explore = require('../models/explore');

var explore = function(app) {

    Area.getAreasList(function(areas) {
        app.get('/explore',function(req,res){
            res.render('explore',{
                user:req.session.user,
                areas:areas,
                success:req.flash('success').toString(),
                error:req.flash('error').toString()
            });
        });
    });

    app.post('/explore',function(req,res){

        var url = Url.parse(req.url,true);
        var query = url.query;
        var areaId = query["areaId"];
        var player = query["player"];

        var env = app.settings.env;
        //var db = getDB(areaId,env);
        //dbClient.init(db);

       // var passNum = query["passNum"];
        Explore.simulate(env,areaId,player,function(err,result){
            if(err) {
                res.send({type:"error",info:err});
            }
            console.log(result);
            res.send({type:"success",info:result});
        });
    });


};

module.exports = explore;
