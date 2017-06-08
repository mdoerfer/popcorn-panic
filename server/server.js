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

    //Add new player to players
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
 * On 'join-lobby'
 */
function onJoinLobby(socket) {
    socket.on('join-lobby', function(payload) {
        util.log();
        util.log('JOIN_LOBBY.');

        //TODO: Leave socket rooms and go to lobby

        //Give lobby information to new player
        socket.emit('lobby-joined', {
            state: 'success',
            data: {
                players: players,
                rooms: rooms
            }
        });

        //Inform all players about somebody joining the lobby
        socket.broadcast.emit('lobby-joined', {
            state: 'success',
            data: {
                players: players,
                rooms: rooms
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

        var roomCreated = newRoom(payload.name);

        if(roomCreated) {
            var room = findRoom(payload.name);

            socket.emit('room-created', {
                state: 'success',
                data: {
                    room: room
                }
            });
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

        var roomJoined = joinRoom(socket, payload.name);

        if(roomJoined) {
            var room = findRoom(payload.name);
            var player = findPlayer(socket.id);
            var players = findPlayers(room.getPlayers());

            //Inform all people in the room about someone joining
            io.to(room.getName()).emit('room-joined', {
                state: 'success',
                data: {
                    room: room,
                    player: player,
                    players: players
                }
            });
        }
        else {
            socket.emit('room-joined', {
                state: 'error'
            });
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

        var roomLeft = leaveRoom(socket, payload.name);

        if(roomLeft) {
            var room = findRoom(payload.name);
            var player = findPlayer(socket.id);

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
                removeRoom(name);
            }
        }
        else {
            socket.emit('room-left', {
                state: 'error'
            });
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

        var changedMap = changeMap(payload.roomName, payload.mapName);

        if(changedMap) {
            var room = findRoom(payload.name);

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

        var changedMode = changeMode(payload.roomName, payload.modeName);

        if(changedMode) {
            var room = findRoom(payload.name);

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

        var room = findRoom(payload.name);

        io.to(room.getName()).emit('game-started', {});
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
//Find players
function findPlayers(ids) {
    var foundPlayers = [];

    for(var i = 0; i < players.length; i++) {
        for(var c = 0; c < ids.length; c++) {
            if(players[i].getId() === ids[c]) {
                foundPlayers.push(players[i]);
            }
        }
    }

    return foundPlayers;
}
//Player exists
function playerExists(id) {
    var playerExists = false;

    for(var i = 0; i < players.length; i++) {
        if(players[i].getId() === id) {
            playerExists = true;
        }
    }

    return playerExists;
}

//Add new room
function newRoom(name) {
    if(!roomExists(name)) {
        rooms.push(new Room(name));
        return true;
    }
    else {
        return false;
    }
}
//Remove room
function removeRoom(name) {
    for(var i = 0; i < rooms.length; i++) {
        if(rooms[i].getName() === name) {
            rooms.splice(i, 1);
        }
    }
}
//Find room
function findRoom(name) {
    for(var i = 0; i < rooms.length; i++) {
        if(rooms[i].getName() === name) {
            return rooms[i];
        }
    }
}
//Join room
function joinRoom(socket, name) {
    if(roomExists(name) && playerExists(socket.id)) {
        var room = findRoom(name);
        var player = findPlayer(socket.id);

        //If room isn't full
        if(!room.isFull()) {
            //If player is not in the room already
            if(!room.hasPlayer(player.getId())) {
                room.addPlayer(player.getId());
                socket.join(name);

                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}
//Leave room
function leaveRoom(socket, name) {
    if(roomExists(name) && playerExists(socket.id)) {
        var room = findRoom(name);
        var player = findPlayer(socket.id);

        room.removePlayer(player.getId());
        socket.leave(name);

        return true;
    }
    else {
        return false;
    }
}
//Change map
function changeMap(roomName, mapName) {
    if(roomExists(roomName)) {
        var room = findRoom(roomName);

        room.setMap(mapName);

        return true;
    }
    else {
        return false;
    }
}
//Change mode
function changeMode(roomName, modeName) {
    if(roomExists(roomName)) {
        var room = findRoom(roomName);

        room.setMode(modeName);

        return true;
    }
    else {
        return false;
    }
}
//Room exists
function roomExists(name) {
    var roomExists = false;

    for(var i = 0; i < rooms.length; i++) {
        if(rooms[i].getName() === name) {
            roomExists = true;
        }
    }

    return roomExists;
}