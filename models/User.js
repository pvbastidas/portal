var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
var User = new keystone.List('User', {
  label: 'Usuario',
  plural: 'Usuarios',
});

User.add({
	name: { type: String, index: true},
	email: { type: Types.Email, initial: true, index: true},
	password: { type: Types.Password, initial: true},
	image: {type: String},
	accessToken: {type: String, noedit: true, hidden: true},
	user_id: {type: String},
	store: { type: Types.Relationship, ref: 'Store'},
	loginWith: {type: String, noedit: true, hidden: true}
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true },
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});

/**
 * Registration
 */
User.defaultColumns = 'name, email, isAdmin';
User.register();
