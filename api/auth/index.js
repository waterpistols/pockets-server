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
  console.log(options);

  try {
    var response = yield rp(options);
    this.body = response;
  } catch(error) {
    console.log(error.message)
  }
}
