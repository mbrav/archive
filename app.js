//Data Seek
//created by Michael Braverman on October 14, 2016

var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/',function(req, res) {
	res.sendFile(__dirname + '/client/index.html');
});

// make everything in the /client folder available to the user
app.use(express.static('client'));

// socket.io connection port
serv.listen(2000);
console.log('SERVER STARTED');

var socketList = {};

var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket) {
	console.log('SOCKET CONNEXION');

	// setup the client once his settings are received
	socket.on('settings', function(clientSettings) {
		console.log('Client Settings Received', clientSettings);

		var id = Math.random();
		socket.id = id;
		socket.width = clientSettings.width;
		socket.height = clientSettings.height;
		socket.name = "" + Math.floor(1000000 * id); // convert id into a name
		socket.x = Math.random() * clientSettings.width;
		socket.y = Math.random() * clientSettings.height;
		socket.color = clientSettings.color;
		socket.fontSize = clientSettings.fontSize;
		socketList[socket.id] = socket;
  });

	// disconnect client when he leaves
	socket.on('disconnect', function() {
		delete socketList[socket.id];
	});
});

// set refresh rate
var fps = 100;
setInterval(function(){

	// data pack about all other players
	var pack = [];

	// update every player
	for (var i in socketList) {
		var socket = socketList[i];
		socket.x +=2;
		// limit to the canvas
		if (socket.x > socket.width - socket.fontSize) {
			socket.x = 0;
			socket.y += socket.fontSize;
			if (socket.y > socket.height) {
				socket.y = 0;
			}
		}

		// update player data pack
		pack.push({
			x:socket.x,
			y:socket.y,
			name:socket.name,
			color:socket.color,
			fontSize:socket.fontSize
		});
	}

	// send info about every player to every player
	// (yes, that's right)
	for (var i in socketList) {
		var socket = socketList[i];
		socket.emit('newPositions',pack);
	}
}, 1000/fps);
