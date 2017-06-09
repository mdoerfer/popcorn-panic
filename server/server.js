/**
 * Require dependencies
 */
var util = require('util'),
    server = require('http').createServer(),
    io = require('socket.io')(server);

/**
 * Require managers
 */
var PlayerManager = require('./managers/player.manager'),
    RoomManager = require('./managers/room.manager');

/**
 * Global variables
 */
var players = new PlayerManager(),
    rooms = new RoomManager();

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

    players.createPlayer(socket.id);

    bindEventHandlers(socket);
}

/**
 * Bind all event handlers
 */
function bindEventHandlers(socket) {
    onDisconnect(socket);
    onJoinLobby(socket);
    onChooseName(socket);
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

        //Remove player from players
        players.removePlayer(socket.id);
    });
}

/**
 * On 'join-lobby'
 */
function onJoinLobby(socket) {
    socket.on('join-lobby', function(payload) {
        util.log();
        util.log('JOIN_LOBBY.');

        //Give lobby information to new player
        socket.emit('lobby-joined', {
            state: 'success',
            data: {
                myPlayer: players.getPlayer(socket.id),
                players: players.getPlayers(),
                rooms: rooms.getRooms()
            }
        });

        //Inform all players about somebody joining the lobby
        socket.broadcast.emit('lobby-joined', {
            state: 'success',
            data: {
                newPlayer: players.getPlayer(socket.id),
                players: players.getPlayers(),
                rooms: rooms.getRooms()
            }
        });
    });
}

/**
 * On 'choose-name'
 */
function onChooseName(socket) {
    socket.on('choose-name', function(payload) {
        util.log();
        util.log('CHOOSE_NAME.');

        //Change player name
        var player = players.getPlayer(socket.id);

        if(!payload.name.length) {
            player.setName('Unknown Unicorn');
        }
        else {
            player.setName(payload.name);
        }

        //Give new player new information about himself
        socket.emit('name-chosen', {
            state: 'success',
            data: {
                player: player
            }
        });
    });
}

/**
 * On 'create-room'
 */
function onCreateRoom(socket) {
    socket.on('create-room', function(payload) {
        util.log();
        util.log('ROOM_CREATED.');

        var roomCreated = rooms.createRoom(payload.name, socket.id);

        if(roomCreated) {
            var room = rooms.getRoom(payload.name);

            socket.emit('room-created', {
                state: 'success',
                data: {
                    room: room,
                    rooms: rooms.getRooms()
                }
            });

            socket.broadcast.emit('room-created', {
                state: 'success',
                data: {
                    room: room,
                    rooms: rooms.getRooms()
                }
            })
        }
        else {
            socket.emit('room-created', {
                state: 'error'
            });
        }
    });
}

/**
 * On 'join-room'
 */
function onJoinRoom(socket) {
    socket.on('join-room', function(payload) {
        util.log();
        util.log('JOIN_ROOM.');

        if(rooms.roomExists(payload.name)) {
            var room = rooms.getRoom(payload.name);

            var roomJoined = room.addPlayer(socket.id);
            socket.join(room.getName());

            if(roomJoined) {
                var newPlayer = players.getPlayer(socket.id),
                    roomPlayers = players.getPlayers(room.getPlayers());

                io.to(room.getName()).emit('room-joined', {
                    state: 'success',
                    data: {
                        room: room,
                        rooms: rooms.getRooms(),
                        player: newPlayer,
                        players: roomPlayers
                    }
                });
            }
            else {
                socket.emit('room-joined', {
                    state: 'error'
                });
            }
        }
    });
}

/**
 * On 'leave-room'
 */
function onLeaveRoom(socket) {
    socket.on('leave-room', function(payload) {
        util.log();
        util.log('LEAVE_ROOM.');

        if(rooms.roomExists(payload.name)) {
            var room = rooms.getRoom(payload.name);

            var roomLeft = room.removePlayer(socket.id);
            socket.leave(room.getName());

            if(roomLeft) {
                var player = players.getPlayer(socket.id);

                io.to(room.getName()).emit('room-left', {
                    state: 'success',
                    data: {
                        player: player
                    }
                });

                socket.emit('room-left', {
                    state: 'success',
                    data: {
                        player: player
                    }
                });

                if(room.isEmpty()) {
                    rooms.removeRoom(room.getName());
                }
            }
            else {
                socket.emit('room-left', {
                    state: 'error'
                });
            }
        }
    });
}

/**
 * On 'change-map'
 */
function onChangeMap(socket) {
    socket.on('change-map', function(payload) {
        util.log();
        util.log('CHANGE_MAP.');

        if(rooms.roomExists(payload.roomName)) {
            var room = rooms.getRoom(payload.roomName);
            room.setMap(payload.mapName);

            io.to(room.getName()).emit('map-changed', {
                state: 'success',
                data: {
                    room: room
                }
            });
        }
    });
}

/**
 * On 'change-mode'
 */
function onChangeMode(socket) {
    socket.on('change-mode', function(payload) {
        util.log();
        util.log('CHANGE_MODE.');

        if(rooms.roomExists(payload.roomName)) {
            var room = rooms.getRoom(payload.roomName);
            room.setMode(payload.modeName);

            io.to(room.getName()).emit('mode-changed', {
                state: 'success',
                data: {
                    room: room
                }
            });
        }
    });
}

/**
 * On 'start-game'
 */
function onStartGame(socket) {
    socket.on('start-game', function(payload) {
        util.log();
        util.log('START_GAME.');

        var room = rooms.getRoom(payload.name);

        io.to(room.getName()).emit('game-started', {});
    });
}