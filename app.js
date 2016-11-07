//Data Seek
//created by Michael Braverman on October 14, 2016

var express = require('express');
var app = express();
var serv = require('http').Server(app);

var clientsOnline = 0;

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
	// setup the client once his settings are received
	console.log("New Client");
	clientsOnline++;

	// update socket data when new position recieved from a player
	socket.on('clientMessage', function(msg) {
		console.log("Clent message!");
		console.log(msg);
	});

	// disconnect player when he leaves
	socket.on('disconnect', function() {
		console.log("Client disconnect");
		clientsOnline--;
	});
});

// SENDING DATA
// var refresh = 2; // set refresh rate (times per second)
// setInterval(function(){
// 	var pack = {
// 		msg: "hey client!",
// 		clientsOnline: clientsOnline
// 	}
// 	io.emit('serverMessage',pack);
// }, 1000/refresh);
