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
            
            self.socket.on('connect', function() {
                console.log('Connected to gameserver');
            });
            
            self.socket.on('error', function(payload) {
                console.log('Error during connection to gameserver', payload);
            });
            
            self.socket.on('connect_failed', function(payload) {
                console.log('Connection to gameserver failed', payload);
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
     * Choose character
     */
    this.chooseCharacter = function(playerCharacter) {
        if(typeof playerCharacter !== "undefined") {
            this.socket.emit('choose-character', {
                character: playerCharacter
            });      
        }
        else {
            console.log('"choose-character": Character name must be provided');
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