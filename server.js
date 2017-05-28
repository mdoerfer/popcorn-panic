var util = require('util'),
   server = require('http').createServer(),
   io = require('socket.io')(server);

io.sockets.on('connection', onSocketConnection);

function onSocketConnection(client) {
   util.log('New client connected. ID: ' + client.id);
}

util.log('Server started.');
server.listen(80);
