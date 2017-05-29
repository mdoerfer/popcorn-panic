var util = require('util');

/**
* Handle client connection
*
* @param client [The client socket that connected]
*/
exports.onClientConnection = function(client) {
   util.log('New client connected. ID: ' + client.id);

   client.on('disconnect', onClientDisconnect);
};

onClientDisconnect = function(client) {
   util.log('Client disconnected. ID: ' + client.id);
   util.log('Socket: ' + client.client.conn.transport.constructor.name);
};
