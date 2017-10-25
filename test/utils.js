var keystone = require('keystone');
var config = require('./config');
var async = require('async');
var dbURI = config.db.test;

before(function(done) {
  keystone.init({
    'name': 'User Model Test',
    's3 config': {} //has to be set, but isn't used in our models
  });
  // keystone.start();
  keystone.import('../models');
  done();
});

beforeEach(function(done){
  if (keystone.mongoose.connection.db) return done();
  console.log('Connecting to ' + dbURI)
  keystone.mongoose.connect(dbURI, done);
});

afterEach(function(done) {
  var conn = keystone.mongoose.connection.db;

  conn.collectionNames(function(err, names){
    async.forEach(names, function(item, callback){
      console.log('removing collection: ', item);
      conn.collection(item.name, function(err, c){
        c.drop(function(err) {
          callback();
          return;
        });
      });
    }, done);
  });

});

after(function(done) {
  var conn = keystone.mongoose.connection.db;

  conn.dropDatabase(function(err) {
    conn.close(function(err) {
      if (err) { done(err); }
      done();
    });
  });
});
