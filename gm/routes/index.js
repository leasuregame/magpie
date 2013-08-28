
/*
 * GET home page.
 */

var User =  require('../models/user');

var player = require('./player');

var routes = function(app){

    app.get('/',function(req , res){
        res.render('index',{
            title:'主页',
            user: req.session.user,
            success:req.flash('success').toString(),
            error:req.flash('error').toString()
        });
    });

    //登录
    app.get('/login',function(req , res){
        res.render('login',{
            title:'登录',
            user:req.session.user,
            success:req.flash('success').toString(),
            error:req.flash('error').toString()
        });
        //res.render('login');
    });

    app.post('/login',function(req , res){

        var name = req.body.username;
        var password = req.body.password;
        if(name == '' || password == '') {
            req.flash('error','用户名和密码都不能为空');
            return res.redirect('/login');
        }

        User.get(name,function(err,user){
            if(!user) {
                req.flash('error','用户不存在');
                return res.redirect('/login');
            }

            if(user.password != password){
                req.flash('error','密码错误');
                return res.redirect('/login');
            }
            req.session.user = user;
            req.flash('success','登录成功');
            res.redirect('/');
        });
    });

    app.get('/reg',checkIsRootLogin);

    //添加用户
    app.get('/reg',function(req , res){

        res.render('reg',{
            title:'添加用户',
            user:req.session.user,
            success:req.flash('success').toString(),
            error:req.flash('error').toString()
        });
    });

    app.post('/reg',function(req , res){
        var name = req.body.username;
        var password = req.body.password;

        if(name == '' || password == '') {
            req.flash('error','用户名和密码都不能为空');
            return res.redirect('/reg');
        }

        User.get(name,function(err,user){
            if(user) {
                req.flash('error','用户已经存在');
                return res.redirect('/reg');
            } else {
                var newUser = new User({
                    name: name,
                    password: password,
                    isRoot:0
                });
                newUser.save(function(err){
                    if(err) {
                        req.flash('error',err);
                        return res.redirect('/reg');
                    }
                    req.flash('success','注册成功');
                    res.redirect('/');
                });
            }
        });

    });

    player(app);
    /*
    app.get('/player',checkLogin);

    //玩家数据修改
    app.get('/player',function(req , res){


        Area.getAreasList(function(areas) {
            res.render('player',{
                title : '玩家数据修改',
                user : req.session.user,
                areas:areas,
                success:req.flash('success').toString(),
                error:req.flash('error').toString()
            });
        });


    });

    app.post('/player',function(req , res){
        var playerName = req.body.playerName;
        var areaId = req.body.areaId;
        var player = {
            name : playerName,
            areaId : areaId
        }



        Player.getPlayerInfo(player,function(err,player){
            if(err) {
                console.log(err);
                return res.redirect('/player');
            }else {
                console.log(player);
                res.redirect('/playerData');
            }
        });
        //   req.flash('success', '通过');

    });

    app.get('/playerData',checkLogin);


    app.get('/playerData',function(req ,res){

        res.render('playerData',{
            title : '玩家数据修改',
            user : req.session.user,
            success:req.flash('success').toString(),
            error:req.flash('error').toString()
        });
    });

    app.post('/playerData',function(req , res){

    });
    */
    app.get('/reward',checkLogin);

    //全服、个人补偿奖赏
    app.get('/reward',function(req , res){
        res.render('reward',{
            title : '补偿奖赏',
            user : req.session.user,
            success:req.flash('success').toString(),
            error:req.flash('error').toString()
        });
    });

    app.post('/reward',function(req , res){

    });

    app.get('/dataTest',checkLogin);

    //数值平衡模拟测试
    app.get('/dataTest',function(req , res){
        res.render('dataTest',{
            title : '数值平衡测试',
            user : req.session.user,
            success:req.flash('success').toString(),
            error:req.flash('error').toString()
        });
    });
    app.post('/dataTest',function(req , res){

    });

    function checkLogin(req, res, next){
        if(!req.session.user){
            req.flash('error','请先登录');
            return res.redirect('/login');
        }
        next();
    }

    function checkNotLogin(req,res,next){
        if(req.session.user){
            req.flash('error','已登录');
            return res.redirect('/');
        }
        next();
    }

    function checkIsRootLogin(req,res,next){
        if(!req.session.user || req.session.user.isRoot != 1){
            req.flash('error','请先用root账号登录');
            return res.redirect('/login');
        }
        next();
    }
};

module.exports = routes;