/**
 * Require dependencies
 */
var util = require('util'),
    io = require('socket.io');

/**
 * Require models
 */
var Player = require('./models/player.model'),
    Room = require('./models/room.model');

/**
 * Global variables
 */
var socket;

var players = [],
    rooms = [];

/**
 * Initialize server
 *
 * This function runs automatically when the server is started
 */
(function () {
    startSocketServer();
})();

/**
 * Establish socket connection
 */
function startSocketServer() {
    util.log('STARTING SERVER...');

    socket = io.listen(80, function() {
        util.log('SERVER STARTED.');
        socket.sockets.on('connection', onSocketConnection);
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

    //Add new player to players array
    players.push(new Player(socket.id));

    bindEventHandlers(socket);
}

/**
 * Bind all event handlers
 */
function bindEventHandlers(socket) {
    socket.on('disconnect', onSocketDisconnect);
    socket.on('choose-name', onChooseName);
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
 * Handle socket disconnect
 */
function onSocketDisconnect() {
    util.log();
    util.log('SOCKET_DISCONNECTED.');
    util.log('SOCKET_ID: ' + this.id);
    util.log('SOCKET_TRANSPORT: ' + this.client.conn.transport.constructor.name);

    //Remove player from players array
    for(var i = 0; i < players.length; i++) {
        if(players[i].getId() === this.id) {
            players.splice(i, 1);
        }
    }
}

/**
 * On 'choose-name'
 *
 * @param payload Contains the data emitted by the client
 */
function onChooseName(payload) {
    util.log();
    util.log('CHOOSE_NAME.');

    socket.emit('name-chosen', {});
}

/**
 * On 'join-lobby'
 *
 * @param payload Contains the data emitted by the client
 */
function onJoinLobby(payload) {
    util.log();
    util.log('JOIN_LOBBY.');

    //this.emit('lobby-joined', {});
}

/**
 * On 'get-rooms'
 *
 * @param payload Contains the data emitted by the client
 */
function onGetRooms(payload) {
    util.log();
    util.log('GET_ROOMS.');

    //this.emit('rooms-available', {});
}

/**
 * On 'create-room'
 *
 * @param payload Contains the data emitted by the client
 */
function onCreateRoom(payload) {
    util.log();
    util.log('CREATE_ROOM.');

    //this.emit('room-created', {});
}

/**
 * On 'join-room'
 *
 * @param payload Contains the data emitted by the client
 */
function onJoinRoom(payload) {
    util.log();
    util.log('JOIN_ROOM.');

    //this.emit('room-joined', {});
}

/**
 * On 'leave-room'
 *
 * @param payload Contains the data emitted by the client
 */
function onLeaveRoom(payload) {
    util.log();
    util.log('LEAVE_ROOM.');

    //this.emit('room-left', {});
}

/**
 * On 'change-map'
 *
 * @param payload Contains the data emitted by the client
 */
function onChangeMap(payload) {
    util.log();
    util.log('CHANGE_MAP.');

    //this.emit('map-changed', {});
}

/**
 * On 'change-mode'
 *
 * @param payload Contains the data emitted by the client
 */
function onChangeMode(payload) {
    util.log();
    util.log('CHANGE_MODE.');

    //this.emit('mode-changed', {});
}

/**
 * On 'start-game'
 *
 * @param payload Contains the data emitted by the client
 */
function onStartGame(payload) {
    util.log();
    util.log('START_GAME.');

    //this.emit('game-started', {});
}