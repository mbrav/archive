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

// RECEIVING DATA
var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket) {
	console.log('SOCKET CONNEXION');

	// setup the client once his settings are received
	socket.on('settings', function(clientSettings) {
		console.log('Client Settings Received', clientSettings);

		socket.id = clientSettings.id;
		socket.x = clientSettings.x;
		socket.y = clientSettings.y;
		socket.z = clientSettings.z;
		socketList[socket.id] = socket;
  });

	// update socket data when new position recieved from a player
	socket.on('playerPosition', function(playerPos) {
		if(socketList[playerPos.id]!=null) {
			socketList[playerPos.id].x = playerPos.x;
			socketList[playerPos.id].y = playerPos.y;
			socketList[playerPos.id].z = playerPos.z;
		}
	});

	// disconnect client when he leaves
	socket.on('disconnect', function() {
		delete socketList[socket.id];
	});
});

// SENDING DATA
var refresh = 60; // set refresh rate
setInterval(function(){

	// data pack about all other players
	var pack = [];

	// update every player
	for (var i in socketList) {
		var socket = socketList[i];

		// update the player data pack
		pack.push({
			x:socket.x,
			y:socket.y,
			z:socket.z,
			id:socket.id
		});
	}

	// send info about every player to every player
	// (yes, that's right)
	for (var i in socketList) {
		var socket = socketList[i];
		socket.emit('newPositions',pack);
	}
}, 1000/refresh);
