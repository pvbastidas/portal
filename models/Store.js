var keystone = require('keystone');
var Types = keystone.Field.Types;
var mongoosastic = require('mongoosastic');
var Charge = keystone.list('Charge');

var Store = new keystone.List('Store', {
  label: 'Establecimiento',
  plural: 'Establecimientos',
});

Store.add({
	name: { type: String, required: true, index: true, initial: true, label: "Nombre"},
  location: {
    lat: {type: Types.Number, initial: true},
    lon: {type: Types.Number, initial: true}
  },
  address: { type: String, required: true, index: true, initial: true, label: "Dirección"},
  city: { type: String, index: true, initial: true, label: "Ciudad"},
  store_min_distance: { type: String, index: true, initial: true, label: "Distancia"},
	image: { type: Types.CloudinaryImage },
  description: { type: String, required: false, initial: true, label: 'Descripción'},
	createdAt: { type: Date, default: Date.now, label: 'Fecha de creación' }
});

Store.schema.post('save', function() {
  // utils.postToElasticSearch(this);
});

Store.schema.pre('remove', function(next){
  Charge.model.remove({store: this._id}).exec();
  next();
});


Store.relationship({ref: 'User', path: 'store'});

/*
 * elasticsearch indexing support
 * https://github.com/mongoosastic/mongoosastic
 * */
Store.schema.plugin(mongoosastic, {
  index: "enerwi",
  type: "store",
  host: "127.0.0.1"
});

/**
 * Registration
 */
Store.defaultColumns = 'name, description, address, createdAt';
Store.register();
