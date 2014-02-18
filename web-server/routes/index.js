/*
 * GET home page.
 */

var fs = require('fs');
var path = require('path');
var auth = require('../util/auth');
var updateRecordDao = require('../util/updateRecordDao');

exports.index = function(req, res) {
  updateRecordDao.versionCounts(function(err, counts) {
    res.render('index', {
      title: 'LeasureGame',
      counts: counts || []
    });
  });
};

exports.login = function(req, res) {
  res.render('login', {
    title: '登陆'
  });
};

exports.doLogin = function(req, res, next) {
  // 校验
  req.assert('username', "用户名不能为空").notEmpty();
  req.assert('password', "密码不能为空").notEmpty();
  var errors = req.validationErrors();
  if (errors && errors.length > 0) {
    var ermsg = [];
    for (var i = 0; i < errors.length; i++) {
      ermsg.push(errors[i].msg);
    }
    var json = {
      title: '管理后台-- 请先登录',
      error: ermsg.join("\n")
    };
    res.render('/login', json);
    return;
  }
  var userid = req.body.username;
  var pwd = req.body.password;
  auth.checkUser(userid, pwd, function(err, user) {
    if ( !! err) {
      var json = {
        title: '管理后台-- 请先登录',
        error: err
      };
      res.render('/login', json);
    } else {
      req.session.user_id = user.user_id;
      req.session.user = user;
      res.redirect("/");
    }

  });
};

exports.doLogout = function(req, res, next) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};