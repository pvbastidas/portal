var keystone = require('keystone');

exports = module.exports = function(req, res) {
  var view = new keystone.View(req, res);
  var locals = res.locals;
  locals.section = 'cuenta';
  locals.validationErrors = {};
  locals.formData = req.user;

  view.on('post', { action: 'cambiarPass' }, function(next) {

    if (!req.body.password || !req.body.password_confirm) {
      req.flash('error', 'Porfavor ingrese una contraseña');
      return next();
    }

    req.user.getUpdateHandler(req).process(req.body, {
      fields: 'password',
      flashErrors: true

    }, function(err) {
      if (err) {
        return next();
      }

      req.flash('success', 'Su contraseña ha sido actualizada');
      return next();
    });

  });

  view.render('change_password');
};
