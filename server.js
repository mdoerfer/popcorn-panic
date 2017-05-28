/**
 * Require dependencies
 */
var util = require('util'),
   fs = require('fs'),
   server = require('https').createServer({
      key: fs.readFileSync('../key.pem'),
      cert: fs.readFileSync('../csr.pem')
   }),
   io = require('socket.io')(server),
   clientEvents = require('./events/client');

/**
 * Initialize server
 * This function runs automatically when the server is started
 */
(function() {
   io.sockets.on('connection', clientEvents.onClientConnection);

   util.log('Starting server...');
   server.listen(80);
   util.log('Server started.');
})();
