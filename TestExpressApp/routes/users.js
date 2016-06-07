var express = require('express');
var mysql = require('mysql');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res) {
	
	var connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : 's-z4U$n{f;3T.Kff',
		database : 'test'
	});
	
	connection.connect();
	
	connection.query('SELECT * FROM blah WHERE blah = 1', function (err, rows, fields) {
		if (err) throw err;
		console.log('Response: ', rows[0]);
		res.render('users', { data: rows });
	});
	
	connection.end();
});

module.exports = router;