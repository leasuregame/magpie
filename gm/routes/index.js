/*
 * GET home page.
 */

var Url = require('url');
var User = require('../models/user');
var player = require('./player');
var card = require('./card');
var rank = require('./rank');
var simBattle = require('./simBattle');
var lottery = require('./lottery');
var passSkillAfresh = require('./passSkillAfresh');
var explore = require('./explore');
var Area = require('../models/area');

var buyVip = require('./buyVip');
var testVip = require('./testVip');
var msgPush = require('./msgPush');
var reward = require('./reward');

var logger = require('../logger').logger('user');

var routes = function(app) {

    app.get('/', function(req, res) {

        res.render('index', {
            title: '主页',
            user: req.session.user,
            playerId: req.session.playerId,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    //登录
    app.get('/login', function(req, res) {
        res.render('login', {
            title: '登录',
            user: req.session.user,
            playerId: req.session.playerId,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    app.post('/login', function(req, res) {

        var url = Url.parse(req.url, true);
        var query = url.query;

        var name = req.body.username;
        var password = req.body.password;

        if (name == '' || password == '') {
            req.flash('error', '用户名和密码都不能为空');
            return res.redirect('/login');
        }

        User.get(name, function(err, user) {
            if (!user) {
                req.flash('error', '用户不存在');
                logger.error("[login]" + name + "不存在");
                //res.send({type: 'error', info: '用户不存在'});
                return res.redirect('/login');
            } else if (user.password != password) {
                req.flash('error', '密码错误');
                logger.error("[login]" + user.name + ":密码错误,正确密码" + user.password + " 输入密码" + password);
                //res.send({type: 'error', info: '密码错误'});
                return res.redirect('/login');
            } else {
                req.session.user = user;
                req.flash('success', '登录成功');
                //res.send({type: 'success', info: '登录成功'});
                logger.info("[login]" + user.name + ":登录成功");
                return res.redirect('/playerLogin');
            }
        });
    });

    app.get('/reg', checkIsRootLogin);

    //添加用户
    app.get('/reg', function(req, res) {

        res.render('reg', {
            title: '添加用户',
            user: req.session.user,
            playerId: req.session.playerId,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });

    app.post('/reg', function(req, res) {
        var name = req.body.username;
        var password = req.body.password;

        if (name == '' || password == '') {
            req.flash('error', '用户名和密码都不能为空');
            return res.redirect('/reg');
        }

        User.get(name, function(err, user) {
            if (user) {
                req.flash('error', '用户已经存在');
                return res.redirect('/reg');
            } else {
                var newUser = new User({
                    name: name,
                    password: password,
                    isRoot: 0
                });
                newUser.save(function(err) {
                    if (err) {
                        req.flash('error', err);
                        return res.redirect('/reg');
                    }
                    req.flash('success', '注册成功');
                    logger.info("[reg]" + JSON.stringify(newUser) + "注册成功");
                    res.redirect('/');
                });
            }
        });

    });

    /*
    注册其他模块路由
     */
    player(app);
    card(app);
    rank(app);
    simBattle(app);
    lottery(app);

    passSkillAfresh(app);
    explore(app);
    buyVip(app);
    testVip(app);
    msgPush(app);
    reward(app);

    app.get('/dataTest', checkLogin);

    //数值平衡模拟测试
    app.get('/dataTest', function(req, res) {
        res.render('dataTest', {
            title: '数值平衡测试',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    app.post('/dataTest', function(req, res) {

    });

    function checkLogin(req, res, next) {
        if (!req.session.user) {
            req.flash('error', '请先登录');
            return res.redirect('/login');
        }
        next();
    }

    function checkNotLogin(req, res, next) {
        if (req.session.user) {
            req.flash('error', '已登录');
            return res.redirect('/');
        }
        next();
    }

    function checkIsRootLogin(req, res, next) {
        if (!req.session.user || req.session.user.isRoot != 1) {
            req.flash('error', '请先用root账号登录');
            return res.redirect('/login');
        }
        next();
    }
};

module.exports = routes;