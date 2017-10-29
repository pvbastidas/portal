/**
 * This script automatically creates a default Admin user when an
 * empty database is used for the first time. You can use this
 * technique to insert data into any List you have defined.
 *
 * Alternatively, you can export a custom function for the update:
 * module.exports = function(done) { ... }
 */
//var triggers = require('mongo-triggers');
var Store = keystone.list('Store');
var Promotion = keystone.list('Promotion');
exports.create = {
	User: [
		{ 'name': 'Admin', 'email': 'ninataty12@gmail.com', 'password': 'secreto12', 'isAdmin': true },
	],
};

exports.create = {
	Promotion.model.find()
	triggers(Store).on('update', function (error, result, { state: true }, update, options) {
	// if (error) {
	// 	console.log("Error al crear trigger: ", error);
	// }

  // error   : null (unless something went wrong)
  // result  : { ... } (in case of the save command, this will be a lastErrorObject)
  // query   : { _id: "foo" }
  // update  : { name: "Anders" }
  // options : undefined (since no options object was passed to the update function)
});

/*

// This is the long-hand version of the functionality above:

var keystone = require('keystone');
var async = require('async');
var User = keystone.list('User');

var admins = [
	{ email: 'user@keystonejs.com', password: 'admin', name: { first: 'Admin', last: 'User' } }
];

function createAdmin (admin, done) {

	var newAdmin = new User.model(admin);

	newAdmin.isAdmin = true;
	newAdmin.save(function (err) {
		if (err) {
			console.error('Error adding admin ' + admin.email + ' to the database:');
			console.error(err);
		} else {
			console.log('Added admin ' + admin.email + ' to the database.');
		}
		done(err);
	});

}

exports = module.exports = function (done) {
	async.forEach(admins, createAdmin, done);
};

*/
