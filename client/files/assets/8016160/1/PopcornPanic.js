var game = game || {};

/**
 * Configuration
 */ 
game.config = {
    mode: 'dev', //Can be 'dev' or 'live'
    socket: {
        host: 'http://138.68.69.7'
    }
};

/**
 * List of scene ids
 */ 
game.scenes = {
    lobby: 526492,
    field: 531055
};

/**
 * List of image src paths (initialized via js)
 */
game.images = {};

/**
 * UI
 */
game.ui = {
    initialized: false
};

/**
 * Sound settings
 */
game.sounds = {
    music: 0.5,
    effects: 0.5,
    volume: 1
};

/**
 * Functions
 */
game.log = function(msg) {
    if(this.config.mode === 'dev') {
        console.log(msg);
    }
};

game.logError = function(msg) {
    if(this.config.mode === 'dev') {
        console.error(msg);
    }
};

game.logWarning = function(msg) {
    if(this.config.mode === 'dev') {
        console.warn(msg);
    }
};