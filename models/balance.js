var mongoose = require('mongoose');

// Define the user schema
var Balance = mongoose.Schema({
    "userId" : { type: String },
    "balance" : { type: Number },
    "safeToSpend" : { type: Number },
});

// Don't include these fields
Balance.statics.defaultProjection = function () {
    return {
        "_id": false,
    };
};

// Turn schema into a mongoose model
module.exports = mongoose.model('balance', Balance, 'balance');
