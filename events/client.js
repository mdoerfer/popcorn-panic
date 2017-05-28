var util = require('util');

/**
* Handle client connection
*
* @param client [The client socket that connected]
*/
exports.onClientConnection = function(client) {
   util.log('New client connected. ID: ' + client.id);
};
