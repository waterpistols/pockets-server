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
      console.log(rent)
      rent.name = 'Rent';
      rent.amount = rent.remaining = 350;
      rent.userId = this.state.userId;
      rent.category = Pocket.categories.fixed;
      rent.color = Pocket.color.rent;
      rent.icon = Pocket.icon.rent;
      rent.percentage = 100;
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
      utilities.percentage = 100;
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
      groceries.percentage = 100;
      rent.locked = true;
      yield groceries.save();
      newPockets.push(groceries);

      // fun
      var fun = new Pocket();
      fun.name = 'Fun';
      fun.amount = fun.remaining = 100;
      fun.userId = this.state.userId;
      fun.category = Pocket.categories.fixed;
      fun.color = Pocket.color.fun;
      fun.icon = Pocket.icon.fun;
      fun.percentage = 100;
      yield fun.save();
      newPockets.push(fun);

      this.body = newPockets;
  }
}
