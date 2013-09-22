/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-9-16
 * Time: 上午11:25
 * To change this template use File | Settings | File Templates.
 */

var Url = require('url');
var dbClient = require('../models/dao/mysql/mysql');
var Explore = require('../models/explore');

var explore = function (app) {


    app.get('/explore', function (req, res) {

        if(!req.session.player) {
            res.redirect('/playerLogin?target=explore');
        }
        else {
            var player = req.session.player;
            var env = app.settings.env;
            Explore.getUserByAccount(env,player.userId,player.areaId,function(err,user){
                if(!err) {
                    res.render('explore', {
                        user: req.session.user,
                       // areas: areas,
                        gameUser:user,
                        player : req.session.player,
                        area : req.session.area,
                        success: req.flash('success').toString(),
                        error: req.flash('error').toString()
                    });
                }
            });
        }

    });


    app.post('/explore', function (req, res) {

        var url = Url.parse(req.url, true);
        var query = url.query;
        var areaId = query["areaId"];
        var playerId = query["playerId"];
        var task = query["task"];

        var env = app.settings.env;
        //var db = getDB(areaId,env);
        //dbClient.init(db);

        // var passNum = query["passNum"];
        Explore.simulate(env, areaId, playerId,task, function (err, result) {
            if (err) {
                res.send({type: "error", info: err});
            }
            console.log(result);
            res.send({type: "success", info: result});
        });
    });

    app.post('/exploreDelCards', function (req, res) {
        var url = Url.parse(req.url, true);
        var query = url.query;
        var playerId = query["playerId"];
        Explore.delCards(playerId, function (err, isOk) {
            if (err) {
                console.log(err);
            } else {
                res.send("success");
            }
        })

    });


};

module.exports = explore;
