var Balance = require(__src + 'models/balance');

exports.getIt = function* () {

  this.auth();

  var balance = yield Balance.findOne({ userId: this.state.userId });

  if(balance) {
    this.body = balance;
  } else {

    this.throw(404);
  }
}
