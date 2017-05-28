var util = require('util'),
   io = require('socket.io');

var socket,
   players;

(function init() {
   players = [];

   socket = io.listen(80);

   setEventHandlers();
})();

function setEventHandlers() {
   socket.sockets.on('connection', onSocketConnection);
}

function onSocketConnection(client) {
   util.log('New client has connected. ID: ' + client.id);
}
