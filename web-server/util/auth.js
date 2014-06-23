exports.checkUser = function(username, password, cb) {
  if (username == 'admin' && password == 'leasuregame405:11') {
      cb(null, {
          user_id: 1,
          user_name: 'admin',
          prvlg_lv: 1
      });
  } else if (username == 'queryer' && password == 'gameerusael:147') {
      cb(null, {
          user_id: 1,
          user_name: 'queryer',
          prvlg_lv: 2
      });
  } else {
    cb('用户名或密码不正确');
  }
};