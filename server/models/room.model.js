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
    this.mode = '';
    this.map = '';
    this.maxPlayers = 4;
};

/**
 * Set room owner
 *
 * @param roomOwner
 */
Room.prototype.setOwner = function(roomOwner) {
    this.owner = roomOwner;
};

/**
 * Set room name
 *
 * @param roomName
 */
Room.prototype.setName = function(roomName) {
    this.name = roomName;
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
    this.mode = roomMode;
};

/**
 * Set room map
 *
 * @param roomMap
 */
Room.prototype.setMap = function(roomMap) {
    this.map = roomMap;
};

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

module.exports = Room;