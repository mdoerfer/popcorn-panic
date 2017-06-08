/**
 * Require dependencies
 */
var util = require('util'),
    server = require('http').createServer(),
    io = require('socket.io')(server);

/**
 * Global variables
 */
var players = [],
    rooms = [];

/**
 * Require events
 */
var socketEvents = require('./events/socket.events');

/**
 * Initialize server
 *
 * This function runs automatically when the server is started
 */
(function () {
    initializeSockets();
    startServer();
})();

/**
 * Establish socket connection
 */
function initializeSockets() {
    io.sockets.on('connection', socketEvents.onSocketConnection);
}

/**
 * Start server
 */
function startServer() {
    util.log('STARTING SERVER...');

    server.listen(80, function () {
        util.log('SERVER STARTED.');
    });
}