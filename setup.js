var User = require('./models/user');

module.exports = function* (next) {

  if(this.headers.hasOwnProperty('x-apikey')) {
    var user = yield User.findOne({ token: this.headers['x-apikey'] });
    if(user) {
      this.state.token = user.token;
      this.state.userId = user.userId;
    } else {
      this.throw(404);
    }
  }

  // API setup
  this.auth = function() {
    this.state.apiOptions = {
        uri: 'http://commonapi.hackathon2015.ing.ro-int/NL/',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + this.state.token
        },
        json: true
    };
  }

  typeof next.next === 'function' ? yield *next : yield next;
}
