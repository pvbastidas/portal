var keystone = require('keystone');
var Store = keystone.list('Store');
var Promotion = keystone.list('Promotion');
var _ = require('underscore');

exports = module.exports = function(req, res) {
  var view = new keystone.View(req, res);
  var locals = res.locals;
  var user = req.user;

  locals.section = 'Promociones';

  view.on('post', { action: 'buscarPromotions' }, function(next) {
    var query = req.body.promotion;

    Promotion.model.find({'name': {$regex: query}, 'store': user.store})
    .exec(function(err, promotions) {
      locals.promotions = promotions;
      locals.query = query;

      if (promotions && !promotions.length || err) {
        req.flash('error', "No se encontró resultados de su búsqueda");
      }

      next();
    });

  });

  view.on('init', function(next){
    Promotion.model.find({store: user.store})
      .exec(function(err, promotions) {
        locals.promotions = promotions;
        next();
      });
  });

  view.render('promotions');
};
