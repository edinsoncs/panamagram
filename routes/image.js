var express = require('express');
var router = express.Router();
var fs = require('fs');
var url = require('url');
var multipart = require('connect-multiparty');
var path = require('path');

var multipartMiddleware = multipart();



router.post('/', multipartMiddleware, function(req, res, next){
	var imagen = req.files.imagen;
	console.log(imagen);

	var db = req.db;

	var basededatos = db.get('imagendata');

	fs.readFile(req.files.imagen.path, function(err, data){
		var nameImagen = req.files.imagen.name;

		if(err){
			console.log(err);
		}
		else {
			var directorio = path.join(__dirname, '..', 'public', 'imagenes'+ nameImagen;) 

			console.log(directorio);
			fs.writeFile(directorio, data, function(err){
				if(err) {
					console.log(err);
				}
				else {
					console.log(data);
					basededatos.insert({
						'Nombre': nameImagen,
						'Url': directorio,
						'Fecha': new Date()
					}).success(function(doc){
						res.redirect('http://somostodospanama.com/app/verfotos.html?id=' + doc._id);
					}).error(function(err){
						console.log(err);
					});
				}
			});
		}
	});

});



module.exports = router;