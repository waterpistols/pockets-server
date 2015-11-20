var mongoose = require('mongoose');

// Define the user schema
var Pocket = mongoose.Schema({
    "date" : { type: Date, default: new Date() },
    "name" : { type: String },
    "amount" : { type: Number },
    "remaining": { type: Number },
    "userId": { type: String },
    "category": { type: String },
    "color": { type: Number },
    "percentage": { type: Number },
    "percent": { type: Number },
    "icon": { type: Number },
    "locked": { type: Boolean, default: false },
    "timeFrom": { type: String },
    "timeTo": { type: String },
    "timeFrequency": { type: String }
});

Pocket.statics.categories = {
  fixed: "Fixed Rate",
  percentage: "Percentage"
};

Pocket.statics.color = {
  rent: 0,
  utilities: 1,
  groceries: 2,
  fun: 3
};

Pocket.statics.icon = {
  rent: 0,
  utilities: 1,
  groceries: 2,
  fun: 3,
  none: 4
};

// Don't include these fields
Pocket.statics.defaultProjection = function () {
    return {
        "_id": false,
    };
};

// Turn schema into a mongoose model
module.exports = mongoose.model('pocket', Pocket, 'pockets');
