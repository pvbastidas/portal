var keystone = require('keystone');
var Types = keystone.Field.Types;
var mongoosePaginate = require('mongoose-paginate');

var Charge = new keystone.List('Charge');

Charge.add({
	client:  { type: Types.Relationship, ref: 'User'},
  	device_id: { type: String, required: true, index: true, initial: true},
  	store:  { type: Types.Relationship, ref: 'Store'},
  	state: { type: Types.Select, options: 'start, stop', default: 'start', index: true, initial: true, label: 'Estado'},
	startDate: { type: Date, label: 'Fecha de inicio' },
  lastSeen: { type: Date, label: 'Ultimo ack' },
	endDate: { type: Date, label: 'Fecha de fin'},
	timeCharge: {type: Number}
});

Charge.schema.virtual('time').get(function () {
	return Math.round(((this.endDate.getTime() - this.startDate.getTime())/1000)/60);
});

Charge.schema.plugin(mongoosePaginate);

/**
 * Registration
 */
Charge.defaultColumns = 'client, store, startDate, endDate, state';
Charge.register();
