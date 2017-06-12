var client = client || function() {
    this.socket = null;
    
    this.me = null;
    this.rooms = [];
    this.players = [];
    this.room = null;
    
    /**
     * Connect to websocket and save socket 
     */
    this.connect = function() {
        if(this.socket !== null) {
            //Reconnect
            this.socket.connect();
        }
        else {
            //Connect for first time
            this.socket = io.connect(game.config.socket.host);
            
            this.bindEventListeners();
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
    
    /**
     * Bind event listeners
     */
    this.bindEventListeners = function() {  
        if(this.socket !== null) {
            this.socket.on('connect', this.onConnect);
            this.socket.on('error', this.onError);
            this.socket.on('connect_failed', this.onConnectFailed);
            this.socket.on('lobby-joined', this.onLobbyJoined);
            this.socket.on('name-chosen', this.onNameChosen);
            this.socket.on('character-chosen', this.onCharacterChosen);
            this.socket.on('room-created', this.onRoomCreated);
            this.socket.on('room-joined', this.onRoomJoined);
            this.socket.on('room-left', this.onRoomLeft);
            this.socket.on('game-started', this.onGameStarted);
            this.socket.on('map-changed', this.onMapChanged);
            this.socket.on('mode-changed', this.onModeChanged);
        }
        else {
            console.error("Couldn't bind socket event listeners. Socket is null");
        }
    };
    
    /**
     * onConnect
     */
    this.onConnect = function() {
        console.log('Connected to gameserver');
    };
    
    /**
     * onError
     */
    this.onError = function(payload) {
        console.log('Error during connection to gameserver', payload);
    };
    
    /**
     * onConnectFailed
     */
    this.onConnectFailed = function(payload) {
        console.log('Connection to gameserver failed', payload);
    };
    
    /**
     * onLobbyJoined
     */
    this.onLobbyJoined = function(payload) {  
       if(payload.state === 'success') {
            //Console
            console.info('Lobby joined');

            //Get variables
            var me = payload.data.myPlayer;
            var rooms = payload.data.rooms;
            var players = payload.data.players;
            
           //Update self
           if(typeof me !== "undefined") game.client.me = me;
           
           game.client.rooms = rooms;
           game.client.players = players;
           
           //Fire game events
           pc.app.fire('lobby:joined', game.client.me, game.client.rooms, game.client.players);
        }
        else {
            //Console
            console.log('Error joining lobby');
        }
    };

    /**
     * onNameChosen
     */ 
    this.onNameChosen = function(payload) {
        if(payload.state === 'success') {
            //Console
            console.info('Name chosen.');

            //Get variables
            var player = payload.data.player;

            //Update self
            game.client.me = player;
            
            //Fire game events
            pc.app.fire('lobby:name-chosen', game.client.me.name);
        }
        else {
            //Console
            console.log('Error during name change');
        } 
    };

    /**
     * onCharacterChosen
     */ 
    this.onCharacterChosen = function(payload) {
        if(payload.state === 'success') {
            //Console
            console.info('Character chosen.');

            //Get variables
            var player = payload.data.player;
            
            //Update self
            game.client.me = player;
            
            //Fire game events
            pc.app.fire('lobby:character-chosen', game.client.me.character);
        }
        else {
            //Console
            console.log('Error during character change');
        } 
    };

    /**
     * onRoomCreated
     */
    this.onRoomCreated = function(payload) {
        if(payload.state === 'success') {
            //Console
            console.info('Room created.');

            //Get variables
            var room = payload.data.room;
            var rooms = payload.data.rooms;

            //Join room
            if(room.owner === game.client.socket.id) {
                game.client.joinRoom(room.name);
            }

            //Update self
            game.client.room = room;
            game.client.rooms = rooms;
            
            //Fire game events
            pc.app.fire('lobby:room-created', game.client.rooms);
        }
        else {
            //Console
            console.log('Error during room creation');
        }
    };

    /**
     * onRoomJoined
     */
    this.onRoomJoined = function(payload) {
        if(payload.state === 'success') {
           //Console
           console.info('Room joined.');
           
           //Get variables
           var rooms = payload.data.rooms;
           var room = payload.data.room;
            
           //Update self
           if(typeof room !== "undefined") {
               game.client.room = room;
           }
           
           game.client.rooms = rooms;
            
            //Fire game events
            pc.app.fire('lobby:room-joined', game.client.rooms);
        }
        else {
            console.log('Error joining room');
        }
    };

    /**
     * onRoomLeft
     */
    this.onRoomLeft = function(payload) {
        if(payload.state === 'success') {
           //Console
           console.info('Room left.');

           //Join lobby
            game.client.joinLobby();
            
            //Fire game events
            pc.app.fire('lobby:room-left', game.client.rooms);
        }
        else {
            //Console
            console.log('Error leaving room.');
        }
    };

    /**
     * onGameStarted
     */
    this.onGameStarted = function(payload) {
       if(payload.state === 'success') {
            //Console
            console.info('Game started.');

           //Get variables
           var room = payload.data.room;
           
           //Update self
           game.client.room = room;
           
           //Fire game events
            pc.app.fire('lobby:game-started', game.client.rooms);
        }
        else {
            //Console
            console.info('Error starting game.');
        } 
    };

    /**
     * onMapChanged
     */
    this.onMapChanged = function(payload) {
        if(payload.state === 'success') {
           //Console
            console.info('Changed map.');
           
           //Get variables
           var room = payload.data.room;
           
           //Update self
           game.client.room = room;
        }
        else {
            //Console
            console.log('Error changing map.');
        }
    };

    /**
     * React on mode changed
     */
    this.onModeChanged = function(payload) {
       if(payload.state === 'success') {
           //Console
            console.info('Changed mode.');
            
           //Get variables
           var room = payload.data.room;
           
           //Update self
           game.client.room = room;
        }
        else {
            //Console
            console.log('Error changing mode.');
        }
    };
};

/**
 * Construct Client
 */
game.client = new client();