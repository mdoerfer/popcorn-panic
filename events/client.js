var util = require('util');

/**
* Handle client connection
*
* @param client [The client socket that connected]
*/
exports.onClientConnection = function(client) {
   util.log('New client connected. ID: ' + client.id);

   client.on('disconnect', function() {
      util.log('Client disconnected.');
   });
};

/**
 * Handle client disconnect
 *
 * @param client [The client socket that disconnected]
 */
exports.onClientDisconnect = function(client) {
   util.log('Client disconnected. ID: ' + client.id);
};
