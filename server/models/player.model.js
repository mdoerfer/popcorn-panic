const _ = require('./../util/util');

const Player = function(playerId) {
    this.id = playerId;
    this.name = 'Unknown Unicorn';
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.pressure = 0;
    this.character = 'Default';
    this.maxPressure = 100;
};

Player.prototype.setId = function(playerId) {
    this.id = playerId;
};

Player.prototype.setName = function(playerName) {
    this.name = playerName;
};

Player.prototype.setPressure = function(playerPressure) {
    this.pressure = playerPressure;
};

Player.prototype.setCharacter = function(playerCharacter) {
    this.character = playerCharacter;
};

Player.prototype.setLocation = function(playerX, playerY, playerZ) {
    this.x = playerX;
    this.y = playerY;
    this.z = playerZ;
};

Player.prototype.setX = function(playerX) {
    this.x = playerX;
};

Player.prototype.setY = function(playerY) {
    this.y = playerY;
};

Player.prototype.setZ = function(playerZ) {
    this.z = playerZ;
};

Player.prototype.getName = function() {
    return this.name;
};

Player.prototype.getId = function() {
    return this.id;
};

Player.prototype.getPressure = function() {
    return this.pressure;
};

Player.prototype.getCharacter = function() {
    return this.character;
};

Player.prototype.getLocation = function() {
    return {
        x: this.x,
        y: this.y,
        z: this.z
    };
};

Player.prototype.getX = function() {
    return this.x;
};

Player.prototype.getY = function() {
    return this.y;
};

Player.prototype.getZ = function() {
    return this.z;
};

Player.prototype.takeDamage = function(amount) {
    var newPressure = this.getPressure() + amount;

    if(newPressure > this.maxPressure) {
        this.pressure = this.maxPressure;
    }
    else {
        this.pressure = newPressure;
    }
};

Player.prototype.reset = function() {
    this.pressure = 0;
    this.character = 'Default';
    this.x = 0;
    this.y = 0;
    this.z = 0;
};

module.exports = Player;