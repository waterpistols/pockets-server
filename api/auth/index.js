var rp = require('request-promise');

var User = require(__src + 'models/user');

exports.login = function* () {

  // Select user
  var user = yield User.findOne({ user: this.request.body.user });

  // Update
  User.update({ user: this.request.body.user }, this.request.body, { upsert: true });

  if(user) {
    this.state.token = user.token;
    this.state.userId = user.userId;
  } else {
    this.throw(404);
  }

  this.auth();

  // Get user info
  var options = this.state.apiOptions;
  options.uri += 'commonapi/persons/' + this.state.userId;

  try {
    var response = yield rp(options);
    if(response) {
      response.token = this.state.token;
      this.body = response;
    } else {
      this.throw(404);
    }
  } catch(error) {
    this.throw(404);
  }
}
