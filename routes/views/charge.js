var keystone = require('keystone');
var Charge = keystone.list('Charge');
var config = require('../../config');

module.exports.start = function(req, res) {
  var params = req.body || {};

  if (!params._id || !params.device_id || !params.store_id) {
      return res.status(401).json({error: "Invalid parameters"});
    }

    console.log('DEBUG, Start charge with params', params);
    // Comprobar si hay una recarga abierta para ese usuario, dispositivo y store no deberia hacer nada
    Charge.model.findOne().where({'client': params._id,
                                  'device_id': params.device_id,
                                  'store': params.store_id,
                                  'state': 'start'})
        .exec(function(err, charge) {
            if(err){
              console.log('DEBUG Error ', err)
              return res.status(500).json({error: "Ha ocurrido un error, por favor intente de nuevo"});
            }

            if (!charge) {
                // Sino existe abierta ninguna carga, creamos una nueva
                var newCharge = {
                    client: params._id,
                    device_id: params.device_id,
                    store: params.store_id,
                    state: 'start',
                    'startDate': new Date(),
                    'timeCharge': 0
                }
                Charge.model.create(newCharge, function (err) {
                    if (err) {
                         return res.status(500).json({error: "Invalid parameters"});
                    }
                    console.log('carga: '+newCharge.timeTotalCharge+" Estado "+ newCharge.state);
                    res.json({"resp": "ok"});
                });

            } else {
              // tenemos una carga, vamos a actualizar el lastseen
              console.log('DEBUG tenemos una carga: ', charge);
              Charge.model.findOneAndUpdate({_id: charge._id}, {lastSeen: new Date()})
                .exec(function(err, charge) {
                  if (err) {
                    return res.status(500).json({error: "Error seteando el lastSeen"});
                  }

                  console.log('DEBUG, carga actualizada: ', charge);

                  return res.json({'resp': 'updated'});
                });
            }
    });
};

module.exports.stop = function(req, res) {
    var endDate = new Date();
  var params = req.body || {};
    console.log('DEBUG, Stop charge with params', params);
    if (!params._id || !params.device_id || !params.store_id) {
      return res.status(401).json({error: "Invalid parameters"});
    }

    // Comprobar si hay una recarga abierta para cerrarla
    Charge.model.findOne().where(
        {'client': params._id, 'device_id': params.device_id, 'store': params.store_id, 'state': 'start'})
        .exec(function(err, charge) {
            if(err){
                console.log('DEBUG Error ', err)
                return res.status(500).json({error: "Ha ocurrido un inconveniente, por favor intente de nuevo"});
            }

            if (charge) {
                console.log('client: '+params._id);
                var timeCharge = endDate.getTime() - charge.startDate.getTime();
                timeCharge = timeCharge/60000;
                console.log("timeCharge: "+timeCharge);
                Charge.model.findOneAndUpdate({_id: charge._id}, {state: 'stop', endDate: endDate, timeCharge: timeCharge})
                  .exec(function(err, charge) {
                    if (err) {
                         return res.status(500).json({error: "Ha ocurrido un inconveniente, por favor intente de nuevo"});
                    }

                    return res.json({'status': 'ok'});
                });
            }
    });
};

module.exports.currentCharge = function(req, res) {
  var params = req.body || {};
    console.log('DEBUG, current charge with params', params);
    if (!params._id || !params.device_id || !params.store_id) {
      return res.status(401).json({error: "Invalid parameters"});
    }

    // Comprobar si hay una recarga abierta para cerrarla
    Charge.model.findOne().where(
        {'client': params._id, 'device_id': params.device_id, 'store': params.store_id, 'state': 'start'})
        .exec(function(err, charge) {
            if(err){
                console.log('DEBUG Error ', err)
                return res.status(500).json({error: "Ha ocurrido un inconveniente, por favor intente de nuevo"});
            }

            return res.json(charge);
        });
};

module.exports.history = function(req, res) {
    var user_id = req.params.user_id,
        page = req.params.page || 1, // los sacamos de 10 en 10
        limit = req.params.limit || 10;

    if (!user_id) {
        return res.status(401).json({error: "Parametros inválidos"});
    }

    Charge
    .paginate({
      page: page,
      perPage: limit,
      maxPages: 100
    })
    .where({client: user_id, state: 'stop'})
    .sort('-endDate')
    .populate('store')
    .exec(function(err, results) {
        if (err) {
            return res.status(500).json({error: "Ha ocurrido un error, intente de nuevo."})
        }

        res.json(results);
    });
};

module.exports.history_by_store = function(req, res) {
    var user_id = req.params.user_id,
        store_id = req.params.store_id;

    if (!user_id || !store_id) {
        return res.status(401).json({error: "Parametros inválidos"});
    }

    Charge.model.find({client: user_id, state: 'stop', store: store_id})
    .sort('-endDate')
    .populate('store')
    .limit(5)
    .exec(function(err, results) {
        if (err) {
            return res.status(500).json({error: "Ha ocurrido un error, intente de nuevo."})
        }

        res.json(results);
    });
};
