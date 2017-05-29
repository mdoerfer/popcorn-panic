/**
 * Require dependencies
 */
var util = require('util'),
   fs = require('fs'),
   server = require('http').createServer(),
   io = require('socket.io')(server);

/**
 * Require events
 */
var clientEvents = require('./events/client');

/**
 * Initialize server
 * This function runs automatically when the server is started
 */
(function() {
   io.sockets.on('connection', clientEvents.onClientConnection);

   util.log('Starting server...');
   server.listen(8080);
   util.log('Server started.');
})();
