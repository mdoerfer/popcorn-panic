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

    this.setId = function(playerId) {
        this.id = playerId;
    };

    this.setName = function(playerName) {
        this.name = playerName;
    };

    this.setPressure = function(playerPressure) {
        this.pressure = playerPressure;
    };

    this.setCharacter = function(playerCharacter) {
        this.character = playerCharacter;
    };

    this.setLocation = function(playerX, playerY, playerZ) {
        this.x = playerX;
        this.y = playerY;
        this.z = playerZ;
    };

    this.setX = function(playerX) {
        this.x = playerX;
    };

    this.setY = function(playerY) {
        this.y = playerY;
    };

    this.setZ = function(playerZ) {
        this.z = playerZ;
    };

    this.getName = function() {
        return this.name;
    };

    this.getId = function() {
        return this.id;
    };

    this.getPressure = function() {
        return this.pressure;
    };

    this.getCharacter = function() {
        return this.character;
    };

    this.getLocation = function() {
        return {
            x: this.x,
            y: this.y,
            z: this.z
        };
    };

    this.getX = function() {
        return this.x;
    };

    this.getY = function() {
        return this.y;
    };

    this.getZ = function() {
        return this.z;
    };

    this.takeDamage = function(amount) {
        var newPressure = this.getPressure() + amount;

        if(newPressure > this.maxPressure) {
            this.pressure = this.maxPressure;
        }
        else {
            this.pressure = newPressure;
        }
    };

    this.reset = function() {
        this.pressure = 0;
        this.character = 'Default';
        this.x = 0;
        this.y = 0;
        this.z = 0;
    };
};

module.exports = Player;