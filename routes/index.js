/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);
// Pass your keystone instance to the module
var restful = require('restful-keystone')(keystone);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
};

// Setup Route Bindings
exports = module.exports = function (app) {
	app.all('/api*', keystone.middleware.cors);
	app.options('/api*', function(req, res) {
		res.sendStatus(200);
	});

	// Views
	app.get('/', routes.views.index);
	app.all('/promotions', routes.views.promotions);
	app.all('/new_promotion', routes.views.new_promotion);
	app.all('/edit_promotion/:promo_id', routes.views.edit_promotion);
	app.post('/charges_by_date', routes.views.charges_by_date);
	app.all('/charges_by_date/:start_date?/:end_date?', routes.views.charges_by_date);
	app.all('/store_info', routes.views.store_info);
	app.all('/charges_by_date', routes.views.charges_by_date);
	app.all('/change_password', routes.views.change_password);
	app.all('/store_edit/:id', routes.views.store_edit);

	// Login Portal
	app.post('/signin', routes.views.signin);
	app.get('/signout', routes.views.signout);

	// Login de la app
	app.post('/api/login', routes.views.user.login)
	app.post('/api/legacylogin', routes.views.user.legacylogin)
	app.post('/api/register', routes.views.user.register)
	app.get('/api/update_image/:user_id', routes.views.user.updateImage)

	// Charge
	app.post('/api/charge/start', middleware.requireUserExternal, routes.views.charge.start)
	app.post('/api/charge/stop', middleware.requireUserExternal, routes.views.charge.stop)
	app.post('/api/charge/current', middleware.requireUserExternal, routes.views.charge.currentCharge)
	app.get('/api/charge/history/:page/:limit/:user_id', middleware.requireUserExternal, routes.views.charge.history)
	app.get('/api/charge/history_by_store/:user_id/:store_id', middleware.requireUserExternal, routes.views.charge.history_by_store)
	app.get('/api/promotions/:page/:limit', middleware.requireUserExternal, routes.views.promotions_api.find_all);
	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);

	// Testing REST API
	restful.expose({
		User : true
	}).start();
};
