var keystone = require('keystone');
var Charge = keystone.list('Charge');
var _ = require('underscore');
var moment = require('moment');
var numeral = require('numeral');

exports = module.exports = function(req, res) {
  var view = new keystone.View(req, res);
  var locals = res.locals;
  var user = req.user;

  locals.charges = [];
  locals.moment = moment;
  locals.numeral = numeral;

  view.on('post', { action: 'searchChargesByDate' }, function(next) {
    var start_date = req.body.start_date;
    var end_date = req.body.end_date;

    if(!start_date || !end_date) {
      locals.charges = [];
      req.flash('error', "Debe ingresar las fechas para la búsqueda.");
      next();
    } else {
      res.redirect(['/charges_by_date', start_date, end_date].join('/'));
    }
  });

  view.on('init', function(next) {
    var iso_start_date;
    var iso_end_date;

    if (req.params.start_date && req.params.end_date) {
      locals.start_date = req.params.start_date;
      locals.end_date = req.params.end_date;

      iso_start_date = new Date(req.params.start_date);
      iso_end_date = new Date(req.params.end_date);
    }

    var query = Charge
      .paginate({
        page: req.query.page || 1,
        perPage: 10,
        maxPages: 100
      });

    if(iso_start_date && iso_end_date){
      query.where({'endDate': {
        $gte: iso_start_date,
        $lt:  iso_end_date
      },
      store: user.store
      });
    } else if (!user.canAccessKeystone) {
      query.where({
        store: user.store
      });
    }

    query.sort('-endDate')
      .populate('client')
      .populate('store')
      .exec(function(err, charges) {
        console.log('DEBUG ', charges);
        locals.charges = charges;
        if (charges.results && !charges.results.length || err) {
          req.flash('warning', "No se encontró resultados de su búsqueda");
        }

        next();
      });
  });

  view.render('charges_by_date');
}
