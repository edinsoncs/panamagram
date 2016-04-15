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
			var directorio = path.join(__dirname, '..', 'public', 'imagenes/' + nameImagen);
			var insertIMG = 'imagenes/' + nameImagen;
			console.log(directorio);
			require('lwip').open(data, function(err, image){


				image.batch()
				    .scale(0)          // scale to 75%
				    .rotate(0)  // rotate 45degs clockwise (white fill)
				    .crop(500, 500)       // crop a 200X200 square from center              // Gaussian blur with SD=5
				    .writeFile(nameImagen, function(err){
				      // check err...
				      // done.
				      console.log(image);

				      fs.writeFile(directorio, image, function(err){
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

				    });

				
				

			});
		}
	});

});



module.exports = router;