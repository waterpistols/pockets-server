var rp = require('request-promise');

exports.login = function* () {

  // Select user
  var token;
  var body = this.request.body;
  var context = this;

  context.state.users.forEach(function(value) {
    if(value.user == body.user) {
      context.state.token = value.token;
      context.state.userId = value.userId;
    }
  });

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
      this.body = 'Not Found';
    }

  } catch(error) {
    console.log(error);
    this.body = 'Not Found';
  }
}
