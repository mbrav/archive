var socket = io();

init();

console.log("Data Seek");

function init() {
  // send player settings
  socket.emit('clientMessage', {
    msg: "hi",
    id: Math.random()
  });

  console.log(emails);

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

    var element = document.getElementById("feed");
    element.appendChild(title);
    element.appendChild(fromWho);
    element.appendChild(toWho);
    element.appendChild(date);
    element.appendChild(content);
  }

  socket.on('serverMessage', function(msg){
    console.log("server msg");
    console.log(msg);

    // document.getElementById("feed").innerHTML = "Clients Online: " + msg.clientsOnline;


  });
}
