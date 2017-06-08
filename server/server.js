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
(function() {
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

    server.listen(80, function() {
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
    onDisconnect(socket);
    onChooseName(socket);
    onJoinLobby(socket);
    onGetRooms(socket);
    onCreateRoom(socket);
    onJoinRoom(socket);
    onLeaveRoom(socket);
    onChangeMap(socket);
    onChangeMode(socket);
    onStartGame(socket);
}

/**
 * On 'disconnect'
 */
function onDisconnect(socket) {
    socket.on('disconnect', function(payload) {
        util.log();
        util.log('SOCKET_DISCONNECTED.');
        util.log('SOCKET_ID: ' + socket.id);
        util.log('SOCKET_TRANSPORT: ' + socket.client.conn.transport.constructor.name);

        removePlayer(socket.id);
    });
}

/**
 * On 'choose-name'
 */
function onChooseName(socket) {
    socket.on('choose-name', function(payload) {
        util.log();
        util.log('CHOOSE_NAME.');
        util.log('SOCKET_ID: ' + socket.id);
        util.log('SOCKET_TRANSPORT: ' + socket.client.conn.transport.constructor.name);

        //Change player name
        var player = findPlayer(socket.id);
        player.setName(payload.name);

        //Emit name-chosen
        socket.emit('name-chosen', {
            state: 'success',
            data: {
                player: player
            }
        });
    });
}

/**
 * On 'join-lobby'
 */
function onJoinLobby(socket) {
    socket.on('join-lobby', function(payload) {
        util.log();
        util.log('JOIN_LOBBY.');

        socket.emit('lobby-joined', {});
    });
}

/**
 * On 'get-rooms'
 */
function onGetRooms(socket) {
    socket.on('get-rooms', function(payload) {
        util.log();
        util.log('GET_ROOMS.');

        socket.emit('rooms-available', {});
    });
}

/**
 * On 'create-room'
 */
function onCreateRoom(socket) {
    socket.on('create-room', function(payload) {
        util.log();
        util.log('ROOM_CREATED.');

        socket.emit('room-created', {});
    });
}

/**
 * On 'join-room'
 */
function onJoinRoom(socket) {
    socket.on('join-room', function(payload) {
        util.log();
        util.log('JOIN_ROOM.');

        socket.emit('room-joined', {});
    });
}

/**
 * On 'leave-room'
 */
function onLeaveRoom(socket) {
    socket.on('leave-room', function(payload) {
        util.log();
        util.log('LEAVE_ROOM.');

        socket.emit('room-left', {});
    });
}

/**
 * On 'change-map'
 */
function onChangeMap(socket) {
    socket.on('change-map', function(payload) {
        util.log();
        util.log('CHANGE_MAP.');

        socket.emit('map-changed', {});
    });
}

/**
 * On 'change-mode'
 */
function onChangeMode(socket) {
    socket.on('change-mode', function(payload) {
        util.log();
        util.log('CHANGE_MODE.');

        socket.emit('mode-changed', {});
    });
}

/**
 * On 'start-game'
 */
function onStartGame(socket) {
    socket.on('start-game', function(payload) {
        util.log();
        util.log('START_GAME.');

        socket.emit('game-started', {});
    });
}

/**
 * Helper functions
 */

//Add new player
function newPlayer(id) {
    players.push(new Player(id));
}
//Remove player
function removePlayer(id) {
    for(var i = 0; i < players.length; i++) {
        if(players[i].getId() === id) {
            players.splice(i, 1);
        }
    }
}
//Find player
function findPlayer(id) {
    for(var i = 0; i < players.length; i++) {
        if(players[i].getId() === id) {
            return players[i];
        }
    }
}