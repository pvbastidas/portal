var keystone = require('keystone');
var Promotion = keystone.list('Promotion');

exports = module.exports = function(req, res) {
  var view = new keystone.View(req, res);
  var locals = res.locals;
  var user = req.user;
  locals.formData = req.body || {};
  locals.validationErrors = {};

  locals.section = 'Promociones';

  view.on('post', { action: 'new_promotion' }, function(next) {
    var promotionData = req.body;
    locals.formData._id =  promotionData.id;

    if (!promotionData.id) {
        var newPromotion = new Promotion.model(),
        updater = newPromotion.getUpdateHandler(req);
        processPromotion('creada');
    } else {
        Promotion.model.findOne({_id: promotionData.id})
          .exec(function(err, promotion) {
            updater = promotion.getUpdateHandler(req);
            processPromotion('actualizada');
          });
    }

    function processPromotion(message) {
      if (promotionData.fecha_exp && new Date(promotionData.fecha_exp).getTime() < new Date().getTime()) {
        req.flash('error', 'La fecha debe ser mayor a la fecha actual.');
        next();
        return;
      };

      if (!user.store) {
        req.flash('error', 'Usted no tiene asociado ningún establecimiento. Por favor contáctese con administración.');
        next();
        return;
      };

      promotionData.store = user.store;

      updater.process(promotionData, {
        flashErrors: true,
        fields: 'name, description, store, fecha_exp, state,point',
        errorMessage: 'Ha ocurrido un inconveniente, por favor intente de nuevo.'
      }, function(err) {
        if (err) {
          locals.validationErrors = err.errors || {};
          next();
        } else {
          req.flash('success', 'Promoción ' + message + ' con exito.');
          res.redirect('/promotions');
        }
      });
    }
  });

  view.render('new_promotion');
};
