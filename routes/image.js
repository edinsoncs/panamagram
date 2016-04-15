var express = require('express');
var router = express.Router();
var fs = require('fs');
var url = require('url');
var multipart = require('connect-multiparty');
var path = require('path');

var multipartMiddleware = multipart();
var easyimg = require('easyimage');



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

			fs.writeFile(directorio, data, function(err){
				if(err) {
					console.log(err);
				}
				else {
					

					easyimg.rescrop({
					     src:nameImagen, dst: __dirname + '/output/'+nameImagen,),
					     width:500, height:350,
					     cropwidth:128, cropheight:128,
					     x:0, y:0
					  }).then(
					  function(image) {
					     console.log('Funciono ' + image.width + ' x ' + image.height);
					  },
					  function (err) {
					    console.log('hubo error');
					  }
					);


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