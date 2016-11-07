// socket
var socket = io();

init();

console.log("Data Seek");
function init() {
  // send player settings
  socket.emit('clientMessage', {
    msg: "hi",
    id: Math.random()
  });
  socket.on('serverMessage', function(msg){
    console.log("server msg");
    console.log(msg);
  });
}
