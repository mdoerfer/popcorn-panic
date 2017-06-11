/**
 * Require dependencies
 */
var util = require('util'),
    server = require('http').createServer(),
    io = require('socket.io')(server);

/**
 * Require game manager
 */
var GameManager = require('./managers/game.manager');

/**
 * Global variables
 */
var game = new GameManager();

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
    util.log('STARTING POPCORN-PANIC SERVER...');

    var PORT = 80;

    server.listen(PORT, function() {
        util.log('POPCORN-PANIC SERVER STARTED.');
        util.log('LISTENING ON PORT ' + PORT);
    });
}

/**
 * Handle client connection
 *
 * @param socket [The socket connection]
 */
function onSocketConnection(socket) {
    //Console
    util.log();
    util.log('NEW_SOCKET_CONNECTED.');
    util.log('SOCKET_ID: ' + socket.id);
    util.log('SOCKET_TRANSPORT: ' + socket.client.conn.transport.constructor.name);

    //Create player
    var playerId = socket.id;
    game.playerManager.createPlayer(playerId);

    //Bind event handlers to socket
    bindEventHandlers(socket);
}

/**
 * Bind all event handlers
 */
function bindEventHandlers(socket) {
    onDisconnect(socket);
    onJoinLobby(socket);
    onChooseName(socket);
    onChooseCharacter(socket);
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
        //Console
        util.log();
        util.log('SOCKET_DISCONNECTED.');
        util.log('SOCKET_ID: ' + socket.id);
        util.log('SOCKET_TRANSPORT: ' + socket.client.conn.transport.constructor.name);

        //Remove player from players and clear up leftovers
        var playerId = socket.id;
        game.playerManager.removePlayer(playerId);
        game.roomManager.removeLeftovers(playerId);
    });
}

/**
 * On 'join-lobby'
 */
function onJoinLobby(socket) {
    socket.on('join-lobby', function(payload) {
        //Console
        util.log();
        util.log('JOIN_LOBBY.');

        //Player ID
        var playerId = socket.id;

        //Give lobby information to new player
        socket.emit('lobby-joined', {
            state: 'success',
            data: {
                myPlayer: game.playerManager.getPlayer(playerId),
                players: game.playerManager.getPlayers(),
                rooms: game.roomManager.getRooms()
            }
        });

        //Inform all players about somebody joining the lobby
        socket.broadcast.emit('lobby-joined', {
            state: 'success',
            data: {
                players: game.playerManager.getPlayers(),
                rooms: game.roomManager.getRooms()
            }
        });
    });
}

/**
 * On 'choose-name'
 */
function onChooseName(socket) {
    socket.on('choose-name', function(payload) {
        //Console
        util.log();
        util.log('CHOOSE_NAME.');

        //Get variables
        var playerId = socket.id;
        var playerName = payload.name;

        //Change player name
        var player = game.playerManager.getPlayer(playerId).setName(playerName);

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
 * On 'choose-character'
 */
function onChooseCharacter(socket) {
    socket.on('choose-character', function(payload) {
        //Console
        util.log();
        util.log('CHOOSE_CHARACTER.');

        //Get variables
        var playerId = socket.id;
        var playerCharacter = payload.character;

        //Change player character
        var player = game.playerManager.getPlayer(playerId).setCharacter(playerCharacter);

        //Give new player new information about himself
        socket.emit('character-chosen', {
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
        //Get variables
        var playerId = socket.id;
        var roomName = payload.name;

        //Try creating
        var roomCreated = game.roomManager.createRoom(roomName, playerId);

        if(roomCreated) {
            //Console
            util.log();
            util.log('ROOM_CREATED.');

            //Get room
            var room = game.roomManager.getRoom(roomName);

            //Inform user about room creation
            socket.emit('room-created', {
                state: 'success',
                data: {
                    room: room,
                    rooms: game.roomManager.getRooms()
                }
            });

            //Inform all other users about room creation
            socket.broadcast.emit('room-created', {
                state: 'success',
                data: {
                    room: room,
                    rooms: game.roomManager.getRooms()
                }
            })
        }
        else {
            //Console
            util.log();
            util.log('ERROR_ROOM_CREATED.');

            //Inform user about error
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
        //Get variables
        var playerId = socket.id;
        var roomName = payload.name;

        //Check if room exists and player hasn't joined any rooms yet
        var playerMayJoin = game.roomManager.roomExists(roomName) && !game.roomManager.playerIsMemberAlready(playerId);

        if(playerMayJoin) {
            //Get room
            var room = game.roomManager.getRoom(roomName);

            //Try joining
            var roomJoined = room.addPlayer(playerId);

            if(roomJoined) {
                //Console
                util.log();
                util.log('ROOM_JOINED.');

                //Join socket room
                socket.join(room.getName());

                //Payload variables
                var newPlayer = game.playerManager.getPlayer(playerId),
                    roomPlayers = game.playerManager.getPlayers(room.getPlayers());

                //Inform game room about user joining
                io.to(room.getName()).emit('room-joined', {
                    state: 'success',
                    data: {
                        room: room,
                        rooms: game.roomManager.getRooms(),
                        player: newPlayer,
                        players: roomPlayers
                    }
                });

                //Inform user about joining the room
                socket.emit('room-joined', {
                    state: 'success',
                    data: {
                        rooms: game.roomManager.getRooms()
                    }
                });

                //Inform all other users that someone joined a room
                socket.broadcast.emit('room-joined', {
                    state: 'success',
                    data: {
                        rooms: game.roomManager.getRooms()
                    }
                });
            }
            else {
                //Console
                util.log();
                util.log('ERROR_ROOM_JOINED.');

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
        //Get variables
        var playerId = socket.id;
        var roomName = payload.name;

        //Check if room exists
        var roomExists = game.roomManager.roomExists(roomName);

        //If room exists, try leaving
        if(roomExists) {
            var room = game.roomManager.getRoom(roomName);

            //Try leaving
            var roomLeft = room.removePlayer(playerId);

            if(roomLeft) {
                //Console
                util.log();
                util.log('LEAVE_ROOM.');

                //Leave socket room
                socket.leave(room.getName());

                //Get leaving player
                var player = game.playerManager.getPlayer(playerId);

                //Inform game room about user leaving
                io.to(room.getName()).emit('room-left', {
                    state: 'success',
                    data: {
                        player: player
                    }
                });

                //Inform player about leaving the room
                socket.emit('room-left', {
                    state: 'success',
                    data: {
                        player: player
                    }
                });

                //If room is empty now, remove it
                if(room.isEmpty()) {
                    game.roomManager.removeRoom(room.getName());
                }
            }
            else {
                //Console
                util.log();
                util.log('ERROR_LEAVE_ROOM.');

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
        //Get variables
        var playerId = socket.id;
        var roomName = payload.roomName;
        var mapName = payload.mapName;

        //Check if room exists
        var roomExists = game.roomManager.roomExists(roomName);

        if(roomExists) {
            //Get room
            var room = game.roomManager.getRoom(roomName);

            //Check if player is owner
            var playerIsOwner = room.hasOwner(playerId);

            if(playerIsOwner) {
                //Console
                util.log();
                util.log('CHANGE_MAP.');

                //Set the map
                room.setMap(mapName);

                //Inform game room about map change
                io.to(room.getName()).emit('map-changed', {
                    state: 'success',
                    data: {
                        room: room
                    }
                });
            }
            else {
                //Console
                util.log();
                util.log('DENY_CHANGE_MAP. (PLAYER_ISNT_OWNER)');
            }
        }
        else {
            //Console
            util.log();
            util.log('ERROR_CHANGE_MAP. (ROOM_DOESNT_EXIST)');
        }
    });
}

/**
 * On 'change-mode'
 */
function onChangeMode(socket) {
    socket.on('change-mode', function(payload) {
        //Get variables
        var playerId = socket.id;
        var roomName = payload.roomName;
        var modeName = payload.modeName;

        //Check if room exists
        var roomExists = game.roomManager.roomExists(roomName);

        if(roomExists) {
            //Get room
            var room = game.roomManager.getRoom(roomName);

            //Check if player is owner
            var playerIsOwner = room.hasOwner(playerId);

            if(playerIsOwner) {
                //Console
                util.log();
                util.log('CHANGE_MODE.');

                //Set the mode
                room.setMode(modeName);

                //Inform game room about mode change
                io.to(room.getName()).emit('mode-changed', {
                    state: 'success',
                    data: {
                        room: room
                    }
                });
            }
            else {
                //Console
                util.log();
                util.log('DENY_CHANGE_MODE. (PLAYER_ISNT_OWNER)');
            }
        }
        else {
            //Console
            util.log();
            util.log('ERROR_CHANGE_MODE. (ROOM_DOESNT_EXIST)');
        }
    });
}

/**
 * On 'start-game'
 */
function onStartGame(socket) {
    socket.on('start-game', function(payload) {
        //Get variables
        var playerId = socket.id;
        var roomName = payload.roomName;

        //Check if room exists
        var roomExists = game.roomManager.roomExists(roomName);

        if(roomExists) {
            //Get room
            var room = game.roomManager.getRoom(roomName);

            //Check if player is owner
            var playerIsOwner = room.hasOwner(playerId);

            if(playerIsOwner) {
                //Console
                util.log();
                util.log('START_GAME.');

                //Set the mode
                room.startGame();

                //Inform game room about mode change
                io.to(room.getName()).emit('game-started', {
                    state: 'success',
                    data: {
                        room: room
                    }
                });
            }
            else {
                //Console
                util.log();
                util.log('DENY_START_GAME. (PLAYER_ISNT_OWNER)');
            }
        }
        else {
            //Console
            util.log();
            util.log('ERROR_START_GAME. (ROOM_DOESNT_EXIST)');
        }
    });
}