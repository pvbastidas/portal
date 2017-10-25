// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();

// Require keystone
var keystone = require('keystone');

var moment = require('moment');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({
	'name': 'ENERWI',
	'brand': 'ENERWI',
	'less': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': 'jade',
	'auto update': true,
	'session': true,
  'auth': true,
  'user model': 'User',
  'logger': 'combined'
});

// Load your project's Models
keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
	_: require('lodash'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable,
});

// Load your project's Routes
keystone.set('routes', require('./routes'));

keystone.set('cors allow origin', true);

// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
	//galleries: 'galleries',
	//enquiries: 'enquiries',
	usuarios: 'users',
	establecimientos: 'stores',
});

// Start Keystone to connect to your database and initialise the web server
var Charge = keystone.list('Charge');
setInterval(function(){
  var plus2hs = moment().add(-1, 'hours');

  Charge.model.find({'state': 'start', 'lastSeen': {$lte: plus2hs.toDate()}}).exec(function(err, charges){
    if (err) {
      console.log('ERROR en matador de cargas', err);
    }

    if(charges){
      console.log('DEBUG, matando cargas colgadas: ', plus2hs.toDate(), charges);

      charges.map(function(c){
        Charge.model.findOneAndUpdate({_id: c._id}, {'state': 'stop'})
          .exec(function(err){
            if (err){
              console.log('ERROR updating the charge', err);
            }
          });
      });
    }
  });

}, 66000);

keystone.start();
