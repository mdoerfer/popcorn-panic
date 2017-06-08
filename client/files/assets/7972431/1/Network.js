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