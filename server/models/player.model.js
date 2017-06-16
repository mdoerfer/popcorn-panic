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
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.rotX = 0;
    this.rotY = 0;
    this.rotZ = 0;
    this.pressure = 0;
    this.maxPressure = 100;
    this.defaultName = 'Unknown Unicorn';
    this.possibleCharacters = [
        'Cornboy',
        'Corngirl',
        'Angrycorn'
    ];
    this.name = this.defaultName;
    this.character = this.possibleCharacters[0];
    this.kills = 0;
    this.deaths = 0;
};

/**
 * Set player id
 *
 * @param playerId
 */
Player.prototype.setId = function(playerId) {
    this.id = playerId;

    return this;
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

    return this;
};

/**
 * Set player pressure
 *
 * @param playerPressure
 */
Player.prototype.setPressure = function(playerPressure) {
    this.pressure = playerPressure;

    return this;
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

    return this;
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

    return this;
};

/**
 * Set player X location
 *
 * @param playerX
 */
Player.prototype.setX = function(playerX) {
    this.x = playerX;

    return this;
};

/**
 * Set player Y location
 *
 * @param playerY
 */
Player.prototype.setY = function(playerY) {
    this.y = playerY;

    return this;
};

/**
 * Set player Z location
 *
 * @param playerZ
 */
Player.prototype.setZ = function(playerZ) {
    this.z = playerZ;

    return this;
};

/**
 * Set player rotation
 *
 * @param playerRotationX
 * @param playerRotationY
 * @param playerRotationZ
 */
Player.prototype.setRotation = function(playerRotationX, playerRotationY, playerRotationZ) {
    this.rotX = playerRotationX;
    this.rotY = playerRotationY;
    this.rotZ = playerRotationZ;

    return this;
};

/**
 * Set player X rotation
 *
 * @param playerRotationX
 */
Player.prototype.setRotationX = function(playerRotationX) {
    this.rotX = playerRotationX;

    return this;
};

/**
 * Set player Y rotation
 *
 * @param playerRotationY
 */
Player.prototype.setRotationY = function(playerRotationY) {
    this.rotY = playerRotationY;

    return this;
};

/**
 * Set player Z rotation
 *
 * @param playerRotationZ
 */
Player.prototype.setRotationZ = function(playerRotationZ) {
    this.rotZ = playerRotationZ;

    return this;
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
 * Get player rotation
 *
 * @returns {{x: *, y: *, z: *}}
 */
Player.prototype.getRotation = function() {
    return {
        x: this.rotX,
        y: this.rotY,
        z: this.rotZ
    };
};

/**
 * Get player X rotation
 *
 * @returns {number|*}
 */
Player.prototype.getRotationX = function() {
    return this.rotX;
};

/**
 * Get player Y rotation
 *
 * @returns {number|*}
 */
Player.prototype.getRotationY = function() {
    return this.rotY;
};

/**
 * Get player Z rotation
 *
 * @returns {*|number}
 */
Player.prototype.getRotationZ = function() {
    return this.rotZ;
};

/**
 * Let the player take damage by a certain amount
 *
 * @param amount
 * @returns {boolean} true if player died after taking damage
 */
Player.prototype.takeDamage = function(amount) {
    var died = false;
    var newPressure = this.getPressure() + amount;

    if(newPressure >= this.maxPressure) {
        this.pressure = 0;
        died = true;
        this.addDeath();
    }
    else {
        this.pressure = newPressure;
    }

    return died;
};

/**
 * Get amount of kills
 *
 * @returns {number}
 */
Player.prototype.getKills = function() {
  return this.kills;
};

/**
 * Add kill
 */
Player.prototype.addKill = function() {
  this.kills++;
};

/**
 * Remove kill
 */
Player.prototype.removeKill = function() {
  this.kills--;
};

/**
 * Get amount of deaths
 *
 * @returns {number}
 */
Player.prototype.getDeaths = function() {
    return this.deaths;
};

/**
 * Add death
 */
Player.prototype.addDeath = function() {
    this.deaths++;
};

/**
 * Remove death
 */
Player.prototype.removeDeath = function() {
    this.deaths--;
};

/**
 * Reset player
 */
Player.prototype.reset = function() {
    this.pressure = 0;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.rotX = 0;
    this.rotY = 0;
    this.rotZ = 0;
    this.kills = 0;
    this.deaths = 0;
};

module.exports = Player;