var util = require('util'),
    Player = require('./../models/player.model');

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

    //Add new player
    players.push(new Player(socket.id));
    util.log(players);

    bindEventHandlers();
};

/**
 * Bind all event handlers
 */
function bindEventHandlers() {
    socket.on('disconnect', exports.onSocketDisconnect);
    socket.on('signup', exports.onSignup);
    socket.on('login', exports.onLogin);
    socket.on('join-lobby', exports.onJoinLobby);
    socket.on('get-rooms', exports.onGetRooms);
    socket.on('create-room', exports.onCreateRoom);
    socket.on('join-room', exports.onJoinRoom);
    socket.on('leave-room', exports.onLeaveRoom);
    socket.on('change-map', exports.onChangeMap);
    socket.on('change-mode', exports.onChangeMode);
    socket.on('start-game', exports.onStartGame);
}

/**
 * Handle socket disconnect
 */
exports.onSocketDisconnect = function () {
    util.log();
    util.log('SOCKET_DISCONNECTED.');
    util.log('SOCKET_ID: ' + this.id);
    util.log('SOCKET_TRANSPORT: ' + this.client.conn.transport.constructor.name);

    for(var i = 0; i < players.length; i++) {
        if(players[i].id === this.id) {
            players.slice(i, 1);
        }
    }
};

/**
 * On 'signup'
 *
 * @param payload Contains the data emitted by the client
 */
exports.onSignup = function (payload) {
    this.emit('signup-done', {});
};

/**
 * On 'login'
 *
 * @param payload Contains the data emitted by the client
 */
exports.onLogin = function (payload) {
    this.emit('login-done', {});
};

/**
 * On 'join-lobby'
 *
 * @param payload Contains the data emitted by the client
 */
exports.onJoinLobby = function (payload) {
    this.emit('lobby-joined', {});
};

/**
 * On 'get-rooms'
 *
 * @param payload Contains the data emitted by the client
 */
exports.onGetRooms = function (payload) {
    this.emit('rooms-available', {});
};

/**
 * On 'create-room'
 *
 * @param payload Contains the data emitted by the client
 */
exports.onCreateRoom = function (payload) {
    this.emit('room-created', {});
};

/**
 * On 'join-room'
 *
 * @param payload Contains the data emitted by the client
 */
exports.onJoinRoom = function (payload) {
    this.emit('room-joined', {});
};

/**
 * On 'leave-room'
 *
 * @param payload Contains the data emitted by the client
 */
exports.onLeaveRoom = function (payload) {
    this.emit('room-left', {});
};

/**
 * On 'change-map'
 *
 * @param payload Contains the data emitted by the client
 */
exports.onChangeMap = function (payload) {
    this.emit('map-changed', {});
};

/**
 * On 'change-mode'
 *
 * @param payload Contains the data emitted by the client
 */
exports.onChangeMode = function (payload) {
    this.emit('mode-changed', {});
};

/**
 * On 'start-game'
 *
 * @param payload Contains the data emitted by the client
 */
exports.onStartGame = function (payload) {
    this.emit('game-started', {});
};