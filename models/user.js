var mongoose = require('mongoose');

// Define the user schema
var User = mongoose.Schema({
    "user" : { type: String },
    "userId" : { type: Number },
    "token" : { type: String },
});

// Don't include these fields
User.statics.defaultProjection = function () {
    return {
        "_id": false,
    };
};

// Turn schema into a mongoose model
module.exports = mongoose.model('user', User, 'users');
