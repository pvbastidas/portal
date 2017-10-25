var keystone = require('keystone');
var Store = keystone.list('Store');
var Charge = keystone.list('Charge');
var _ = require('underscore');
var moment = require('moment');

var config = require('../../config');

exports = module.exports = function(req, res) {
  var view = new keystone.View(req, res);
  var locals = res.locals;
  locals.moment = moment;
  locals.GOOGLE_API_KEY = config.GOOGLE_API_KEY;

  view.on('init', function(next){
    Store.model.findOne({_id: req.user.store})
      .exec(function(err, store) {
        if (store) {
          locals.store = store;
          var date = moment(store.createdAt).format('YYYY-MM-DD');
          locals.date = date;

          Charge.model.find({store: store._id})
            .populate('client')
            .sort('-endDate')
            .limit(5)
            .exec(function(err, charges) {
              locals.charges = charges;
              next();
            });
        } else {
          locals.store = {
            location: {
              lat: 0,
              lon: 0
            }
          };
          next();
        }
      });
  });

  view.render('store_info');
};
