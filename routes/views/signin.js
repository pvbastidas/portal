var keystone = require('keystone'),
	async = require('async'),
	User = keystone.list('User');

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res),
		locals = res.locals,
		jsonResponse = {};

	locals.section = 'session';
	locals.form = req.body;

	if (!req.body.email || !req.body.password) {
		return res.status(422).json({error: 'Porfavor ingrese su email y contraseña'});
	}

	var onSuccess = function() {
		return res.json('ok');
	};

	var onFail = function() {
		return res.status(422).json({error: 'Su email o contraseña son incorrectos.'});
	};

  User.model.findOne({'email': req.body.email}, function(err, user){
    if (!user) {
      onFail();
      return;
    }

    keystone.session.signin({ email: req.body.email, password: req.body.password }, req, res, onSuccess, onFail);
  });
};
