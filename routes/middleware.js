/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */
var _ = require('lodash');
var keystone = require('keystone');
var User = keystone.list('User');


/**
	Initialises the standard view locals

	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/
exports.initLocals = function (req, res, next) {
	res.locals.navLinks = [
		{ label: 'Inicio', key: 'home', href: '/' }
	];

	if (req.user){
      User.model.findOne({_id: req.user._id})
        .populate('store')
        .exec(function(err, user) {
          res.locals.user = user;
          next();
        });
    } else{
      next();
    }
};


/**
	Fetches and clears the flashMessages before a view is rendered
*/
exports.flashMessages = function (req, res, next) {
	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error'),
	};
	res.locals.messages = _.some(flashMessages, function (msgs) { return msgs.length; }) ? flashMessages : false;
	next();
};


/**
	Prevents people from accessing protected pages when they're not signed in
 */
exports.requireUser = function (req, res, next) {
	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/keystone/signin');
	} else {
		next();
	}
};

exports.requireUserExternal = function (req, res, next) {
	var auth = req.headers.authorization;

	if (auth) {
		var authOptions = auth.split(' ');

		if (authOptions.length === 2) {
			var token = authOptions[1];

			User.model.findOne().where('accessToken', token).exec(function(err, user) {
				if (err || !user) {
					return res.status(401).json({error: "unauthorized"});
				}
				next()
			});

		} else {
			return res.status(401).json({error: "unauthorized"});
		}
	} else {
		return res.status(401).json({error: "unauthorized"});
	}
};
