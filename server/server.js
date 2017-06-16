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
    onUpdateGameTime(socket);
    onStartGame(socket);
    onStartTimer(socket);
    onMovePlayer(socket);
    onTakeDamage(socket);
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
        game.roomManager.removeLeftovers(game, io, playerId);
        game.playerManager.removePlayer(playerId);
    });
}

/**
 * On 'join-lobby'
 */
function onJoinLobby(socket) {
    socket.on('join-lobby', function(payload) {
        //Console
        util.log();
        util.log('JOIN_LOBBY. (' + socket.id + ')');

        //Player ID
        var playerId = socket.id;

        //Give lobby information to new player
        socket.emit('lobby-joined', {
            state: 'success',
            target: 'me',
            data: {
                me: game.playerManager.getPlayer(playerId),
                players: game.playerManager.getPlayers(),
                rooms: game.roomManager.getRooms()
            }
        });

        //Inform all players about somebody joining the lobby
        socket.broadcast.emit('lobby-joined', {
            state: 'success',
            target: 'other',
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
        var playerName = payload.data.playerName;

        //Change player name
        var player = game.playerManager.getPlayer(playerId).setName(playerName);

        //Give new player new information about himself
        socket.emit('name-chosen', {
            state: 'success',
            target: 'me',
            data: {
                me: player
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
        var playerCharacter = payload.data.playerCharacter;

        //Change player character
        var player = game.playerManager.getPlayer(playerId).setCharacter(playerCharacter);

        //Give new player new information about himself
        socket.emit('character-chosen', {
            state: 'success',
            target: 'me',
            data: {
                me: player
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
        var roomName = payload.data.roomName;

        //Try creating
        var roomCreated = game.roomManager.createRoom(roomName, playerId);

        if(roomCreated) {
            //Console
            util.log();
            util.log('ROOM_CREATED.');

            //Get room
            var room = game.roomManager.getRoom(roomName),
                roomPlayers = game.playerManager.getPlayers(room.getPlayers());

            //Join socket room
            socket.join(room.getName());

            //Inform user about room creation
            socket.emit('room-created', {
                state: 'success',
                target: 'me',
                data: {
                    room: room,
                    roomPlayers: roomPlayers,
                    rooms: game.roomManager.getRooms()
                }
            });

            //Inform all other users about room creation
            socket.broadcast.emit('room-created', {
                state: 'success',
                target: 'other',
                data: {
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
                state: 'error',
                target: 'me',
                message: "Couldn't create room"
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

        //Handle random room joining
        var joinRandom = payload.data.random;
        var roomName = '';

        if(joinRandom) {
            var randomRoom = game.roomManager.getRandomRoom();

            if(randomRoom !== null) {
                roomName = randomRoom.getName();
            }
            else {
                //Inform user of error
                socket.emit('room-joined', {
                    state: 'error',
                    target: 'me',
                    message: "No random room found."
                });

                return;
            }
        }
        else {
            roomName = payload.data.roomName;
        }

        //Check if room exists and player hasn't joined any rooms yet
        var playerMayJoin = game.roomManager.roomExists(roomName) && !game.roomManager.playerIsMemberAlready(playerId) && !game.roomManager.gameHasStarted(roomName);

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
                    target: 'room',
                    data: {
                        room: room,
                        roomPlayers: roomPlayers,
                        newPlayer: newPlayer,
                        rooms: game.roomManager.getRooms()
                    }
                });

                //Inform all other users that someone joined a room
                socket.broadcast.emit('room-joined', {
                    state: 'success',
                    target: 'other',
                    data: {
                        rooms: game.roomManager.getRooms()
                    }
                });
            }
            else {
                //Console
                util.log();
                util.log('ERROR_ROOM_JOINED.');

                //Inform user of error
                socket.emit('room-joined', {
                    state: 'error',
                    target: 'me',
                    message: "Player couldn't join room."
                });
            }
        }
        else {
            //Console
            util.log();
            util.log('ERROR_ROOM_JOINED. (ROOM_DOESNT_EXIST_OR_PLAYER_ALREADY_MEMBER_OR_GAME_HAS_STARTED)');

            //Inform user of error
            socket.emit('room-joined', {
                state: 'error',
                target: 'me',
                message: "Room doesn't exist, player is already member of a room or game has already started."
            });
        }
    });
}

/**
 * On 'leave-room'
 */
function onLeaveRoom(socket, roomName) {
    socket.on('leave-room', function(payload) {
        //Get variables
        var playerId = socket.id;
        var roomName = payload.data.roomName || roomName;

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

                //Payload variables
                var leavingPlayer = game.playerManager.getPlayer(playerId),
                    roomPlayers = game.playerManager.getPlayers(room.getPlayers());

                //Inform game room about user leaving
                io.to(room.getName()).emit('room-left', {
                    state: 'success',
                    target: 'room',
                    data: {
                        room: room,
                        roomPlayers: roomPlayers,
                        leavingPlayer: leavingPlayer,
                        rooms: game.roomManager.getRooms()
                    }
                });

                //Leave socket room
                socket.leave(room.getName());

                //Inform player about leaving the room
                socket.emit('room-left', {
                    state: 'success',
                    target: 'me',
                    data: {
                        rooms: game.roomManager.getRooms()
                    }
                });

                //If room is empty now, remove it
                if(room.isEmpty()) {
                    var removedRoom = game.roomManager.removeRoom(room.getName());

                    if(removedRoom) {
                        //Console
                        util.log('REMOVE_ROOM_BECAUSE_EMPTY.');
                    }
                    else {
                        //Console
                        util.log('ERROR_REMOVE_ROOM_BECAUSE_EMPTY.');
                    }
                }
            }
            else {
                //Console
                util.log();
                util.log('ERROR_LEAVE_ROOM.');

                socket.emit('room-left', {
                    state: 'error',
                    target: 'me',
                    message: "Player couldn't leave room."
                });
            }
        }
        else {
            //Console
            util.log();
            util.log('ERROR_LEAVE_ROOM. (ROOM_DOESNT_EXIST)');

            //Inform user of error
            socket.emit('room-left', {
                state: 'error',
                target: 'me',
                message: "Room doesn't exist."
            });
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
        var roomName = payload.data.roomName;
        var mapName = payload.data.mapName;

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

                //Get room players
                var roomPlayers = game.playerManager.getPlayers(room.getPlayers());

                //Inform game room about map change
                io.to(room.getName()).emit('map-changed', {
                    state: 'success',
                    target: 'room',
                    data: {
                        room: room,
                        roomPlayers: roomPlayers
                    }
                });
            }
            else {
                //Console
                util.log();
                util.log('DENY_CHANGE_MAP. (PLAYER_ISNT_OWNER)');

                //Inform user of error
                socket.emit('map-changed', {
                    state: 'error',
                    target: 'me',
                    message: "Player can't change map, because he is not the room owner."
                });
            }
        }
        else {
            //Console
            util.log();
            util.log('ERROR_CHANGE_MAP. (ROOM_DOESNT_EXIST)');

            //Inform user of error
            socket.emit('map-changed', {
                state: 'error',
                target: 'me',
                message: "Room doesn't exist."
            });
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
        var roomName = payload.data.roomName;
        var modeName = payload.data.modeName;

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

                //Get room players
                var roomPlayers = game.playerManager.getPlayers(room.getPlayers());

                //Inform game room about mode change
                io.to(room.getName()).emit('mode-changed', {
                    state: 'success',
                    target: 'room',
                    data: {
                        room: room,
                        roomPlayers: roomPlayers
                    }
                });
            }
            else {
                //Console
                util.log();
                util.log('DENY_CHANGE_MODE. (PLAYER_ISNT_OWNER)');

                //Inform user of error
                socket.emit('mode-changed', {
                    state: 'error',
                    target: 'me',
                    message: "Player can't change mode, because he is not the room owner."
                });
            }
        }
        else {
            //Console
            util.log();
            util.log('ERROR_CHANGE_MODE. (ROOM_DOESNT_EXIST)');

            //Inform user of error
            socket.emit('mode-changed', {
                state: 'error',
                target: 'me',
                message: "Room doesn't exist."
            });
        }
    });
}

function onUpdateGameTime(socket) {
    socket.on('update-game-time', function(payload) {
        //Get variables
        var playerId = socket.id;
        var roomName = payload.data.roomName;
        var action = payload.data.action;

        console.log('ACTION: ' + action);

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
                util.log('UPDATE_GAME_TIME.');

                //Set the mode
                if(action === 'increase') {
                    room.increaseGameTime();
                }
                else if(action === 'decrease') {
                    room.decreaseGameTime();
                }

                console.log('GAME_TIME: ' + room.getGameTime());

                //Get room players
                var roomPlayers = game.playerManager.getPlayers(room.getPlayers());

                //Inform game room about mode change
                io.to(room.getName()).emit('game-time-updated', {
                    state: 'success',
                    target: 'room',
                    data: {
                        room: room,
                        roomPlayers: roomPlayers
                    }
                });
            }
            else {
                //Console
                util.log();
                util.log('DENY_UPDATE_GAME_TIME. (PLAYER_ISNT_OWNER)');

                //Inform user of error
                socket.emit('game-time-updated', {
                    state: 'error',
                    target: 'me',
                    message: "Player can't update game time, because he is not the room owner."
                });
            }
        }
        else {
            //Console
            util.log();
            util.log('ERROR_UPDATE_GAME_TIME. (ROOM_DOESNT_EXIST)');

            //Inform user of error
            socket.emit('game-time-updated', {
                state: 'error',
                target: 'me',
                message: "Room doesn't exist."
            });
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
        var roomName = payload.data.roomName;

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

                //Start the game
                room.startGame();

                //Get room players
                var roomPlayers = game.playerManager.getPlayers(room.getPlayers());

                //Inform game room about mode change
                io.to(room.getName()).emit('game-started', {
                    state: 'success',
                    target: 'room',
                    data: {
                        room: room,
                        roomPlayers: roomPlayers
                    }
                });

                socket.broadcast.emit('game-started', {
                    state: 'success',
                    target: 'other',
                    data: {
                        rooms: game.roomManager.getRooms()
                    }
                });
            }
            else {
                //Console
                util.log();
                util.log('DENY_START_GAME. (PLAYER_ISNT_OWNER)');

                //Inform user of error
                socket.emit('game-started', {
                    state: 'error',
                    target: 'me',
                    message: "Player can't start game, because he is not the room owner."
                });
            }
        }
        else {
            //Console
            util.log();
            util.log('ERROR_START_GAME. (ROOM_DOESNT_EXIST)');

            //Inform user of error
            socket.emit('game-started', {
                state: 'error',
                target: 'me',
                message: "Room doesn't exist."
            });
        }
    });
}

/**
 * On 'start-timer'
 *
 * @param socket
 */
function onStartTimer(socket) {
    socket.on('start-timer', function(payload) {
        //Get variables
        var playerId = socket.id;
        var roomName = payload.data.roomName;

        //Check if room exists
        var roomExists = game.roomManager.roomExists(roomName);

        if(roomExists) {
            //Get room
            var room = game.roomManager.getRoom(roomName);

            //Mark player has done tutorial
            room.playerTutorialDone();

            //Only start timer if all players have completed the tutorial
            if(room.timerCanStart()) {
                //Console
                util.log();
                util.log('START_TIMER.');

                //Inform game room about timer starting
                io.to(room.getName()).emit('timer-started', {
                    state: 'success',
                    target: 'room',
                    data: {
                        secondsLeft: room.getGameTimeInS()
                    }
                });

                //Update game timer every second
                var secondsLeft = room.getGameTimeInS();

                var timerUpdate = setInterval(function() {
                    if(secondsLeft > 0) {
                        io.to(room.getName()).emit('timer-update', {
                            state: 'success',
                            target: 'room',
                            data: {
                                secondsLeft: secondsLeft
                            }
                        });

                        secondsLeft--;
                    }
                    else {
                        //Cancel timer update
                        clearInterval(timerUpdate);

                        var roomPlayers = game.playerManager.getPlayers(room.getPlayers());

                        var podium = roomPlayers.sort(function(a, b) {
                            return b.getKills() - a.getKills();
                        });

                        io.to(room.getName()).emit('game-ended', {
                            state: 'success',
                            target: 'room',
                            data: {
                                podium: podium
                            }
                        });

                        //Reset players and room
                        room.stopGame();
                        game.playerManager.resetPlayers(room.getPlayers());
                    }
                }, 1000);
            }
        }
    });
}

/**
 * On 'move-player'
 *
 * @param socket
 */
function onMovePlayer(socket) {
    socket.on('move-player', function(payload) {
        var playerId = socket.id;
        var roomName = payload.data.roomName;
        var x = payload.data.x;
        var y = payload.data.y;
        var z = payload.data.z;
        var rotX = payload.data.rotX;
        var rotY = payload.data.rotY;
        var rotZ = payload.data.rotZ;

        var player = game.playerManager.getPlayer(playerId);

        if(player !== null) {
            player.setLocation(x, y, z);
            player.setRotation(rotX, rotY, rotZ);

            io.to(roomName).emit('player-moved', {
                state: 'success',
                target: 'room',
                data: {
                    player: player
                }
            });
        }
    });
}

/**
 * On 'take-damage'
 *
 * @param socket
 */
function onTakeDamage(socket) {
    socket.on('take-damage', function(payload) {
        var inflictingPlayerId = socket.id;
        var targetPlayerId = payload.data.targetPlayerId;
        var roomName = payload.data.roomName;

        var inflictingPlayer = game.playerManager.getPlayer(inflictingPlayerId);
        var targetPlayer = game.playerManager.getPlayer(targetPlayerId);
        var room = game.roomManager.getRoom(roomName);

        if(inflictingPlayer !== null && targetPlayer !== null) {
            var died = targetPlayer.takeDamage(10);

            if(died) {
                inflictingPlayer.addKill();
            }

            var roomPlayers = game.playerManager.getPlayers(room.getPlayers());

            io.to(roomName).emit('took-damage', {
                state: 'success',
                target: 'room',
                data: {
                    room: room,
                    roomPlayers: roomPlayers
                }
            });
        }
    });
}