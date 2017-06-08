var util = require('util');

/**
 * Handle client connection
 *
 * @param socket [The socket connection]
 */
exports.onSocketConnection = function (socket) {
    util.log();
    util.log('NEW_SOCKET_CONNECTED.');
    util.log('SOCKET_ID: ' + socket.id);
    util.log('SOCKET_TRANSPORT: ' + socket.client.conn.transport.constructor.name);

    //Bind EventHandlers
    socket.on('disconnect', exports.onSocketDisconnect);
};

/**
 * Handle socket disconnect
 *
 * this = socket
 */
exports.onSocketDisconnect = function () {
    util.log();
    util.log('SOCKET_DISCONNECTED.');
    util.log('SOCKET_ID: ' + this.id);
    util.log('SOCKET_TRANSPORT: ' + this.client.conn.transport.constructor.name);
};
