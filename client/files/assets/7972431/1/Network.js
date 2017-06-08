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
                    self.socket.emit('join-lobby');
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
                    self.socket.emit('join-room', {
                        name: payload.data.room.name
                    });
                    
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
                    self.socket.emit('join-lobby');
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