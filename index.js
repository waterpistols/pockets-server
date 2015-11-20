
/**
 * Module dependencies.
 */
var koa = require('koa');
var router = require('koa-router')();
var mongoose = require('mongoose');

// API
var pockets = require('./api/pockets');

// DB Connect
mongoose.connect('mongodb://pockets:asdasd@ds047792.mongolab.com:47792/pockets');
mongoose.connection.on('open', function() { console.log('Mongo Connected!') });
mongoose.connection.on('error', function(err) { console.log(err) });

// Routes
router.get('/pockets', pockets.list);

function api(opts) {
  opts = opts || {};
  var app = koa();

  // routing
  app.use(router.routes());
  app.use(router.allowedMethods());

  return app;
}

module.exports = api;
