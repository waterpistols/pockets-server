var rp = require('request-promise');

var Pocket = require(__src + 'models/pocket');
var Location = require(__src + 'models/location');
var Transaction = require(__src + 'models/transaction');
var Balance = require(__src + 'models/balance');

exports.list = function* () {

  this.auth();

  // Get pockets
  var pockets = yield Pocket.find({ userId: this.state.userId });

  if(pockets.length > 0) {
    this.body = pockets;

  // If no pockets create defaults
  } else {

      var newPockets = [];

      // Rent
      var rent = new Pocket();
      rent.name = 'Rent';
      rent.amount = rent.remaining = 350;
      rent.userId = this.state.userId;
      rent.category = Pocket.categories.fixed;
      rent.color = Pocket.color.rent;
      rent.icon = Pocket.icon.rent;
      rent.percent = 0;
      rent.locked = true;
      yield rent.save();
      newPockets.push(rent);

      // Utilities
      var utilities = new Pocket();
      utilities.name = 'Utilities';
      utilities.amount = utilities.remaining = 70;
      utilities.userId = this.state.userId;
      utilities.category = Pocket.categories.fixed;
      utilities.color = Pocket.color.utilities;
      utilities.icon = Pocket.icon.utilities;
      utilities.percent = 0;
      yield utilities.save();
      newPockets.push(utilities);

      // Groceries
      var groceries = new Pocket();
      groceries.name = 'Groceries';
      groceries.amount = groceries.remaining = 120;
      groceries.userId = this.state.userId;
      groceries.category = Pocket.categories.fixed;
      groceries.color = Pocket.color.groceries;
      groceries.icon = Pocket.icon.groceries;
      groceries.percent = 0;
      rent.locked = true;
      yield groceries.save();
      newPockets.push(groceries);

      // fun
      var fun = new Pocket();
      fun.name = 'Fun';
      fun.amount = fun.remaining = 100;
      fun.userId = this.state.userId;
      fun.category = Pocket.categories.percentage;
      fun.color = Pocket.color.fun;
      fun.icon = Pocket.icon.fun;
      fun.percent = 15;
      yield fun.save();
      newPockets.push(fun);

      this.body = newPockets;
  }
}

exports.createPocket = function* () {
  this.auth();

  var pocket = new Pocket();
  pocket.name = this.request.body.name;
  pocket.locked = this.request.body.hasOwnProperty('locked') ? true : false;
  pocket.color = this.request.body.hasOwnProperty('color') ? this.request.body.color : Pocket.color.other;
  pocket.userId = this.state.userId;

  pocket.save();

  this.body = pocket;
}

exports.updatePocket = function* () {

  var pocket = Pocket.findOne({ _id: this.params.id });

  // General
  if(this.request.body.hasOwnProperty('body')) {
    pocket.name = this.request.body.name;
    pocket.locked = this.request.body.hasOwnProperty('locked') ? true : false;
    pocket.color = this.request.body.hasOwnProperty('color') ? this.request.body.color : Pocket.color.other;
  }

  // Fixed
  if(this.request.body.hasOwnProperty('category') && this.request.body.category === Pocket.categories.fixed) {
    pocket.category = Pocket.categories.fixed;
    pocket.amount = pocket.remaining = this.request.body.amount;

  // Percent
  } else {
    pocket.category = Pocket.categories.percentage;
    pocket.amount = pocket.remaining = 0;
    pocket.percentage = this.request.body.percent;
  }

  // Get Pockets
  var pockets = yield Pocket.find({ userId: this.state.userId });
  var totalSpent = 0;

  // Update balance
  var options = JSON.parse(JSON.stringify(this.state.apiOptions));
  options.uri += 'commonapi/persons/' + this.state.userId + '/accounts';

  try {
    var accounts = yield rp(options);
    accounts = accounts.list[0];

    balance.balance = accounts.availableBalance.value;
    var totalFixed = 0;
    var totalSpent = 0;
    var remaining = 0;

    if(pockets.length) {
        for(var i = 0; i < pockets.length; i++) {
          var pocket = pockets[i];

          if(pocket.category === Pocket.categories.fixed) {
             totalFixed += pocket.amount;
          }
        }

        totalSpent = totalFixed;
        remaining = balance.balance - totalFixed;

        for(var i = 0; i < pockets.length; i++) {
          var pocket = pockets[i];

          if(pocket.category === Pocket.categories.fixed) {
             totalSpent += pocket.percent * remaining / 100;
          }
        }
    }

    balance.safeToSpend = balance.balance - totalSpent;
    balance.userId = this.state.userId;
    balance.save();

  } catch(error) {
    console.log(error);
    this.throw(404);
  }

  // Time interval
  if(this.request.body.hasOwnProperty('timeFrom')) {
    pocket.timeFrom = this.request.body.timeFrom;
    pocket.timeTo = this.request.body.timeTo;
    pocket.timeFrequency = this.request.body.timeFrequency;
  }

  pocket.save();

  this.body = pocket;
}

exports.listPercent = function* () {
  this.auth();

  // Get pockets
  var pockets = yield Pocket.find({ userId: this.state.userId, type: Pocket.categories.percent });

  if(pockets.length > 0) {
    this.body = pockets;

  // If no pockets create defaults
  } else {
    this.throw(404, 'No pockets found');
  }
}

exports.listPercent = function* () {
  this.auth();

  // Get pockets
  var pockets = yield Pocket.find({ userId: this.state.userId, type: Pocket.categories.percent });

  if(pockets.length > 0) {
    this.body = pockets;

  // If no pockets create defaults
  } else {
    this.throw(404, 'No pockets found');
  }
}

exports.updatePercent = function* () {
  this.auth();

  var pockets = this.request.body;

  if(pockets.length) {
    for(var i=0; i<pockets.length; i++) {
      var pocket = pockets[i];

      yield Pocket.update({ _id: pocket._id }, { percent: pocket.percent });
    }
  }

  this.body = 'Bravo';
}

exports.pocketDetails = function* () {
  var pocket = yield Pocket.findOne({ _id: this.params.id });

  if(pocket !== null) {
    pocket.transactions = yield Transaction.find({ pocketId: pocket._id });
    pocket.locations = yield Location.find({ pocketId: pocket._id });
  }
  this.body = pocket;
}

exports.deleteLocation = function* () {
  Location.delete({ _id: this.params.id });

  this.body = 'Deleted successfully';
}
