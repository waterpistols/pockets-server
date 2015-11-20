var Pocket = require(__src + 'models/pocket');

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
