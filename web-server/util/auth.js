exports.checkUser = function(username, password, cb) {
  if (username == 'admin' && password == 'leasuregame405:11') {
    cb(null, {
      user_id: 1
    });
  } else {
    cb('用户名或密码不正确');
  }
};