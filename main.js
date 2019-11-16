/**
 * http://usejsdoc.org/
 */
var express = require("express");
var mysql = require("mysql");
var bodyparser = require("body-parser");

var app = express();
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
var con = mysql.createConnection({
	host:"localhost",
	user:"me",
	password:"admin"
});
con.connect(function(err){if(err){throw err;}});
//app.get('/',function(req, res){res.send("Hello, World!");});
app.get('/api/customers', function(req, res, next){
	//var name = req.query('name');
	con.query("SELECT id, name FROM customers WHERE name LIKE" + req.query.name, function(err, result, fields){
		if(result.rows === 0){
			res.statusCode = 404;
			return res.json({errors:"Not Found"});
		}
		if(err){
			res.statusCode = 500;
			return res.json({errors:"Server Error"});
		}
		res.json(result);
	});
});
app.get('/api/customers/:id', function(req, res, next){
	//var name = req.query('name');
	con.query("SELECT * FROM customers WHERE id=" + req.param.id, function(err, result, fields){
		if(result.rows === 0){
			res.statusCode = 404;
			return res.json({errors:"Not Found"});
		}
		if(err){
			res.statusCode = 500;
			return res.json({errors:"Server Error"});
		}
		res.json(result);
	});
});
app.get('/api/orders/:customerid', function(req, res, next){
	con.query("SELECT number, date FROM orders WHERE customer=" + req.param.customerid, function(err, result, fields){
		if(result.rows === 0){
			res.statusCode = 404;
			return res.json({errors:"Not Found"});
		}
		if(err){
			res.statusCode = 500;
			return res.json({errors:"Server Error"});
		}
		res.json(result);
	});
});
app.get('/api/orders/:id', function(req, res, next){
	con.query("SELECT * FROM orders WHERE id=" + req.param.id, function(err, result, fields){
		if(result.rows === 0){
			res.statusCode = 404;
			return res.json({errors:"Not Found"});
		}
		if(err){
			res.statusCode = 500;
			return res.json({errors:"Server Error"});
		}
		res.json(result);
	});
});
app.get('/api/items/:orderid', function(req, res, next){
	con.query("SELECT number, name FROM items WHERE order=" + req.param.orderid, function(err, result, fields){
		if(result.rows === 0){
			res.statusCode = 404;
			return res.json({errors:"Not Found"});
		}
		if(err){
			res.statusCode = 500;
			return res.json({errors:"Server Error"});
		}
		res.json(result);
	});
});
app.get('/api/items/id/:id', function(req, res, next){
	con.query("SELECT * FROM items WHERE id=" + req.query.name, function(err, result, fields){
		if(result.rows === 0){
			res.statusCode = 404;
			return res.json({errors:"Not Found"});
		}
		if(err){
			res.statusCode = 500;
			return res.json({errors:"Server Error"});
		}
		res.json(result);
	});
});
app.post('api/customers', function(req, res, next){
	var data = [req.body.name, req.body.phone, req.body.email];
	con.query("INSERT INTO customers (name, phone, email) VALUES ($1, $2, $3) RETURNING id", data, function(err, result){
		res.json(result.rows[0].id);
	});
});
app.post('api/customers/:customerid/orders', function(req, res, next){
	var data = [req.param.customerid, req.body.date];
	con.query("INSERT INTO orders (customer, date) VALUES ($1, $2) RETURNING id", data, function(err, result){
		res.json(result.rows[0].id);
	});
});
app.post('api/customers/:orderid/items', function(req, res, next){
	var data = [req.param.orderid, req.body.type, req.body.description];
	con.query("INSERT INTO orders (order, type, description) VALUES ($1, $2, $3) RETURNING id", data, function(err, result){
		res.json(result.rows[0].id);
	});
});
app.put('api/customers/:id', function(req, res, next){
	if(req.body.name){
		con.query("UPDATE customers SET name=($1) WHERE id=($2)", [req.body.name, req.param.id], function(err, result){});
	}
	if(req.body.phone){
		con.query("UPDATE customers SET phone=($1) WHERE id=($2)", [req.body.phone, req.param.id], function(err, result){});
	}
	if(req.body.email){
		con.query("UPDATE customers SET email=($1) WHERE id=($2)", [req.body.email, req.param.id], function(err, result){});
	}
});
app.put('api/orders/:id', function(req, res, next){
	if(req.body.date){
		con.query("UPDATE orders SET date=($1) WHERE id=($2)", [req.body.date, req.param.id], function(err, result){});
	}
});
app.put('api/items/:id', function(req, res, next){
	if(req.body.type){
		con.query("UPDATE items SET type=($1) WHERE id=($2)", [req.body.type, req.param.id], function(err, result){});
	}
	if(req.body.description){
		con.query("UPDATE items SET description=($1) WHERE id=($2)", [req.body.description, req.param.id], function(err, result){});
	}
});
app.delete('api/customers/:id', function(req, res, next){
	con.query("DELETE FROM customers WHERE id=($1)", [req.param.id], function(err, result){});
});
app.delete('api/orders/:id', function(req, res, next){
	con.query("DELETE FROM orders WHERE id=($1)", [req.param.id], function(err, result){});
});
app.delete('api/items/:id', function(req, res, next){
	con.query("DELETE FROM items WHERE id=($1)", [req.param.id], function(err, result){});
});
app.listen(3000, function(){console.log("Listening on port 3000");});
