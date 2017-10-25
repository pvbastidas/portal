var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals,
    expire = req.query.expire;

	locals.section = 'session';

	keystone.session.signout(req, res, function() {
	    if (expire) {
	      req.flash('error', "Su sesión ha expirado, porfavor vuelva a ingresar.");
	    }

		res.redirect('/');
	});

};
