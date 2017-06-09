var client = client || function() {
    this.socket = null;
    
    /**
     * Connect to websocket and save socket 
     */
    this.connect = function() {
        var self = this;
    
        if(self.socket !== null) {
            //Reconnect
            self.socket.connect();
        }
        else {
            //Connect for first time
            self.socket = io.connect(game.config.socket.host);
            
            self.socket.on('name-chosen', function(payload) {
                if(payload.state === 'success') {
                    console.info('Name changed.');
                    
                    console.group('Payload');
                    console.log(payload.data);
                    console.groupEnd();
                    
                }
                else {
                    console.log('Error during name change');
                } 
            });
            
            self.socket.on('lobby-joined', function(payload) {
               if(payload.state === 'success') {
                   //TODO: Change scene to lobby and append data accordingly
                    console.info('Lobby joined');
                   
                   console.group('Payload');
                    console.log(payload.data);
                    console.groupEnd();
                }
                else {
                    console.log('Error joining lobby');
                }
            });
            
            self.socket.on('room-created', function(payload) {
                if(payload.state === 'success') {              
                    self.joinRoom(payload.data.room.name);
                    
                    console.info('Created room');
                    
                    console.group('Payload');
                    console.log(payload.data);
                    console.groupEnd();
                }
                else {
                    console.log('Error during room creation');
                }
            });
            
            self.socket.on('room-joined', function(payload) {
               if(payload.state === 'success') {
                    //TODO: Change scene to room and append data accordingly
                    console.info('Joined room');
                   
                   console.group('Payload');
                    console.log(payload.data);
                    console.groupEnd();
                }
                else {
                    console.log('Error joining room');
                }
            });
            
            self.socket.on('room-left', function(payload) {
               if(payload.state === 'success') {
                    self.joinLobby();
                   console.info('Left room');
                   
                   console.group('Payload');
                    console.log(payload.data);
                    console.groupEnd();
                }
                else {
                    console.log('Error leaving room');
                }
            });
            
            self.socket.on('game-started', function(payload) {
               if(payload.state === 'success') {
                   //Change scene to game scene
                    console.info('Game started');
                   
                   console.group('Payload');
                    console.log(payload.data);
                    console.groupEnd();
                }
                else {
                    console.info('Error starting game');
                } 
            });
            
            self.socket.on('mode-changed', function(payload) {
               if(payload.state === 'success') {
                    console.info('Changed mode');
                   
                   console.group('Payload');
                    console.log(payload.data);
                    console.groupEnd();
                }
                else {
                    console.log('Error changing mode');
                }
            });
            
            self.socket.on('map-changed', function(payload) {
               if(payload.state === 'success') {
                    console.info('Changed map');
                   
                   console.group('Payload');
                    console.log(payload.data);
                    console.groupEnd();
                }
                else {
                    console.log('Error changing map');
                }
            });
        }
    };
    
    /**
     * Join lobby
     */
    this.joinLobby = function() {
        this.socket.emit('join-lobby');
    };
    
    /**
     * Choose name
     */
    this.chooseName = function(playerName) {
        if(typeof playerName !== "undefined") {
            this.socket.emit('choose-name', {
                name: playerName
            });      
        }
        else {
            console.log('"choose-name": Player name must be provided');
        }
    };
    
    /**
     * Create room
     */
    this.createRoom = function(roomName) {
        if(typeof roomName !== "undefined") {
            this.socket.emit('create-room', {
                name: roomName
            });      
        }
        else {
            console.log('"create-room": Room name must be provided.');
        }
    };
    
    /**
     * Join room
     */
    this.joinRoom = function(roomName) {
        if(typeof roomName !== "undefined") {
            this.socket.emit('join-room', {
                name: roomName
            });      
        }
        else {
            console.log('"join-room": Room name must be provided.');
        }
    };
    
    /**
     * Leave room
     */
    this.leaveRoom = function(roomName) {
        if(typeof roomName !== "undefined") {
            this.socket.emit('leave-room', {
                name: roomName
            });      
        }
        else {
            console.log('"leave-room": Room name must be provided.');
        }
    };
    
    /**
     * Change map
     */
    this.changeMap = function(roomName, mapName) {
        if(typeof roomName !== "undefined" && typeof mapName !== "undefined") {
            this.socket.emit('change-map', {
                roomName: roomName,
                mapName: mapName
            });      
        }
        else {
            console.log('"change-map": Room name and map name must be provided.');
        }
    };
    
    /**
     * Change mode
     */
    this.changeMode = function(roomName, modeName) {
        if(typeof roomName !== "undefined" && typeof modeName !== "undefined") {
            this.socket.emit('change-mode', {
                roomName: roomName,
                modeName: modeName
            });      
        }
        else {
            console.log('"change-mode": Room name and mode name must be provided.');
        }
    };
    
    /**
     * Start game
     */
    this.startGame = function(roomName) {
         if(typeof roomName !== "undefined") {
            this.socket.emit('start-game', {
                name: roomName
            });      
        }
        else {
            console.log('"start-game": Room name must be provided.');
        }
    };
    
    /**
     * Disconnect from websocket
     */
    this.disconnect = function() {
        //Close socket connection
        this.socket.disconnect();
    };
};

/**
 * Construct Client
 */
game.client = new client();