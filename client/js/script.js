var canvas = document.getElementById('ctx'); // DOM canvas
var ctx = canvas.getContext('2d'); // drawing canavs
var socket = io();

// settings
var colors = {};
var fontSize;

setup();
function setup() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  colors.r = Math.floor(Math.random() * 255);
  colors.g = Math.floor(Math.random() * 255);
  colors.b = Math.floor(Math.random() * 255);

  fontSize = Math.floor(Math.random() * 64 + 32);

  // send settings
  socket.emit('settings', {
    width: canvas.width,
    height: canvas.height,
    color: colors,
    fontSize: fontSize
  });
}

socket.on('newPositions', function(data){

  // draw data that fades
  ctx.fillStyle = 'rgba(255,255,255,0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  console.log(data);
  for (var i = 0; i < data.length; i++) {
    ctx.fillStyle = 'rgb('+ data[i].color.r  + ',' + data[i].color.g  + ',' + data[i].color.b  + ')';
    ctx.font = "" + data[i].fontSize + "px serif";
    ctx.fillText(data[i].name, data[i].x, data[i].y);
  }
});
