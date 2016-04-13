var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next){
	var db = req.db;
	var imagen = db.get('imagendata');

	imagen.find({}, function(err, doc){
		var data = doc.reverse();
		res.json(data);
	})

});


module.exports = router;