var rp = require('request-promise');

var User = require(__src + 'models/user');
var Balance = require(__src + 'models/balance');
var Pocket = require(__src + 'models/pocket');

exports.login = function* () {

  // Select user
  var user = yield User.findOne({ user: this.request.body.user });

  // Update
  User.update({ user: this.request.body.user }, this.request.body);

  if(user) {
    this.state.token = user.token;
    this.state.userId = user.userId;
  } else {
    this.throw(404);
  }

  this.auth();


  // Update balance
  var balance = yield Balance.findOne({ userId: this.state.userId });

  if(balance === null) {
    balance = new Balance();
  }

  // Get Pockets
  var pockets = yield Pocket.find({ userId: this.state.userId });
  var totalSpent = 0;

  // Get balance
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

  // Get user info
  var options = JSON.parse(JSON.stringify(this.state.apiOptions));
  options.uri += 'commonapi/persons/' + this.state.userId;

  try {
    var response = yield rp(options);
    if(response) {
      response.token = this.state.token;
      this.body = response;
    } else {
      console.log(error);
      this.throw(404);
    }
  } catch(error) {
    console.log(error);
    this.throw(404);
  }
}
