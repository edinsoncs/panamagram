var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next){
	var db = req.db;
	var collection = db.get('imagendata');
	collection.find({}, function(err, doc){
		var uploadIMG = doc.reverse();
		res.json(uploadIMG);
	});
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