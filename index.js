var koa = require('koa');
var router = require('koa-router')();
var bodyParser = require('koa-bodyparser');
var mongoose = require('mongoose');
var setup = require('./setup.js');

global.__src = __dirname + '/';

// API
var auth = require('./api/auth');
var pockets = require('./api/pockets');
var transactions = require('./api/transactions');

// DB Connect
mongoose.connect('mongodb://pockets:asdasd@ds047792.mongolab.com:47792/pockets');
mongoose.connection.on('open', function() { console.log('Mongo Connected!') });
mongoose.connection.on('error', function(err) { console.log(err) });

// Routes
router.post('/v1/login', auth.login);
router.get('/v1/pockets', pockets.list);
router.get('/v1/transactions', transactions.list);
router.get('/v1/transactions/sync', transactions.sync);

function api(opts) {

  opts = opts || {};
  var app = koa();

  app.use(setup);
  app.use(bodyParser());

  // routing
  app.use(router.routes());
  app.use(router.allowedMethods());

  return app;
}

module.exports = api;
