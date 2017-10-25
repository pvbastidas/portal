var keystone = require('keystone');
var Promotion = keystone.list('Promotion');
var _ = require('underscore');
var moment = require('moment');

exports = module.exports = function(req, res) {
  var view = new keystone.View(req, res);
  var locals = res.locals;
  var promo_id = req.params.promo_id;
  locals.formData = req.body || {};
  locals.validationErrors = {};

  view.on('init', function(next){
    Promotion.model.findOne({_id: promo_id})
      .exec(function(err, promotion) {
        if (promotion) {
          locals.formData = promotion;
          var date = moment(promotion.fecha_exp).format('YYYY-MM-DD');
          locals.date = date;
        }

        next();
      });
  });

  view.render('new_promotion');
};
