/**
 * Require dependencies
 */
var util = require('util'),
    server = require('http').createServer(),
    io = require('socket.io')(server);

/**
 * Require models
 */
var Player = require('./models/player.model'),
    Room = require('./models/room.model');

/**
 * Global variables
 */
var players = [],
    rooms = [];

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
    io.sockets.on('connection', onSocketConnection);
}

/**
 * Start server
 */
function startServer() {
    util.log();
    util.log('STARTING SERVER...');

    server.listen(80, function () {
        util.log('SERVER STARTED.');
    });
}

/**
 * Handle client connection
 *
 * @param socket [The socket connection]
 */
function onSocketConnection(socket) {
    util.log();
    util.log('NEW_SOCKET_CONNECTED.');
    util.log('SOCKET_ID: ' + socket.id);
    util.log('SOCKET_TRANSPORT: ' + socket.client.conn.transport.constructor.name);

    newPlayer(socket.id);

    bindEventHandlers(socket);
}

/**
 * Bind all event handlers
 */
function bindEventHandlers(socket) {
    socket.on('disconnect', function(payload) {
        util.log();
        util.log('SOCKET_DISCONNECTED.');
        util.log('SOCKET_ID: ' + socket.id);
        util.log('SOCKET_TRANSPORT: ' + socket.client.conn.transport.constructor.name);

        console.log(socket);

        removePlayer(socket.id);
    });

    socket.on('choose-name', function(payload) {
        util.log();
        util.log('CHOOSE_NAME.');
        util.log('SOCKET_ID: ' + socket.id);
        util.log('SOCKET_TRANSPORT: ' + socket.client.conn.transport.constructor.name);

        var player = findPlayer(socket.id);
        player.setName(payload.name);

        socket.emit('name-chosen', {
            state: 'success',
            data: {
                player: player
            }
        });

        util.log(players);
    });

    socket.on('join-lobby', onJoinLobby);
    socket.on('get-rooms', onGetRooms);
    socket.on('create-room', onCreateRoom);
    socket.on('join-room', onJoinRoom);
    socket.on('leave-room', onLeaveRoom);
    socket.on('change-map', onChangeMap);
    socket.on('change-mode', onChangeMode);
    socket.on('start-game', onStartGame);
}

/**
 * On 'join-lobby'
 *
 * @param payload Contains the data emitted by the client
 */
function onJoinLobby(payload) {
    util.log();
    util.log('JOIN_LOBBY.');

    io.emit('lobby-joined', {});
}

/**
 * On 'get-rooms'
 *
 * @param payload Contains the data emitted by the client
 */
function onGetRooms(payload) {
    util.log();
    util.log('GET_ROOMS.');

    io.emit('rooms-available', {});
}

/**
 * On 'create-room'
 *
 * @param payload Contains the data emitted by the client
 */
function onCreateRoom(payload) {
    util.log();
    util.log('CREATE_ROOM.');

    io.emit('room-created', {});
}

/**
 * On 'join-room'
 *
 * @param payload Contains the data emitted by the client
 */
function onJoinRoom(payload) {
    util.log();
    util.log('JOIN_ROOM.');

    io.emit('room-joined', {});
}

/**
 * On 'leave-room'
 *
 * @param payload Contains the data emitted by the client
 */
function onLeaveRoom(payload) {
    util.log();
    util.log('LEAVE_ROOM.');

    io.emit('room-left', {});
}

/**
 * On 'change-map'
 *
 * @param payload Contains the data emitted by the client
 */
function onChangeMap(payload) {
    util.log();
    util.log('CHANGE_MAP.');

    io.emit('map-changed', {});
}

/**
 * On 'change-mode'
 *
 * @param payload Contains the data emitted by the client
 */
function onChangeMode(payload) {
    util.log();
    util.log('CHANGE_MODE.');

    io.emit('mode-changed', {});
}

/**
 * On 'start-game'
 *
 * @param payload Contains the data emitted by the client
 */
function onStartGame(payload) {
    util.log();
    util.log('START_GAME.');

    io.emit('game-started', {});
}

/**
 * Helper functions
 */
function newPlayer(id) {
    players.push(new Player(id));
}

function removePlayer(id) {
    for(var i = 0; i < players.length; i++) {
        if(players[i].getId() === id) {
            players.splice(i, 1);
        }
    }
}

function findPlayer(id) {
    for(var i = 0; i < players.length; i++) {
        if(players[i].getId() === id) {
            return players[i];
        }
    }
}