
var db = require('./db.js');
var dbSelect = "SELECT * FROM users WHERE name = ?";
var dbInsert = "INSERT INTO users (name , password , isRoot) VALUES (?,?,?)";

function User(user) {
    this.name = user.name;
    this.password = user.password;
    this.isRoot = user.isRoot;
};


User.prototype.save = function(cb) {

    var user = {
        name:this.name,
        password:this.password,
        isRoot:0
    };
    console.log(db);
    db.run(dbInsert,user.name,user.password,user.isRoot,function(err,user){
        if(err) {
            console.log(err);
            return cb(err);
        }
       // db.close();
        cb(err,user);
    });

};

User.get = function get(username,cb) {

    db.get(dbSelect,username,function(err,row){
           var user;

           if(err) {
              console.log(err);
          //    db.close();
              return cb(err);
           }
           if(row) {
               user = new User(row);
           }else {
               user = null;
           }
       // db.close();
       // console.log(user);
        cb(err,user);

    });
};

module.exports = User;
