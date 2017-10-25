
var keystone = require('keystone');
var User = keystone.list('User');
var https = require('follow-redirects').https;
var config = require('../../config');
var uuid = require('node-uuid');

module.exports.login = function(req, res) {
  	var params = req.body || {};
  	var options,
  		facebook = params.isFacebook;

	if (!params.access_token) {
		return res.status(401).json({error: "Parametros inválidos"});
	}

	if (facebook) {
		options = {
			host: config.facebook_api,
			path: '/me?access_token=' + params.access_token + '&fields=picture,name,email'
		};
  	} else {
  		options = {
			host: config.google_api,
			path: '/oauth2/v1/userinfo?alt=json&access_token=' + params.access_token,
			headers: {
     			'Authorization': 'Bearer ' + params.bearer_token
   			}
		};
  	}

	https.get(options,function(resp){
		var data = '';
		resp.on('data', function (chunk) {
			data += chunk;
		});
		resp.on('end', function() {

			var user = JSON.parse(data);
			console.log('DEBUG login data ', user);

			var result = {
				user_id: user.id,
				name: user.name || user.email,
				email: user.email || '',
				accessToken: params.access_token || '',
				loginWith: facebook ? 'facebook' : 'google'
			};

			if (facebook) {
				if (user.picture && user.picture.data) {
					result.image = user.picture.data.url
				}
			} else {
				result.image = user.picture;
			}

			console.log('DEBUG >', result);

			User.model.findOne().where('user_id', result.user_id).exec(function(err, user) {
				if (user) {
					User.model.findOneAndUpdate({user_id: result.user_id}, {accessToken: result.accessToken, image: result.image, name: result.name})
						.exec(function(err, user) {
							if (err) {
								console.log(err);
	  							res.status(500).json({error: 'Lo sentimos, ha ocurrido un inconveniente porfavor intente de nuevo'});
	  						} else {
	  							result._id = user._id;
	  							res.json(result);
	  						}
						});
				} else {
					User.model.create(result, function (err, user) {
  						if (err) {
  							console.log(err);
  							res.status(500).json({error: 'Lo sentimos, ha ocurrido un inconveniente porfavor intente de nuevo'});
  						} else {
  							result._id = user._id;
  							res.json(result);
  						}
					});
				}
			});
		});
    });
};

module.exports.legacylogin = function(req, res) {
  	var params = req.body || {};

  	console.log('DEBUG Login with params >', params);

	if (!params.email || !params.password) {
		return res.status(422).json({error: "Parametros inválidos"});
	}

	var newAccessToken = uuid.v1();

	User.model.findOneAndUpdate({email: params.email}, {accessToken: newAccessToken})
	.exec(function(err, user) {

		if (err) {
			return res.status(500).json({error: 'Lo sentimos, ha ocurrido un inconveniente porfavor intente de nuevo.'});
		}

		if (!user) {
			return res.status(401).json({error: 'El email o la contraseña son incorrectos.'});
		}

		user._.password.compare(params.password, function(err, isMatch) {
			if (err || !isMatch) {
				return res.status(401).json({error: 'El email o contraseña son incorrectos.'});
			} else {
				return res.json(user);
			}
		});
	});
};

module.exports.register = function(req, res) {
  	var params = req.body || {};

	if (!params.name || !params.email || !params.password) {
		return res.status(422).json({error: "Parametros inválidos"});
	}

	var newUser = {
		name: params.name,
		email: params.email,
		password: params.password,
		accessToken: uuid.v1()
	};

	User.model.findOne().where('email', newUser.email).exec(function(err, user) {
		if (err) {
			return res.status(500).json({error: 'Lo sentimos, ha ocurrido un inconveniente porfavor intente de nuevo.'});
		};

		if (user) {
			return res.status(422).json({error: "Ya existe un usuario con el email ingresado."});
		} else {
			User.model.create(newUser, function (err, user) {
				if (err) {
					res.status(500).json({error: 'Lo sentimos, ha ocurrido un inconveniente porfavor intente de nuevo'});
				} else {
					newUser._id = user._id;
					res.json(newUser);
				}
			});
		}
	});
};

module.exports.updateImage = function(req, res) {
	var user_id = req.params.user_id;

	if (!user_id) {
		return res.status(401).json({error: "Parametros inválidos"});
	}

	var options = {
		host: config.facebook_api,
		path: '/' + user_id + '/picture'
	};

	https.get(options,function(resp) {
		var imageUrl = resp.responseUrl;
		console.log('Image url ', resp);

		if (imageUrl) {
			User.model.findOneAndUpdate({user_id: user_id}, {image: imageUrl})
				.exec(function(err, user) {
					res.json({imageUrl: imageUrl});
				});	
		} else {
			res.json({resp: 'no se encontro la imagen'});
		}
    });
};
