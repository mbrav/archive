// Technelogical Feudalism
//created by Michael Braverman on April 18, 2016

var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');

var express = require('express'), app = module.exports = express();

var io = require('socket.io').listen(server);

var server = http.createServer(handleRequest).listen(80);

var data;
var authorized = false;

var times = 0;


// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io').listen(8002);

io.sockets.on('connection',
  // We are given a websocket object in our function
  function (socket) {

    console.log("We have a new client: " + socket.id);

    // When this user emits, client side: socket.emit('otherevent',some data);
    socket.on('send-data',
      function(dataIn) {
        times++;
        // Data comes in as whatever was sent, including objects
        console.log("Received" + times +" 'send-data' " + dataIn.oath);
        data = dataIn;

        // Send it to all other clients
        socket.broadcast.emit('spy-data', dataIn);

        // This is a way to send to everyone including sender
        // io.sockets.emit('spy-data', dataIn);
        console.log(dataIn);

      }
    );

    socket.on('disconnect', function() {
      console.log("Client has disconnected");
    });
  }
);

// name a fucntion handlRequest
function handleRequest (request, response) {

    response.writeHead(200, {'Content-Type': 'text/html'});

    // get the path at the end of the url
    var path = url.parse(request.url).pathname;
    // check what url user has entered
    switch (path) {
      case '/':
        render('./public/index.html', response);
        response.writeHead(200, {"Content-Type": "text/html"});
        break;
      case '/peasant':
        render('./public/peasant.html', response);
        response.writeHead(200, {"Content-Type": "text/html"});
        break;
      case '/noble':
        render('./public/noble.html', response);
        response.writeHead(200, {"Content-Type": "text/html"});
        break;
      case '/lie':
        render('./public/lie.html', response);
        response.writeHead(200, {"Content-Type": "text/html"});
        authorized = false;
        break;
      case '/prism':
        // does not work yet
        if (!authorized) {
          render('./public/prism.html', response);
          response.writeHead(200, {"Content-Type": "text/html"});
        } else {
          render('./public/lie.html', response);
          response.end("Sorry, your are either not a noble, or you are trying to be sneaky...\n");
        }
        break;
      case '/style.css':
        render('./public/style.css', response);
        response.writeHead(200, {"Content-Type": "text/css"});
        break;
      case '/socket.io-1.4.5.js':
        render('./public/js/socket.io-1.4.5.js', response);
        response.writeHead(200, {"Content-Type": "text/javascript"});
        break;
      case '/p5.min.js':
        render('./public/js/p5.min.js', response);
        response.writeHead(200, {"Content-Type": "text/javascript"});
        break;
      case '/p5.dom.js':
        render('./public/js/p5.dom.js', response);
        response.writeHead(200, {"Content-Type": "text/javascript"});
        break;
      default:
        response.writeHead(404);
        response.write('Route not defined!');
        response.end();
    }

    // if (data != null) {
    //   console.log("not null");
    //   if (data.oath != "hello") {
    //     response.writeHead(301, {
    //       "Location" : "/lie"
    //     });
    //     console.log("lie!");
    //     response.end();
    //   } else {
    //     response.writeHead(301, {
    //       "Location" : "/prism"
    //     });
    //     console.log("noble!");
    //     authorized = true;
    //     response.end();
    //   }
    // }
}

function render(path, response) {
  fs.readFile(path, null, function(error, data) {
    if (error) {
      response.writeHead(404);
      response.write('File not found!');
    }  else {
      response.write(data);
    }
    response.end();
  });
}
