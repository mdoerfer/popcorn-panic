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
};

/**
 * On 'signup'
 */
exports.onSignup = function (payload) {
    this.emit('signup-done', {});
};

/**
 * On 'login'
 */
exports.onLogin = function (payload) {
    this.emit('login-done', {});
};

/**
 * On 'join-lobby'
 */
exports.onJoinLobby = function (payload) {
    this.emit('lobby-joined', {});
};

/**
 * On 'get-rooms'
 */
exports.onGetRooms = function (payload) {
    this.emit('rooms-available', {});
};

/**
 * On 'create-room'
 */
exports.onCreateRoom = function (payload) {
    this.emit('room-created', {});
};

/**
 * On 'join-room'
 */
exports.onJoinRoom = function (payload) {
    this.emit('room-joined', {});
};

/**
 * On 'leave-room'
 */
exports.onLeaveRoom = function (payload) {
    this.emit('room-left', {});
};

/**
 * On 'change-map'
 */
exports.onChangeMap = function (payload) {
    this.emit('map-changed', {});
};

/**
 * On 'change-mode'
 */
exports.onChangeMode = function (payload) {
    this.emit('mode-changed', {});
};

/**
 * On 'start-game'
 */
exports.onStartGame = function (payload) {
    this.emit('game-started', {});
};