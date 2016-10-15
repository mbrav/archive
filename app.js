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
io.sockets.on ('connection', function(socket) {
	socket.id = Math.random();
	socket.x = 0;
	socket.y = 0;
	socket.z = 0;
	socketList[socket.id] = socket;

	console.log('SOCKET CONNEXION');

	socket.on('data', function(data){
		console.log(data);
		socket.emit('NSAmsg', {
			msg:'YOU WHERE IDENTIFIED AS ' + data.user + ' BY THE NSA'
		});
	});
});

// set refresh rate
var fps = 0.5;
setInterval(function(){
	for (var i in socketList) {
		var socket = socketList[i];
		socket.x += 0.5;
		if (socket.x > 300) {
			socket.x = 0;
			socket.y ++;
		}
		socket.z ++;
		socket.emit('newPosition',{
			x:socket.x,
			y:socket.y,
			z:socket.z
		});
	}
}), 1000/fps;
