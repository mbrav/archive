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

var io = require('socket.io')(serv,{});
io.sockets.on ('connection', function(socket) {
	console.log('SOCKET CONNEXION');

	socket.on('data', function(data){
		console.log(data);
		socket.emit('NSAmsg', {
			msg:'YOU WHERE IDENTIFIED AS ' + data.user + ' BY THE NSA'
		});
	});

});
