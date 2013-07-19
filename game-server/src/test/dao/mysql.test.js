require('./setup');
app = require("pomelo").app;
var dao = app.get('dao');
var should = require("should");
var Card = require("../../app/domain/card");

var mysql = require('mysql');
var queues = require('mysql-queues');

describe("Mysql execute multiple statements in transaction", function () {
	it("transaction should works fine", function(){

		var connection = mysql.createConnection({
		    host : '127.0.0.1',
		    port : 3306,
		    user : 'dev',
		    password : '1',
		    database : 'magpie',
		    charset : 'UTF8_GENERAL_CI',
		    debug : false
		});

		connection.connect();

		var queues = require('mysql-queues');
		var DEBUG = true;
		queues(connection, DEBUG);

		var q = connection.createQueue();
		q.query("INSERT INTO battleLog (id, createTime, enemy, own, battleLog) values (?,?,?,?,?)", [1,0,1,1,'battleLog']); 
		q.query("INSERT INTO battleLog (id, createTime, enemy, own, battleLog) values (?,?,?,?,?)", [2,0,1,1,'battleLog']);
		q.execute();


		// var trans = connection.startTransaction();

		// // function error(err) {
		// //     if(err && trans.rollback) {trans.rollback(); throw err;}
		// // }
		// // trans.query("INSERT INTO battleLog (id, createTime, enemy, own, battleLog) values (?,?,?,?,?)", 
		// // 	[1,0,1,1,'battleLog'], error);
		// // // for(var i = 2; i < 5; i++)
		// // //     trans.query("INSERT INTO battleLog (id, createTime, enemy, own, battleLog) values (?,?,?,?,?)", 
		// // // 		[i,0,1,1,'battleLog'], error);
		// // trans.commit();
		// console.log('commit...');

		// trans.query("INSERT INTO battleLog (id, createTime, enemy, own, battleLog) values (?,?,?,?,?)", 
		// 	[1,0,1,1,'battleLog'], function(err, info) {
		//     if(err)
		//         trans.rollback();
		//     else
		//         trans.query("UPDATE battleLog set enemy = ? where id = ?", [2, info.insertId], function(err) {
		//             if(err)
		//                 trans.rollback();
		//             else
		//                 trans.commit();
		//         });
		// });
		// trans.execute();
	});

});