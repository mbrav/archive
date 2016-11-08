var socket = io();

init();

var feed, terminal;
var clientsOnline;

function init() {
  feed = document.getElementById("feed");
  terminal = document.getElementById("terminal");
  // send player settings
  socket.emit('clientMessage', {
    msg: "hi",
    id: Math.random()
  });

  for (var i = 0; i < emails.length; i++) {
    var title = document.createElement("h1");
    title.appendChild(document.createTextNode(emails[i].subject));

    var fromWho = document.createElement("h2");
    fromWho.appendChild(document.createTextNode("From: " + emails[i].from));

    var toWho = document.createElement("h2");
    toWho.appendChild(document.createTextNode("To: " + emails[i].to));

    var date = document.createElement("h2");
    date.appendChild(document.createTextNode("To: " + emails[i].timestamp));

    var content = document.createElement("p");
    content.appendChild(document.createTextNode("To: " + emails[i].body));

    feed.appendChild(title);
    feed.appendChild(fromWho);
    feed.appendChild(toWho);
    feed.appendChild(date);
    feed.appendChild(content);
  }

  socket.on('newClient', function(msg){
    clientsOnline = msg.clientsOnline;
    updateBasedOnClientsOnline();
    var terminalMessage = document.createElement("p");

    terminalMessage.appendChild(document.createTextNode("NEW USER CONNECTS, IP:" + msg.host + " AGENT: " + msg.agent + "--- " + msg.clientsOnline + " users remain online "));
    terminal.appendChild(terminalMessage);
  });

  socket.on('clientDisconnect', function(msg){
    clientsOnline = msg.clientsOnline;
    updateBasedOnClientsOnline();
    var terminalMessage = document.createElement("p");

    terminalMessage.appendChild(document.createTextNode("USER DISCONNECTS, " + msg.clientsOnline + " users remain online "));
    terminal.appendChild(terminalMessage);
  });

  socket.on('serverMessage', function(msg){
    var terminalMessage = document.createElement("p");

    terminalMessage.appendChild(document.createTextNode(msg.msg));
    terminal.appendChild(terminalMessage);
  });
}

function updateBasedOnClientsOnline() {
  feed.style.opacity = opacityFormula(clientsOnline);
  console.log(opacityFormula(clientsOnline));
}

function opacityFormula(usersOnline) {
  return Math.exp(usersOnline/60)-1;
}
