//Data Seek
//created by Michael Braverman on October 14, 2016

var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/',function(req, res) {
	res.sendFile(__dirname + '/client/index.html');
});
app.use('/client',express.static(__dirname + '/client'));

serv.listen(2000);

console.log('SERVER STARTED');

var socketList = {};

var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket) {
	console.log('SOCKET CONNEXION');

	// setup the clinet once his settings are received
	socket.on('settings', function(clientSettings) {
		console.log('Client Settings Received', clientSettings);

		var id = Math.random();
		socket.width = clientSettings.width;
		socket.height = clientSettings.height;
		socket.id = id;
		socket.name = "" + Math.floor(1000000 * id); // convert id into a name
		socket.x = 0;
		socket.y = clientSettings.fontSize;
		socket.z = 0;
		socket.color = clientSettings.color;
		socket.fontSize = clientSettings.fontSize;
		socketList[socket.id] = socket;
  });

	// disconnect client when he leaves
	socket.on('disconnect', function() {
		delete socketList[socket.id]
	});
});

// set refresh rate
var fps = 30;
setInterval(function(){

	// data about all other players
	var pack = [];

	for (var i in socketList) {
		var socket = socketList[i];
		socket.x += 10;

		// limit to the canvas
		if (socket.x > socket.width) {
			socket.x = 0;
			socket.y += 10;
			if (socket.y > socket.height) {
				socket.y = 0;
				socket.z ++;
			}
		}
		pack.push({
			x:socket.x,
			y:socket.y,
			z:socket.z,
			name:socket.name,
			color: socket.color,
			fontSize: socket.fontSize
		});
	}
	for (var i in socketList) {
		// send info to every player about every other player
		socket.emit('newPositions',pack);
	}
}, 1000/fps);
