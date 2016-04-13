var express = require('express');
var app = express();

var mongo = require('mongodb');

var monk = require('monk');
var db = monk('localhost:27017/panamagram');

var home = require('./routes/home');
var postimg = require('./routes/image');
var api = require('./routes/api');
var fotounica = require('./routes/fotos');


app.use(function(req, res, next){
	req.db = db;
	console.log('conectamos a la bd');
	next();
});


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
  next();
});

app.use('/', home);
app.use('/imagen', postimg);

app.use('/api', api);
app.use('/fotos', fotounica);




function puerto() {
	return 3000
}
app.listen(puerto(), function(){
	console.log('corriendo servidor: ' + puerto());
});
