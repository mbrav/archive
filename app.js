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
		console.log("new client connected");
		console.log(msg);

		io.emit('newClient', {
			clientsOnline: clientsOnline,
			host: socket.handshake.headers.host,
			agent: socket.handshake.headers["user-agent"]
		});
	});

	// disconnect player when he leaves
	socket.on('disconnect', function() {
		console.log("Client disconnect");
		clientsOnline--;
		io.emit('clientDisconnect', {
			clientsOnline: clientsOnline
		});
	});
});

// server message
var refresh = 0.1; // set refresh rate (times per second)
setInterval(function(){

	var serverMessages = [
		"sounds like it is time you close your browser window ...",
		"can't read any email's? there aren't any",
		"CNN claims this is illegal ...",
		"guess who is going to become presisdent anyway ...",
		"a f**k up? just blame the Russians",
		"Sudian Arabian camels...",
		// "2 politcal parties, 4 banks, 3 oil firms, 4 big media companies, 97 jelly bean flavours, 56 bagel flavours. FREEDOM OF CHOICE!",
		'"God bless the America we are trying to create."',
		'"We are going to take things away from you on behalf of the common good."',
		'"Im not going to have some reporters pawing through our papers."',
		'"We came, we saw, he died"',
		'"Its this vast right-wing conspiracy that has been against my husband."',
		'"Dont let anybody tell you that its corporations and businesses that create jobs."',
	];

	io.emit('serverMessage', {
			msg: serverMessages[Math.floor(Math.random()*serverMessages.length)]
			// msg: "test"
	});

}, 1000/refresh);

function opacityFormula(usersOnline) {
  return Math.exp(usersOnline/100)-1;
}
