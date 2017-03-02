var redis = require('redis');
var port = 6379;

var client = redis.createClient(port, 'localhost', {no_ready_check: true});

writeRead();
function writeRead() {

  client.auth('password', function (err) {
      if (err) throw err;
  });

  client.on('connect', function() {
      console.log('Connected to Redis');
  });

  var object = {
    sex: "male",
    age: "20",
    birth: "01-04-1996"
  };

  for (var i = 0; i < 1000000; i++) {
    client.set(i, Math.random());

    if (i%100==0) {
      console.log("set" + i);
    }
  }

  for (var i = 70; i < 100; i++) {
    client.get(i, function (err, reply) {
      if (err) throw err;
      console.log(reply.toString());
    });
  }

  // client.set("michael", "hello", redis.print);

}
