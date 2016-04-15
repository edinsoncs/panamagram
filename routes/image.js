var express = require('express');
var router = express.Router();
var fs = require('fs');
var url = require('url');
var multipart = require('connect-multiparty');
var path = require('path');
var im = require('imagemagick');
var multipartMiddleware = multipart();




router.post('/', multipartMiddleware, function(req, res, next){
	var imagen = req.files.imagen;
	
	var db = req.db;

	var basededatos = db.get('imagendata');

					

	fs.readFile(req.files.imagen.path, function(err, data){
		var nameImagen = req.files.imagen.name;

		if(err){
			console.log(err);
		}
		else {

			


			var directorio = path.join(__dirname, '..', 'public', 'imagenes/' + nameImagen);
			var resizes = path.join(__dirname, '..', 'public', 'resizes/' + nameImagen);
			var insertIMG = 'imagenes/' + nameImagen;
			console.log(directorio);

			fs.writeFile(directorio, data, function(err){
				
				im.resize({

				srcPath: directorio,

				dstPath: resizes,

				width: 200

				}, function(err, stdout, stderr){

				if (err) throw err;

				console.log('resized image to fit within 200x200px');

				});


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