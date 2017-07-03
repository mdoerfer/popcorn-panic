var game = game || {};

/**
 * Configuration
 */ 
game.config = {
    mode: 'live', //Can be 'dev' or 'live'
    socket: {
        host: 'http://138.68.69.7'
    }
};

/**
 * Save name of last played music
 */
game.lastMusic = {
    name: 'music'
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
    music: 0.05,
    effects: 0.2,
    volume: 1
};

/**
 * Log Functions
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

/**
 * Sound Functions
 */
game.playEffect = function(name, entity) {
    var ent = entity || pc.app.root.findByName('Root');
    
    ent.sound.slot(name).volume = this.sounds.effects;
    ent.sound.slot(name).play();
};

game.changeMusicVolume = function() {
    if(!this.lastMusic) return;
    
    var ent = pc.app.root.findByName('Root');
    
    var soundInstances = ent.sound.slot(this.lastMusic.name).instances;
    
    for(var i = 0; i < soundInstances.length; i++) {
        soundInstances[i].volume = this.sounds.music;
    }
};

game.changeMasterVolume = function() {    
    var ent = pc.app.root.findByName('Root');
    
    ent.sound.volume = this.sounds.volume;
};

game.playMusic = function(name, entity) {
    var ent = entity || pc.app.root.findByName('Root');
    
    //Save last music for reference
    this.lastMusic = {
        name: name,
        entity: ent
    };

    ent.sound.slot(name).volume = this.sounds.music;
    ent.sound.slot(name).play();
};

game.stopSound = function(name, entity) {
    var ent = entity || pc.app.root.findByName('Root');
    
    ent.sound.slot(name).stop();
};