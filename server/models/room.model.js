/**
 * Dependencies
 */
const _ = require('./../util/util');

/**
 * Room
 *
 * @param roomName
 * @constructor
 */
const Room = function(roomName, ownerId) {
    this.owner = ownerId;
    this.name = roomName;
    this.players = [];
    this.maxPlayers = 4;
    this.started = false;
    this.possibleModes = [
        'Deathmatch',
        'CaptureTheFlag'
    ];
    this.possibleMaps = [
        'Field',
        'Pot'
    ];
    this.mode = this.possibleModes[0];
    this.map = this.possibleMaps[0];
    this.maxGameTime = 10;
    this.minGameTime = 1;
    this.defaultGameTime = 1;
    this.gameTime = this.defaultGameTime;

    this.tutorialDoneCounter = 0;
};

/**
 * Timer can start
 */
Room.prototype.timerCanStart = function() {
    var canStart = false;

    if(this.tutorialDoneCounter === this.players.length) {
        canStart = true;
    }

    return canStart;
};

/**
 * Increase tutorial done counter
 */
Room.prototype.playerTutorialDone = function() {
  this.tutorialDoneCounter++;
};

/**
 * Set room owner
 *
 * @param roomOwner
 */
Room.prototype.setOwner = function(roomOwner) {
    this.owner = roomOwner;

    return this;
};

/**
 * Set room name
 *
 * @param roomName
 */
Room.prototype.setName = function(roomName) {
    this.name = roomName;

    return this;
};

/**
 * Add player id as foreign key to room
 *
 * @param playerId
 * @returns {boolean}
 */
Room.prototype.addPlayer = function(playerId) {
    var addedPlayer = false;

    if(this.isntFull() && !this.hasPlayer(playerId)) {
        this.players.push(playerId);

        addedPlayer = true;
    }

    return addedPlayer;
};

/**
 * Remove player id from room
 *
 * @param playerId
 * @returns {boolean}
 */
Room.prototype.removePlayer = function(playerId) {
    var self = this;
    var removedPlayer = false;

    _.foreach(this.players, function(index) {
        if(this == playerId) {
            self.players.splice(index, 1);

            //Set new owner of room if owner is leaving
            if(self.hasOwner(playerId)) {
                self.setOwner(self.getPlayers()[0]);
            }

            removedPlayer = true;
        }
    });

    return removedPlayer;
};

/**
 * Set room mode
 *
 * @param roomMode
 */
Room.prototype.setMode = function(roomMode) {
    if(this.possibleModes.indexOf(roomMode) !== -1) {
        this.mode = roomMode;
    }
    else {
        this.mode = this.possibleModes[0];
    }

    return this;
};

/**
 * Set room map
 *
 * @param roomMap
 */
Room.prototype.setMap = function(roomMap) {
    if(this.possibleMaps.indexOf(roomMap) !== -1) {
        this.map = roomMap;
    }
    else {
        this.map = this.possibleMaps[0];
    }

    return this;
};

/**
 * Set room game time
 *
 * @returns {*}
 */
Room.prototype.setGameTime = function(time) {
    if(typeof time !== "number") {
        this.gameTime = this.defaultGameTime;
    }
    else if(time > this.maxGameTime) {
        this.gameTime = this.maxGameTime;
    }
    else if(time <= this.minGameTime) {
        this.gameTime = this.minGameTime;
    }
    else {
        this.gameTime = time;
    }

    return this;
};

/**
 * Increase room game time
 */
Room.prototype.increaseGameTime = function() {
    this.setGameTime(this.getGameTime() + 1);
};

/**
 * Decrease room game time
 */
Room.prototype.decreaseGameTime = function() {
    this.setGameTime(this.getGameTime() - 1);
};

/**
 * Get room owner
 *
 * @returns {*}
 */
Room.prototype.getOwner = function() {
    return this.owner;
};

/**
 * Get room name
 *
 * @returns {*}
 */
Room.prototype.getName = function() {
    return this.name;
};

/**
 * Get room player ids (foreign keys)
 *
 * @returns {Array}
 */
Room.prototype.getPlayers = function() {
    return this.players;
};

/**
 * Get room mode
 *
 * @returns {string|*}
 */
Room.prototype.getMode = function() {
    return this.mode;
};

/**
 * Get room map
 *
 * @returns {*|string}
 */
Room.prototype.getMap = function() {
    return this.map;
};

/**
 * Get room game time
 *
 * @returns {number}
 */
Room.prototype.getGameTime = function() {
    return this.gameTime;
};

/**
 * Get room game time in seconds
 *
 * @returns {number}
 */
Room.prototype.getGameTimeInS = function() {
    return this.gameTime * 60;
};

/**
 * Get room game time in milliseconds
 *
 * @returns {number}
 */
Room.prototype.getGameTimeInMs = function() {
    return this.gameTime * 60 * 1000;
};

/**
 * Get room max players amount
 *
 * @returns {number}
 */
Room.prototype.getMaxPlayers = function() {
    return this.maxPlayers;
};

/**
 * Check if room isnt full
 *
 * @returns {boolean}
 */
Room.prototype.isntFull = function() {
    return this.players.length < this.maxPlayers;
};

/**
 * Check if room is full
 *
 * @returns {boolean}
 */
Room.prototype.isFull = function() {
    return this.players.length >= this.maxPlayers;
};

/**
 * Check if room is empty
 *
 * @returns {boolean}
 */
Room.prototype.isEmpty = function() {
    return this.players.length === 0;
};

/**
 * Check if room would be empty if one player left
 *
 * @returns {boolean}
 */
Room.prototype.wouldBeEmpty = function() {
    return (this.players.length - 1) === 0;
};

/**
 * Check if certain player id is owner of the room
 */
Room.prototype.hasOwner = function(playerId) {
    return this.getOwner() == playerId;
};

/**
 * Check if certain player id has joined the room
 *
 * @param playerId
 * @returns {boolean}
 */
Room.prototype.hasPlayer = function(playerId) {
    return this.players.indexOf(playerId) !== -1;
};

/**
 * Start the game
 */
Room.prototype.startGame = function() {
    this.started = true;
};

/**
 * Stop the game
 */
Room.prototype.stopGame = function() {
    this.tutorialDoneCounter = 0;
    this.started = false;
};

/**
 * Check if game has started
 *
 * @returns {boolean}
 */
Room.prototype.hasStarted = function() {
    return this.started;
};

module.exports = Room;