var express = require('express');
var router = express.Router();
var fs = require('fs');
var url = require('url');
var multipart = require('connect-multiparty');
var path = require('path');

var multipartMiddleware = multipart();




router.post('/', multipartMiddleware, function(req, res, next){
	var imagen = req.files.imagen;
	var im = require('imagemagick');
	var db = req.db;

	var basededatos = db.get('imagendata');

	im.convert([req.files.imagen.path, '-resize', '400x350', req.files.imagen.name], 
					function(err, stdout){
					  if (err) throw err;
					  console.log('stdout:', stdout);
	});
					

	fs.readFile(req.files.imagen.path, function(err, data){
		var nameImagen = req.files.imagen.name;

		if(err){
			console.log(err);
		}
		else {

			


			var directorio = path.join(__dirname, '..', 'public', 'imagenes/' + nameImagen);
			var insertIMG = 'imagenes/' + nameImagen;
			console.log(directorio);

			fs.writeFile(directorio, data, function(err){
				if(err) {
					console.log(err);
				}
				else {
					



					basededatos.insert({
						'Nombre': nameImagen,
						'Url': insertIMG,
						'Fecha': new Date()
					}).success(function(doc){
						res.redirect('http://somostodospanama.com/app/demo2/shared.html?id=' + doc._id);
					}).error(function(err){
						console.log(err);
					});
				}
			});
		}
	});

});



module.exports = router;