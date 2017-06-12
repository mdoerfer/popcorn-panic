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
      if (this.socket !== null) {
         //Reconnect
         this.socket.connect();
      } else {
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
      if (typeof playerName !== "undefined") {
         this.socket.emit('choose-name', {
            data: {
               playerName: playerName
            }
         });
      } else {
         console.log('"choose-name": Player name must be provided');
      }
   };

   /**
    * Choose character
    */
   this.chooseCharacter = function(playerCharacter) {
      if (typeof playerCharacter !== "undefined") {
         this.socket.emit('choose-character', {
            data: {
               playerCharacter: playerCharacter
            }
         });
      } else {
         console.log('"choose-character": Character name must be provided');
      }
   };

   /**
    * Create room
    */
   this.createRoom = function(roomName) {
      if (typeof roomName !== "undefined") {
         this.socket.emit('create-room', {
            data: {
               roomName: roomName
            }
         });
      } else {
         console.log('"create-room": Room name must be provided.');
      }
   };

   /**
    * Join room
    */
   this.joinRoom = function(roomName) {
      if (typeof roomName !== "undefined") {
         this.socket.emit('join-room', {
            data: {
               roomName: roomName,
                random: false
            }
         });
      } else {
         console.log('"join-room": Room name must be provided.');
      }
   };
    
    /**
     * Join random room
     */
    this.joinRandomRoom = function() {
      this.socket.emit('join-room', {
         data: {
             random: true
         } 
      }); 
    };

   /**
    * Leave room
    */
   this.leaveRoom = function(roomName) {
      if (typeof roomName !== "undefined") {
         this.socket.emit('leave-room', {
            data: {
               roomName: roomName
            }
         });
      } else {
         console.log('"leave-room": Room name must be provided.');
      }
   };

   /**
    * Change map
    */
   this.changeMap = function(roomName, mapName) {
      if (typeof roomName !== "undefined" && typeof mapName !== "undefined") {
         this.socket.emit('change-map', {
            data: {
               roomName: roomName,
               mapName: mapName
            }
         });
      } else {
         console.log('"change-map": Room name and map name must be provided.');
      }
   };

   /**
    * Change mode
    */
   this.changeMode = function(roomName, modeName) {
      if (typeof roomName !== "undefined" && typeof modeName !== "undefined") {
         this.socket.emit('change-mode', {
            data: {
               roomName: roomName,
               modeName: modeName
            }
         });
      } else {
         console.log('"change-mode": Room name and mode name must be provided.');
      }
   };

   /**
    * Start game
    */
   this.startGame = function(roomName) {
      if (typeof roomName !== "undefined") {
         this.socket.emit('start-game', {
            data: {
               roomName: roomName
            }
         });
      } else {
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
      if (this.socket !== null) {
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
      } else {
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
      if (payload.state === 'success') {
         if (payload.target === 'me') {
            //Console
            console.info('You joined the lobby.');
            
             //Update client data
            game.client.me = payload.data.me;
            game.client.players = payload.data.players;
            game.client.rooms = payload.data.rooms;
             
            //Fire game events
            pc.app.fire('lobby:you-joined', game.client.me, game.client.rooms, game.client.players);
         } 
          else if (payload.target === 'other') {
            //Console
            console.info('Someone joined the lobby.');
            
              //Update client data
            game.client.players = payload.data.players;
            game.client.rooms = payload.data.rooms;
              
            //Fire game events
            pc.app.fire('lobby:someone-joined', game.client.rooms, game.client.players);
         }
         
      } else {
         //Console
         console.log('Error joining lobby');
      }
   };

   /**
    * onNameChosen
    */
   this.onNameChosen = function(payload) {
      if (payload.state === 'success') {
          if(payload.target === 'me') {
              //Console
                console.info('You changed your name.');
              
              //Update client data
              game.client.me = payload.data.me;
              
              //Fire game events
                pc.app.fire('lobby:name-chosen', game.client.me.name);
          }
      } else {
         //Console
         console.log('Error during name change');
      }
   };

   /**
    * onCharacterChosen
    */
   this.onCharacterChosen = function(payload) {
      if (payload.state === 'success') {
          if(payload.target === 'me') {
            //Console
            console.info('You changed your character.');

            //Update self
            game.client.me = payload.data.me;
              
            //Fire game events
            pc.app.fire('lobby:character-chosen', game.client.me.character);
          }
      } else {
         //Console
         console.log('Error during character change');
      }
   };

   /**
    * onRoomCreated
    */
   this.onRoomCreated = function(payload) {
      if (payload.state === 'success') {
          if(payload.target === 'me') {
             //Console
             console.info('You created a room.');

             //Update client data
             game.client.room = payload.data.room;
              game.client.room.players = payload.data.roomPlayers;
             game.client.rooms = payload.data.rooms;

             //Fire game events
             pc.app.fire('lobby:you-created-a-room', game.client.room, game.client.rooms);
             
          }
          else if(payload.target === 'other') {
              //Update client data
              game.client.rooms = payload.data.rooms;
              
              //Fire game events
              pc.app.fire('lobby:someone-created-a-room', game.client.rooms);
          }
      } else {
         //Console
         console.log('Error during room creation');
          console.log(payload.message);
      }
   };

   /**
    * onRoomJoined
    */
   this.onRoomJoined = function(payload) {
      if (payload.state === 'success') {
          if(payload.target === 'room') {
              //Console
              console.log(payload.data.newPlayer.name + ' joined your room.');
              
              //Update client data
              game.client.room = payload.data.room;
              game.client.room.players = payload.data.roomPlayers;
              game.client.rooms = payload.data.rooms;
              
              //Fire game events
                pc.app.fire('room:someone-joined-your-room', game.client.room, game.client.rooms);
          }
          else if(payload.target === 'other') {
              //Console
              console.log('Someone joined a room');
              
              //Update client data
              game.client.rooms = payload.data.rooms;
              
              //Fire game events
                pc.app.fire('lobby:someone-joined-a-room', game.client.rooms);
          }
      } else {
         console.log('Error joining room');
          console.log(payload.message);
      }
   };

   /**
    * onRoomLeft
    */
   this.onRoomLeft = function(payload) {
      if (payload.state === 'success') {
          if(payload.target === 'room') {
              //Console
              console.log(payload.data.leavingPlayer.name + ' left your room.');
              
              //Update client data
              game.client.room = payload.data.room;
              game.client.room.players = payload.data.roomPlayers;
              game.client.rooms = payload.data.rooms;
              
              //Fire game events
                pc.app.fire('lobby:someone-left-your-room', game.client.room, game.client.rooms);
          }
          else if(payload.target === 'me') {
              //Console
              console.log('You left a room');
              
              //Update client data
              game.client.room = null;
              game.client.rooms = payload.data.rooms;
              
              game.client.joinLobby();
              
              //Fire game events
              pc.app.fire('lobby:you-left-a-room', game.client.rooms);
          }
      } else {
         //Console
         console.log('Error leaving room.');
          console.log(payload.message);
      }
   };

   /**
    * onMapChanged
    */
   this.onMapChanged = function(payload) {
      if (payload.state === 'success') {
          if(payload.target === 'room') {
              //Console
             console.info('Changed map.');

             //Update self
             game.client.room = payload.data.room;
              game.client.room.players = payload.data.roomPlayers;
              
              //Fire game events
              pc.app.fire('room:map-changed', game.client.room);
          }
      } else {
         //Console
         console.log('Error changing map.');
          console.log(payload.message);
      }
   };

   /**
    * React on mode changed
    */
   this.onModeChanged = function(payload) {
      if (payload.state === 'success') {
         if(payload.target === 'room') {
              //Console
             console.info('Changed mode.');

             //Update self
             game.client.room = payload.data.room;
             game.client.room.players = payload.data.roomPlayers;
              
              //Fire game events
              pc.app.fire('room:mode-changed', game.client.room);
          }
      } else {
         //Console
         console.log('Error changing mode.');
          console.log(payload.message);
      }
   };
    
    /**
    * onGameStarted
    */
   this.onGameStarted = function(payload) {
      if (payload.state === 'success') {
         //Update self
         game.client.room = payload.data.room;
          game.client.room.players = payload.data.roomPlayers;
              
          //Fire game events
          pc.app.fire('room:game-started', game.client.room);
      } else {
         //Console
         console.info('Error starting game.');
          console.log(payload.message);
      }
   };
};

/**
 * Construct Client
 */
game.client = new client();