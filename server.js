/**
 * Require dependencies
 */
var util = require('util'),
   server = require('http').createServer(),
   io = require('socket.io')(server),
   clientEvents = require('./events/client');

/**
 * Initialize server
 * This function runs automatically when the server is started
 */
(function () {
   io.sockets.on('connection', clientEvents.onClientConnection);

   util.log('Starting server...');
   server.listen(80);
   util.log('Server started.');
})();
