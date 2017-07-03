var client = client || function() {
        //The socket
        this.socket = null;
        
        //Information about me (as a player)
        this.me = null;
    
        //List of all rooms
        this.rooms = [];
    
        //List of all players
        this.players = [];
    
        //Information about currently joined room
        this.room = null;
    
        //Flags
        this.tutorialDone = false;
        this.addedListeners = false;

        /**
         * Connect to websocket and save socket
         */
        this.connect = function() {
            if(this.socket !== null) {
                //Reconnect
                this.socket.connect();
            } else {
                //Connect for first time
                this.socket = io.connect(game.config.socket.host);
                
                //Bind event listeners to socket;
                this.bindEventListeners();
            }
        };

        /**
         * Join lobby
         */
        this.joinLobby = function() {
            //Logs
            game.log('JOIN_LOBBY');
            
            //Emission
            this.socket.emit('join-lobby');
        };

        /**
         * Choose name
         * 
         * @param playerName = The name the player has chosen
         */
        this.chooseName = function(playerName) {
            if(typeof playerName !== "undefined") {
                //Logs
                game.log('CHOOSE_NAME');
                
                this.socket.emit('choose-name', {
                    data: {
                        playerName: playerName
                    }
                });
            } else {
                //Logs
                game.logError('"CHOOSE_NAME": Player name must be provided');
            }
        };

        /**
         * Choose character
         * 
         * @param playerCharacter = The string identifier for the chosen character (Playercorn, Angrycorn, Cornboy, Corngirl)
         */
        this.chooseCharacter = function(playerCharacter) {
            if(typeof playerCharacter !== "undefined") {
                //Logs
                game.log('CHOOSE_CHARACTER');
                
                this.socket.emit('choose-character', {
                    data: {
                        playerCharacter: playerCharacter
                    }
                });
            } else {
                //Logs
                game.logError('"CHOOSE_CHARACTER": Character string identifier must be provided');
            }
        };

        /**
         * Create room
         * 
         * @param roomName = The name of the room to be created
         */
        this.createRoom = function(roomName) {
            if(typeof roomName !== "undefined") {
                //Logs
                game.log('CREATE_ROOM');
                
                this.socket.emit('create-room', {
                    data: {
                        roomName: roomName
                    }
                });
            } else {
                game.logError('"CREATE_ROOM": Room name must be provided.');
            }
        };

        /**
         * Join room
         * 
         * @param roomName = The name of the room that should be joined
         */
        this.joinRoom = function(roomName) {
            if(typeof roomName !== "undefined") {
                //Logs
                game.log('JOIN_ROOM');
                
                this.socket.emit('join-room', {
                    data: {
                        roomName: roomName,
                        random: false
                    }
                });
            } else {
                game.logError('"JOIN_ROOM": Room name must be provided.');
            }
        };

        /**
         * Join random room
         */
        this.joinRandomRoom = function() {
            //Logs
            game.log('JOIN_RANDOM_ROOM');
            
            this.socket.emit('join-room', {
                data: {
                    random: true
                }
            });
        };

        /**
         * Leave room
         * 
         * @param roomName = The name of the room to leave
         */
        this.leaveRoom = function(roomName) {
            if(typeof roomName !== "undefined") {
                //Logs
                game.log('LEAVE_ROOM');
                
                this.socket.emit('leave-room', {
                    data: {
                        roomName: roomName
                    }
                });
            } else {
                //Logs
                game.logError('"LEAVE_ROOM": Room name must be provided.');
            }
        };

        /**
         * Change map
         * 
         * @param roomName = The name of the room to change the map for
         * @param mapName = The name of the map to be changed to
         */
        this.changeMap = function(roomName, mapName) {
            if(typeof roomName !== "undefined" && typeof mapName !== "undefined") {
                //Logs
                game.log('CHANGE_MAP');
                
                this.socket.emit('change-map', {
                    data: {
                        roomName: roomName,
                        mapName: mapName
                    }
                });
            } else {
                //Logs
                game.logError('"CHANGE_MAP": Room name and map name must be provided.');
            }
        };

        /**
         * Change mode
         * 
         * @param roomName = The name of the room to change the mode for
         * @param modeName = The name of the mode to be changed to
         */
        this.changeMode = function(roomName, modeName) {
            if(typeof roomName !== "undefined" && typeof modeName !== "undefined") {
                //Logs
                game.log('CHANGE_MODE');
                
                this.socket.emit('change-mode', {
                    data: {
                        roomName: roomName,
                        modeName: modeName
                    }
                });
            } else {
                game.logError('"CHANGE_MODE": Room name and mode name must be provided.');
            }
        };
    
        /**
         * Update game time
         * 
         * @param roomName = The name of the room the game time should be updated for
         * @param action = 'increase' or 'decrease' game time
         */
        this.updateGameTime = function(roomName, action) {
            if(typeof roomName !== "undefined" && typeof action !== "undefined") {
                //Logs
                game.log('UPDATE_GAME_TIME');
                
                this.socket.emit('update-game-time', {
                    data: {
                        roomName: roomName,
                        action: action
                    }
                });
            } else {
                game.logError('"UPDATE_GAME_TIME": Room name and action must be provided.');
            }
        };

        /**
         * Start game
         * 
         * @param roomName = The name of the room the game should be started for
         */
        this.startGame = function(roomName) {
            if(typeof roomName !== "undefined") {
                //Logs
                game.log('START_GAME');
                
                this.socket.emit('start-game', {
                    data: {
                        roomName: roomName
                    }
                });
            } else {
                game.logError('"START_GAME": Room name must be provided.');
            }
        };
    
        /**
         * Start timer
         * 
         * @param roomName = The name of the room the timer should be started for
         */
        this.startTimer = function(roomName) {
            var self = this;
            
            if(typeof self.room.name !== "undefined") {
                //Logs
                game.log('START_TIMER');
                
                this.socket.emit('start-timer', {
                    data: {
                        roomName: self.room.name
                    }
                });
            } else {
                //Logs
                game.logError('"START_TIMER": Room name must be provided.');
            }
        };

        /**
         * Move player
         * 
         * @param location = The location object containing x, y and z coordinates
         * @param rotation = The local euler angles containing x, y and z local rotation angles
         */
        this.movePlayer = function(location, rotation) {
            var self = this;

            if(this.room !== null) {
                this.socket.emit('move-player', {
                    data: {
                        roomName: self.room.name,
                        x: location.x,
                        y: location.y,
                        z: location.z,
                        rotX: rotation.x,
                        rotY: rotation.y,
                        rotZ: rotation.z
                    }
                });
            }
        };
    
        /**
         * Take damage
         * 
         * @param playerId = The player id of the player that received the damage
         */
        this.takeDamage = function(playerId) {
            var self = this;
            
            if(this.room !== null) {
                this.socket.emit('take-damage', {
                   data: {
                       roomName: self.room.name,
                       targetPlayerId: playerId
                   } 
                });
            }
        };
    
        /**
         * Cool down
         * 
         */
        this.coolDown = function() {
            var self = this;
            
            if(this.room !== null) {
                this.socket.emit('cool-down', {
                   data: {
                       roomName: self.room.name
                   } 
                });
            }
        };
    
        /**
         * Lobby message
         * 
         * @param msgContent = The text content of the chat message
         */
        this.lobbyMessage = function(msgContent) {
            var self = this;
            
            if(msgContent.length > 0) {
                //Logs
                game.log('LOBBY_MESSAGE');
                
                this.socket.emit('lobby-message', {
                   data: {
                       msgContent: msgContent
                   } 
                });
            } else {
                //Logs
                game.logError('"LOBBY_MESSAGE": Message content cant be empty.');
            }
        };
        
        /**
         * Room message
         * 
         * @param msgContent = The text content of the room message
         */
        this.roomMessage = function(msgContent) {
            var self = this;
            
            if(msgContent.length > 0 && this.room !== null) {
                //Logs
                game.log('ROOM_MESSAGE');
                
                this.socket.emit('room-message', {
                   data: {
                       roomName: self.room.name,
                       msgContent: msgContent
                   } 
                });
            } else {
                //Logs
                game.logError('"ROOM_MESSAGE": You need to join a room and message content cant be empty.');
            }
        };

        /**
         * Disconnect from websocket
         */
        this.disconnect = function() {
            //Close socket connection
            this.socket.disconnect();
        };

        /**
         * Bind event listeners
         */
        this.bindEventListeners = function() {
            if(this.socket !== null) {
                //Logs
                game.log('Binding socket event listeners.');
                
                //Listeners
                this.socket.on('disconnect', this.onDisconnect);
                this.socket.on('leftovers-removed', this.onLeftoversRemoved);
                this.socket.on('connect', this.onConnect);
                this.socket.on('error', this.onError);
                this.socket.on('connect_failed', this.onConnectFailed);
                this.socket.on('connect_error', this.onConnectError);
                this.socket.on('connect_timeout', this.onConnectTimeout);
                this.socket.on('lobby-joined', this.onLobbyJoined);
                this.socket.on('name-chosen', this.onNameChosen);
                this.socket.on('character-chosen', this.onCharacterChosen);
                this.socket.on('room-created', this.onRoomCreated);
                this.socket.on('room-joined', this.onRoomJoined);
                this.socket.on('room-left', this.onRoomLeft);
                this.socket.on('game-started', this.onGameStarted);
                this.socket.on('timer-started', this.onTimerStarted);
                this.socket.on('timer-update', this.onTimerUpdate);
                this.socket.on('game-ended', this.onGameEnded);
                this.socket.on('game-reset', this.onGameReset);
                this.socket.on('map-changed', this.onMapChanged);
                this.socket.on('mode-changed', this.onModeChanged);
                this.socket.on('game-time-updated', this.onGameTimeUpdated);
                this.socket.on('player-moved', this.onPlayerMoved);
                this.socket.on('took-damage', this.onTookDamage);
                this.socket.on('cool-down', this.onCoolDown);
                this.socket.on('lobby-message', this.onLobbyMessage);
                this.socket.on('room-message', this.onRoomMessage);
            } else {
                //Logs
                game.logError("Couldn't bind socket event listeners. Socket is " + typeof this.socket);
            }
        };

        /**
         * onConnect
         */
        this.onConnect = function() {
            game.log('"ON_CONNECT": Connected to gameserver');
        };
    
        /**
         * onDisconnect
         */
        this.onDisconnect = function() {
            game.log('"ON_DISCONNECT": Disconnected from gameserver');
        };
    
        /**
         * onLeftoversRemoved
         */
        this.onLeftoversRemoved = function(payload) {
            game.log('"ON_LEFTOVERS_REMOVED": Leftovers removed, updating state from gameserver');
            
            game.client.rooms = payload.data.rooms;
            
            pc.app.fire('lobby:leftovers-removed', game.client.rooms);
        };

        /**
         * onError
         * 
         * @param payload = The object containing data that is received from the server
         */
        this.onError = function(payload) {
            game.logError('"ON_ERROR": Error during connection to gameserver', payload);
        };
    
        /**
         * onConnectError
         * 
         * @param payload = The object containing data that is received from the server
         */
        this.onConnectError = function(payload) {
            game.logError('"ON_CONNECT_ERROR": Error during connection to gameserver', payload);
        };

        /**
         * onConnectFailed
         * 
         * @param payload = The object containing data that is received from the server
         */
        this.onConnectFailed = function(payload) {
            game.logError('"ON_CONNECT_FAILED": Connection to gameserver failed', payload);
        };
    
        /**
         * onConnectTimeout
         * 
         * @param payload = The object containing data that is received from the server
         */
        this.onConnectTimeout = function(payload) {
            game.logWarning('"ON_CONNECT_TIMEOUT": Connection to gameserver timed out', payload);
        };

        /**
         * onLobbyJoined
         * 
         * @param payload = The object containing data that is received from the server
         */
        this.onLobbyJoined = function(payload) {
            if(payload.state === 'success') {
                if(payload.target === 'me') {
                    //Logs
                    game.log('"ON_LOBBY_JOINED": (ME) You joined the lobby.');

                    //Update client data
                    game.client.me = payload.data.me;
                    game.client.players = payload.data.players;
                    game.client.rooms = payload.data.rooms;

                    //Fire game events
                    pc.app.fire('lobby:you-joined', game.client.me, game.client.rooms, game.client.players, payload.data.lobbyChat, payload.data.leaderboard);
                }
                else if(payload.target === 'other') {
                    //Logs
                    game.log('"ON_LOBBY_JOINED": (OTHER) Someone joined the lobby.');

                    //Update client data
                    game.client.players = payload.data.players;
                    game.client.rooms = payload.data.rooms;

                    //Fire game events
                    pc.app.fire('lobby:someone-joined', game.client.rooms, game.client.players);
                }

            } else {
                //Logs
                game.logError('"ON_LOBBY_JOINED": Error joining lobby');
            }
        };

        /**
         * onNameChosen
         * 
         * @param payload = The object containing data that is received from the server
         */
        this.onNameChosen = function(payload) {
            if(payload.state === 'success') {
                if(payload.target === 'me') {
                    //Logs
                    game.log('"ON_NAME_CHOSEN": (ME) You changed your name.');

                    //Update client data
                    game.client.me = payload.data.me;

                    //Fire game events
                    pc.app.fire('lobby:name-chosen', game.client.me.name);
                }
            } else {
                //Logs
                game.logError('"ON_NAME_CHOSEN": Error during name change');
            }
        };

        /**
         * onCharacterChosen
         * 
         * @param payload = The object containing data that is received from the server
         */
        this.onCharacterChosen = function(payload) {
            if(payload.state === 'success') {
                if(payload.target === 'me') {
                    //Logs
                    game.log('"ON_CHARACTER_CHOSEN": (ME) You changed your character.');

                    //Update self
                    game.client.me = payload.data.me;

                    //Fire game events
                    pc.app.fire('lobby:character-chosen', game.client.me.character);
                }
            } else {
                //Logs
                game.logError('"ON_CHARACTER_CHOSEN": Error during character change');
            }
        };

        /**
         * onRoomCreated
         * 
         * @param payload = The object containing data that is received from the server
         */
        this.onRoomCreated = function(payload) {
            if(payload.state === 'success') {
                if(payload.target === 'me') {
                    //Logs
                    game.log('"ON_ROOM_CREATED": (ME) You created a room.');

                    //Update client data
                    game.client.room = payload.data.room;
                    game.client.room.players = payload.data.roomPlayers;
                    game.client.rooms = payload.data.rooms;

                    //Fire game events
                    pc.app.fire('lobby:you-created-a-room', game.client.room, game.client.rooms);

                }
                else if(payload.target === 'other') {
                    //Logs
                    game.log('"ON_ROOM_CREATED": (OTHER) Someone created a room');
                    
                    //Update client data
                    game.client.rooms = payload.data.rooms;

                    //Fire game events
                    pc.app.fire('lobby:someone-created-a-room', game.client.rooms);
                }
            } else {
                //Logs
                game.logError('"ON_ROOM_CREATED": Error during room creation', payload.message);
            }
        };

        /**
         * onRoomJoined
         * 
         * @param payload = The object containing data that is received from the server
         */
        this.onRoomJoined = function(payload) {
            if(payload.state === 'success') {
                if(payload.target === 'room') {
                    //Logs
                    game.log('"ON_ROOM_JOINED": (ROOM) ' + payload.data.newPlayer.name + ' joined your room.');

                    //Update client data
                    game.client.room = payload.data.room;
                    game.client.room.players = payload.data.roomPlayers;
                    game.client.rooms = payload.data.rooms;

                    //Fire game events
                    pc.app.fire('room:someone-joined-your-room', game.client.room, game.client.rooms);
                }
                else if(payload.target === 'other') {
                    //Logs
                    game.log('"ON_ROOM_JOINED": (OTHER) Someone joined a room');

                    //Update client data
                    game.client.rooms = payload.data.rooms;

                    //Fire game events
                    pc.app.fire('lobby:someone-joined-a-room', game.client.rooms);
                }
            } else {
                game.logError('"ON_ROOM_JOINED": Error joining room');
                game.logError(payload.message);
            }
        };

        /**
         * onRoomLeft
         * 
         * @param payload = The object containing data that is received from the server
         */
        this.onRoomLeft = function(payload) {
            if(payload.state === 'success') {
                if(payload.target === 'room') {
                    //Logs
                    game.log('"ON_ROOM_LEFT": (ROOM) ' + payload.data.leavingPlayer.name + ' left your room.');

                    //Update client data
                    game.client.room = payload.data.room;
                    game.client.room.players = payload.data.roomPlayers;
                    game.client.rooms = payload.data.rooms;

                    //Fire game events
                    pc.app.fire('lobby:someone-left-your-room', game.client.room, game.client.rooms);
                    pc.app.fire('game:someone-left', payload.data.leavingPlayer);
                }
                else if(payload.target === 'me') {
                    //Logs
                    game.log('"ON_ROOM_LEFT": (ME) You left a room');

                    //Update client data
                    game.client.room = null;
                    game.client.tutorialDone = false;
                    game.client.rooms = payload.data.rooms;

                    game.client.joinLobby();

                    //Fire game events
                    pc.app.fire('lobby:you-left-a-room', game.client.rooms);
                }
            } else {
                //Logs
                game.logError('"ON_ROOM_LEFT": Error leaving room.');
                game.logError(payload.message);
            }
        };

        /**
         * onMapChanged
         * 
         * @param payload = The object containing data that is received from the server
         */
        this.onMapChanged = function(payload) {
            if(payload.state === 'success') {
                if(payload.target === 'room') {
                    //Logs
                    game.log('"ON_MAP_CHANGED": (ROOM) The map was changed.');

                    //Update self
                    game.client.room = payload.data.room;
                    game.client.room.players = payload.data.roomPlayers;

                    //Fire game events
                    pc.app.fire('room:map-changed', game.client.room);
                }
            } else {
                //Logs
                game.logError('"ON_MAP_CHANGED": Error changing map.');
                game.logError(payload.message);
            }
        };

        /**
         * React on mode changed
         * 
         * @param payload = The object containing data that is received from the server
         */
        this.onModeChanged = function(payload) {
            if(payload.state === 'success') {
                if(payload.target === 'room') {
                    //Logs
                    game.log('"ON_MODE_CHANGED": (ROOM) The mode was changed.');

                    //Update self
                    game.client.room = payload.data.room;
                    game.client.room.players = payload.data.roomPlayers;

                    //Fire game events
                    pc.app.fire('room:mode-changed', game.client.room);
                }
            } else {
                //Logs
                game.logError('"ON_MODE_CHANGED": Error changing mode.');
                game.logError(payload.message);
            }
        };
    
         /**
         * React on game time updated
         * 
         * @param payload = The object containing data that is received from the server
         */
        this.onGameTimeUpdated = function(payload) {
            if(payload.state === 'success') {
                if(payload.target === 'room') {
                    //Logs
                    game.log('"ON_GAME_TIME_UPDATED": (ROOM) Game time was changed.');

                    //Update self
                    game.client.room = payload.data.room;
                    game.client.room.players = payload.data.roomPlayers;

                    //Fire game events
                    pc.app.fire('room:game-time-updated', game.client.room);
                }
            } else {
                //Logs
                game.logError('"ON_GAME_TIME_UPDATED": Error changing gaming time.');
                game.logError(payload.message);
            }
        };

        /**
         * onGameStarted
         * 
         * @param payload = The object containing data that is received from the server
         */
        this.onGameStarted = function(payload) {
            if(payload.state === 'success') {
                if(payload.target === 'room') {
                    //Logs
                    game.log('"ON_GAME_STARTED": (ROOM) Your game started.');

                    //Update self
                    game.client.room = payload.data.room;
                    game.client.room.players = payload.data.roomPlayers;

                    //Fire game events
                    pc.app.fire('room:your-game-started', game.client.room);
                }
                else if(payload.target === 'other') {
                    //Logs
                    game.log('"ON_GAME_STARTED": (OTHER) Someone started a game.');

                    //Update self
                    game.client.rooms = payload.data.rooms;

                    //Fire game events
                    pc.app.fire('lobby:someones-game-started', game.client.rooms);
                }

            } else {
                //Logs
                game.logError('"ON_GAME_STARTED": Error starting game.');
                game.logError(payload.message);
            }
        };
    
        /**
         * onTimerStarted
         * 
         * @param payload = The object containing data that is received from the server
         */
        this.onTimerStarted = function(payload) {
            if(payload.state === 'success') {
                if(payload.target === 'room') {
                    //Logs
                    game.log('"ON_TIMER_STARTED": (ROOM) Your game timer started');

                    //Fire game events
                    pc.app.fire('room:your-timer-started', payload.data.secondsLeft);
                }
            }
            else {
                game.logError('"ON_TIMER_STARTED": Error starting game timer.');
            }
        };
    
        /**
         * onTimerUpdate
         * 
         * @param payload = The object containing data that is received from the server
         */
        this.onTimerUpdate = function(payload) {
          if(payload.state === 'success') {
              if(payload.target === 'room') {
                  //Fire game events
                  pc.app.fire('room:your-timer-updated', payload.data.secondsLeft);
              }
          }  
            else {
                game.logError('"ON_TIMER_UPDATE": Error updating game timer.');
            }
        };
    
        /**
         * onGameEnded
         * 
         * @param payload = The object containing data that is received from the server
         */
        this.onGameEnded = function(payload) {
            if(payload.state === 'success') {
                if(payload.target === 'room') {
                    //Logs
                    game.log('"ON_GAME_ENDED": (ROOM) Your game ended');
                    
                    //Fire game events
                    pc.app.fire('room:your-game-ended', payload.data.podium);
                    pc.app.fire('game:game-ended');
                }
            }
            else {
                game.logError('"ON_GAME_ENDED": Error ending game.');
            }
        };
    
        /**
         * onGameReset
         * 
         * @param payload = The object containing data that is received from the server
         */
        this.onGameReset = function(payload) {
            if(payload.state === 'success') {
                if(payload.target === 'room') {
                    //Logs
                    game.log('"ON_GAME_RESET": (ROOM) Your game was reset');
                    
                    //Update self
                    game.client.room = payload.data.room;
                    game.client.room.players = payload.data.roomPlayers;
                }
                else if(payload.target === 'other') {
                    //Logs
                    game.log('"ON_GAME_RESET": (OTHER) A game was reset');
                    
                    //Update self
                    game.client.rooms = payload.data.rooms;
                    
                    pc.app.fire('lobby:someones-game-reset', game.client.rooms, payload.data.leaderboard);
                }
            }
            else {
                game.logError('"ON_GAME_RESET": Error reseting game.');
            }
        };

        /**
         * onPlayerMoved
         * 
         * @param payload = The object containing data that is received from the server
         */
        this.onPlayerMoved = function(payload) {
            if(payload.state === 'success') {
                if(payload.target === 'room') {
                    //Skip if it's myself that moved
                    if(payload.data.player.id === game.client.me.id) return;

                    //Fire game events
                    pc.app.fire('game:player-moved', payload.data.player);
                }
            }
            else {
                //Logs
                game.logError('"ON_PLAYER_MOVED": Error moving player.');
            }
        };
    
        /**
         * onTookDamage
         * 
         * @param payload = The object containing data that is received from the server
         */
        this.onTookDamage = function(payload) {
            if(payload.state === 'success') {
                if(payload.target === 'room') {   
                    //Update self
                    game.client.room = payload.data.room;
                    game.client.room.players = payload.data.roomPlayers;
                    
                    //Fire game events
                    pc.app.fire('game:player-damaged', game.client.room, payload.data.playerThatDied);
                }
            }
            else {
                //Logs
                game.logError('"ON_TOOK_DAMAGE": Error damaging player.');
            }
        };
    
        /**
         * onCoolDown
         * 
         * @param payload = The object containing data that is received from the server
         */
        this.onCoolDown = function(payload) {
            if(payload.state === 'success') {
                if(payload.target === 'room') {   
                    //Update self
                    game.client.room = payload.data.room;
                    game.client.room.players = payload.data.roomPlayers;
                    
                    //Fire game events
                    pc.app.fire('game:player-cooled-down', game.client.room);
                }
            }
            else {
                //Logs
                game.logError('"ON_COOL_DOWN": Error cooling down player.');
            }
        };
    
        /**
         * onLobbyMessage
         * 
         * @param payload = The object containing data that is received from the server
         */
        this.onLobbyMessage = function(payload) {
            if(payload.state === 'success') {
                if(payload.target === 'all') {
                    //Logs
                    game.log('"ON_LOBBY_MESSAGE": (ALL) A lobby message was received.');
                    
                    //Fire game events
                    pc.app.fire('lobby:message', payload.data.lobbyChat);
                }
            }
            else {
                //Logs
                game.logError('"ON_LOBBY_MESSAGE": Error receiving lobby messages.');
            }
        };
    
        /**
         * onRoomMessage
         * 
         * @param payload = The object containing data that is received from the server
         */
        this.onRoomMessage = function(payload) {
            if(payload.state === 'success') {
                if(payload.target === 'room') {
                    //Logs
                    game.log('"ON_ROOM_MESSAGE": (ROOM) A room message was received.');
                    
                    //Fire game events
                    pc.app.fire('room:message', payload.data.roomChat);
                }
            }
            else {
                //Logs
                game.logError('"ON_ROOM_MESSAGE": Error receiving room messages.');
            }
        };
    };

/**
 * Construct Client
 */
game.client = new client();