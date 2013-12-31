exports.checkUser = function(username, password, cb) {
  if (username == 'admin' && password == '123456') {
    cb(null, {
      user_id: 1
    });
  } else {
    cb('用户名或密码不正确');
  }
};