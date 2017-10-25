var keystone = require('keystone');
var Store = keystone.list('Store');

exports = module.exports = function(req, res) {
  var view = new keystone.View(req, res);
  var locals = res.locals;
  var user = req.user;
  locals.formData = req.body || {};
  locals.validationErrors = {};

  view.on('post', { action: 'editStore' }, function(next) {
    var storeData = req.body;
    var id = req.params.id;

    Store.model.findOne({_id: id})
      .exec(function(err, store) {
        if (store) {
          updater = store.getUpdateHandler(req);
          updater.process(storeData, {
            flashErrors: true,
            fields: 'name, location.lat, location.lon, address, description',
            errorMessage: 'Ha ocurrido un inconveniente, por favor intente de nuevo.'
          }, function(err) {
            if (err) {
              locals.validationErrors = err.errors || {};
              next();
            } else {
              req.flash('success', 'Punto de carga actualizado con exito.');
              res.redirect('/store_info');
            }
          });
        } else {
          req.flash('success', 'Ha ocurrido un inconveniente, por favor intente de nuevo');
          res.redirect('/store_info');
          return;
        }
      });
  });

  view.on('init', function(next){
    var id = req.params.id;
    Store.model.findOne({_id: id})
      .exec(function(err, store) {
        if (store) {
          locals.formData = store;
        }
        next();
      });
  });

  view.render('store_edit');
};
