exports.checkUser = function(username, password, cb) {
  if (username == 'admin' && password == 'leasuregame405:11') {
      cb(null, {
          user_id: 1,
          user_name: 'admin',
          prvlg_lv: 1
      });
  } else if (username == 'guest' && password == 'erusael<>183') {
      cb(null, {
          user_id: 1,
          user_name: 'guest',
          prvlg_lv: 2
      });
  } else {
    cb('用户名或密码不正确');
  }
};