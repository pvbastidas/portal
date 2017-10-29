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
    console.log('User: '+req.user.store);
    Store.model.findOne({_id: req.user.store})
      .exec(function(err, store) {
        //console.log("Store"+ store);
        if (store) {
          locals.store = store;
          var date = moment(store.createdAt).format('YYYY-MM-DD');
          locals.date = date;

          if (!req.user.canAccessKeystone) {
            Charge.model.find({store: req.user.store, state: 'start'})
            .populate('client')
            .sort('-endDate')
            .limit(5)
            .exec(function(err, charges) {
              locals.charges = charges;
              next();
            });
          }    
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

module.exports.currentCharges = function(req, res) {
  var params = req.body || {};
    console.log('DEBUG, current charge with params', params);
    // if (!params._id || !params.device_id || !params.store_id) {
    //   return res.status(401).json({error: "Invalid parameters"});
    // }

    // Comprobar si hay recargas abiertas para cerrarla
    Charge.model.find().where(
        {state: 'start'})
        .exec(function(err, charges) {
            if(err){
                console.log('DEBUG Error ', err)
                return res.status(500).json({error: "Ha ocurrido un inconveniente, por favor intente de nuevo"});
            }

            return res.json(charges);
        });
};
