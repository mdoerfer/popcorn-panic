/**
 * Require dependencies
 */
var util = require('util'),
   server = require('http').createServer(),
   io = require('socket.io')(server);

/**
 * Initialize server
 * This function runs automatically when the server is started
 * and runs all the necessary sub-functions
 */
(function () {
   initializeSockets();
   startServer();
})();

/**
 * Initialize sockets
 */
function initializeSockets() {
   util.log('Sockets initialized.');

   io.sockets.on('connection', onClientConnection);
}

/**
 * Handle client connection
 *
 * @param client [The client socket that connected]
 */
function onClientConnection(client) {
   util.log('New client connected. ID: ' + client.id);
}

/**
 * Start the gameserver
 */
function startServer() {
   util.log('Server started.');

   server.listen(80);
}
