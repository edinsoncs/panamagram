var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next){
	res.json('hola','edinson');
});

router.get('/:idfoto', function(req, res, next){

	var id = req.params.idfoto;

	var db = req.db;
	var collection = db.get('imagendata');

	collection.findOne({'_id': id}, function(err, doc){
		res.json(doc);
	});

});


module.exports = router;