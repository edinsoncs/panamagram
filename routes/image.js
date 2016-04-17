var express = require('express');
var router = express.Router();
var fs = require('fs');
var url = require('url');
var multipart = require('connect-multiparty');
var path = require('path');
var im = require('imagemagick');
var easyimg = require('easyimage');
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
			var insertResize = 'resizes/' + nameImagen;
			var insertIMG = 'imagenes/' + nameImagen;
			//console.log(directorio);

			fs.writeFile(directorio, data, function(err){

				easyimg.info(directorio).then(
				  function(file) {
				    console.log(file);
				  }, function (err) {
				    console.log('hubo un error' + err);
				  }
				);

				easyimg.rescrop({
				     src:directorio, dst:resizes,
				     width:500, height:500,
				     x:0, y:0
				  }).then(
				  function(image) {
				     console.log('Resized and cropped: ' + image.width + ' x ' + image.height);
				  },
				  function (err) {
				    console.log(err);
				  }
				);

				
				if(err) {
					console.log(err);
				}
				else {

					basededatos.insert({
						'Nombre': nameImagen,
						'Url': insertIMG,
						'Resizes': insertResize,
						'Fecha': new Date()
					}).success(function(doc){
						res.redirect('http://panagram.xyz/shared.html?id=' + doc._id);
					}).error(function(err){
						console.log(err);
					});
				}
			});
		}
	});

});



module.exports = router;