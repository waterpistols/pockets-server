var rp = require('request-promise');
var co = require('co');

var Transaction = require(__src + 'models/transaction');
var User = require(__src + 'models/user');

exports.list = function* () {

  this.auth();
  this.body = yield Transaction.find({ userId: this.state.mongoUserId });
}

exports.addtoPocket = function* () {
  this.auth();

  var transactionId = this.params.id;
  var pocketId = this.request.body.pocketId;

  var transaction = yield Transaction.findOne({ _id: transactionId });

  if(transaction) {
    yield Transaction.update({ _id: transactionId }, { pocketId: pocketId });
    this.body = yield Transaction.findOne({ _id: transactionId });
  } else {
    this.body = 'Failed';
  }
}

exports.sync = function* () {
    var user;
    var transaction;
    var users = yield User.find().populate('transactions');
    var context = this;

    if(users) {
      for (var i=0; i < users.length; i++) {
        var user = users[i];
        var userTransactions = yield Transaction.find({ userId: user._id });

        // Get ING transactions
        context.auth();

        // Get user info
        var options = context.state.apiOptions;
        options.uri += 'commonapi/persons/' + user.userId + '/transactions'
        options.headers['Authorization'] = 'Bearer ' + user.token;

        try {
          var response = yield rp(options);

          if(response) {
            var newTransactions = [];

            for (var j=0; j < response.list.length; j++) {
              var newTransaction = true;
              transaction = response.list[j];

              // Add new transactions
              for (var k=0; k < userTransactions.length; k++) {
                var existingTransaction = userTransactions[k];

                if(existingTransaction.id === transaction.productId
                  && existingTransaction.type === transaction.transactionType.code
                  && existingTransaction.amount === transaction.amount.value ) {
                    newTransaction = false;
                }
              }

              if(newTransaction) {
                var newOne = new Transaction();

                newOne.id = transaction.productId;
                newOne.date = transaction.createDate.datetime;
                newOne.userId = user._id;
                newOne.type = transaction.transactionType.code;
                newOne.description = transaction.description;
                newOne.amount = transaction.amount.value;

                yield newOne.save();

                newTransactions.push(newOne._id);

                // Notify user
              }
            }
          } else {
            context.throw(429);
          }
        } catch(error) {
          console.log(error)
        }
      }
    }

    this.body = users;
}
