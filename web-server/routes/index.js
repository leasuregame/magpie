/*
 * GET home page.
 */

var fs = require('fs');
var path = require('path');
var auth = require('../util/auth');
var updateRecordDao = require('../util/updateRecordDao');
var onlineUserDao = require('../util/onlineUserDao');
var async = require('async')

var convertData = function(items) {
  var list = items.map(function(item) {
    item.ct = new Date(item.ct).getHours();
    return [item.ct, item.qty];
  }).sort(function(x, y) {
    return y[0] - x[0];
  });
  list.push(['date', 'qty']);
  return list.reverse();
};

exports.index = function(req, res) {
  async.parallel([
    function(cb) {
      updateRecordDao.versionCounts(cb);
    }, 
    function(cb) {
      updateRecordDao.getUserCount(cb);
    },
    function(cb) {
      onlineUserDao.getRecords(new Date().toLocaleDateString(), cb);
    }
  ], function(err, results) {
    if (err) {
      return res.status(500).send('服务器出错'+err);
    }
    console.log('message: ', results);
    var counts = results[0][0];
    var userNum = results[1][0][0].num;
    var users = results[2][0];

    console.log(counts, userNum);
    res.render('index', {
      title: 'LeasureGame',
      userNum: userNum,
      counts: counts.map(function(c) {
        c.percent = ((c.num/userNum)*100).toFixed(1);
        return c;
      }),
      users: convertData(users)
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