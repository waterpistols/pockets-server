var mongoose = require('mongoose');

// Define the user schema
var Location = mongoose.Schema({
    "id" : { type: String },
    "pocketId": { type: String },
    "name": { type: String },
    "userId": { type: String }
});

// Don't include these fields
Location.statics.defaultProjection = function () {
    return {
        "_id": false,
    };
};

// Turn schema into a mongoose model
module.exports = mongoose.model('location', Location, 'locations');
