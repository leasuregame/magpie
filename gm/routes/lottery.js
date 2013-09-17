/**
 * Created with JetBrains WebStorm.
 * User: lujunyu
 * Date: 13-9-13
 * Time: 下午5:48
 * To change this template use File | Settings | File Templates.
 */


var Url = require('url');

var lottery = function(app) {

    app.get('/lottery',function(req,res){
        res.render('lottery',{
            user:req.session.user,
            success:req.flash('success').toString(),
            error:req.flash('error').toString()
        });
    });

    app.post('/lottery',function(req,res){

    });

};

module.exports = lottery;