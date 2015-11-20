var mongoose = require('mongoose');

// Define the user schema
var Transaction = mongoose.Schema({
    "id" : { type: String },
    "date" : { type: String },
    "type" : { type: String },
    "description": { type: String },
    "userId": { type: String },
    "amount": { type: Number }
});

// Don't include these fields
Transaction.statics.defaultProjection = function () {
    return {
        "_id": false,
    };
};

// Turn schema into a mongoose model
module.exports = mongoose.model('transaction', Transaction, 'transactions');
