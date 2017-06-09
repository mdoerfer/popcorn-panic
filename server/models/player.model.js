/**
 * Dependencies
 */
const _ = require('./../util/util');

/**
 * Player
 *
 * @param playerId
 * @constructor
 */
const Player = function(playerId) {
    this.id = playerId;
    this.name = this.defaultName;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.pressure = 0;
    this.character = this.possibleCharacters[0];
    this.maxPressure = 100;
    this.defaultName = 'Unknown Unicorn';
    this.possibleCharacters = [
        'Cornboy',
        'Corngirl',
        'Angrycorn'
    ]
};

/**
 * Set player id
 *
 * @param playerId
 */
Player.prototype.setId = function(playerId) {
    this.id = playerId;
};

/**
 * Set player name
 *
 * @param playerName
 */
Player.prototype.setName = function(playerName) {
    if(!playerName.length) {
        this.name = this.defaultName;
    }
    else {
        this.name = playerName;
    }
};

/**
 * Set player pressure
 *
 * @param playerPressure
 */
Player.prototype.setPressure = function(playerPressure) {
    this.pressure = playerPressure;
};

/**
 * Set player character
 *
 * @param playerCharacter
 */
Player.prototype.setCharacter = function(playerCharacter) {
    if(this.possibleCharacters.indexOf(playerCharacter) !== -1) {
        this.character = playerCharacter;
    }
    else {
        this.character = this.possibleCharacters[0];
    }
};

/**
 * Set player location
 *
 * @param playerX
 * @param playerY
 * @param playerZ
 */
Player.prototype.setLocation = function(playerX, playerY, playerZ) {
    this.x = playerX;
    this.y = playerY;
    this.z = playerZ;
};

/**
 * Set player X location
 *
 * @param playerX
 */
Player.prototype.setX = function(playerX) {
    this.x = playerX;
};

/**
 * Set player Y location
 *
 * @param playerY
 */
Player.prototype.setY = function(playerY) {
    this.y = playerY;
};

/**
 * Set player Z location
 *
 * @param playerZ
 */
Player.prototype.setZ = function(playerZ) {
    this.z = playerZ;
};

/**
 * Get player name
 *
 * @returns {string|*}
 */
Player.prototype.getName = function() {
    return this.name;
};

/**
 * Get player id
 *
 * @returns {*}
 */
Player.prototype.getId = function() {
    return this.id;
};

/**
 * Get player pressure
 *
 * @returns {number|*}
 */
Player.prototype.getPressure = function() {
    return this.pressure;
};

/**
 * Get player pressure
 *
 * @returns {string|*}
 */
Player.prototype.getCharacter = function() {
    return this.character;
};

/**
 * Get player location
 *
 * @returns {{x: *, y: *, z: *}}
 */
Player.prototype.getLocation = function() {
    return {
        x: this.x,
        y: this.y,
        z: this.z
    };
};

/**
 * Get player X location
 *
 * @returns {number|*}
 */
Player.prototype.getX = function() {
    return this.x;
};

/**
 * Get player Y location
 *
 * @returns {number|*}
 */
Player.prototype.getY = function() {
    return this.y;
};

/**
 * Get player Z location
 *
 * @returns {*|number}
 */
Player.prototype.getZ = function() {
    return this.z;
};

/**
 * Let the player take damage by a certain amount
 *
 * @param amount
 */
Player.prototype.takeDamage = function(amount) {
    var newPressure = this.getPressure() + amount;

    if(newPressure > this.maxPressure) {
        this.pressure = this.maxPressure;
    }
    else {
        this.pressure = newPressure;
    }
};

/**
 * Reset player
 */
Player.prototype.reset = function() {
    this.pressure = 0;
    this.character = 'Default';
    this.x = 0;
    this.y = 0;
    this.z = 0;
};

module.exports = Player;