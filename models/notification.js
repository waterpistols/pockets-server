var mongoose = require('mongoose');

// Define the user schema
var Notification = mongoose.Schema({
    "userId" : { type: String },
    "type" : { type: Number },
    "amount" : { type: Number },
    "seen": { type: Boolean, default: false },
    "created": { type: Date, default: new Date() }
});

Notification.statics.types = {
  manual: 0,
  automatic: 1
}

// Don't include these fields
Notification.statics.defaultProjection = function () {
    return {
        "_id": false,
    };
};

// Turn schema into a mongoose model
module.exports = mongoose.model('notification', Notification, 'notification');
