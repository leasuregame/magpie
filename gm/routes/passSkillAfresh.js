/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-9-14
 * Time: 下午4:59
 * To change this template use File | Settings | File Templates.
 */

var Url = require("url");
var PassSkillAfresh = require('../models/passSkillAfresh');

var passSkillAfresh = function (app) {

    app.get('/passSkillAfresh', function (req, res) {
        res.render('passSkillAfresh', {
            user:req.session.user,
            success:req.flash('success').toString(),
            error:req.flash('error').toString()
        });
    });

    app.post('/passSkillAfresh', function (req, res) {

        var url = Url.parse(req.url,true);
        var query = url.query;
        var type = query["type"];
        var times = query["times"];

        PassSkillAfresh.simulate(type,times,function(err,result){
            if(err == null) {
                res.send({type:"success",info:result});
            }
        });


    });

};

module.exports = passSkillAfresh;