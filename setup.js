module.exports = function* (next) {
  this.state.users = [
    {
      user: 'Dennis-Meijer',
      token: 'eyJhbGciOiJIUzI1NiIsImN0eSI6InRleHRcL3BsYWluIn0.eyJleHAiOjE0NDcyNDg2MTksIm5vbmNlIjoiMTQ5NWE5YWItZWE5Mi00MjU4LWIwYzctMGQ0Zjk1ZTU5M2ViIiwiYXVkIjpbIjEiXSwiaXNzIjoiMzEzMCIsImp0aSI6IjEzYzRhMDZmLTViNWQtNDhiNi1hOGVkLWQ1YzAwNDJhYjRjYiIsImlhdCI6MTQ0ODAyNTg3Mn0.a2zO7PwQasHg6F2BLtYknaQ-AkGvV5KBR28DuSSQQME',
      userId: 130
    },
    {
      user: 'Bianca-Rynsburger',
      token: 'eyJhbGciOiJIUzI1NiIsImN0eSI6InRleHRcL3BsYWluIn0.eyJleHAiOjE0NDcyNDg2NDQsIm5vbmNlIjoiMWZmNWFiNWItNWEyMi00OWZlLTg2ZTYtZTYwZjQ4NGU0YjljIiwiYXVkIjpbIjEiXSwiaXNzIjoiMzEzMSIsImp0aSI6IjNjYTAxNDRjLWNlZTYtNGQzNC1hZGIxLTI5NzU4MTNiMWY1MCIsImlhdCI6MTQ0ODAyNTg5N30.wl8siPKQSnNe0VbJ52i0vOP7JJW-t2vMn4Z1ZWAeoSI',
      userId: 131
    },
    {
      user: 'Bianca-vd-Berg',
      token: 'eyJhbGciOiJIUzI1NiIsImN0eSI6InRleHRcL3BsYWluIn0.eyJleHAiOjE0NDcyNDg2OTMsIm5vbmNlIjoiZDJmNTEyNzgtNWUxOS00NTNlLWI5ODMtODFiM2M3ZDkwMTc3IiwiYXVkIjpbIjEiXSwiaXNzIjoiMzEzMiIsImp0aSI6ImM2MzRkYzMxLTA4ZDItNGVkMC05N2Q2LTI0OWNmZmM3MmIzOSIsImlhdCI6MTQ0ODAyNTk0Nn0.UM9UX03BOnUF_qADY_BfT4S3QXBDZYxw59kefBe3hPE',
      userId: 132
    },
    {
      user: 'Bart-van-Dijk',
      token: 'eyJhbGciOiJIUzI1NiIsImN0eSI6InRleHRcL3BsYWluIn0.eyJleHAiOjE0NDcyNDg3MzcsIm5vbmNlIjoiNTlkMWNhZTctZmYxNi00NmJkLTkyMmYtZmU3YzdmYTc0ZjU3IiwiYXVkIjpbIjEiXSwiaXNzIjoiMzEzMyIsImp0aSI6IjZiYzI4ODczLTI3ZDUtNDM0Yi1hYzA1LTEyMWIxNTdiMDg5OCIsImlhdCI6MTQ0ODAyNTk5MH0.53bwsSuYq7LcNkpUTF9fwsaZBpXN6A7n3Rjv_lwB8gs',
      userId: 133
    },
  ];

  // Get api key
  if(this.headers.hasOwnProperty('X-Apikey')) {
    this.state.token = this.headers['X-Apikey'];
    var context = this;

    context.state.users.forEach(function(value) {
      if(value.apikey == context.state.token) {
        context.state.userId = value.userId;
      }
    });
  } else {
    this.state.token = '';
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
