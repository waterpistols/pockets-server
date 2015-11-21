var Notification = require(__src + 'models/notification');

exports.polling = function* () {
  this.auth();

  var notifications = yield Notification.find({ userId: this.state.userId, seen: false });
  if(notifications.length) {
    for(var i = 0; i < notifications.length; i++) {
      var notification = notifications[i];
      Notification.update({ _id: notification._id }, { seen: true });
    }

    this.body = notifications;
  } else {
    this.body = [];
  }
}

exports.create = function* () {
  this.auth();

  var notification = new Notification();
  notification.userId = this.state.userId;
  notification.type = this.request.body.type;
  notification.amount = this.request.body.amount;
  notification.save();

  this.body = notification;
}

exports.see = function* () {
  this.auth();

  var notification = yield Notification.findOne({ _id: this.params.id });

  if(notification) {
    Notification.update({ _id: this.params.id }, { seen: true });
    this.body = notification;
  } else {
    this.throw(404);
  }
}
